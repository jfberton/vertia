"use client";

import React, { useState } from "react";
import {
  X,
  Wrench,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ObraCliente } from "@/lib/data/mock-multi-tenant";
import { RubroProfesional, SolicitudServicio } from "@/types/domain";
import { saveStoredSolicitudServicio } from "@/lib/services/mock-store";

interface SolicitarProfesionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  clienteNombre: string;
  obras: ObraCliente[];
  onSolicitudCreada: (solicitud: SolicitudServicio) => void;
}

const RUBROS_DISPONIBLES: RubroProfesional[] = [
  "Gasista Matriculado",
  "Plomero / Sanitarista",
  "Electricista",
  "Albañil / Constructor",
  "Carpintero",
  "Techista",
  "Pintor / Terminaciones",
  "Herrero / Cerrajero",
];

export function SolicitarProfesionalModal({
  isOpen,
  onClose,
  clienteId,
  clienteNombre,
  obras,
  onSolicitudCreada,
}: SolicitarProfesionalModalProps) {
  const [obraSeleccionadaId, setObraSeleccionadaId] = useState<string>(
    obras[0]?.id || ""
  );
  const [rubro, setRubro] = useState<RubroProfesional>("Gasista Matriculado");
  const [descripcion, setDescripcion] = useState("");
  const [fechaRequerida, setFechaRequerida] = useState("");
  const [presupuestoEstimado, setPresupuestoEstimado] = useState(120000);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obraSeleccionadaId) {
      setError("Por favor selecciona el frente de obra donde se realizará el servicio.");
      return;
    }
    if (!descripcion.trim()) {
      setError("Indica la descripción de la tarea requerida.");
      return;
    }

    const obraElegida = obras.find((o) => o.id === obraSeleccionadaId);
    const folioGenerado = `SRV-${Math.floor(1000 + Math.random() * 9000)}`;

    const costoTotal = Number(presupuestoEstimado) || 0;
    const comision = Math.round(costoTotal * 0.12);
    const manoObra = costoTotal - comision;

    const nuevaSolicitud: SolicitudServicio = {
      id: `srv-${Date.now()}`,
      folio: folioGenerado,
      cliente_id: clienteId,
      cliente_nombre: clienteNombre,
      obra_id: obraSeleccionadaId,
      obra_nombre: obraElegida ? obraElegida.nombre_obra : "Obra en Ejecución",
      rubro,
      descripcion_tarea: descripcion.trim(),
      fecha_requerida: fechaRequerida || "A coordinar esta semana",
      costo_estimado: costoTotal,
      costo_mano_obra: manoObra,
      comision_vertia: comision,
      cobrado_cliente: false,
      pagado_profesional: false,
      conformidad_cliente: false,
      estado: "Solicitado",
      created_at: new Date().toISOString(),
    };

    saveStoredSolicitudServicio(nuevaSolicitud);
    onSolicitudCreada(nuevaSolicitud);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Solicitar Profesional de Red Vertia
              </h2>
              <p className="text-xs text-slate-500">
                Oficios calificados y matriculados con garantía y mediación de pago Vertia.
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Frente de Obra */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Frente de Obra de Destino *
            </label>
            <select
              value={obraSeleccionadaId}
              onChange={(e) => setObraSeleccionadaId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              {obras.length === 0 ? (
                <option value="">No hay obras registradas</option>
              ) : (
                obras.map((o) => (
                  <option key={o.id} value={o.id}>
                    🏗️ {o.nombre_obra} ({o.direccion})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Rubro del Profesional */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rubro / Oficio Requerido *
            </label>
            <select
              value={rubro}
              onChange={(e) => setRubro(e.target.value as RubroProfesional)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {RUBROS_DISPONIBLES.map((r) => (
                <option key={r} value={r}>
                  🔧 {r}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción de la tarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descripción de los Trabajos *
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Ej: Prueba hidráulica de cañerías termofusión y habilitación de 3 bocas de gas para caldera."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          {/* Fecha y Presupuesto Referencia */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fecha Estimada Requerida
              </label>
              <Input
                type="date"
                value={fechaRequerida}
                onChange={(e) => setFechaRequerida(e.target.value)}
                className="text-xs h-9 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Presupuesto Objetivo ($ ARS)
              </label>
              <Input
                type="number"
                min="0"
                step="5000"
                value={presupuestoEstimado}
                onChange={(e) => setPresupuestoEstimado(Number(e.target.value))}
                className="text-xs h-9 bg-slate-50 font-bold"
              />
            </div>
          </div>

          {/* Información de Garantía Vertia */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-indigo-800">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Garantía de Pago Escrow Vertia</span>
            </div>
            <p className="text-[11px] text-indigo-700 leading-relaxed">
              Vertia asigna al profesional calificado de la red. El pago queda en custodia y solo se libera al profesional una vez que tu capataz u obra otorgue la <strong>Conformidad del Trabajo</strong> finalizado.
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Enviar Requerimiento a Red</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
