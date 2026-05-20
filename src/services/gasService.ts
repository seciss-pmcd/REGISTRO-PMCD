/**
 * Service to interact with Google Apps Script Web App
 */

/**
 * Service to interact with Google Apps Script Web App
 */

const GAS_URL = import.meta.env.VITE_GAS_URL;

export interface ResponseData {
  [key: string]: any;
}

export const gasService = {
  async submitForm(data: ResponseData) {
    if (!GAS_URL || GAS_URL.includes('your-id')) {
      throw new Error('GAS Web App URL not configured.');
    }

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'No fue posible completar el registro.');
    }

    return result;
  },

  async getResponses(): Promise<ResponseData[]> {
    if (!GAS_URL || GAS_URL.includes('your-id')) {
      console.warn('GAS URL not configured, returning mock data.');
      return this.getMockResponses();
    }

    try {
      const response = await fetch(GAS_URL);
      if (!response.ok) throw new Error('Failed to fetch responses');
      return await response.json();
    } catch (error) {
      console.error('Error fetching responses:', error);
      return this.getMockResponses();
    }
  },

  getMockResponses(): ResponseData[] {
    return [
      {
        'ID Registro': 'REG-20240520-142201-101',
        Fecha: '2024-05-20T14:22:01Z',
        Nombre: 'Dr. Roberto Velázquez',
        Email: 'roberto.v@medicina.unam.mx',
        Teléfono: '5512345678',
        Asignatura: 'Anatomía Humana I',
        Experiencia: '11-15 años',
        Sede: 'Facultad de Medicina',
        'Tipo Alumnos': 'Pregrado',
        'Estatus Email': 'Enviado'
      }
    ];
  }
};
