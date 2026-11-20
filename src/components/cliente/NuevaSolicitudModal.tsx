"use client";

import React, { useState } from "react";
import {
  X,
  ClipboardList,
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Truck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ObraCliente,
  MultiTenantOrden,
  MultiTenantDetalleOrden,
  MultiTenantProducto,
  MOCK_PRODUCTOS,
} from "@/lib/data/mock-multi-tenant";
import { saveStoredOrden } from "@/lib/services/mock-store";

interface NuevaSolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  clienteNombre: string;
  obras: ObraCliente[];
  onOrdenCreada: (nuevaOrden: MultiTenantOrden) => void;
}

interface ItemSolicitud {
  material: string;
  codigo: string;
  cantidad: number;
  unidad: string;
}

export function NuevaSolicitudModal({
  isOpen,
  onClose,
  clienteId,
  clienteNombre,
  obras,
  onOrdenCreada,
}: NuevaSolicitudModalProps) {
  const [obraSeleccionadaId, setObraSeleccionadaId] = useState<string>(
    obras[0]?.id || ""
  );
  const [tipo, setTipo] = useState<"Material" | "Mantenimiento">("Material");
  const [observaciones, setObservaciones] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Catálogo disponible para selección rápida
  const materialesRed = MOCK_PRODUCTOS.filter((p) => p.publicado_en_red);

  // Lista de renglones seleccionados
  const [items, setItems] = useState<ItemSolicitud[]>([
    {
      material: materialesRed[0]?.nombre || "Cemento Cruz Azul Gris 50kg (Bolsa)",
      codigo: materialesRed[0]?.codigo_barras || "750123450001",
      cantidad: 50,
      unidad: materialesRed[0]?.unidad_medida || "BL",
    },
  ]);

  const calcularPrecioReferencia = (nombre: string) => {
    const prod = materialesRed.find((m) => m.nombre === nombre);
    return prod ? (prod.precio_red_vertia || prod.precio) : 0;
  };

  const totalEstimadoPreliminar = items.reduce((acc, it) => {
    return acc + calcularPrecioReferencia(it.material) * it.cantidad;
  }, 0);

  if (!isOpen) return null;

  const handleAgregarRenglon = () => {
    const primerMat = materialesRed[0];
    setItems([
      ...items,
      {
        material: primerMat?.nombre || "Material de Obra",
        codigo: primerMat?.codigo_barras || "7790000000000",
        cantidad: 10,
        unidad: primerMat?.unidad_medida || "UN",
      },
    ]);
  };

  const handleEliminarRenglon = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCambiarMaterial = (index: number, matNombre: string) => {
    const encontrado = materialesRed.find((m) => m.nombre === matNombre);
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      material: matNombre,
      codigo: encontrado?.codigo_barras || "7790000000000",
      unidad: encontrado?.unidad_medida || "UN",
    };
    setItems(updated);
  };

  const handleCambiarCantidad = (index: number, cantidad: number) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      cantidad: Math.max(1, cantidad),
    };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obraSeleccionadaId) {
      setError("Por favor selecciona la obra de destino.");
      return;
    }
    if (items.length === 0 || items.some((it) => it.cantidad <= 0)) {
      setError("Verifica que todos los ítems tengan cantidad mayor a 0.");
      return;
    }

    const obraElegida = obras.find((o) => o.id === obraSeleccionadaId);
    const folioGenerado = `VT-${Math.floor(1000 + Math.random() * 9000)}`;

    const detallesOrden: MultiTenantDetalleOrden[] = items.map((it, idx) => ({
      id: `det-${Date.now()}-${idx}`,
      material: it.material,
      codigo: it.codigo,
      cantidadSolicitada: it.cantidad,
      cantidadDisponibleCorralon: it.cantidad,
      stockRealFisico: it.cantidad * 2,
      cantidadAutorizadaExtension: 0,
      unidad: it.unidad,
      estadoItem: "Completo",
      peso_kg_unitario: it.unidad === "BL" ? 50 : 15,
      peso_total_kg: (it.unidad === "BL" ? 50 : 15) * it.cantidad,
    }));

    const nuevaOrden: MultiTenantOrden = {
      id: `ord-${Date.now()}`,
      tenant_id: "vertia-central",
      folio: folioGenerado,
      tipo,
      proyectoUbicacion: obraElegida
        ? `${obraElegida.nombre_obra} (${obraElegida.direccion})`
        : "Obra de Construcción",
      cliente: clienteNombre,
      cliente_id: clienteId,
      obra_id: obraSeleccionadaId,
      corralonAsignado: "Pendiente de Asignación (Vertia Core)",
      fecha: "Hoy, recién creada",
      estado: "Por cotizar",
      distanciaKm: 6.5,
      detalles: detallesOrden,
    };

    saveStoredOrden(nuevaOrden);
    onOrdenCreada(nuevaOrden);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Nueva Solicitud de Pedido de Materiales
              </h2>
              <p className="text-xs text-slate-500">
                La solicitud se envía al Operador de Vertia para coordinar y asignar el corralón óptimo.
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

          {/* Selector de Obra */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
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
                      🏗️ {o.nombre_obra} — {o.direccion}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo de Requerimiento
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Material">Material Grueso / Flete</option>
                <option value="Mantenimiento">Mantenimiento / Reparación</option>
              </select>
            </div>
          </div>

          {/* Renglones de Materiales */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-indigo-600" />
                <span>Materiales Solicitados</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAgregarRenglon}
                className="text-xs h-7 gap-1 border-dashed text-indigo-700 border-indigo-200 hover:bg-indigo-50"
              >
                <Plus className="w-3 h-3" />
                <span>Agregar Ítem</span>
              </Button>
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => {
                const precioUnit = calcularPrecioReferencia(item.material);
                const subtotalItem = precioUnit * item.cantidad;
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-2xs"
                  >
                    <div className="flex-1 w-full">
                      <select
                        value={item.material}
                        onChange={(e) => handleCambiarMaterial(idx, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {materialesRed.map((mat) => (
                          <option key={mat.id} value={mat.nombre}>
                            {mat.nombre} ({mat.unidad_medida}) — Ref. ${mat.precio.toLocaleString("es-AR")}
                          </option>
                        ))}
                      </select>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>Ref. Red Vertia: <strong className="text-slate-700">${precioUnit.toLocaleString("es-AR")}</strong> /{item.unidad}</span>
                        <span>•</span>
                        <span>Subtotal ref: <strong className="text-indigo-700">${subtotalItem.toLocaleString("es-AR")}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="w-24">
                        <Input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) =>
                            handleCambiarCantidad(idx, Number(e.target.value))
                          }
                          className="text-xs h-8 text-center font-bold"
                          placeholder="Cant."
                        />
                      </div>
                      <Badge variant="outline" className="text-xs font-semibold px-2 py-1 bg-slate-50">
                        {item.unidad}
                      </Badge>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleEliminarRenglon(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar ítem"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total estimado de referencia */}
            <div className="flex items-center justify-between p-3 bg-slate-100/80 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">Subtotal Estimado de Materiales (Referencia Red):</span>
              <span className="text-sm font-extrabold text-slate-900">
                ${totalEstimadoPreliminar.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          {/* Información Logística de Vertia */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5 text-amber-800">
              <Truck className="w-4 h-4 text-amber-700" />
              <span>Proceso de Cotización y Envío Red Vertia</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Los precios unitarios indicados son de referencia de la red. Al emitir esta solicitud, el Operador de Vertia analiza el stock en los corralones asociados y emite un <strong>Presupuesto Confirmado</strong> que incluye flete y corralón asignado. Podrás revisarlo y <strong>aceptarlo en la app</strong> antes de autorizar el despacho.
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
              <span>Enviar Solicitud a Vertia</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
