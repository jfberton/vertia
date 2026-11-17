"use client";

import React, { useState } from "react";
import {
  Boxes,
  Plus,
  Search,
  Barcode,
  Share2,
  AlertTriangle,
  Edit2,
  MoreVertical,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MockProducto {
  id: string;
  codigo_barras: string;
  nombre: string;
  descripcion: string;
  unidad_medida: string;
  precio: number;
  cantidad_total: number;
  cantidad_minima: number;
  cantidad_maxima: number;
  publicado_en_red: boolean;
}

const mockProductos: MockProducto[] = [
  {
    id: "p-1",
    codigo_barras: "7791234567890",
    nombre: "Rodamiento SKF 6204-2RSH",
    descripcion: "Rodamiento rígido de bolas con sellos de obturación",
    unidad_medida: "UN",
    precio: 8500.0,
    cantidad_total: 120,
    cantidad_minima: 20,
    cantidad_maxima: 200,
    publicado_en_red: true,
  },
  {
    id: "p-2",
    codigo_barras: "7798765432109",
    nombre: "Aceite Sintético Hidráulico ISO 68",
    descripcion: "Tambor 200L para sistemas hidráulicos de alta presión",
    unidad_medida: "LT",
    precio: 3400.0,
    cantidad_total: 15,
    cantidad_minima: 30, // Alerta stock bajo
    cantidad_maxima: 100,
    publicado_en_red: false,
  },
  {
    id: "p-3",
    codigo_barras: "7795556667771",
    nombre: "Correa Dentada HTD 8M-1200",
    descripcion: "Correa sincrónica de poliuretano ancho 30mm",
    unidad_medida: "UN",
    precio: 14200.0,
    cantidad_total: 85,
    cantidad_minima: 15,
    cantidad_maxima: 90,
    publicado_en_red: true,
  },
  {
    id: "p-4",
    codigo_barras: "7794443332220",
    nombre: "Filtro de Aceite Donaldson P550008",
    descripcion: "Filtro para compresores y maquinaria pesada",
    unidad_medida: "UN",
    precio: 19800.0,
    cantidad_total: 5,
    cantidad_minima: 10, // Stock crítico
    cantidad_maxima: 50,
    publicado_en_red: false,
  },
];

export default function ProductosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState(mockProductos);

  const togglePublicarRed = (id: string) => {
    setProductos(
      productos.map((p) =>
        p.id === id ? { ...p, publicado_en_red: !p.publicado_en_red } : p
      )
    );
  };

  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo_barras.includes(busqueda)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Boxes className="w-6 h-6 text-indigo-400" />
            Catálogo de Productos
          </h1>
          <p className="text-sm text-zinc-400">
            Administra tus artículos, umbrales de stock de seguridad y publicaciones en la Red B2B.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por código de barras o nombre..."
            className="pl-9 h-9 text-xs bg-zinc-950 border-zinc-800"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="text-xs border-zinc-800 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            Filtrar por Categoría
          </Button>
          <Button variant="outline" size="sm" className="text-xs border-zinc-800 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
            Ordenar
          </Button>
        </div>
      </div>

      {/* Tabla de Productos */}
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/70 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Precio Unit.</th>
                <th className="py-3 px-4">Stock Actual</th>
                <th className="py-3 px-4">Límites Seguridad</th>
                <th className="py-3 px-4">Red B2B</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtrados.map((p) => {
                const stockBajo = p.cantidad_total <= p.cantidad_minima;

                return (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{p.nombre}</div>
                      <div className="text-xs text-zinc-400 line-clamp-1">{p.descripcion}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        <Barcode className="w-3.5 h-3.5 text-zinc-500" />
                        {p.codigo_barras}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-zinc-200">
                      ${p.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${stockBajo ? "text-red-400" : "text-emerald-400"}`}>
                          {p.cantidad_total} {p.unidad_medida}
                        </span>
                        {stockBajo && (
                          <span title="Stock por debajo del mínimo">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-zinc-400">
                      <span>Mín: {p.cantidad_minima}</span> • <span>Máx: {p.cantidad_maxima}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => togglePublicarRed(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          p.publicado_en_red
                            ? "bg-indigo-950/80 text-indigo-300 border-indigo-700 hover:bg-indigo-900"
                            : "bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:bg-zinc-800"
                        }`}
                      >
                        <Share2 className="w-3 h-3" />
                        <span>{p.publicado_en_red ? "En Red B2B" : "Privado"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
