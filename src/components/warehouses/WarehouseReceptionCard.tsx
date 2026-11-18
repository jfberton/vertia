"use client";

import React from "react";
import {
  Truck,
  PackageOpen,
  ArrowRight,
  Clock,
  Layers,
  AlertCircle,
  Building,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecepcionItem } from "@/lib/data/mock-spatial-warehouse";

interface WarehouseReceptionCardProps {
  receptionItems: RecepcionItem[];
  onOpenSlottingModal: (item?: RecepcionItem) => void;
  warehouseName: string;
}

export function WarehouseReceptionCard({
  receptionItems,
  onOpenSlottingModal,
  warehouseName,
}: WarehouseReceptionCardProps) {
  const pendingItems = receptionItems.filter((i) => i.cantidad_pendiente > 0);
  const totalBultosPendientes = pendingItems.reduce((acc, curr) => acc + curr.cantidad_pendiente, 0);
  const totalKilos = pendingItems.reduce((acc, curr) => acc + curr.peso_total_kg, 0);

  return (
    <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden border">
      {/* Cabecera Industrial */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 py-4 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  Muelle de Ingreso & Estiba Rápida
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5 flex items-center gap-2">
                Zona de Recepción / Pulmón Operativo
                <span className="text-xs font-normal text-slate-300 hidden md:inline">
                  — {warehouseName}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              onClick={() => onOpenSlottingModal()}
              disabled={pendingItems.length === 0}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-4 shadow-sm transition-all"
            >
              <PackageOpen className="w-4 h-4 mr-1.5" />
              Acomodar Mercadería (Slotting)
            </Button>
          </div>
        </div>

        {/* Mini KPIs del Pulmón */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">Lotes en Espera</span>
            <span className="text-sm font-bold text-white font-mono">{pendingItems.length} remitos</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">Bultos por Ubicar</span>
            <span className="text-sm font-bold text-amber-300 font-mono">{totalBultosPendientes} u</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">Peso Total en Muelle</span>
            <span className="text-sm font-bold text-indigo-300 font-mono">{(totalKilos / 1000).toFixed(1)} Tn</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">Estado del Pulmón</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Operativo
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Mercadería en Espera */}
      <div className="p-4 bg-slate-50/60">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
          <span>Mercadería recién ingresada sin asignar a Racks físicos</span>
          <span className="text-slate-400 font-normal">
            Prioriza el acomodo para liberar el muelle de descarga
          </span>
        </div>

        {pendingItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-slate-800">Pulmón Operativo Despejado</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Toda la mercadería ingresada ha sido acomodada en sus racks y estantes definitivos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingItems.map((item) => {
              const isAlta = item.prioridad === "alta" || item.prioridad === "critica";
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Header Item */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {item.remito_numero}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isAlta && (
                          <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] px-1.5 py-0">
                            Alta Prioridad
                          </Badge>
                        )}
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.fecha_hora_arribo}
                        </span>
                      </div>
                    </div>

                    {/* Titulo del Producto */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {item.producto_nombre}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{item.proveedor}</span>
                      </div>
                    </div>

                    {/* Especificaciones */}
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Pendiente:</span>
                        <span className="font-bold text-slate-800">
                          {item.cantidad_pendiente} {item.unidad}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Lote Fabricante:</span>
                        <span className="font-mono font-medium text-slate-700 truncate block">
                          {item.lote}
                        </span>
                      </div>
                    </div>

                    {item.sugerencia_pasillo && (
                      <div className="text-[10px] text-indigo-700 bg-indigo-50/70 border border-indigo-100/80 rounded px-2 py-1 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                        <span>Sugerencia: {item.sugerencia_pasillo}</span>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Muelle: <strong className="text-slate-700">{item.muelle_descarga}</strong>
                    </span>
                    <Button
                      size="sm"
                      onClick={() => onOpenSlottingModal(item)}
                      className="h-7 text-[11px] bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600 font-semibold transition-all px-2.5"
                    >
                      Acomodar en Rack
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
