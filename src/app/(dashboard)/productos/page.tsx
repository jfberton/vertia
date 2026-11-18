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
  CheckCircle2,
  Warehouse,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MockProducto {
  id: string;
  codigo_barras: string;
  nombre: string;
  categoria: string;
  unidad_medida: string;
  precio: number;
  stock_real: number;        // Lo que está físicamente en el galpón
  stock_comprometido: number; // Reservado en pedidos activos
  stock_disponible: number;   // Real - Comprometido (libre para red o mostrador)
  cantidad_minima: number;
  cantidad_maxima: number;
  publicado_en_red: boolean;
  ubicacion_estanteria: string;
}

const mockProductos: MockProducto[] = [
  {
    id: "p-1",
    codigo_barras: "7791234567890",
    nombre: "Cemento Loma Negra 50kg (Bolsa)",
    categoria: "Obra Gruesa",
    unidad_medida: "BL",
    precio: 9800.0,
    stock_real: 120,          // 120 bolsas en físico
    stock_comprometido: 60,   // 60 bolsas ya vendidas / en órdenes
    stock_disponible: 60,     // 60 bolsas libres para la red B2B
    cantidad_minima: 40,
    cantidad_maxima: 500,
    publicado_en_red: true,
    ubicacion_estanteria: "Galpón A • Rack 02 • Nivel 1",
  },
  {
    id: "p-2",
    codigo_barras: "7798765432109",
    nombre: "Hierro Nervado Aletado Ø 10mm (Barra 12m)",
    categoria: "Hierros & Acero",
    unidad_medida: "UN",
    precio: 14500.0,
    stock_real: 250,
    stock_comprometido: 100,
    stock_disponible: 150,
    cantidad_minima: 50,
    cantidad_maxima: 600,
    publicado_en_red: true,
    ubicacion_estanteria: "Galpón B • Patio Vigas • Fila 01",
  },
  {
    id: "p-3",
    codigo_barras: "7795556667771",
    nombre: "Arena Fina de Río (Bolsón 1m³)",
    categoria: "Áridos",
    unidad_medida: "M3",
    precio: 22000.0,
    stock_real: 18,
    stock_comprometido: 12,
    stock_disponible: 6,      // Alerta stock disponible bajo
    cantidad_minima: 10,
    cantidad_maxima: 50,
    publicado_en_red: true,
    ubicacion_estanteria: "Silo Abierto • Tolva 3",
  },
  {
    id: "p-4",
    codigo_barras: "7794443332220",
    nombre: "Ladrillo Hueco 12x18x33 (Pallet x 144u)",
    categoria: "Mampostería",
    unidad_medida: "PAL",
    precio: 95000.0,
    stock_real: 8,
    stock_comprometido: 6,
    stock_disponible: 2,      // Stock crítico
    cantidad_minima: 5,
    cantidad_maxima: 40,
    publicado_en_red: false,
    ubicacion_estanteria: "Patio Descubierto • Fila 04",
  },
];

export default function ProductosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState(mockProductos);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const togglePublicarRed = (id: string) => {
    setProductos(
      productos.map((p) => {
        if (p.id === id) {
          const nuevoEstado = !p.publicado_en_red;
          setMensajeExito(
            nuevoEstado
              ? `"${p.nombre}" publicado en la Red Colaborativa B2B.`
              : `"${p.nombre}" despublicado de la Red B2B (solo venta local).`
          );
          setTimeout(() => setMensajeExito(null), 3000);
          return { ...p, publicado_en_red: nuevoEstado };
        }
        return p;
      })
    );
  };

  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo_barras.includes(busqueda) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Corporativo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Catálogo de Materiales & Métrica Dual de Stock
              </h1>
              <p className="text-xs text-slate-500">
                Control de inventario de corralón: Stock Real Físico vs. Stock Disponible para la Red VERTIA.
              </p>
            </div>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Registrar Material
        </Button>
      </div>

      {mensajeExito && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Tarjetas Explicativas de la Métrica Dual Solicitada por Humberto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-3.5 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">1. Stock Real (Físico en Galpón)</span>
            <Warehouse className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Total de bultos/unidades contadas en racks y estantes. Base para autorizar extensiones negociadas en la red.
          </p>
        </Card>

        <Card className="p-3.5 bg-white border-amber-200/80 bg-amber-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">2. Stock Comprometido</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
            Unidades ya asignadas a órdenes activas, despachos o remitos pendientes de entrega en obras.
          </p>
        </Card>

        <Card className="p-3.5 bg-white border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">3. Stock Disponible (Venta / Red)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-[11px] text-emerald-800/80 mt-1 leading-relaxed">
            Saldo inmediato para despachar sin afectar compromisos previos. Visible en el marketplace B2B.
          </p>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar material o código EAN..."
            className="pl-9 h-9 text-xs border-slate-200"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Rubros de Construcción
          </Button>
          <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Ordenar
          </Button>
        </div>
      </div>

      {/* Tabla de Materiales con Métrica Dual */}
      <Card className="bg-white border-slate-200 shadow-xs overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Material / Insumo</th>
                <th className="py-3 px-4">Código & Ubicación 3D</th>
                <th className="py-3 px-4">Precio Unit.</th>
                <th className="py-3 px-4 text-center bg-slate-100/60 font-black text-slate-800">
                  Stock Real (Físico)
                </th>
                <th className="py-3 px-4 text-center text-amber-700">Comprometido</th>
                <th className="py-3 px-4 text-center bg-emerald-50/70 font-black text-emerald-800">
                  Stock Disponible
                </th>
                <th className="py-3 px-4 text-center">Publicación Red</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((p) => {
                const stockCritico = p.stock_disponible <= p.cantidad_minima;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.nombre}</div>
                      <div className="text-[11px] text-slate-400">{p.categoria}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Barcode className="w-3.5 h-3.5 text-slate-400" />
                        {p.codigo_barras}
                      </div>
                      <div className="text-[10px] text-indigo-600 mt-0.5">
                        {p.ubicacion_estanteria}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      ${p.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </td>
                    {/* Stock Real */}
                    <td className="py-3.5 px-4 text-center bg-slate-50/60">
                      <span className="font-extrabold text-slate-800 text-sm">
                        {p.stock_real} {p.unidad_medida}
                      </span>
                    </td>
                    {/* Stock Comprometido */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-amber-600 text-xs">
                        {p.stock_comprometido} {p.unidad_medida}
                      </span>
                    </td>
                    {/* Stock Disponible */}
                    <td className="py-3.5 px-4 text-center bg-emerald-50/40">
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className={`font-black text-sm ${
                            stockCritico ? "text-amber-600" : "text-emerald-700"
                          }`}
                        >
                          {p.stock_disponible} {p.unidad_medida}
                        </span>
                        {stockCritico && (
                          <span title="Stock disponible por debajo del umbral mínimo de seguridad">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Red B2B Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => togglePublicarRed(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                          p.publicado_en_red
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <Share2 className="w-3 h-3" />
                        <span>{p.publicado_en_red ? "Publicado en Red" : "Solo Local"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-slate-700"
                        >
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
