import { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  Users,
  Upload,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { gasService, RegistrationData } from './services/gasService';

const COURSE_OPTIONS = [
  'Formación y Actualización Docente en Ciencias de la Salud y Planeación Didáctica de la Asignatura',
  'Diseño y Elaboración de Instrumentos de Evaluación de la Competencia Clínica',
  'Acceso a Fuentes de Información Electrónicas',
  'La Tutoría en el Docente Clínico',
  'Comunicación en el Proceso Enseñanza Aprendizaje de la Clínica',
  'Introduccion a los Procesos de la Investigación',
  'Estrategias de Sensibilización contra el Acoso y la Violencia en el Área Médica',
  'Estrategias Didácticas a Distancia para Profesores del Área Clínica',
  'Educación en Ciencias de la Salud con Perspectiva de Género'
];

const initialFormData: RegistrationData = {
  fullName: '',
  workplace: '',
  subjects: '',
  groups: '',
  phone: '',
  email: '',
  selectedCourse: COURSE_OPTIONS[0],
  file: null
};

export default function App() {
  const [formData, setFormData] = useState<RegistrationData>(initialFormData);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await gasService.submitForm(formData);
      setStatus('success');
      setMessage('Su registro fue recibido correctamente. Revise su correo electrónico para consultar la confirmación.');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'No fue posible completar el registro. Verifique la información e intente nuevamente.'
      );
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status !== 'loading') {
      setStatus('idle');
      setMessage('');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, file });
    if (status !== 'loading') {
      setStatus('idle');
      setMessage('');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setStatus('idle');
    setMessage('');
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl bg-[#082657] text-white shadow-lg"
        >
          <div className="px-6 py-10 text-center md:px-10">
            <div className="mx-auto mb-5 inline-flex rounded-full bg-[#e3b64b] px-5 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-[#082657]">
              PMCD · SECISS · FM-UNAM
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Programa Maestro de Capacitación Docente
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-blue-100">
              Registro docente para cursos de formación y actualización académica
            </p>

            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#e3b64b]" />
          </div>
        </motion.header>

        <section className="mt-6 rounded-lg border-l-4 border-[#e3b64b] bg-white px-5 py-4 shadow-sm md:px-6">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f7edcf] text-[#082657]">
              <GraduationCap size={24} />
            </div>
            <p className="text-sm leading-6 text-slate-700">
              Complete el formulario y adjunte su propuesta de asignatura o credencial de trabajador UNAM.
              Sus datos y documentos serán revisados por el Programa Maestro de Capacitación Docente.
            </p>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]"
        >
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
            <div className="h-1.5 bg-gradient-to-r from-[#082657] via-[#e3b64b] to-[#082657]" />

            <div className="p-6 md:p-8">
              <div className="mb-7">
                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#082657]">
                  Registro PMCD
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Datos del profesor
                </h2>
              </div>

              {status === 'success' ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950">Registro recibido</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                    {message}
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-8 rounded-md bg-[#082657] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-blue-700"
                  >
                    Realizar otro registro
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="md:col-span-2">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        Nombre completo
                      </span>
                      <input
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                      />
                    </label>

                    <label>
                      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        <MapPin size={13} /> Sede de adscripción
                      </span>
                      <input
                        required
                        name="workplace"
                        value={formData.workplace}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                      />
                    </label>

                    <label>
                      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        <Mail size={13} /> Correo electrónico
                      </span>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                      />
                    </label>

                    <label>
                      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        <BookOpen size={13} /> Asignatura(s) que imparte
                      </span>
                      <input
                        required
                        name="subjects"
                        value={formData.subjects}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                      />
                    </label>

                    <label>
                      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        <Users size={13} /> Grupo(s) asignado(s)
                      </span>
                      <input
                        required
                        name="groups"
                        value={formData.groups}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                      />
                    </label>

                    <label>
                      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        <Phone size={13} /> Teléfono de contacto
                      </span>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                      />
                    </label>

                    <label>
                      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        <Upload size={13} /> Propuesta o credencial UNAM
                      </span>
                      <input
                        required
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="w-full rounded-md border border
