"use client";

import React, { useState, useMemo } from "react";
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Barcode,
  Tag,
  MapPin,
  Layers,
  Box,
  Truck,
  X,
  Check,
  Building2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MultiTenantOrden, MultiTenantDetalleOrden } from "@/lib/data/mock-multi-tenant";
import { MOCK_SPATIAL_CELLS_PINOS_CENTRAL, formatLocationCode } from "@/lib/data/mock-spatial-warehouse";

export interface PickingItemData {
  id: string;
  detalleId: string;
  material: string;
  codigo: string;
  cantidadSolicitada: number;
  unidad: string;
  pasillo: string;
  pasilloNombre: string;
  rack: number;
  estanteria: number;
  nivel: number;
  codigoVisual: string;
  lote: string;
  pesoKgUnitario: number;
  pesoTotalKg: number;
  recolectado: boolean;
}

export interface PickingSummary {
  totalItems: number;
  totalBultos: number;
  totalPesoKg: number;
  muelleSalida: string;
}

interface PickingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: MultiTenantOrden;
  onCompletePicking: (orderId: string, summary: PickingSummary) => void;
}

/**
 * Resuelve la ubicación física en depósito, lote y peso para un ítem de orden.
 * Mapea contra las celdas espaciales de Galpón Central o provee coordenadas determinísticas.
 */
