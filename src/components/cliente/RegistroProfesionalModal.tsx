"use client";

import React, { useState } from "react";
import {
  X,
  UserCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RubroProfesional, ProfesionalServicio } from "@/types/domain";
import { saveStoredProfesional } from "@/lib/services/mock-store";

interface RegistroProfesionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfesionalRegistrado: (profesional: ProfesionalServicio) => void;
}

const RUBROS: RubroProfesional[] = [
  "Gasista Matriculado",
  "Plomero / Sanitarista",
  "Electricista",
  "Albañil / Constructor",
  "Carpintero",
  "Techista",
  "Pintor / Terminaciones",
  "Herrero / Cerrajero",
];

export function RegistroProfesionalModal({
  isOpen,
  onClose,
  onProfesionalRegistrado,
}: RegistroProfesionalModalProps) {
  const [nombre, setNombre] = useState("");
  const [rubro, setRubro] = useState<RubroProfesional>("Gasista Matriculado");
  const [matricula, setMatricula] = useState("");
  const [cuit, setCuit] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [ciudad, setCiudad] = useState("Buenos Aires");
  const [zonaCobertura, setZonaCobertura] = useState("CABA y Zona Norte");
  const [tarifaHora, setTarifaHora] = useState(9500);
  const [costoVisita, setCostoVisita] = useState(12000);
  const [descripcionExperiencia, setDescripcionExperiencia] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      setError("Por favor completa tu nombre y teléfono de contacto.");
      return;
    }

    const nuevoProf: ProfesionalServicio = {
      id: `prof-${Date.now()}`,
      nombre: nombre.trim(),
      rubro,
      matricula: matricula.trim() || undefined,
      cuit_rut: cuit.trim() || undefined,
      telefono: telefono.trim(),
      email: email.trim() || undefined,
      ciudad: ciudad.trim() || "Buenos Aires",
      zona_cobertura: zonaCobertura.trim() || "CABA y Gran Buenos Aires",
      costo_visita: Number(costoVisita) || 10000,
      descripcion_experiencia: descripcionExperiencia.trim() || undefined,
      calificacion: 5.0,
      trabajos_completados: 0,
      activo: true,
      tarifa_hora_estimada: Number(tarifaHora) || 8500,
      created_at: new Date().toISOString(),
    };

    saveStoredProfesional(nuevoProf);
    onProfesionalRegistrado(nuevoProf);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Alta de Profesional / Oficio en Red Vertia
              </h2>
              <p className="text-xs text-slate-500">
                Ofrece tus servicios a constructoras y proyectos de la red con cobros garantizados.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Nombre y Rubro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre Completo / Razón Social *
              </label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Marcelo Gómez"
                className="text-xs h-9 bg-slate-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rubro / Especialidad *
              </label>
              <select
                value={rubro}
                onChange={(e) => setRubro(e.target.value as RubroProfesional)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {RUBROS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Matrícula y CUIT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matrícula / Registro Oficial (si aplica)
              </label>
              <Input
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Ej: MAT-ENARGAS 4912"
                className="text-xs h-9 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CUIT / Monotributo
              </label>
              <Input
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                placeholder="20-33445566-9"
                className="text-xs h-9 bg-slate-50"
              />
            </div>
          </div>

          {/* Teléfono y Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teléfono / WhatsApp *
              </label>
              <Input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+54 9 11 5566-7788"
                className="text-xs h-9 bg-slate-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="profesional@gmail.com"
                className="text-xs h-9 bg-slate-50"
              />
            </div>
          </div>

          {/* Cobertura, Tarifa y Costo Visita */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Zona de Cobertura
              </label>
              <Input
                value={zonaCobertura}
                onChange={(e) => setZonaCobertura(e.target.value)}
                placeholder="Ej: CABA y Zona Norte"
                className="text-xs h-9 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Costo Visita Técnica ($)
              </label>
              <Input
                type="number"
                min="0"
                step="500"
                value={costoVisita}
                onChange={(e) => setCostoVisita(Number(e.target.value))}
                className="text-xs h-9 bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tarifa Hora Estimada ($)
              </label>
              <Input
                type="number"
                min="0"
                step="500"
                value={tarifaHora}
                onChange={(e) => setTarifaHora(Number(e.target.value))}
                className="text-xs h-9 bg-slate-50 font-bold"
              />
            </div>
          </div>

          {/* Portfolio y Especialidades */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Portfolio / Tipos de Trabajos que Realizas
            </label>
            <textarea
              value={descripcionExperiencia}
              onChange={(e) => setDescripcionExperiencia(e.target.value)}
              placeholder="Describe tu experiencia, especialidades y tipos de obras donde trabajas (ej: Instalaciones de gas en media presión, soldadura de montantes, tendidos cloacales en PVC)..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Beneficio Red Vertia */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantía de Cobro en Obras</span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Al quedar dado de alta, el operador de Vertia te asignará a pedidos de constructoras. El cliente deposita el monto en custodia y Vertia te transfiere el pago directo una vez otorgada la conformidad de obra.
            </p>
          </div>

          {/* Footer de Acciones */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmar Alta en Red</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
