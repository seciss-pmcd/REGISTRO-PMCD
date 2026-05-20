/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  Users,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { gasService, ResponseData } from './services/gasService';

export default function App() {
  const [formData, setFormData] = useState<ResponseData>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    experience: '0-5 años',
    workplace: '',
    studentType: 'Pregrado'
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await gasService.submitForm(formData);
      setStatus('success');
      setMessage('Su registro fue realizado correctamente. Revise su correo electrónico para consultar el instructivo de acceso.');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('No fue posible completar el registro. Verifique la información e intente nuevamente.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status !== 'loading') {
      setStatus('idle');
      setMessage('');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      experience: '0-5 años',
      workplace: '',
      studentType: 'Pregrado'
    });
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
              <span className="text-[#e3b64b]">FORMCLIP</span> — Registro Docente
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-blue-100">
              Programa Maestro de Capacitación Docente | Facultad de Medicina UNAM
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
              Complete el formulario de inscripción. Las instrucciones de acceso serán enviadas por
              correo electrónico una vez finalizado el registro.
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
                  Capacitación docente
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Formulario de Inscripción
                </h2>
              </div>

              {status === 'success' ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950">Registro exitoso</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                    {message}
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-8 rounded-md bg-[#082657] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-blue-700"
                  >
                    Realizar otra inscripción
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
                        placeholder="Ej. Dra. María Fernanda López Hernández"
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
                        placeholder="correo@ejemplo.com"
                      />
                    </label>

                    <label>
                      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        <Phone size={13} /> Teléfono
                      </span>
                      <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                        placeholder="55 1234 5678"
                      />
                    </label>

                    <label className="md:col-span-2">
                      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        <BookOpen size={13} /> Asignatura
                      </span>
                      <input
                        required
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                        placeholder="Nombre de la materia"
                      />
                    </label>

                    <label>
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        Experiencia docente
                      </span>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                      >
                        <option value="0-5 años">0-5 años</option>
                        <option value="6-10 años">6-10 años</option>
                        <option value="11-15 años">11-15 años</option>
                        <option value="Más de 15 años">Más de 15 años</option>
                      </select>
                    </label>

                    <label>
                      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        <Users size={13} /> Tipo de alumnos
                      </span>
                      <select
                        name="studentType"
                        value={formData.studentType}
                        onChange={handleChange}
                        className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                      >
                        <option value="Pregrado">Pregrado</option>
                        <option value="Posgrado">Posgrado</option>
                        <option value="Ambos">Ambos</option>
                      </select>
                    </label>

                    <label className="md:col-span-2">
                      <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        <MapPin size={13} /> Sede / Lugar de trabajo
                      </span>
                      <input
                        required
                        name="workplace"
                        value={formData.workplace}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#e3b64b] focus:bg-white focus:ring-4 focus:ring-[#e3b64b]/20"
                        placeholder="Facultad, hospital o institución"
                      />
                    </label>
                  </div>

                  <p className="rounded-md border-l-4 border-[#e3b64b] bg-[#fff8e6] px-4 py-3 text-xs leading-5 text-slate-700">
                    Los datos proporcionados serán utilizados exclusivamente para fines académicos y
                    administrativos relacionados con el registro, seguimiento y comunicación del curso.
                  </p>

                  {status === 'error' && (
                    <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                      <AlertCircle size={18} className="mt-0.5 shrink-0" />
                      <p>{message}</p>
                    </div>
                  )}

                  <button
                    disabled={status === 'loading'}
                    type="submit"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#082657] px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <>
                        <RefreshCw className="animate-spin" size={16} />
                        Enviando
                      </>
                    ) : (
                      <>
                        Inscribirse
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f7edcf] text-[#082657]">
              <GraduationCap size={26} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#082657]">
              CLIP · PMCD
            </p>
            <h3 className="mt-3 text-xl font-black text-slate-950">
              Cápsulas de Aprendizaje Inmediato
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Al completar el registro, recibirá por correo electrónico el instructivo de acceso,
              la información para ingresar a Moodle y la clave de inscripción correspondiente.
            </p>
            <div className="mt-6 h-1 w-16 rounded-full bg-[#e3b64b]" />
          </aside>
        </motion.section>
      </div>
    </main>
  );
}