export function resolveItemLocation(item: MultiTenantDetalleOrden, index: number): Omit<PickingItemData, "recolectado"> {
  const normMaterial = item.material.toLowerCase();

  // Intentar match directo en celdas espaciales
  const spatialMatch = MOCK_SPATIAL_CELLS_PINOS_CENTRAL.find(
    (cell) =>
      cell.producto_actual &&
      (normMaterial.includes(cell.producto_actual.toLowerCase()) ||
        cell.producto_actual.toLowerCase().includes(normMaterial) ||
        (cell.sku && item.codigo && cell.sku.toLowerCase() === item.codigo.toLowerCase()))
  );

  if (spatialMatch) {
    const pesoUnit = spatialMatch.peso_actual_kg && spatialMatch.cantidad_actual > 0
      ? Math.round(spatialMatch.peso_actual_kg / spatialMatch.cantidad_actual)
      : 50;

    return {
      id: `pick-${item.id}-${index}`,
      detalleId: item.id,
      material: item.material,
      codigo: item.codigo || spatialMatch.sku || "7791234567890",
      cantidadSolicitada: item.cantidadSolicitada,
      unidad: item.unidad || "UN",
      pasillo: spatialMatch.pasillo_id,
      pasilloNombre: spatialMatch.pasillo_nombre,
      rack: spatialMatch.rack,
      estanteria: spatialMatch.estanteria,
      nivel: spatialMatch.nivel,
      codigoVisual: spatialMatch.codigo_visual,
      lote: spatialMatch.lote || `LOTE-2026-X${index + 1}`,
      pesoKgUnitario: pesoUnit,
      pesoTotalKg: pesoUnit * item.cantidadSolicitada,
    };
  }

  // Mapeo por familias de materiales
  if (normMaterial.includes("cemento")) {
    return {
      id: `pick-${item.id}-${index}`,
      detalleId: item.id,
      material: item.material,
      codigo: item.codigo || "7791234567890",
      cantidadSolicitada: item.cantidadSolicitada,
      unidad: item.unidad || "BL",
      pasillo: "P1",
      pasilloNombre: "Pasillo 1 - Obra Gruesa & Cementos",
      rack: 1,
      estanteria: 1,
      nivel: 1,
      codigoVisual: "P1-R01-E1-N1",
      lote: "LOTE-LN-2024-X4",
      pesoKgUnitario: 50,
      pesoTotalKg: 50 * item.cantidadSolicitada,
    };
  }

  if (normMaterial.includes("cal")) {
    return {
      id: `pick-${item.id}-${index}`,
      detalleId: item.id,
      material: item.material,
      codigo: item.codigo || "7793332221115",
      cantidadSolicitada: item.cantidadSolicitada,
      unidad: item.unidad || "BL",
      pasillo: "P1",
      pasilloNombre: "Pasillo 1 - Obra Gruesa & Cementos",
      rack: 1,
      estanteria: 2,
      nivel: 1,
      codigoVisual: "P1-R01-E2-N1",
      lote: "CAL-SE-2026-B2",
      pesoKgUnitario: 25,
      pesoTotalKg: 25 * item.cantidadSolicitada,
    };
  }

  if (normMaterial.includes("arena") || normMaterial.includes("árido")) {
    return {
      id: `pick-${item.id}-${index}`,
      detalleId: item.id,
      material: item.material,
      codigo: item.codigo || "7795556667771",
      cantidadSolicitada: item.cantidadSolicitada,
      unidad: item.unidad || "M3",
      pasillo: "P2",
      pasilloNombre: "Pasillo 2 - Áridos & Tolvas",
      rack: 1,
      estanteria: 1,
      nivel: 1,
      codigoVisual: "P2-R01-E1-N1",
      lote: "AR-RIO-2026-N2",
      pesoKgUnitario: 1200,
      pesoTotalKg: 1200 * item.cantidadSolicitada,
    };
  }

  if (normMaterial.includes("hierro") || normMaterial.includes("malla") || normMaterial.includes("acero")) {
    return {
      id: `pick-${item.id}-${index}`,
      detalleId: item.id,
      material: item.material,
      codigo: item.codigo || "7798765432109",
      cantidadSolicitada: item.cantidadSolicitada,
      unidad: item.unidad || "UN",
      pasillo: "P2",
      pasilloNombre: "Pasillo 2 - Perfiles de Acero Pesado",
      rack: 2,
      estanteria: 1,
      nivel: 1,
      codigoVisual: "P2-R02-E1-N1",
      lote: "ACINDAR-2026-HN10",
      pesoKgUnitario: 7.4,
      pesoTotalKg: Math.round(7.4 * item.cantidadSolicitada),
    };
  }

  if (normMaterial.includes("ladrillo")) {
    return {
      id: `pick-${item.id}-${index}`,
      detalleId: item.id,
      material: item.material,
      codigo: item.codigo || "7794443332220",
      cantidadSolicitada: item.cantidadSolicitada,
      unidad: item.unidad || "PAL",
      pasillo: "P2",
      pasilloNombre: "Pasillo 2 - Ladrillería & Bloques",
      rack: 2,
      estanteria: 2,
      nivel: 1,
      codigoVisual: "P2-R02-E2-N1",
      lote: "PAL-2026-N1",
      pesoKgUnitario: 800,
      pesoTotalKg: 800 * item.cantidadSolicitada,
    };
  }

  // Asignación secuencial por defecto
  const pId = index % 2 === 0 ? "P1" : "P2";
  const rackNum = (index % 2) + 1;
  const nivelNum = (index % 3) + 1;
  const code = formatLocationCode(pId, rackNum, 1, nivelNum);

  return {
    id: `pick-${item.id}-${index}`,
    detalleId: item.id,
    material: item.material,
    codigo: item.codigo || "7790001112223",
    cantidadSolicitada: item.cantidadSolicitada,
    unidad: item.unidad || "UN",
    pasillo: pId,
    pasilloNombre: pId === "P1" ? "Pasillo 1 - Obra Gruesa" : "Pasillo 2 - Complementos",
    rack: rackNum,
    estanteria: 1,
    nivel: nivelNum,
    codigoVisual: code,
    lote: `LOTE-GEN-2026-${(index + 1) * 10}`,
    pesoKgUnitario: 20,
    pesoTotalKg: 20 * item.cantidadSolicitada,
  };
}

