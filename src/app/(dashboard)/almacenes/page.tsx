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
  Navigation,
  Compass,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
    nombre: "Galpón Central - Corralón Los Pinos",
    direccion: "Av. Circunvalación 4500, Rosario",
    radio_cobertura_km: 25,
    coordenadas_gps: "-32.9511, -60.6663",
    capacidad_maxima: 5000,
    es_zona_recepcion: false,
    total_ubicaciones: 240,
    ocupacion_porcentaje: 74,
  },
  {
    id: "alm-2",
    nombre: "Zona de Recepción / Pulmón General",
    direccion: "Portón Norte - Descarga Camiones",
    radio_cobertura_km: 10,
    coordenadas_gps: "-32.9480, -60.6620",
    capacidad_maxima: 1000,
    es_zona_recepcion: true,
    total_ubicaciones: 40,
    ocupacion_porcentaje: 28,
  },
  {
    id: "alm-3",
    nombre: "Sucursal Sur & Patio de Áridos",
    direccion: "Ruta 9 Km 280, Alvear",
    radio_cobertura_km: 40,
    coordenadas_gps: "-33.0201, -60.6188",
    capacidad_maxima: 3500,
    es_zona_recepcion: false,
    total_ubicaciones: 180,
    ocupacion_porcentaje: 82,
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
  {
    id: "u-1",
    codigo_visual: "F01-R01-E01-N1",
    fila: 1,
    rack: 1,
    estanteria: 1,
    nivel: 1,
    producto_actual: "Cemento Loma Negra 50kg",
    cantidad: 120,
    lote: "L-2026-A",
    estado: "completo",
  },
  {
    id: "u-2",
    codigo_visual: "F01-R01-E01-N2",
    fila: 1,
    rack: 1,
    estanteria: 1,
    nivel: 2,
    producto_actual: "Cal Hidráulica Santa Elena 25kg",
    cantidad: 80,
    lote: "L-2026-B",
    estado: "ocupado",
  },
  {
    id: "u-3",
    codigo_visual: "F01-R01-E01-N3",
    fila: 1,
    rack: 1,
    estanteria: 1,
    nivel: 3,
    producto_actual: null,
    estado: "vacio",
  },
  {
    id: "u-4",
    codigo_visual: "F01-R01-E02-N1",
    fila: 1,
    rack: 1,
    estanteria: 2,
    nivel: 1,
    producto_actual: "Hierro Nervado Ø 10mm (Barra 12m)",
    cantidad: 250,
    lote: "L-2025-Z",
    estado: "completo",
  },
  {
    id: "u-5",
    codigo_visual: "F01-R01-E02-N2",
    fila: 1,
    rack: 1,
    estanteria: 2,
    nivel: 2,
    producto_actual: null,
    estado: "vacio",
  },
  {
    id: "u-6",
    codigo_visual: "F01-R01-E02-N3",
    fila: 1,
    rack: 1,
    estanteria: 2,
    nivel: 3,
    producto_actual: null,
    estado: "vacio",
  },
];

export default function AlmacenesPage() {
  const [almacenes] = useState<MockAlmacen[]>(mockAlmacenes);
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState<MockAlmacen>(mockAlmacenes[0]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<MockUbicacion | null>(mockUbicaciones[0]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Almacenes, Matriz Espacial 3D & Radio de Cobertura
              </h1>
              <p className="text-xs text-slate-500">
                Visualización espacial de racks/niveles y configuración de alcance de flete logístico para la red VERTIA.
              </p>
            </div>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo Almacén / Galpón
        </Button>
      </div>

      {/* Selector de Almacenes (Tarjetas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {almacenes.map((alm) => {
          const esActivo = alm.id === almacenSeleccionado.id;
          return (
            <button
              key={alm.id}
              onClick={() => setAlmacenSeleccionado(alm)}
              className={`p-4 rounded-xl text-left border transition-all ${
                esActivo
                  ? "bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-sm"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-xs">{alm.nombre}</span>
                {alm.es_zona_recepcion && (
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]">
                    Zona Recepción
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-1">{alm.direccion}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                <span className="text-indigo-600 font-semibold flex items-center gap-1">
                  <Compass className="w-3 h-3" /> Radio: {alm.radio_cobertura_km} km
                </span>
                <span className="font-bold text-slate-700">
                  {alm.ocupacion_porcentaje}% ocupación
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid: Matriz 3D y Detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matriz 3D (8 columnas) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Matriz Espacial Nativa
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {almacenSeleccionado.nombre} — Sector Racks Principales
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span> Completo
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500"></span> Parcial
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-xs border border-dashed border-slate-300"></span> Vacío
                </span>
              </div>
            </div>

            {/* Representación visual de Racks y Niveles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {mockUbicaciones.map((u) => {
                const esActiva = u.id === ubicacionSeleccionada?.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setUbicacionSeleccionada(u)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      esActiva
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10 shadow-xs"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {u.codigo_visual}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          u.estado === "completo"
                            ? "bg-emerald-500"
                            : u.estado === "ocupado"
                            ? "bg-amber-500"
                            : "bg-slate-300"
                        }`}
                      ></span>
                    </div>
                    {u.producto_actual ? (
                      <div>
                        <div className="text-[11px] font-semibold text-slate-800 line-clamp-1">
                          {u.producto_actual}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {u.cantidad} unidades • {u.lote}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">Posición disponible</div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Ficha de Ubicación y Datos GPS (4 columnas) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm p-4 rounded-xl space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Detalle de Ubicación Seleccionada
              </span>
              <h3 className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                {ubicacionSeleccionada?.codigo_visual || "Selecciona una posición"}
              </h3>
            </div>

            {ubicacionSeleccionada && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-slate-500 text-[11px]">Mercadería Almacenada:</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {ubicacionSeleccionada.producto_actual || "Ubicación libre"}
                  </div>
                  {ubicacionSeleccionada.cantidad && (
                    <div className="text-slate-600 text-xs">
                      Cantidad: <strong className="text-slate-900">{ubicacionSeleccionada.cantidad} bultos</strong>
                    </div>
                  )}
                  {ubicacionSeleccionada.lote && (
                    <div className="text-slate-500 text-[11px] font-mono">
                      Lote: {ubicacionSeleccionada.lote}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block">Fila / Rack:</span>
                    <span className="font-bold text-slate-700">
                      F0{ubicacionSeleccionada.fila} • R0{ubicacionSeleccionada.rack}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block">Estantería / Nivel:</span>
                    <span className="font-bold text-slate-700">
                      E0{ubicacionSeleccionada.estanteria} • N{ubicacionSeleccionada.nivel}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-800 block">
                    Geolocalización & Radio de Entrega:
                  </span>
                  <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-[11px] space-y-1 text-slate-600">
                    <div>GPS: <span className="font-mono text-slate-800">{almacenSeleccionado.coordenadas_gps}</span></div>
                    <div>Radio de flete: <strong className="text-indigo-700">{almacenSeleccionado.radio_cobertura_km} km a la redonda</strong></div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
