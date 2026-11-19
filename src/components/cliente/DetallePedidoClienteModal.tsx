"use client";

import React, { useState } from "react";
import {
  X,
  ClipboardList,
  Building2,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Camera,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MultiTenantOrden } from "@/lib/data/mock-multi-tenant";
import { RemitoPdfModal } from "@/components/orders/RemitoPdfModal";
import { actualizarEstadoOrden, aceptarPresupuesto } from "@/lib/services/ordenes.service";

interface DetallePedidoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  orden: MultiTenantOrden | null;
  onOrdenActualizada: (orden: MultiTenantOrden) => void;
}

export function DetallePedidoClienteModal({
  isOpen,
  onClose,
  orden,
  onOrdenActualizada,
}: DetallePedidoClienteModalProps) {
  const [modalRemitoAbierto, setModalRemitoAbierto] = useState(false);
  const [mensajeConformidad, setMensajeConformidad] = useState<string | null>(null);

  if (!isOpen || !orden) return null;

  // Pasos del flujo
  const pasos = [
    { key: "Por cotizar", label: "Solicitud Enviada", desc: "En evaluación por Vertia" },
    { key: "Presupuesto listo", label: "Presupuesto Listo", desc: "Esperando tu aprobación" },
    { key: "Asignada", label: "Corralón Asignado", desc: orden.corralonAsignado },
    { key: "En preparación", label: "En Preparación", desc: "Picking en estanterías" },
    { key: "En camino", label: "Flete en Camino", desc: orden.chofer_asignado ? `Chofer: ${orden.chofer_asignado}` : "Transporte en viaje" },
    { key: "Entregada", label: "Entregada en Obra", desc: "Recepción con remito" },
  ];

  const getPasoIndice = (estado: string) => {
    switch (estado) {
      case "Por cotizar":
        return 0;
      case "Presupuesto listo":
        return 1;
      case "Asignada":
        return 2;
      case "En preparación":
        return 3;
      case "En camino":
        return 4;
      case "Entregada":
        return 5;
      default:
        return 2;
    }
  };

  const pasoActual = getPasoIndice(orden.estado);

  const handleAceptarPresupuesto = async () => {
    try {
      const updated = await aceptarPresupuesto(orden.id);
      onOrdenActualizada(updated);
      setMensajeConformidad("¡Presupuesto aceptado! La orden fue autorizada y enviada al corralón para su despacho.");
      setTimeout(() => setMensajeConformidad(null), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDarConformidad = async () => {
    try {
      const updated = await actualizarEstadoOrden(orden.id, "Entregada");
      onOrdenActualizada(updated);
      setMensajeConformidad("¡Conformidad registrada con éxito! La entrega quedó archivada.");
      setTimeout(() => setMensajeConformidad(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Pedido {orden.folio}
                  </h2>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold px-2 py-0.5 ${
                      orden.estado === "Entregada"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : orden.estado === "En camino"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-indigo-50 text-indigo-800 border-indigo-200"
                    }`}
                  >
                    {orden.estado}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {orden.proyectoUbicacion} • {orden.fecha}
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

          {/* Cuerpo */}
          <div className="p-6 overflow-y-auto space-y-5">
            {mensajeConformidad && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{mensajeConformidad}</span>
              </div>
            )}

            {/* Timeline Horizontal */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Seguimiento de Entrega en Obra</span>
              </div>
              <div className="relative flex items-center justify-between">
                {pasos.map((paso, idx) => {
                  const isDone = idx < pasoActual;
                  const isCurrent = idx === pasoActual;
                  return (
                    <div key={paso.key} className="flex-1 flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          isDone
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                            ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div className="mt-1.5 text-[11px] font-bold text-slate-800 truncate max-w-[95px]">
                        {paso.label}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[95px]">
                        {paso.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Presupuesto Confirmado por Vertia */}
            {orden.estado === "Presupuesto listo" && (
              <div className="p-4 bg-emerald-50/90 border-2 border-emerald-300 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">
                        ¡Presupuesto Confirmado por Red Vertia!
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        Cotizado para entrega directa en tu obra por {orden.corralonAsignado}.
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-bold text-xs">
                    Pendiente Aprobación
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white/90 p-3 rounded-lg border border-emerald-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Materiales</span>
                    <div className="font-bold text-slate-800">
                      ${Math.max(0, (orden.monto_total_cotizado || 0) - (orden.costo_flete || 0)).toLocaleString("es-AR")}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Flete Consolidado</span>
                    <div className="font-bold text-slate-800">
                      ${(orden.costo_flete || 0).toLocaleString("es-AR")}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-700 uppercase font-bold">Total Presupuestado</span>
                    <div className="text-sm font-extrabold text-emerald-700">
                      ${(orden.monto_total_cotizado || 0).toLocaleString("es-AR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Al aceptar, la orden pasa a preparación en el depósito del corralón.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleAceptarPresupuesto}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aceptar Presupuesto y Autorizar Envío</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Tarjeta de Flete y Corralón Asignado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Corralón Proveedor
                </div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{orden.corralonAsignado}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Distancia a obra: <strong>{orden.distanciaKm} km</strong>
                </div>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Transporte & Chofer
                </div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {orden.chofer_asignado || "Aguardando asignación en corralón"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Patente: <strong>{orden.patente_asignada || "Pendiente"}</strong> • DNI: {orden.dni_chofer || "—"}
                </div>
              </div>
            </div>

            {/* Lista de Materiales */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-slate-600" />
                  <span>Detalle de Materiales Solicitados</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {orden.detalles.length} ítem(s)
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {orden.detalles.map((det) => (
                  <div key={det.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50/50">
                    <div>
                      <div className="font-bold text-slate-800">{det.material}</div>
                      <div className="text-[10px] text-slate-400">Código: {det.codigo}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900">
                        {det.cantidadSolicitada}
                      </span>
                      <span className="ml-1 text-slate-500 font-semibold">{det.unidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentos & Remito PDF */}
            <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-lg border border-indigo-200 text-indigo-700 shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Remito Oficial de Despacho
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {orden.remito_numero ? `Folio: ${orden.remito_numero}` : "Emitido al finalizar el picking por el corralón"}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalRemitoAbierto(true)}
                className="text-xs h-8 gap-1.5 font-semibold text-indigo-700 border-indigo-200 hover:bg-indigo-100"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ver Remito PDF</span>
              </Button>
            </div>
          </div>

          {/* Footer de Acciones */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/70">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cerrar
            </Button>
            <div className="flex items-center gap-2">
              {orden.estado !== "Entregada" && (
                <Button
                  size="sm"
                  onClick={handleDarConformidad}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dar Conformidad de Recepción</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Remito PDF Reutilizado */}
      {modalRemitoAbierto && (
        <RemitoPdfModal
          isOpen={modalRemitoAbierto}
          onClose={() => setModalRemitoAbierto(false)}
          order={orden}
          transportInfo={{
            chofer: orden.chofer_asignado || "Chofer Designado",
            dni: orden.dni_chofer || "34.120.984",
            vehiculo: orden.vehiculo_asignado || "Camión Chasis Flete",
            patente: orden.patente_asignada || "AF-982-ZZ",
            muelle: "Muelle 1 - Descarga Rápida",
          }}
        />
      )}
    </>
  );
}
