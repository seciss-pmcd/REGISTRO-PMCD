/**
 * GOOGLE APPS SCRIPT BACKEND FOR FORMCLIP (CAPACITACIÓN DOCENTE)
 * 
 * Instructions:
 * 1. Open a Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code.
 * 4. Update the constants (IDs).
 * 5. Deploy > New Deployment > Web App (Execute as: Me, Access: Anyone).
 */

const SPREADSHEET_ID = '1JN5XNK1RMSxqCJorJNGKsMIRIJLGewBeD7aLb4TS71M';
const SHEET_NAME = 'Responses';
const PDF_FILE_ID = '1eBZmXMXM-AkrrBnynONEaulWEQylKp2A';
const FROM_NAME = 'Programa Maestro de Capacitación Docente';
const SUPPORT_EMAIL = 'programa.maestro@facmed.unam.mx';
const COURSE_KEY = 'CLIPMCD11';

const EXPERIENCE_OPTIONS = ['0-5 años', '6-10 años', '11-15 años', 'Más de 15 años'];
const STUDENT_TYPE_OPTIONS = ['Pregrado', 'Posgrado', 'Ambos'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const data = JSON.parse(e.postData.contents);
    
    // Validate
    const validation = validatePayload(data);
    if (!validation.valid) {
      return createResponse({ success: false, message: 'Validación fallida', errors: validation.errors });
    }

    const normalizedData = validation.data;

    // Check Duplicate
    if (isDuplicateEmail(normalizedData.email)) {
      return createResponse({ success: false, message: 'El correo electrónico ya está registrado.' });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow(['ID Registro', 'Fecha', 'Nombre', 'Email', 'Teléfono', 'Asignatura', 'Experiencia', 'Sede', 'Tipo Alumnos', 'Estatus Email', 'Log']);
    }

    const registrationId = 'REG-' + Utilities.formatDate(new Date(), "GMT", "yyyyMMdd-HHmmss") + '-' + Math.floor(Math.random() * 1000);
    const createdAt = new Date();

    const row = [
      registrationId,
      createdAt,
      normalizedData.fullName,
      normalizedData.email,
      normalizedData.phone,
      normalizedData.subject,
      normalizedData.experience,
      normalizedData.workplace,
      normalizedData.studentType,
      "Pendiente",
      "",
    ];

    sheet.appendRow(row);
    const rowIndex = sheet.getLastRow();

    try {
      sendConfirmationEmail(normalizedData);
      sheet.getRange(rowIndex, 10).setValue("Enviado");
      sheet.getRange(rowIndex, 11).setValue("Correo enviado correctamente.");
    } catch (mailError) {
      sheet.getRange(rowIndex, 10).setValue("Error al enviar");
      sheet.getRange(rowIndex, 11).setValue(sanitizeText(mailError.message || mailError));

      return createResponse({
        success: false,
        message: "El registro fue guardado, pero no fue posible enviar el correo.",
        registrationId,
      });
    }

    return createResponse({
      success: true,
      message: "Registro completado correctamente.",
      registrationId,
    });
  } catch (error) {
    return createResponse({
      success: false,
      message: "No fue posible completar el registro.",
      error: sanitizeText(error.message || error),
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    return createResponse(data);
  } catch (error) {
    return createResponse({ status: 'error', message: error.toString() });
  }
}

function validatePayload(data) {
  const normalized = {
    fullName: sanitizeText(data.fullName),
    email: sanitizeText(data.email).toLowerCase(),
    phone: sanitizeText(data.phone),
    subject: sanitizeText(data.subject),
    experience: sanitizeText(data.experience),
    workplace: sanitizeText(data.workplace),
    studentType: sanitizeText(data.studentType),
  };

  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!normalized.fullName) errors.fullName = "Nombre completo obligatorio.";
  if (!normalized.email) {
    errors.email = "Correo electrónico obligatorio.";
  } else if (!emailPattern.test(normalized.email)) {
    errors.email = "Formato de correo electrónico inválido.";
  }
  if (!normalized.subject) errors.subject = "Asignatura obligatoria.";
  if (!normalized.experience) errors.experience = "Experiencia docente obligatoria.";
  if (!normalized.workplace) errors.workplace = "Sede obligatoria.";
  if (!normalized.studentType) errors.studentType = "Tipo de alumnos obligatorio.";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: normalized,
  };
}

function isDuplicateEmail(email) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet || sheet.getLastRow() < 2) {
    return false;
  }

  const values = sheet.getRange(2, 4, sheet.getLastRow() - 1, 1).getValues();
  return values.some((row) => String(row[0]).trim().toLowerCase() === email);
}

function sendConfirmationEmail(data) {
  let attachment = null;
  try {
    const pdfFile = DriveApp.getFileById(PDF_FILE_ID);
    attachment = pdfFile.getBlob().setName("instructivo_moodle.pdf");
  } catch (e) {
    console.warn("Could not find PDF file: " + e.message);
  }

  const subject = "Confirmación de registro e instructivo de acceso al curso";
  const body = `Estimado(a) ${data.fullName}:

Su registro al curso ha sido realizado correctamente.

Adjunto encontrará el instructivo para acceder al curso en la plataforma Moodle.

Importante:
Cuando el sistema solicite la clave de inscripción, deberá ingresar la siguiente clave:

${COURSE_KEY}

Si presenta alguna duda o problema de acceso, favor de comunicarse con el Programa Maestro de Capacitación Docente.

Atentamente,
Programa Maestro de Capacitación Docente
Facultad de Medicina UNAM`;

  const emailOptions = {
    to: data.email,
    subject,
    body,
    name: FROM_NAME,
    replyTo: SUPPORT_EMAIL
  };
  
  if (attachment) {
    emailOptions.attachments = [attachment];
  }

  MailApp.sendEmail(emailOptions);
}

function createResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitizeText(value) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
Actualización de variable VITE_GAS_URL.
