"use client";

import React, { useState, useEffect } from "react";
import {
  PackageOpen,
  ArrowRight,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User,
  X,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SpatialCell, RecepcionItem, calculateCellStatus } from "@/lib/data/mock-spatial-warehouse";

interface WarehouseSlottingModalProps {
  isOpen: boolean;
  onClose: () => void;
  receptionItems: RecepcionItem[];
  availableCells: SpatialCell[];
  preselectedItem?: RecepcionItem | null;
  preselectedCell?: SpatialCell | null;
  currentOperatorName: string;
  onPerformSlotting: (params: {
    receptionItemId: string;
    cellId: string;
    quantity: number;
    notes?: string;
  }) => void;
}

export function WarehouseSlottingModal({
  isOpen,
  onClose,
  receptionItems,
  availableCells,
  preselectedItem,
  preselectedCell,
  currentOperatorName,
  onPerformSlotting,
}: WarehouseSlottingModalProps) {
  const pendingItems = receptionItems.filter((i) => i.cantidad_pendiente > 0);

  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedCellId, setSelectedCellId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (preselectedItem && preselectedItem.cantidad_pendiente > 0) {
        setSelectedItemId(preselectedItem.id);
        setQuantity(preselectedItem.cantidad_pendiente);
      } else if (pendingItems.length > 0) {
        setSelectedItemId(pendingItems[0].id);
        setQuantity(pendingItems[0].cantidad_pendiente);
      }

      if (preselectedCell) {
        setSelectedCellId(preselectedCell.id);
      } else {
        // Pick first empty or partial cell
        const freeCell = availableCells.find((c) => c.estado === "vacio" || c.estado === "parcial");
        if (freeCell) {
          setSelectedCellId(freeCell.id);
        } else if (availableCells.length > 0) {
          setSelectedCellId(availableCells[0].id);
        }
      }
      setNotes("");
    }
  }, [isOpen, preselectedItem, preselectedCell, availableCells]);

  if (!isOpen) return null;

  const currentItem = receptionItems.find((i) => i.id === selectedItemId);
  const currentCell = availableCells.find((c) => c.id === selectedCellId);

  const maxTransferable = currentItem ? currentItem.cantidad_pendiente : 0;

  // Calculo de proyección de ocupación
  const cellCapacidad = currentCell?.capacidad_maxima || 50;
  const cellActual = currentCell?.cantidad_actual || 0;
  const projectedQty = cellActual + (Number(quantity) || 0);
  const projectedPct = Math.round((projectedQty / cellCapacidad) * 100);
  const projectedStatus = calculateCellStatus(projectedPct);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !selectedCellId || quantity <= 0) return;

    onPerformSlotting({
      receptionItemId: selectedItemId,
      cellId: selectedCellId,
      quantity: Number(quantity),
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <PackageOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Acomodar Mercadería en Racks (Slotting)
              </h2>
              <p className="text-xs text-slate-400">
                Asigna stock pendiente del Pulmón a una celda física específica del galpón.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {pendingItems.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No hay mercadería pendiente</p>
              <p className="text-xs text-slate-500 mt-1">
                La Zona de Recepción se encuentra actualmente despejada.
              </p>
            </div>
          ) : (
            <>
              {/* Selección de Mercadería en Pulmón */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  1. Mercadería de Origen (Zona de Recepción):
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => {
                    const itemId = e.target.value;
                    setSelectedItemId(itemId);
                    const item = receptionItems.find((i) => i.id === itemId);
                    if (item) setQuantity(item.cantidad_pendiente);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {pendingItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.remito_numero}] {item.producto_nombre} — {item.cantidad_pendiente} {item.unidad} libres (Lote: {item.lote})
                    </option>
                  ))}
                </select>
                {currentItem && (
                  <div className="p-2 bg-indigo-50/60 border border-indigo-100 rounded-lg text-[11px] text-indigo-900 flex items-center justify-between">
                    <span>
                      Proveedor: <strong>{currentItem.proveedor}</strong>
                    </span>
                    <span>
                      Lote: <strong className="font-mono">{currentItem.lote}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Cantidad a asignar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">
                    2. Cantidad a Asignar / Acomodar:
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Máximo disponible: <strong>{maxTransferable} u</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={maxTransferable}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(maxTransferable, Math.max(1, Number(e.target.value))))}
                    className="h-9 text-xs font-mono font-bold"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setQuantity(maxTransferable)}
                    className="h-9 text-xs font-semibold shrink-0"
                  >
                    Todo ({maxTransferable})
                  </Button>
                  {maxTransferable > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setQuantity(Math.ceil(maxTransferable / 2))}
                      className="h-9 text-xs font-semibold shrink-0"
                    >
                      Mitad ({Math.ceil(maxTransferable / 2)})
                    </Button>
                  )}
                </div>
              </div>

              {/* Selección de Celda Destino */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">
                    3. Celda de Destino en el Galpón:
                  </label>
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    {availableCells.filter((c) => c.estado === "vacio").length} celdas vacías
                  </span>
                </div>
                <select
                  value={selectedCellId}
                  onChange={(e) => setSelectedCellId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                >
                  {availableCells.map((cell) => {
                    const libre = Math.max(0, cell.capacidad_maxima - cell.cantidad_actual);
                    const tag =
                      cell.estado === "vacio"
                        ? "🟢 VACÍO"
                        : cell.estado === "parcial"
                        ? "🟡 PARCIAL"
                        : "🔴 LLENO";
                    return (
                      <option key={cell.id} value={cell.id}>
                        {cell.codigo_visual} ({tag} - {cell.porcentaje_ocupacion}% ocupado - {libre}u libres) — {cell.pasillo_id}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Preview de Impacto Visual */}
              {currentCell && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Proyección de Capacidad en Celda Destino:
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{currentCell.codigo_visual}</span>
                      <span className="text-slate-500 block text-[11px]">{currentCell.pasillo_nombre}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 line-through">
                          {currentCell.porcentaje_ocupacion}%
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                        <span
                          className={`font-mono font-bold text-sm ${
                            projectedPct > 100 ? "text-rose-600" : projectedPct >= 80 ? "text-emerald-600" : "text-indigo-600"
                          }`}
                        >
                          {projectedPct}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {projectedQty} / {cellCapacidad} bultos
                      </span>
                    </div>
                  </div>

                  {projectedPct > 100 && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Atención: Esta asignación superará el límite de estiba de la celda.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Operario y Notas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Operario Responsable:</label>
                  <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg text-slate-700 text-xs">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold text-slate-900 truncate">{currentOperatorName}</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Observaciones de Estiba:</label>
                  <Input
                    placeholder="Ej: Pallet en nivel bajo"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {/* Botones de Pie */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs font-semibold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={pendingItems.length === 0 || quantity <= 0 || !selectedCellId}
              className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 shadow-sm"
            >
              Confirmar Slotting & Alojar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