export function PickingModal({ isOpen, onClose, order, onCompletePicking }: PickingModalProps) {
  // Inicialización de lista de picking ordenada por ubicación física:
  // Pasillo -> Rack -> Nivel
  const [items, setItems] = useState<PickingItemData[]>(() => {
    const rawItems: PickingItemData[] = (order.detalles || []).map((det, idx) => ({
      ...resolveItemLocation(det, idx),
      recolectado: false,
    }));

    // Ordenamiento estricto por Pasillo -> Rack -> Nivel
    return rawItems.sort((a, b) => {
      if (a.pasillo !== b.pasillo) return a.pasillo.localeCompare(b.pasillo);
      if (a.rack !== b.rack) return a.rack - b.rack;
      if (a.estanteria !== b.estanteria) return a.estanteria - b.estanteria;
      return a.nivel - b.nivel;
    });
  });

  const [muelleSalida, setMuelleSalida] = useState("Muelle Salida 1 - Grúa Autopropulsada");

  // Re-sincronizar si cambia la orden
  React.useEffect(() => {
    const rawItems: PickingItemData[] = (order.detalles || []).map((det, idx) => ({
      ...resolveItemLocation(det, idx),
      recolectado: false,
    }));

    rawItems.sort((a, b) => {
      if (a.pasillo !== b.pasillo) return a.pasillo.localeCompare(b.pasillo);
      if (a.rack !== b.rack) return a.rack - b.rack;
      if (a.estanteria !== b.estanteria) return a.estanteria - b.estanteria;
      return a.nivel - b.nivel;
    });

    setItems(rawItems);
  }, [order]);

  const toggleItemRecolectado = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, recolectado: !item.recolectado } : item))
    );
  };

  const marcarTodos = (valor: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, recolectado: valor })));
  };

  // Métricas de progreso
  const totalItems = items.length;
  const itemsRecolectados = items.filter((i) => i.recolectado).length;
  const porcentaje = totalItems > 0 ? Math.round((itemsRecolectados / totalItems) * 100) : 0;
  const isCompleto = totalItems > 0 && itemsRecolectados === totalItems;

  const totalBultos = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.cantidadSolicitada, 0);
  }, [items]);

  const totalPesoKg = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.pesoTotalKg, 0);
  }, [items]);

  const handleConfirmarPicking = () => {
    if (!isCompleto) return;
    onCompletePicking(order.id, {
      totalItems,
      totalBultos,
      totalPesoKg,
      muelleSalida,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Cabecera Principal */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 border-b border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-800/80">
                    Operación de Depósito WMS
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/60">
                    {order.folio}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
                  Hoja de Ruta de Picking Guiado
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Recorrido secuencial optimizado por pasillos físicos (Pasillo → Rack → Nivel)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Progreso y KPIs */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Progreso Recolección</span>
              <span className="text-sm font-extrabold text-white font-mono">
                {itemsRecolectados} / {totalItems} ítems ({porcentaje}%)
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Bultos Totales</span>
              <span className="text-sm font-extrabold text-amber-300 font-mono">
                {totalBultos} unidades
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Peso Estimado</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">
                {totalPesoKg.toLocaleString()} kg ({(totalPesoKg / 1000).toFixed(2)} Tn)
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Destino Posterior</span>
              <span className="text-xs font-bold text-indigo-300 truncate block">
                Pulmón de Salida
              </span>
            </div>
          </div>

          {/* Barra Visual de Progreso */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isCompleto ? "bg-emerald-500" : "bg-indigo-500"
              }`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        {/* Metadatos de la Orden y Destino */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Cliente: <strong className="text-slate-900">{order.cliente}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="truncate max-w-xs text-slate-500">
              Obra: <strong className="text-slate-800">{order.proyectoUbicacion}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => marcarTodos(true)}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Marcar todos
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => marcarTodos(false)}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:underline"
            >
              Desmarcar todos
            </button>
          </div>
        </div>

        {/* Lista de Ítems Ordenados por Ubicación Física */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-100/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              Secuencia Física de Extracción (Pasillo → Rack → Nivel)
            </span>
            <span className="text-[11px] text-slate-400">
              Haga clic en la casilla para marcar el ítem sobre el pallet
            </span>
          </div>

          {items.map((item, index) => {
            const isRecolectado = item.recolectado;

            return (
              <div
                key={item.id}
                onClick={() => toggleItemRecolectado(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isRecolectado
                    ? "bg-emerald-50/70 border-emerald-300 shadow-2xs"
                    : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs shadow-2xs"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Casilla Interactiva Grande */}
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isRecolectado
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
                          : "border-slate-300 bg-white hover:border-indigo-500"
                      }`}
                    >
                      {isRecolectado && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Cuerpo del Ítem */}
                  <div className="flex-1 space-y-2">
                    {/* Fila 1: Paso de Ruta + Ubicación Física WMS */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white font-mono">
                          Paso #{index + 1}
                        </span>

                        {/* Coordenadas Físicas */}
                        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-semibold">
                          <MapPin className="w-3 h-3 mr-1 text-indigo-600" />
                          {item.pasilloNombre}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-700 font-semibold">
                          <Layers className="w-3 h-3 mr-1 text-slate-500" />
                          Rack {item.rack.toString().padStart(2, "0")}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-700 font-semibold">
                          <Box className="w-3 h-3 mr-1 text-slate-500" />
                          Nivel {item.nivel} {item.nivel === 1 ? "(Suelo / Pick)" : "(Altura)"}
                        </Badge>
                        <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300">
                          {item.codigoVisual}
                        </span>
                      </div>

                      {/* Estado del Ítem */}
                      <div>
                        {isRecolectado ? (
                          <Badge className="bg-emerald-600 text-white border-transparent text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Recolectado / En Pallet
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] font-semibold">
                            <Clock className="w-3 h-3 mr-1" />
                            Pendiente
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Fila 2: Nombre de Material, EAN y Lote */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div>
                        <h4 className={`text-sm font-bold ${isRecolectado ? "text-emerald-950" : "text-slate-900"}`}>
                          {item.material}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 font-mono">
                            <Barcode className="w-3.5 h-3.5 text-slate-400" />
                            {item.codigo}
                          </span>
                          <span className="flex items-center gap-1 font-mono font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            <Tag className="w-3 h-3 text-indigo-600" />
                            Lote: {item.lote}
                          </span>
                        </div>
                      </div>

                      {/* Cantidad y Peso */}
                      <div className="text-right sm:shrink-0">
                        <div className="text-base font-black text-slate-900">
                          {item.cantidadSolicitada} {item.unidad}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.pesoTotalKg.toLocaleString()} kg (~{(item.pesoTotalKg / 1000).toFixed(2)} Tn)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sección de Pulmón de Salida (Zona de Embarque) */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-indigo-950">
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <span className="font-bold text-xs block">
                  Traslado Inmediato a Zona de Embarque (Pulmón de Salida)
                </span>
                <span className="text-[11px] text-indigo-800">
                  Al completar el picking, la orden pasará a estado <strong>"En preparación"</strong> y la mercadería quedará estibada en el muelle de expedición.
                </span>
              </div>
            </div>

            {/* Selector de Muelle de Embarque */}
            <div className="shrink-0 w-full sm:w-auto">
              <select
                value={muelleSalida}
                onChange={(e) => setMuelleSalida(e.target.value)}
                className="w-full sm:w-auto bg-white border border-indigo-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Muelle Salida 1 - Grúa Autopropulsada">Muelle Salida 1 (Carga Pesada)</option>
                <option value="Muelle Salida 2 - Dársena Pallets">Muelle Salida 2 (Pallets)</option>
                <option value="Muelle Salida 3 - Furgón Rápido">Muelle Salida 3 (Furgón Ligero)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer de Acciones */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            {isCompleto ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% de ítems recolectados. Listo para trasladar a muelle de carga.
              </span>
            ) : (
              <span className="text-amber-800 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Faltan {totalItems - itemsRecolectados} ítems por marcar en pallet.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none text-xs border-slate-300 text-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={!isCompleto}
              onClick={handleConfirmarPicking}
              className={`flex-1 sm:flex-none text-xs font-bold shadow-xs ${
                isCompleto
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              <PackageCheck className="w-4 h-4 mr-1.5" />
              Completar Picking & Enviar a Embarque ({porcentaje}%)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
