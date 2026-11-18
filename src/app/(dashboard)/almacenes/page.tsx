"use client";

import React, { useState } from "react";
import {
  Warehouse,
  Plus,
  Layers,
  MapPin,
  Box,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MockAlmacen {
  id: string;
  nombre: string;
  direccion: string;
  radio_cobertura_km: number;
  coordenadas_gps: string;
  capacidad_maxima: number;
  es_zona_recepcion: boolean;
  total_ubicaciones: number;
  ocupacion_porcentaje: number;
}

const mockAlmacenes: MockAlmacen[] = [
  {
    id: "alm-1",
    nombre: "Almacén Central A1",
    direccion: "Av. Circunvalación 4500, Rosario",
    radio_cobertura_km: 35,
    coordenadas_gps: "-32.9511, -60.6663",
    capacidad_maxima: 5000,
    es_zona_recepcion: false,
    total_ubicaciones: 240,
    ocupacion_porcentaje: 74,
  },
  {
    id: "alm-2",
    nombre: "Muelle de Recepción & Staging",
    direccion: "Muelle 02 - Portón Norte",
    radio_cobertura_km: 10,
    coordenadas_gps: "-32.9480, -60.6620",
    capacidad_maxima: 1000,
    es_zona_recepcion: true,
    total_ubicaciones: 40,
    ocupacion_porcentaje: 28,
  },
  {
    id: "alm-3",
    nombre: "Depósito Córdoba",
    direccion: "Ruta 9 Km 680, Córdoba",
    radio_cobertura_km: 50,
    coordenadas_gps: "-31.4201, -64.1888",
    capacidad_maxima: 3500,
    es_zona_recepcion: false,
    total_ubicaciones: 180,
    ocupacion_porcentaje: 88,
  },
];

interface MockUbicacion {
  id: string;
  codigo_visual: string;
  fila: number;
  rack: number;
  estanteria: number;
  nivel: number;
  producto_actual?: string | null;
  cantidad?: number;
  lote?: string;
  estado: "vacio" | "ocupado" | "completo";
}

const mockUbicaciones: MockUbicacion[] = [
  { id: "u-1", codigo_visual: "F01-R01-E01-N1", fila: 1, rack: 1, estanteria: 1, nivel: 1, producto_actual: "Rodamiento SKF 6204", cantidad: 120, lote: "L-2026-A", estado: "ocupado" },
  { id: "u-2", codigo_visual: "F01-R01-E01-N2", fila: 1, rack: 1, estanteria: 1, nivel: 2, producto_actual: "Rodamiento SKF 6205", cantidad: 80, lote: "L-2026-B", estado: "ocupado" },
  { id: "u-3", codigo_visual: "F01-R01-E01-N3", fila: 1, rack: 1, estanteria: 1, nivel: 3, producto_actual: null, cantidad: 0, estado: "vacio" },
  { id: "u-4", codigo_visual: "F01-R01-E02-N1", fila: 1, rack: 1, estanteria: 2, nivel: 1, producto_actual: "Correa Dentada HTD 8M", cantidad: 300, lote: "L-2025-Z", estado: "completo" },
  { id: "u-5", codigo_visual: "F01-R01-E02-N2", fila: 1, rack: 1, estanteria: 2, nivel: 2, producto_actual: null, cantidad: 0, estado: "vacio" },
  { id: "u-6", codigo_visual: "F01-R02-E01-N1", fila: 1, rack: 2, estanteria: 1, nivel: 1, producto_actual: "Filtro de Aceite Industrial", cantidad: 45, lote: "L-2026-C", estado: "ocupado" },
  { id: "u-7", codigo_visual: "F01-R02-E01-N2", fila: 1, rack: 2, estanteria: 1, nivel: 2, producto_actual: null, cantidad: 0, estado: "vacio" },
  { id: "u-8", codigo_visual: "F01-R02-E01-N3", fila: 1, rack: 2, estanteria: 1, nivel: 3, producto_actual: null, cantidad: 0, estado: "vacio" },
];

export default function AlmacenesPage() {
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState(mockAlmacenes[0].id);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);

  const ubicacionesFiltradas = mockUbicaciones.filter((u) =>
    u.codigo_visual.toLowerCase().includes(filtroTexto.toLowerCase()) ||
    (u.producto_actual && u.producto_actual.toLowerCase().includes(filtroTexto.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-indigo-400" />
            Almacenes & Matriz de Ubicaciones 3D
          </h1>
          <p className="text-sm text-zinc-400">
            Organiza tus depósitos, muelles de recepción y consulta el mapa físico de estanterías.
          </p>
        </div>
        <Button onClick={() => setMostrarModalNuevo(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo Almacén
        </Button>
      </div>

      {/* Almacenes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockAlmacenes.map((alm) => {
          const isSelected = alm.id === almacenSeleccionado;

          return (
            <div
              key={alm.id}
              onClick={() => setAlmacenSeleccionado(alm.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-zinc-900 border-indigo-500 shadow-lg shadow-indigo-500/10"
                  : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${alm.es_zona_recepcion ? "bg-amber-950 text-amber-400" : "bg-indigo-950 text-indigo-400"}`}>
                    <Warehouse className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">{alm.nombre}</h3>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      {alm.direccion}
                    </div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-1 flex items-center gap-2">
                      <span>GPS: {alm.coordenadas_gps}</span>
                      <span>• Radio flete: {alm.radio_cobertura_km} km</span>
                    </div>
                  </div>
                </div>
                {alm.es_zona_recepcion && (
                  <Badge variant="warning" className="text-[10px]">
                    Recepción / Muelle
                  </Badge>
                )}
              </div>

              {/* Capacidad Progress */}
              <div className="space-y-1.5 mt-4 pt-3 border-t border-zinc-800/80">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Capacidad ocupada</span>
                  <span className="font-medium text-zinc-200">{alm.ocupacion_porcentaje}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      alm.ocupacion_porcentaje > 85
                        ? "bg-amber-500"
                        : "bg-indigo-500"
                    }`}
                    style={{ width: `${alm.ocupacion_porcentaje}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                  <span>{alm.total_ubicaciones} posiciones 3D</span>
                  <span>Máx: {alm.capacidad_maxima} u.</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explorador de Ubicaciones 3D */}
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Matriz Espacial de Ubicaciones Físicas
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Coordenadas de almacenamiento (Pasillo • Rack • Estantería • Nivel)
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                type="text"
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                placeholder="Filtrar por código o producto..."
                className="pl-9 h-9 text-xs bg-zinc-950 border-zinc-800"
              />
            </div>
            <Button size="sm" variant="outline" className="border-zinc-800 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Filtros
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {ubicacionesFiltradas.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-300">
                      {u.codigo_visual}
                    </span>
                    <Badge
                      variant={
                        u.estado === "completo"
                          ? "default"
                          : u.estado === "ocupado"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-[10px]"
                    >
                      {u.estado === "vacio" ? "Disponible" : u.estado}
                    </Badge>
                  </div>

                  <div className="text-xs text-zinc-300 font-medium line-clamp-1">
                    {u.producto_actual || "Posición vacía"}
                  </div>

                  {u.producto_actual && (
                    <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
                      <span>Lote: <strong className="text-zinc-400">{u.lote}</strong></span>
                      <span className="text-emerald-400 font-semibold">{u.cantidad} u.</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Fila {u.fila} • Rack {u.rack}</span>
                  <span>Est. {u.estanteria} • Nivel {u.nivel}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
