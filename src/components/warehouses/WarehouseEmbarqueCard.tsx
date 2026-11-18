"use client";

import React, { useState } from "react";
import {
  Truck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  User,
  PackageCheck,
  Send,
  Printer,
  X,
  ShieldCheck,
  Building,
  QrCode,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmbarqueItem, EmbarqueEstado } from "@/lib/data/mock-spatial-warehouse";

interface WarehouseEmbarqueCardProps {
  embarqueItems: EmbarqueItem[];
  warehouseName: string;
  onConfirmarCarga?: (item: EmbarqueItem) => void;
  onStatusChange?: (itemId: string, newStatus: EmbarqueEstado) => void;
}

export function WarehouseEmbarqueCard({
  embarqueItems,
  warehouseName,
  onConfirmarCarga,
  onStatusChange,
}: WarehouseEmbarqueCardProps) {
  const [selectedRemitoItem, setSelectedRemitoItem] = useState<EmbarqueItem | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>("all");

  // Cálculos de KPIs
  const ordenesActivas = embarqueItems.filter((i) => i.estado !== "Despachado");
  const totalBultosListos = ordenesActivas.reduce((acc, curr) => acc + curr.bultos, 0);
  const totalKilos = ordenesActivas.reduce((acc, curr) => acc + curr.peso_kg, 0);
  const camionesEnEspera = ordenesActivas.filter((i) => i.estado === "En carga" || i.estado === "Listo para cargar").length;

  const filteredItems = embarqueItems.filter((item) => {
    if (filterEstado === "all") return true;
    return item.estado === filterEstado;
  });

  const handleNextStatus = (item: EmbarqueItem) => {
    let nextStatus: EmbarqueEstado = item.estado;
    if (item.estado === "Listo para cargar") nextStatus = "En carga";
    else if (item.estado === "En carga") nextStatus = "Despachado";

    if (onStatusChange) {
      onStatusChange(item.id, nextStatus);
    }
    if (onConfirmarCarga) {
      onConfirmarCarga({ ...item, estado: nextStatus });
    }
  };

  const getStatusBadge = (estado: EmbarqueEstado) => {
    switch (estado) {
      case "Listo para cargar":
        return (
          <Badge className="bg-amber-50 text-amber-800 border-amber-200 font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
            Listo para cargar
          </Badge>
        );
      case "En carga":
        return (
          <Badge className="bg-sky-50 text-sky-800 border-sky-200 font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5" />
            En carga activa
          </Badge>
        );
      case "Despachado":
        return (
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold text-[10px]">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Despachado
          </Badge>
        );
    }
  };

  return (
    <>
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden border">
        {/* Cabecera Industrial de Alto Contraste */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-5 py-4 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                    Muelle de Expedición & Carga
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
                <h2 className="text-base font-bold text-white tracking-tight mt-0.5 flex items-center gap-2">
                  Pulmón de Salida (Zona de Embarque)
                  <span className="text-xs font-normal text-slate-300 hidden md:inline">
                    — {warehouseName}
                  </span>
                </h2>
              </div>
            </div>

            {/* Filtros de Estado en Cabecera */}
            <div className="flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setFilterEstado("all")}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  filterEstado === "all"
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Todos ({embarqueItems.length})
              </button>
              <button
                onClick={() => setFilterEstado("Listo para cargar")}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  filterEstado === "Listo para cargar"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Listos ({embarqueItems.filter((i) => i.estado === "Listo para cargar").length})
              </button>
              <button
                onClick={() => setFilterEstado("En carga")}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  filterEstado === "En carga"
                    ? "bg-sky-600 text-white shadow-2xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                En Carga ({embarqueItems.filter((i) => i.estado === "En carga").length})
              </button>
            </div>
          </div>

          {/* KPIs de Expedición */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-900/70 rounded-lg p-2.5 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Órdenes en Muelle</span>
              <span className="text-sm font-bold text-white font-mono">{ordenesActivas.length} órdenes</span>
            </div>
            <div className="bg-slate-900/70 rounded-lg p-2.5 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Bultos / Pallets Listos</span>
              <span className="text-sm font-bold text-amber-300 font-mono">{totalBultosListos} u</span>
            </div>
            <div className="bg-slate-900/70 rounded-lg p-2.5 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Camiones en Espera / Carga</span>
              <span className="text-sm font-bold text-sky-300 font-mono">{camionesEnEspera} transportes</span>
            </div>
            <div className="bg-slate-900/70 rounded-lg p-2.5 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Toneladas por Despachar</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {(totalKilos / 1000).toFixed(1)} Tn
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Despachos Preparados */}
        <div className="p-4 bg-slate-50/70">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
            <span>Mercadería Pickeada Lista para Subir a Camión</span>
            <span className="text-slate-400 font-normal">
              Inspecciona remitos de salida y valida la estiba vehicular
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
              <PackageCheck className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-slate-800">Muelle de Salida al Día</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                No hay despachos pendientes con el filtro seleccionado.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map((item) => {
                const isCritico = item.prioridad === "critica";
                const isAlta = item.prioridad === "alta";

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      {/* Fila Superior: Folio + Estado */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {item.folio}
                          </span>
                          {isCritico && (
                            <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] px-1.5 py-0">
                              Crítico
                            </Badge>
                          )}
                          {isAlta && (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0">
                              Urgente
                            </Badge>
                          )}
                        </div>
                        {getStatusBadge(item.estado)}
                      </div>

                      {/* Cliente y Destino de Obra */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.cliente}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item.destino_obra}</span>
                        </div>
                      </div>

                      {/* Resumen de Materiales */}
                      {item.items_resumen && (
                        <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 text-[11px] text-slate-700">
                          <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">
                            Carga Preparada:
                          </span>
                          <span className="line-clamp-2 font-medium">{item.items_resumen}</span>
                        </div>
                      )}

                      {/* Especificaciones de Transporte */}
                      <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Bultos & Peso:</span>
                          <span className="font-bold text-slate-800">
                            {item.bultos} u / {(item.peso_kg / 1000).toFixed(2)} Tn
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Hora Límite:</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.hora_limite_salida}
                          </span>
                        </div>
                      </div>

                      {/* Chofer Asignado */}
                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-0.5">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.chofer_asignado}</span>
                      </div>
                    </div>

                    {/* Acciones Directas */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRemitoItem(item)}
                        className="h-7 text-[11px] border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold px-2"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        Ver Remito
                      </Button>

                      {item.estado === "Listo para cargar" && (
                        <Button
                          size="sm"
                          onClick={() => handleNextStatus(item)}
                          className="h-7 text-[11px] bg-amber-600 hover:bg-amber-700 text-white font-semibold px-2.5 shadow-2xs"
                        >
                          <Truck className="w-3.5 h-3.5 mr-1" />
                          Iniciar Carga
                        </Button>
                      )}

                      {item.estado === "En carga" && (
                        <Button
                          size="sm"
                          onClick={() => handleNextStatus(item)}
                          className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Confirmar Salida
                        </Button>
                      )}

                      {item.estado === "Despachado" && (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          En Tránsito
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Modal / Visor de Remito de Expedición */}
      {selectedRemitoItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Cabecera del Remito */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">
                    Remito Oficial de Salida ({selectedRemitoItem.remito_numero || "REM-EXP-2026"})
                  </h3>
                  <span className="text-[10px] text-slate-300">
                    Documento de Traslado y Control de Carga WMS
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRemitoItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del Remito */}
            <div className="p-5 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              {/* Bloque emisor y destino */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Origen / Expedición:
                  </span>
                  <span className="font-bold text-slate-800 block text-xs">{warehouseName}</span>
                  <span className="text-[11px] text-slate-500">Muelle Asignado: {selectedRemitoItem.muelle_embarque || "Dársena Principal"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Destino Obra:
                  </span>
                  <span className="font-bold text-slate-800 block text-xs">{selectedRemitoItem.cliente}</span>
                  <span className="text-[11px] text-slate-500">{selectedRemitoItem.destino_obra}</span>
                </div>
              </div>

              {/* Datos de Transporte */}
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-700 block">
                  Unidad de Transporte & Chofer:
                </span>
                <p className="font-semibold text-slate-800">{selectedRemitoItem.chofer_asignado}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Hora de Salida Programada:</span>
                  <strong className="text-slate-700 font-mono">{selectedRemitoItem.hora_limite_salida}</strong>
                </div>
              </div>

              {/* Detalle de Materiales */}
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-500 block mb-2">
                  Detalle de Bultos y Pesaje:
                </span>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 flex justify-between text-[11px]">
                    <span>Descripción</span>
                    <span>Cantidad / Peso</span>
                  </div>
                  <div className="p-3 flex justify-between items-center border-t border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-900">{selectedRemitoItem.items_resumen || "Materiales de Construcción"}</p>
                      <span className="text-[11px] text-slate-400">Orden asociada: {selectedRemitoItem.folio}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 block">{selectedRemitoItem.bultos} Bultos</span>
                      <span className="text-[11px] text-slate-500 font-mono">{(selectedRemitoItem.peso_kg / 1000).toFixed(2)} Tn</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Firma y Código de Seguridad */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-slate-100 border border-slate-200">
                    <QrCode className="w-8 h-8 text-slate-700" />
                  </div>
                  <div className="text-[10px] text-slate-500">
                    <span className="font-bold text-slate-700 block">Firma Electrónica Válida</span>
                    <span>Certificado InvenTrack WMS v2</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Inspección Aprobada
                  </Badge>
                </div>
              </div>
            </div>

            {/* Footer de Acciones del Remito */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="h-8 text-xs border-slate-300"
              >
                <Printer className="w-3.5 h-3.5 mr-1 text-slate-600" />
                Imprimir Copia
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRemitoItem(null)}
                  className="h-8 text-xs"
                >
                  Cerrar
                </Button>
                {selectedRemitoItem.estado !== "Despachado" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleNextStatus(selectedRemitoItem);
                      setSelectedRemitoItem(null);
                    }}
                    className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    {selectedRemitoItem.estado === "Listo para cargar" ? "Iniciar Carga" : "Confirmar Salida"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
