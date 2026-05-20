const GAS_URL = import.meta.env.VITE_GAS_URL;
const MAX_FILE_SIZE_MB = 8;

export interface RegistrationData {
  fullName: string;
  workplace: string;
  subjects: string;
  groups: string;
  phone: string;
  email: string;
  selectedCourse: string;
  file?: File | null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',').pop() || '' : result;
      resolve(base64);
    };

    reader.onerror = () => reject(new Error('No fue posible leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

export const gasService = {
  async submitForm(data: RegistrationData) {
    if (!GAS_URL) {
      throw new Error('GAS Web App URL not configured.');
    }

    if (!data.file) {
      throw new Error('Debe adjuntar un archivo.');
    }

    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (data.file.size > maxBytes) {
      throw new Error(`El archivo no debe superar ${MAX_FILE_SIZE_MB} MB.`);
    }

    const fileBase64 = await fileToBase64(data.file);

    const payload = {
      fullName: data.fullName,
      workplace: data.workplace,
      subjects: data.subjects,
      groups: data.groups,
      phone: data.phone,
      email: data.email,
      selectedCourse: data.selectedCourse,
      fileName: data.file.name,
      fileType: data.file.type || 'application/octet-stream',
      fileBase64
    };

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'No fue posible completar el registro.');
    }

    return result;
  }
};
