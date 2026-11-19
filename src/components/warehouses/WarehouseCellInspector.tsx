"use client";

import React, { useState } from "react";
import {
  MapPin,
  Box,
  Layers,
  Scale,
  Calendar,
  Barcode,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  PackagePlus,
  Trash2,
  Copy,
  Check,
  Building2,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpatialCell, CellStatus } from "@/lib/data/mock-spatial-warehouse";

interface WarehouseCellInspectorProps {
  cell: SpatialCell | null;
  warehouseName: string;
  onOpenSlottingWithCell: (cell: SpatialCell) => void;
  onClearCellStock: (cellId: string) => void;
  onClose?: () => void;
  readOnly?: boolean;
}

export function WarehouseCellInspector({
  cell,
  warehouseName,
  onOpenSlottingWithCell,
  onClearCellStock,
  onClose,
  readOnly,
}: WarehouseCellInspectorProps) {
  const [copied, setCopied] = useState(false);

  if (!cell) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm p-6 rounded-xl text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Inspector de Celda</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Haz clic en cualquier estante, nivel o bahía de la matriz 3D para inspeccionar sus especificaciones físicas y stock asignado.
          </p>
        </div>
      </Card>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cell.codigo_visual);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: CellStatus) => {
    switch (status) {
      case "vacio":
        return (
          <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
            Vacío / Disponible
          </Badge>
        );
      case "parcial":
        return (
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>
            Ocupación Parcial
          </Badge>
        );
      case "lleno":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Capacidad Óptima / Lleno
          </Badge>
        );
      case "critico":
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse"></span>
            Alerta / Sobrecarga
          </Badge>
        );
    }
  };

  const getProgressBarColor = (status: CellStatus) => {
    switch (status) {
      case "vacio":
        return "bg-slate-200";
      case "parcial":
        return "bg-indigo-600";
      case "lleno":
        return "bg-emerald-500";
      case "critico":
        return "bg-rose-600";
    }
  };

  const getNivelDescription = (nivel: number) => {
    switch (nivel) {
      case 1:
        return "Nivel 1 (Piso / Carga Pesada & Picking)";
      case 2:
        return "Nivel 2 (Media Altura / Apilado)";
      case 3:
        return "Nivel 3 (Elevación / Transelevador)";
      case 4:
        return "Nivel 4 (Superior / Custodia Larga)";
      default:
        return `Nivel ${nivel}`;
    }
  };

  const hasSpace = cell.estado === "vacio" || cell.estado === "parcial";

  return (
    <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden space-y-0">
      {/* Header Celda */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[150px]">{warehouseName}</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">{cell.pasillo_id}</span>
          </div>
          {getStatusBadge(cell.estado)}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-lg font-extrabold text-slate-900 tracking-tight">
              {cell.codigo_visual}
            </h3>
            <button
              onClick={handleCopyCode}
              title="Copiar código de ubicación"
              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-600 shadow-2xs" title="Código QR WMS">
            <QrCode className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">{cell.pasillo_nombre}</p>
      </div>

      {/* Contenido del Inspector */}
      <div className="p-4 space-y-4 text-xs">
        {/* Barra de Ocupación */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Porcentaje de Ocupación:</span>
            <span className="font-mono font-bold text-slate-900">{cell.porcentaje_ocupacion}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(cell.estado)}`}
              style={{ width: `${Math.min(cell.porcentaje_ocupacion, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Carga actual: <strong className="text-slate-800">{cell.cantidad_actual}</strong> / {cell.capacidad_maxima} bultos
            </span>
            <span>
              Disponible: <strong className="text-indigo-600">{Math.max(0, cell.capacidad_maxima - cell.cantidad_actual)} u</strong>
            </span>
          </div>
        </div>

        {/* Ficha del Producto Asignado */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Mercadería en Posición
          </span>

          {cell.producto_actual ? (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {cell.producto_actual}
                  </h4>
                  {cell.categoria && (
                    <span className="inline-block text-[10px] text-indigo-700 bg-indigo-50 font-medium px-1.5 py-0.2 rounded border border-indigo-100 mt-1">
                      {cell.categoria}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Lote Identificador:</span>
                  <span className="font-mono font-bold text-slate-800 truncate block">
                    {cell.lote || "LOTE-STD-2026"}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Fecha de Estiba:</span>
                  <span className="font-medium text-slate-800 block">
                    {cell.fecha_ingreso || "18/11/2026"}
                  </span>
                </div>
              </div>

              {cell.observaciones && (
                <div className="p-2 rounded bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{cell.observaciones}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-center space-y-1">
              <Box className="w-7 h-7 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Posición Libre / Vacía</p>
              <p className="text-[11px] text-slate-400">
                Lista para recibir asignación de stock desde el Pulmón Operativo.
              </p>
            </div>
          )}
        </div>

        {/* Coordenadas Físicas de la Estructura */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px]">Rack / Módulo:</span>
            <span className="font-bold text-slate-800">
              Rack R0{cell.rack} • Estante E0{cell.estanteria}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px]">Nivel Vertical:</span>
            <span className="font-bold text-slate-800">
              {getNivelDescription(cell.nivel)}
            </span>
          </div>
        </div>

        {/* Resistencia de Carga Estructural */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-slate-400" /> Capacidad de Carga:
            </span>
            <span className="font-mono font-bold text-slate-800">
              {cell.peso_actual_kg} / {cell.peso_max_kg} kg
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${cell.peso_actual_kg > cell.peso_max_kg ? "bg-rose-500" : "bg-slate-600"}`}
              style={{
                width: `${Math.min(100, (cell.peso_actual_kg / (cell.peso_max_kg || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Botones de Acción */}
        {readOnly ? (
          <div className="pt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Auditoría WMS: La asignación y desalojo de celdas es exclusivo del operario del galpón.</span>
          </div>
        ) : (
          <div className="pt-2 space-y-2">
            {hasSpace && (
              <Button
                onClick={() => onOpenSlottingWithCell(cell)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 shadow-xs"
              >
                <PackagePlus className="w-4 h-4 mr-1.5" />
                Acomodar Stock Aquí (Slotting)
              </Button>
            )}

            {cell.producto_actual && (
              <Button
                variant="outline"
                onClick={() => onClearCellStock(cell.id)}
                className="w-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs h-8 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Desalojar Celda (Mover a Pulmón)
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
