"use client";

import React, { useState, useMemo } from "react";
import {
  Layers,
  Box,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  Maximize,
  Grid,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpatialCell, CellStatus } from "@/lib/data/mock-spatial-warehouse";

interface WarehouseSpatial3DProps {
  cells: SpatialCell[];
  selectedCell: SpatialCell | null;
  onSelectCell: (cell: SpatialCell) => void;
  warehouseName: string;
}

type ViewMode = "isometric" | "elevation" | "blueprint";

export function WarehouseSpatial3D({
  cells,
  selectedCell,
  onSelectCell,
  warehouseName,
}: WarehouseSpatial3DProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("isometric");
  const [selectedPasillo, setSelectedPasillo] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Controles de Cámara Isométrica 3D
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotAngle, setRotAngle] = useState<number>(-34); // Grados Z
  const [tiltAngle, setTiltAngle] = useState<number>(55); // Grados X
  const [hoveredCell, setHoveredCell] = useState<SpatialCell | null>(null);

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

  // Filtrado de celdas
  const filteredCells = useMemo(() => {
    return cells.filter((cell) => {
      if (selectedPasillo !== "all" && cell.pasillo_id !== selectedPasillo) return false;
      if (selectedStatusFilter !== "all" && cell.estado !== selectedStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = cell.codigo_visual.toLowerCase().includes(q);
        const matchesProduct = cell.producto_actual?.toLowerCase().includes(q) ?? false;
        const matchesLote = cell.lote?.toLowerCase().includes(q) ?? false;
        if (!matchesCode && !matchesProduct && !matchesLote) return false;
      }
      return true;
    });
  }, [cells, selectedPasillo, selectedStatusFilter, searchQuery]);

  // Resumen de conteos
  const counts = useMemo(() => {
    const vacio = cells.filter((c) => c.estado === "vacio").length;
    const parcial = cells.filter((c) => c.estado === "parcial").length;
    const lleno = cells.filter((c) => c.estado === "lleno").length;
    const critico = cells.filter((c) => c.estado === "critico").length;
    return { vacio, parcial, lleno, critico, total: cells.length };
  }, [cells]);

  // Agrupamiento por Pasillo y Rack para la visualización
  const groupedByPasillo = useMemo(() => {
    const result: Record<string, Record<number, SpatialCell[]>> = {};

    filteredCells.forEach((c) => {
      if (!result[c.pasillo_id]) {
        result[c.pasillo_id] = {};
      }
      if (!result[c.pasillo_id][c.rack]) {
        result[c.pasillo_id][c.rack] = [];
      }
      result[c.pasillo_id][c.rack].push(c);
    });

    return result;
  }, [filteredCells]);

  const handleResetCamera = () => {
    setZoomLevel(1);
    setRotAngle(-34);
    setTiltAngle(55);
  };

  const getCellColorClass = (cell: SpatialCell, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) {
      return "ring-3 ring-indigo-600 ring-offset-2 z-20 shadow-md";
    }

    switch (cell.estado) {
      case "vacio":
        return "bg-slate-100/90 border border-dashed border-slate-300 text-slate-400 hover:bg-slate-200/80 hover:border-slate-400";
      case "parcial":
        return "bg-gradient-to-t from-indigo-600 to-indigo-500 border border-indigo-700 text-white shadow-xs hover:from-indigo-500 hover:to-indigo-400";
      case "lleno":
        return "bg-gradient-to-t from-emerald-600 to-emerald-500 border border-emerald-700 text-white shadow-xs hover:from-emerald-500 hover:to-emerald-400";
      case "critico":
        return "bg-gradient-to-t from-rose-600 to-amber-600 border border-rose-700 text-white shadow-xs animate-pulse hover:from-rose-500 hover:to-amber-500";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Barra Superior: Modos de Vista & Filtros */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Selector de Modo */}
          <div className="bg-white p-0.5 rounded-lg border border-slate-200 flex items-center shadow-2xs text-xs font-semibold">
            <button
              onClick={() => setViewMode("isometric")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                viewMode === "isometric"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              Perspectiva 3D
            </button>
            <button
              onClick={() => setViewMode("elevation")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                viewMode === "elevation"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Elevación de Racks
            </button>
            <button
              onClick={() => setViewMode("blueprint")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                viewMode === "blueprint"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Plano 2D
            </button>
          </div>
        </div>

        {/* Buscador & Filtro de Pasillo */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar SKU, celda o lote..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs pl-8 bg-white border-slate-200"
            />
          </div>

          <select
            value={selectedPasillo}
            onChange={(e) => setSelectedPasillo(e.target.value)}
            className="h-8 bg-white border border-slate-200 rounded-lg px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          >
            <option value="all">Todos los Pasillos</option>
            {pasillos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-barra: Leyenda de Estados y Filtro por Ocupación */}
      <div className="px-4 py-2 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">
            Filtrar:
          </span>
          <button
            onClick={() => setSelectedStatusFilter("all")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              selectedStatusFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos ({counts.total})
          </button>
          <button
            onClick={() => setSelectedStatusFilter("lleno")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
              selectedStatusFilter === "lleno"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" />
            Lleno ({counts.lleno})
          </button>
          <button
            onClick={() => setSelectedStatusFilter("parcial")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
              selectedStatusFilter === "parcial"
                ? "bg-indigo-600 text-white"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-indigo-500 inline-block" />
            Parcial ({counts.parcial})
          </button>
          <button
            onClick={() => setSelectedStatusFilter("vacio")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
              selectedStatusFilter === "vacio"
                ? "bg-slate-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-xs border border-dashed border-slate-400 inline-block" />
            Vacío ({counts.vacio})
          </button>
          <button
            onClick={() => setSelectedStatusFilter("critico")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
              selectedStatusFilter === "critico"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-rose-500 inline-block" />
            Crítico ({counts.critico})
          </button>
        </div>

        {/* Controles de Vista Isométrica */}
        {viewMode === "isometric" && (
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              title="Acercar (Zoom In)"
              className="p-1 rounded text-slate-600 hover:text-indigo-600 hover:bg-white transition-all"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              title="Alejar (Zoom Out)"
              className="p-1 rounded text-slate-600 hover:text-indigo-600 hover:bg-white transition-all"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setRotAngle((r) => r - 15)}
              title="Girar Izquierda"
              className="px-1 text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-all"
            >
              ↺
            </button>
            <button
              onClick={() => setRotAngle((r) => r + 15)}
              title="Girar Derecha"
              className="px-1 text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-all"
            >
              ↻
            </button>
            <button
              onClick={handleResetCamera}
              title="Restablecer Cámara"
              className="p-1 rounded text-slate-600 hover:text-indigo-600 hover:bg-white transition-all"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* ÁREA DE VISUALIZACIÓN */}
      <div className="relative min-h-[460px] max-h-[600px] overflow-hidden bg-slate-900 flex items-center justify-center p-6 select-none">
        {/* Fondo con Cuadrícula Industrial */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 80%),
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Overlay de Ayuda e Información Flotante */}
        <div className="absolute top-3 left-3 z-30 pointer-events-none">
          <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold text-white">{warehouseName}</span>
            <span className="text-slate-500">|</span>
            <span>{filteredCells.length} celdas en vista</span>
          </div>
        </div>

        {/* Tooltip flotante al pasar el mouse por una celda */}
        {hoveredCell && (
          <div className="absolute bottom-3 left-3 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 rounded-xl p-3 shadow-xl text-white text-xs max-w-xs space-y-1">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono font-bold text-indigo-300 text-sm">
                  {hoveredCell.codigo_visual}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    hoveredCell.estado === "lleno"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : hoveredCell.estado === "parcial"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : hoveredCell.estado === "critico"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {hoveredCell.estado}
                </span>
              </div>
              <div className="font-semibold text-slate-100 line-clamp-1">
                {hoveredCell.producto_actual || "Posición Libre"}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                <span>Ocupación: <strong className="text-white">{hoveredCell.porcentaje_ocupacion}%</strong></span>
                <span>{hoveredCell.cantidad_actual} / {hoveredCell.capacidad_maxima} u</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODO 1: PERSPECTIVA ISOMÉTRICA 3D */}
        {/* ======================================================== */}
        {viewMode === "isometric" && (
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-300"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            <div
              className="relative transition-transform duration-300"
              style={{
                transformStyle: "preserve-3d",
                transform: `scale(${zoomLevel}) rotateX(${tiltAngle}deg) rotateZ(${rotAngle}deg)`,
              }}
            >
              {/* Plano del Suelo del Galpón */}
              <div
                className="relative p-8 rounded-3xl bg-slate-800/90 border-2 border-indigo-500/30 shadow-2xl flex flex-col gap-8"
                style={{
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(99, 102, 241, 0.1)",
                }}
              >
                {/* Marcaciones de Piso / Carril de Tránsito */}
                <div className="absolute top-2 left-6 right-6 border-b border-dashed border-amber-400/40 text-[9px] font-mono text-amber-300/60 flex justify-between tracking-widest uppercase">
                  <span>◀ Muelle Recepción</span>
                  <span>Pasillo Principal Tránsito Autoelevador ▶</span>
                </div>

                {/* Pasillos Isométricos */}
                {Object.keys(groupedByPasillo).length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs font-mono">
                    No hay celdas coincidentes con los filtros aplicados.
                  </div>
                ) : (
                  Object.entries(groupedByPasillo).map(([pasilloId, racksMap]) => (
                    <div
                      key={pasilloId}
                      className="relative p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3"
                    >
                      {/* Rótulo de Pasillo */}
                      <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-800 pb-2">
                        <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          {pasilloId} — {pasillos.find((p) => p.id === pasilloId)?.nombre || pasilloId}
                        </span>
                        <span className="text-[10px] text-slate-500">Estructura Heavy Rack</span>
                      </div>

                      {/* Racks del Pasillo */}
                      <div className="flex flex-wrap gap-6 items-end">
                        {Object.entries(racksMap).map(([rackNum, rackCells]) => {
                          // Agrupar celdas del rack por niveles
                          const niveles = [3, 2, 1]; // De arriba a abajo

                          return (
                            <div
                              key={rackNum}
                              className="relative bg-slate-800/90 rounded-xl p-3 border-2 border-slate-600/60 shadow-lg flex flex-col gap-2 min-w-[200px]"
                            >
                              {/* Marco Superior del Rack */}
                              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between border-b border-slate-700 pb-1">
                                <span className="font-bold text-slate-200">Rack R0{rackNum}</span>
                                <span className="text-[9px] text-indigo-400">3 Niveles</span>
                              </div>

                              {/* Niveles del Rack (N3 Arriba, N2 Medio, N1 Suelo) */}
                              <div className="flex flex-col gap-2">
                                {niveles.map((nivelNum) => {
                                  const nivelCells = rackCells.filter((c) => c.nivel === nivelNum);
                                  if (nivelCells.length === 0) return null;

                                  return (
                                    <div
                                      key={nivelNum}
                                      className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-lg border border-slate-700/50"
                                    >
                                      <span className="font-mono text-[9px] font-bold text-slate-500 w-4 shrink-0">
                                        N{nivelNum}
                                      </span>

                                      {/* Celdas / Estantes del Nivel */}
                                      <div className="flex gap-2 flex-1">
                                        {nivelCells.map((cell) => {
                                          const isSelected = selectedCell?.id === cell.id;
                                          const isHovered = hoveredCell?.id === cell.id;

                                          return (
                                            <button
                                              key={cell.id}
                                              onClick={() => onSelectCell(cell)}
                                              onMouseEnter={() => setHoveredCell(cell)}
                                              onMouseLeave={() => setHoveredCell(null)}
                                              className={`relative flex-1 h-12 rounded-lg p-1.5 text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${getCellColorClass(
                                                cell,
                                                isHovered,
                                                isSelected
                                              )}`}
                                              style={{
                                                transform: isHovered
                                                  ? "translateY(-4px) scale(1.04)"
                                                  : isSelected
                                                  ? "translateY(-2px) scale(1.02)"
                                                  : "none",
                                              }}
                                            >
                                              <div className="flex items-center justify-between w-full">
                                                <span className="font-mono text-[9px] font-bold opacity-90 truncate">
                                                  E{cell.estanteria}
                                                </span>
                                                <span className="font-mono text-[8px] font-bold">
                                                  {cell.porcentaje_ocupacion}%
                                                </span>
                                              </div>

                                              {/* Mini barra de carga dentro de la celda */}
                                              <div className="w-full bg-black/20 rounded-full h-1 overflow-hidden mt-0.5">
                                                <div
                                                  className="bg-white/80 h-full rounded-full"
                                                  style={{
                                                    width: `${Math.min(100, cell.porcentaje_ocupacion)}%`,
                                                  }}
                                                />
                                              </div>

                                              <div className="text-[8px] truncate font-medium opacity-90">
                                                {cell.producto_actual || "Vacío"}
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODO 2: ELEVACIÓN FRONTAL DE RACKS */}
        {/* ======================================================== */}
        {viewMode === "elevation" && (
          <div className="w-full max-h-[500px] overflow-y-auto p-4 space-y-6">
            {Object.entries(groupedByPasillo).map(([pasilloId, racksMap]) => (
              <div
                key={pasilloId}
                className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-4 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-indigo-400">{pasilloId}</span>
                    <span className="text-xs text-white font-medium">
                      {pasillos.find((p) => p.id === pasilloId)?.nombre || pasilloId}
                    </span>
                  </div>
                  <Badge className="bg-slate-700 text-slate-300 text-[10px]">
                    Vista Frontal de Bahías
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(racksMap).map(([rackNum, rackCells]) => {
                    const niveles = [3, 2, 1];

                    return (
                      <div
                        key={rackNum}
                        className="bg-slate-900 rounded-lg p-3 border border-slate-700/80 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-bold">
                          <span>RACK R0{rackNum}</span>
                          <span className="text-[10px] text-slate-500">Corte Transversal</span>
                        </div>

                        <div className="space-y-2">
                          {niveles.map((nivelNum) => {
                            const cellsInNivel = rackCells.filter((c) => c.nivel === nivelNum);
                            if (cellsInNivel.length === 0) return null;

                            return (
                              <div
                                key={nivelNum}
                                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/70 border border-slate-700"
                              >
                                <span className="font-mono text-[10px] font-bold text-slate-400 w-6 shrink-0">
                                  N0{nivelNum}
                                </span>
                                <div className="grid grid-cols-2 gap-2 flex-1">
                                  {cellsInNivel.map((cell) => {
                                    const isSelected = selectedCell?.id === cell.id;
                                    return (
                                      <button
                                        key={cell.id}
                                        onClick={() => onSelectCell(cell)}
                                        className={`p-2.5 rounded-lg text-left transition-all flex flex-col justify-between ${getCellColorClass(
                                          cell,
                                          false,
                                          isSelected
                                        )}`}
                                      >
                                        <div className="flex items-center justify-between font-mono text-[10px] font-bold mb-1">
                                          <span>{cell.codigo_visual}</span>
                                          <span>{cell.porcentaje_ocupacion}%</span>
                                        </div>
                                        <div className="text-[11px] font-semibold truncate leading-tight">
                                          {cell.producto_actual || "Posición Libre"}
                                        </div>
                                        <div className="text-[10px] opacity-80 mt-1 flex items-center justify-between">
                                          <span>{cell.cantidad_actual} bultos</span>
                                          <span>Lote: {cell.lote || "S/L"}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
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
        )}

        {/* ======================================================== */}
        {/* MODO 3: PLANO 2D (LAYOUT DE PLANTA) */}
        {/* ======================================================== */}
        {viewMode === "blueprint" && (
          <div className="w-full max-w-2xl bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-white">
              <div>
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Grid className="w-4 h-4 text-indigo-400" />
                  Plano Esquemático de Distribución en Planta (2D)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mapa de zonificación: muelles de descarga, pasillos de circulación y zonas de racks.
                </p>
              </div>
              <Badge className="bg-indigo-950 text-indigo-300 border-indigo-800 text-[10px]">
                Nave Industrial
              </Badge>
            </div>

            {/* Diagrama Esquemático SVG / Canvas */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs text-white">
              {/* Zona Norte: Recepción */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between">
                <span className="font-bold">▲ MUELLES DE DESCARGA (ZONA NORTE)</span>
                <span className="text-[10px]">Acceso Camiones Tolva & Chasis</span>
              </div>

              {/* Racks y Pasillos */}
              <div className="grid grid-cols-3 gap-3">
                {pasillos.map((p) => {
                  const cellsInP = cells.filter((c) => c.pasillo_id === p.id);
                  const fullCount = cellsInP.filter((c) => c.estado === "lleno" || c.estado === "critico").length;
                  const pct = Math.round((fullCount / (cellsInP.length || 1)) * 100);

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPasillo(p.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPasillo === p.id
                          ? "bg-indigo-900/40 border-indigo-500 text-white shadow-md"
                          : "bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-bold text-indigo-400 text-xs mb-1">{p.id}</div>
                      <div className="text-[11px] font-sans font-semibold text-slate-200 line-clamp-1">
                        {p.nombre}
                      </div>
                      <div className="mt-3 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Ocupación:</span>
                        <strong className="text-white">{pct}%</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Zona Sur: Salida & Expedición */}
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                <span className="font-bold">▼ PLAYA DE EXPEDICIÓN & CONSOLIDADOS</span>
                <span className="text-[10px]">Carga a Camiones de Reparto B2B</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pie Informativo */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            Haz clic en cualquier celda para ver el desglose en el <strong>Inspector de Celda</strong>.
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Matriz WMS Espacial Nativa • InvenTrack v2
        </div>
      </div>
    </div>
  );
}
