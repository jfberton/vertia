"use client";

import React, { useState } from "react";
import { X, Building2, MapPin, User, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ObraCliente } from "@/lib/data/mock-multi-tenant";
import { saveStoredObra } from "@/lib/services/mock-store";

interface NuevaObraModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  clienteNombre: string;
  onObraCreada: (nuevaObra: ObraCliente) => void;
}

export function NuevaObraModal({
  isOpen,
  onClose,
  clienteId,
  clienteNombre,
  onObraCreada,
}: NuevaObraModalProps) {
  const [nombreObra, setNombreObra] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("Rosario");
  const [responsable, setResponsable] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreObra.trim() || !direccion.trim() || !responsable.trim()) {
      setError("Por favor completa los campos obligatorios: Nombre de Obra, Dirección y Responsable.");
      return;
    }

    const nuevaObra: ObraCliente = {
      id: `obra-${Date.now()}`,
      cliente_id: clienteId,
      cliente_nombre: clienteNombre,
      nombre_obra: nombreObra.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim() || "Rosario",
      responsable_contacto: responsable.trim(),
      telefono_contacto: telefono.trim() || "+54 9 341 555-0000",
      coordenadas_gps: "-32.9500, -60.6500",
      activa: true,
      fecha_inicio: new Date().toLocaleDateString("es-AR"),
    };

    saveStoredObra(nuevaObra);
    onObraCreada(nuevaObra);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Registrar Nuevo Frente de Obra</h2>
              <p className="text-xs text-slate-500">Destino de descarga para fletes de materiales en Vertia.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre del Proyecto / Frente de Obra *
            </label>
            <Input
              type="text"
              placeholder="Ej. Torre Bellini Sur, Complejo Residencial Las Heras..."
              value={nombreObra}
              onChange={(e) => setNombreObra(e.target.value)}
              className="text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dirección de Descarga *
              </label>
              <Input
                type="text"
                placeholder="Ej. Av. Pellegrini 2800"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ciudad / Localidad
              </label>
              <Input
                type="text"
                placeholder="Ej. Rosario, Funes, San Lorenzo"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Responsable / Capataz en Obra *
              </label>
              <Input
                type="text"
                placeholder="Ej. Arq. Sofia Valenzuela / Romero"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                className="text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teléfono de Contacto
              </label>
              <Input
                type="text"
                placeholder="Ej. +54 9 341 555-1234"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Los corralones asignados por Vertia utilizarán esta dirección para calcular radios logísticos y coordinar el ingreso de camiones y grúas.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Guardar Frente de Obra</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
