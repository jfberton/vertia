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
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MockProducto {
  id: string;
  codigo_barras: string;
  nombre: string;
  descripcion: string;
  unidad_medida: string;
  precio: number;
  stock_real: number;        // Lo que está físicamente en el galpón
  stock_comprometido: number; // Reservado en pedidos activos
  stock_disponible: number;   // Real - Comprometido
  cantidad_minima: number;
  cantidad_maxima: number;
  publicado_en_red: boolean;
}

const mockProductos: MockProducto[] = [
  {
    id: "p-1",
    codigo_barras: "7791234567890",
    nombre: "Cemento Loma Negra 50kg (Bolsa)",
    descripcion: "Cemento portland normal para hormigón y albañilería",
    unidad_medida: "BL",
    precio: 9800.0,
    stock_real: 120,          // 120 en galpón
    stock_comprometido: 60,   // 60 reservadas
    stock_disponible: 60,     // 60 disponibles para venta libre
    cantidad_minima: 40,
    cantidad_maxima: 500,
    publicado_en_red: true,
  },
  {
    id: "p-2",
    codigo_barras: "7798765432109",
    nombre: "Hierro Nervado Aletado Ø 10mm (Barra 12m)",
    descripcion: "Acero para armaduras de hormigón armado según norma IRAM",
    unidad_medida: "UN",
    precio: 14500.0,
    stock_real: 250,
    stock_comprometido: 100,
    stock_disponible: 150,
    cantidad_minima: 50,
    cantidad_maxima: 600,
    publicado_en_red: true,
  },
  {
    id: "p-3",
    codigo_barras: "7795556667771",
    nombre: "Arena Fina para Revoque (Bolsón 1m³)",
    descripcion: "Árido seleccionado limpio para mezclas finas",
    unidad_medida: "M3",
    precio: 22000.0,
    stock_real: 18,
    stock_comprometido: 12,
    stock_disponible: 6,      // Alerta stock disponible bajo
    cantidad_minima: 10,
    cantidad_maxima: 50,
    publicado_en_red: false,
  },
  {
    id: "p-4",
    codigo_barras: "7794443332220",
    nombre: "Ladrillo Hueco 12x18x33 (Pallet x 144u)",
    descripcion: "Ladrillo cerámico hueco no portante para tabiques",
    unidad_medida: "PAL",
    precio: 95000.0,
    stock_real: 8,
    stock_comprometido: 6,
    stock_disponible: 2,      // Stock crítico
    cantidad_minima: 5,
    cantidad_maxima: 40,
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
            Catálogo de Materiales & Stock
          </h1>
          <p className="text-sm text-zinc-400">
            Control de inventario con doble estatus: Stock Real Físico vs. Stock Disponible para la Red.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo Material
        </Button>
      </div>

      {/* Explicador de Estatus de Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
          <span className="font-semibold text-zinc-200">1. Stock Real (Físico):</span>
          <span className="text-zinc-400 block mt-0.5">La mercadería que efectivamente está en tus estantes y galpones.</span>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
          <span className="font-semibold text-amber-300">2. Stock Comprometido:</span>
          <span className="text-zinc-400 block mt-0.5">Unidades reservadas en órdenes activas de entrega a obras.</span>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
          <span className="font-semibold text-emerald-400">3. Stock Disponible:</span>
          <span className="text-zinc-400 block mt-0.5">Libre para venta inmediata en mostrador o en la Red VERTIA.</span>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar material o código de barras..."
            className="pl-9 h-9 text-xs bg-zinc-950 border-zinc-800"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="text-xs border-zinc-800 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            Rubros de Construcción
          </Button>
          <Button variant="outline" size="sm" className="text-xs border-zinc-800 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
            Ordenar
          </Button>
        </div>
      </div>

      {/* Tabla de Materiales con Doble Estatus */}
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950/70 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Material / Insumo</th>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Precio Unit.</th>
                <th className="py-3 px-4 text-center bg-zinc-950/40">Stock Real</th>
                <th className="py-3 px-4 text-center">Comprometido</th>
                <th className="py-3 px-4 text-center bg-emerald-950/20">Disponible</th>
                <th className="py-3 px-4 text-center">Red B2B</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtrados.map((p) => {
                const stockCritico = p.stock_disponible <= p.cantidad_minima;

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
                    {/* Stock Real */}
                    <td className="py-3.5 px-4 text-center bg-zinc-950/40">
                      <span className="font-bold text-zinc-200">
                        {p.stock_real} {p.unidad_medida}
                      </span>
                    </td>
                    {/* Stock Comprometido */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-medium text-amber-400">
                        {p.stock_comprometido} {p.unidad_medida}
                      </span>
                    </td>
                    {/* Stock Disponible */}
                    <td className="py-3.5 px-4 text-center bg-emerald-950/20">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`font-extrabold ${stockCritico ? "text-amber-400" : "text-emerald-400"}`}>
                          {p.stock_disponible} {p.unidad_medida}
                        </span>
                        {stockCritico && (
                          <span title="Stock disponible por debajo del umbral de seguridad">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Red B2B Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => togglePublicarRed(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          p.publicado_en_red
                            ? "bg-indigo-950/80 text-indigo-300 border-indigo-700 hover:bg-indigo-900"
                            : "bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:bg-zinc-800"
                        }`}
                      >
                        <Share2 className="w-3 h-3" />
                        <span>{p.publicado_en_red ? "Publicado" : "Privado"}</span>
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
