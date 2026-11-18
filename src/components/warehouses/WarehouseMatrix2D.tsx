"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Layers,
  Box,
  AlertTriangle,
  CheckCircle2,
  Package,
  Sparkles,
  ArrowUpDown,
  Building,
  Info,
  ChevronRight,
  Maximize2,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpatialCell, CellStatus } from "@/lib/data/mock-spatial-warehouse";

interface WarehouseMatrix2DProps {
  cells: SpatialCell[];
  selectedCell: SpatialCell | null;
  onSelectCell: (cell: SpatialCell) => void;
  warehouseName: string;
}

export function WarehouseMatrix2D({
  cells,
  selectedCell,
  onSelectCell,
  warehouseName,
}: WarehouseMatrix2DProps) {
  const [selectedPasillo, setSelectedPasillo] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lista única de pasillos disponibles
  const pasillos = useMemo(() => {
    const map = new Map<string, string>();
    cells.forEach((c) => {
      if (!map.has(c.pasillo_id)) {
        map.set(c.pasillo_id, c.pasillo_nombre);
      }
    });
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  }, [cells]);

  // Si no hay pasillo seleccionado o se borró, por defecto se usa el primero si hay varios, o "all"
  const activePasilloId = selectedPasillo === "all" && pasillos.length > 0 ? pasillos[0].id : selectedPasillo;

  // Filtrado de celdas
  const filteredCells = useMemo(() => {
    return cells.filter((cell) => {
      if (selectedPasillo !== "all" && cell.pasillo_id !== selectedPasillo) return false;
      if (selectedStatusFilter !== "all" && cell.estado !== selectedStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = cell.codigo_visual.toLowerCase().includes(q);
        const matchesProduct = cell.producto_actual?.toLowerCase().includes(q) ?? false;
        const matchesSku = cell.sku?.toLowerCase().includes(q) ?? false;
        const matchesLote = cell.lote?.toLowerCase().includes(q) ?? false;
        if (!matchesCode && !matchesProduct && !matchesSku && !matchesLote) return false;
      }
      return true;
    });
  }, [cells, selectedPasillo, selectedStatusFilter, searchQuery]);

  // Conteos rápidos
  const counts = useMemo(() => {
    const vacio = cells.filter((c) => c.estado === "vacio").length;
    const parcial = cells.filter((c) => c.estado === "parcial").length;
    const lleno = cells.filter((c) => c.estado === "lleno").length;
    const critico = cells.filter((c) => c.estado === "critico").length;
    const total = cells.length;
    const totalCap = cells.reduce((acc, c) => acc + c.capacidad_maxima, 0) || 1;
    const totalQty = cells.reduce((acc, c) => acc + c.cantidad_actual, 0);
    const avgOccupancy = Math.round((totalQty / totalCap) * 100);

    return { vacio, parcial, lleno, critico, total, avgOccupancy };
  }, [cells]);

  // Agrupamiento por Pasillo -> Rack -> Estantería -> Niveles
  const pasillosParaMostrar = useMemo(() => {
    const pIds = selectedPasillo === "all" 
      ? pasillos.map((p) => p.id)
      : [selectedPasillo];

    return pIds.map((pId) => {
      const pNombre = pasillos.find((p) => p.id === pId)?.nombre || pId;
      const pasilloCells = filteredCells.filter((c) => c.pasillo_id === pId);

      // Agrupar por Rack
      const racksMap = new Map<number, SpatialCell[]>();
      pasilloCells.forEach((c) => {
        if (!racksMap.has(c.rack)) {
          racksMap.set(c.rack, []);
        }
        racksMap.get(c.rack)!.push(c);
      });

      const racks = Array.from(racksMap.entries())
        .sort(([rA], [rB]) => rA - rB)
        .map(([rackNum, rackCells]) => {
          // Obtener lista de niveles únicos ordenados de arriba (mayor) a abajo (1 = suelo)
          const niveles = Array.from(new Set(rackCells.map((c) => c.nivel))).sort((a, b) => b - a);
          // Obtener estanterías (columnas) ordenadas
          const estanterias = Array.from(new Set(rackCells.map((c) => c.estanteria))).sort((a, b) => a - b);

          return {
            rackNum,
            niveles,
            estanterias,
            rackCells,
          };
        });

      return {
        pasilloId: pId,
        pasilloNombre: pNombre,
        racks,
        totalCells: pasilloCells.length,
      };
    });
  }, [filteredCells, pasillos, selectedPasillo]);

  const getStatusColorClasses = (estado: CellStatus, isSelected: boolean) => {
    const baseBorder = isSelected ? "ring-2 ring-indigo-600 border-indigo-600 shadow-md scale-[1.01]" : "hover:shadow-sm";

    switch (estado) {
      case "vacio":
        return `${baseBorder} bg-slate-50/80 border-slate-200 text-slate-500 hover:border-slate-300`;
      case "parcial":
        return `${baseBorder} bg-sky-50/60 border-sky-200 text-sky-900 hover:border-sky-400`;
      case "lleno":
        return `${baseBorder} bg-emerald-50/70 border-emerald-300 text-emerald-950 hover:border-emerald-400`;
      case "critico":
        return `${baseBorder} bg-rose-50/80 border-rose-300 text-rose-950 hover:border-rose-400 animate-pulse`;
    }
  };

  const getProgressColor = (estado: CellStatus) => {
    switch (estado) {
      case "vacio":
        return "bg-slate-300";
      case "parcial":
        return "bg-sky-500";
      case "lleno":
        return "bg-emerald-500";
      case "critico":
        return "bg-rose-500";
    }
  };

  const getNivelDescriptor = (nivel: number) => {
    switch (nivel) {
      case 3:
        return "N3 · Alto (Pallets)";
      case 2:
        return "N2 · Medio (Fraccionado)";
      case 1:
        return "N1 · Suelo (Picking)";
      default:
        return `N${nivel} · Industrial`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* 1. Header Industrial de Navegación 2D */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  Matriz 2D Industrial
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {warehouseName}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                Almacenamiento Activo & Slotting por Pasillos
              </h3>
            </div>
          </div>

          {/* Buscador Universal Instantáneo */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Buscar por SKU, producto, lote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-indigo-400 rounded-lg"
              />
            </div>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="h-8 px-2 text-xs text-slate-300 hover:text-white"
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Barra de Filtros por Pasillo y Estado */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800/80 text-xs">
          {/* Selector de Pasillos (Tabs Píldoras) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-slate-400 text-[11px] font-semibold mr-1 shrink-0">Pasillos:</span>
            <button
              onClick={() => setSelectedPasillo("all")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0 transition-all ${
                selectedPasillo === "all"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              Todos los Pasillos
            </button>
            {pasillos.map((p) => {
              const isActive = selectedPasillo === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPasillo(p.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0 transition-all flex items-center gap-1 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  <span>{p.id}</span>
                  <span className="text-[10px] opacity-75 font-normal hidden sm:inline">
                    · {p.nombre.replace(/Pasillo \d+\s*-\s*/, "")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filtros de Ocupación */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-[11px]">
            <button
              onClick={() => setSelectedStatusFilter("all")}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                selectedStatusFilter === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Todos ({counts.total})
            </button>
            <button
              onClick={() => setSelectedStatusFilter("vacio")}
              className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
                selectedStatusFilter === "vacio" ? "bg-slate-700 text-slate-200" : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Vacíos ({counts.vacio})
            </button>
            <button
              onClick={() => setSelectedStatusFilter("parcial")}
              className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
                selectedStatusFilter === "parcial" ? "bg-sky-700 text-white" : "text-sky-300 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Parcial ({counts.parcial})
            </button>
            <button
              onClick={() => setSelectedStatusFilter("lleno")}
              className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
                selectedStatusFilter === "lleno" ? "bg-emerald-700 text-white" : "text-emerald-300 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Lleno ({counts.lleno})
            </button>
            <button
              onClick={() => setSelectedStatusFilter("critico")}
              className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
                selectedStatusFilter === "critico" ? "bg-rose-700 text-white" : "text-rose-300 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              Alerta ({counts.critico})
            </button>
          </div>
        </div>
      </div>

      {/* 2. Leyenda Visual de Niveles Verticales */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
            Niveles Verticales:
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-indigo-800 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded font-mono">N3</strong>
            Alto / Pallets Completos
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-sky-800 bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded font-mono">N2</strong>
            Medio / Carga Fraccionada
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-mono">N1</strong>
            Piso / Picking Diario Rápido
          </span>
        </div>
        <div className="text-slate-500 font-medium">
          Ocupación Promedio: <strong className="text-slate-800 font-mono">{counts.avgOccupancy}%</strong>
        </div>
      </div>

      {/* 3. Cuadrícula 2D de Racks y Estantes */}
      <div className="p-4 space-y-6 overflow-x-auto max-h-[700px] overflow-y-auto">
        {pasillosParaMostrar.length === 0 || filteredCells.length === 0 ? (
          <div className="p-10 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Box className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No se encontraron celdas</h4>
            <p className="text-xs text-slate-500 mt-1">
              Prueba cambiando el pasillo seleccionado o limpiando los términos de búsqueda.
            </p>
          </div>
        ) : (
          pasillosParaMostrar.map((pasillo) => (
            <div key={pasillo.pasilloId} className="space-y-3">
              {/* Encabezado del Pasillo */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black bg-indigo-600 text-white px-2 py-0.5 rounded shadow-2xs">
                    {pasillo.pasilloId}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-800">
                    {pasillo.pasilloNombre}
                  </h4>
                  <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200">
                    {pasillo.totalCells} celdas
                  </Badge>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {pasillo.racks.length} Baterías de Racks
                </span>
              </div>

              {/* Racks del Pasillo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pasillo.racks.map((rack) => (
                  <div
                    key={`rack-${pasillo.pasilloId}-${rack.rackNum}`}
                    className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 space-y-2"
                  >
                    {/* Header del Rack */}
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                      <span className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-indigo-500" />
                        Rack {rack.rackNum.toString().padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {rack.estanterias.length} Estantes · {rack.niveles.length} Niveles
                      </span>
                    </div>

                    {/* Matriz Vertical: Niveles de Arriba (N3) a Abajo (N1) */}
                    <div className="space-y-1.5">
                      {rack.niveles.map((nivelNum) => {
                        return (
                          <div
                            key={`nivel-${nivelNum}`}
                            className="bg-white rounded-lg border border-slate-200/80 p-2 space-y-1"
                          >
                            {/* Etiqueta del Nivel */}
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pb-0.5 border-b border-slate-100">
                              <span className="font-bold text-slate-700">
                                {getNivelDescriptor(nivelNum)}
                              </span>
                              <span className="font-mono text-slate-400">Nivel {nivelNum}</span>
                            </div>

                            {/* Celdas / Estanterías del Nivel */}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              {rack.estanterias.map((estNum) => {
                                const cell = rack.rackCells.find(
                                  (c) => c.nivel === nivelNum && c.estanteria === estNum
                                );

                                if (!cell) {
                                  return (
                                    <div
                                      key={`empty-pos-${nivelNum}-${estNum}`}
                                      className="p-2 rounded-md border border-dashed border-slate-200 text-center text-[10px] text-slate-400"
                                    >
                                      E{estNum} (Sin celda)
                                    </div>
                                  );
                                }

                                const isSelected = selectedCell?.id === cell.id;
                                const isCritico = cell.estado === "critico";
                                const isLleno = cell.estado === "lleno";

                                return (
                                  <button
                                    key={cell.id}
                                    onClick={() => onSelectCell(cell)}
                                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${getStatusColorClasses(
                                      cell.estado,
                                      isSelected
                                    )}`}
                                  >
                                    {/* Fila Superior de la Celda */}
                                    <div className="flex items-center justify-between w-full mb-1">
                                      <span className="font-mono text-[11px] font-black tracking-tight text-slate-800">
                                        {cell.codigo_visual}
                                      </span>
                                      <span className="font-mono text-[10px] font-bold">
                                        {cell.porcentaje_ocupacion}%
                                      </span>
                                    </div>

                                    {/* Contenido / Producto */}
                                    <div className="min-h-[34px] w-full">
                                      {cell.producto_actual ? (
                                        <>
                                          <p className="text-[11px] font-bold leading-tight line-clamp-1 text-slate-900">
                                            {cell.producto_actual}
                                          </p>
                                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                                            <span className="font-mono truncate">{cell.lote || cell.sku || "Lote Estándar"}</span>
                                            <span className="font-semibold">{cell.cantidad_actual} u</span>
                                          </div>
                                        </>
                                      ) : (
                                        <p className="text-[11px] text-slate-400 italic">
                                          Disponible / Vacío
                                        </p>
                                      )}
                                    </div>

                                    {/* Barra de Ocupación Visual */}
                                    <div className="w-full mt-1.5 space-y-1">
                                      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${getProgressColor(cell.estado)}`}
                                          style={{ width: `${Math.min(100, cell.porcentaje_ocupacion)}%` }}
                                        />
                                      </div>
                                      <div className="flex items-center justify-between text-[9px] text-slate-500">
                                        <span>{(cell.peso_actual_kg / 1000).toFixed(1)} Tn</span>
                                        <span>Máx: {(cell.peso_max_kg / 1000).toFixed(1)} Tn</span>
                                      </div>
                                    </div>

                                    {/* Indicador de Celda Seleccionada */}
                                    {isSelected && (
                                      <div className="mt-1 pt-1 border-t border-indigo-200 flex items-center justify-between text-[9px] font-bold text-indigo-700">
                                        <span>Seleccionada</span>
                                        <Check className="w-3 h-3" />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Footer Informativo de Atajos */}
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 text-[11px]">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          Haz clic en cualquier celda para abrir el drawer de inspección, reubicación o acomodo de mercadería.
        </span>
        {selectedCell && (
          <span className="text-[11px] font-bold text-indigo-700 font-mono">
            Celda Activa: {selectedCell.codigo_visual}
          </span>
        )}
      </div>
    </div>
  );
}
