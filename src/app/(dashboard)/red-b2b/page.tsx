"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe2,
  Search,
  Building2,
  MapPin,
  Share2,
  Plus,
  MessageSquare,
  ShieldCheck,
  SlidersHorizontal,
  CheckCircle2,
  Truck,
  ArrowRight,
  Filter,
  DollarSign,
  Lock,
  Boxes,
  Eye,
  EyeOff,
  Edit2,
  Check,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

// Modelo de Producto Expuesto a la Red VERTIA por el Corralón
interface ProductoExpuestoCorralon {
  id: string;
  sku: string;
  producto_nombre: string;
  categoria: string;
  stock_fisico_bodega: number;
  stock_expuesto_red: number;
  unidad: string;
  precio_mostrador: number;
  precio_red_vertia: number;
  publicado_en_red: boolean;
  ubicacion_pasillo: string;
}

const mockProductosExpuestosIniciales: ProductoExpuestoCorralon[] = [
  {
    id: "exp-1",
    sku: "CEM-CAZ-50",
    producto_nombre: "Cemento Cruz Azul Gris 50kg (Bolsa)",
    categoria: "Cementos y Adhesivos",
    stock_fisico_bodega: 120,
    stock_expuesto_red: 60,
    unidad: "BL",
    precio_mostrador: 245.0,
    precio_red_vertia: 235.0,
    publicado_en_red: true,
    ubicacion_pasillo: "Pasillo A · Rack 01",
  },
  {
    id: "exp-2",
    sku: "VAR-COR-12",
    producto_nombre: "Varilla Corrugada Grado 42 - 1/2 pulgada (Tramo 12m)",
    categoria: "Aceros y Perfiles",
    stock_fisico_bodega: 180,
    stock_expuesto_red: 80,
    unidad: "PZA",
    precio_mostrador: 285.0,
    precio_red_vertia: 270.0,
    publicado_en_red: true,
    ubicacion_pasillo: "Pasillo B · Patio Metal",
  },
  {
    id: "exp-3",
    sku: "CAL-HID-25",
    producto_nombre: "Cal Hidratada de Alta Pureza 25kg",
    categoria: "Cementos y Adhesivos",
    stock_fisico_bodega: 90,
    stock_expuesto_red: 45,
    unidad: "BL",
    precio_mostrador: 95.0,
    precio_red_vertia: 89.0,
    publicado_en_red: true,
    ubicacion_pasillo: "Pasillo A · Rack 02",
  },
  {
    id: "exp-4",
    sku: "ARE-LAV-M3",
    producto_nombre: "Arena Lavada de Río (M3)",
    categoria: "Áridos y Graneles",
    stock_fisico_bodega: 45,
    stock_expuesto_red: 20,
    unidad: "M3",
    precio_mostrador: 480.0,
    precio_red_vertia: 450.0,
    publicado_en_red: true,
    ubicacion_pasillo: "Patio Abierto · Bahía 1",
  },
  {
    id: "exp-5",
    sku: "GRA-TRIT-M3",
    producto_nombre: "Grava Triturada 3/4 pulgada (M3)",
    categoria: "Áridos y Graneles",
    stock_fisico_bodega: 35,
    stock_expuesto_red: 0,
    unidad: "M3",
    precio_mostrador: 520.0,
    precio_red_vertia: 495.0,
    publicado_en_red: false,
    ubicacion_pasillo: "Patio Abierto · Bahía 2",
  },
  {
    id: "exp-6",
    sku: "PEG-PIS-20",
    producto_nombre: "PegaAzulejo y Piso Interiores 20kg",
    categoria: "Terminaciones",
    stock_fisico_bodega: 65,
    stock_expuesto_red: 30,
    unidad: "BL",
    precio_mostrador: 165.0,
    precio_red_vertia: 155.0,
    publicado_en_red: true,
    ubicacion_pasillo: "Pasillo C · Rack 01",
  },
];

export default function RedB2BPage() {
  const { user, tenant } = useAuth();
  const isSuperAdmin = user?.is_super_admin ?? false;
  const isCorralon = !isSuperAdmin && (user?.tipo_empresa === "corralon" || user?.rol === "administrador" || user?.rol === "operario");

  const [busqueda, setBusqueda] = useState("");
  const [productosExpuestos, setProductosExpuestos] = useState<ProductoExpuestoCorralon[]>(mockProductosExpuestosIniciales);
  const [modalEditar, setModalEditar] = useState<ProductoExpuestoCorralon | null>(null);
  const [nuevoPrecioRed, setNuevoPrecioRed] = useState<number>(0);
  const [nuevoStockRed, setNuevoStockRed] = useState<number>(0);
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMensaje(msg);
    setTimeout(() => setToastMensaje(null), 3500);
  };

  // Filtrado de productos del corralón
  const productosFiltrados = productosExpuestos.filter(
    (p) =>
      p.producto_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Totales
  const totalPublicados = productosExpuestos.filter((p) => p.publicado_en_red).length;
  const totalStockExpuesto = productosExpuestos.filter((p) => p.publicado_en_red).reduce((acc, p) => acc + p.stock_expuesto_red, 0);
  const valorTotalExpuesto = productosExpuestos
    .filter((p) => p.publicado_en_red)
    .reduce((acc, p) => acc + p.stock_expuesto_red * p.precio_red_vertia, 0);

  const handleTogglePublicacion = (id: string) => {
    setProductosExpuestos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nuevoEstado = !p.publicado_en_red;
          showToast(
            nuevoEstado
              ? `"${p.producto_nombre}" ahora está expuesto a la Red VERTIA.`
              : `"${p.producto_nombre}" fue pausado (solo disponible en mostrador local).`
          );
          return {
            ...p,
            publicado_en_red: nuevoEstado,
            stock_expuesto_red: nuevoEstado && p.stock_expuesto_red === 0 ? Math.floor(p.stock_fisico_bodega * 0.5) : p.stock_expuesto_red,
          };
        }
        return p;
      })
    );
  };

  const handleAbrirEdicion = (prod: ProductoExpuestoCorralon) => {
    setModalEditar(prod);
    setNuevoPrecioRed(prod.precio_red_vertia);
    setNuevoStockRed(prod.stock_expuesto_red);
  };

  const handleGuardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEditar) return;

    setProductosExpuestos((prev) =>
      prev.map((p) => {
        if (p.id === modalEditar.id) {
          return {
            ...p,
            precio_red_vertia: Number(nuevoPrecioRed),
            stock_expuesto_red: Number(nuevoStockRed),
            publicado_en_red: Number(nuevoStockRed) > 0,
          };
        }
        return p;
      })
    );

    showToast(`Precio y stock de red actualizados para "${modalEditar.producto_nombre}".`);
    setModalEditar(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMensaje && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#071b3f] text-white text-xs font-bold shadow-2xl flex items-center gap-3 border border-indigo-400/40 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMensaje}</span>
        </div>
      )}

      {/* Banner Informativo de Unificación */}
      {isCorralon && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Boxes className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-xs block text-amber-950">
                Pestaña Unificada en &quot;Materiales y Stock&quot;
              </span>
              <span className="text-[11px] text-amber-800">
                Ahora administras el catálogo completo, precios de mostrador, listas de precios, bonificaciones, stock físico vs. comprometido y publicación en la Red VERTIA en un solo lugar.
              </span>
            </div>
          </div>
          <Link href="/productos">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0">
              Ir a Materiales y Stock
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Header Corporativo de la Sección */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Canal Exclusivo B2B
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {tenant?.nombre || "Casa de Materiales"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-0.5">
              Mi Exposición en Red VERTIA
            </h1>
            <p className="text-xs text-slate-500">
              Administra los productos de tu bodega que pones a disposición de la Red VERTIA para que el sistema cotice y ruteé pedidos hacia obras.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold px-3 py-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ruteo Activo por VERTIA</span>
          </Badge>
        </div>
      </div>

      {/* Banner de Privacidad y Confidencialidad Multi-Tenant */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-sky-50/70 to-slate-50 border border-indigo-100 flex items-start gap-3.5 shadow-xs">
        <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600 shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs leading-relaxed text-slate-700">
          <strong className="text-indigo-950 font-bold block mb-0.5">
            Privacidad Garantizada: Tus competidores no tienen acceso a tu inventario ni a tus precios
          </strong>
          <span>
            VERTIA administra centralizadamente las solicitudes de contratistas y calcula el ruteo logístico óptimo. Ningún otro corralón o proveedor de materiales puede ver lo que tienes en stock ni los precios que ofreces. Este panel es tu consola privada para exponer excedentes o material para venta a obras.
          </span>
        </div>
      </div>

      {/* Métricas de Exposición */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200/90 rounded-2xl shadow-xs">
          <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Productos en Red
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalPublicados}{" "}
            <span className="text-xs font-normal text-slate-400">
              / {productosExpuestos.length}
            </span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Disponibles para cotización</span>
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200/90 rounded-2xl shadow-xs">
          <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Volumen Apartado Red
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {totalStockExpuesto}{" "}
            <span className="text-xs font-normal text-slate-400">unidades</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Separado de venta de mostrador
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200/90 rounded-2xl shadow-xs">
          <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Valor Expuesto ($ MXN)
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ${valorTotalExpuesto.toLocaleString("es-MX")}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            En productos activos para obras
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200/90 rounded-2xl shadow-xs">
          <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Liquidación Protegida
          </div>
          <div className="text-2xl font-black text-[#071b3f] mt-1">
            100% Escrow
          </div>
          <div className="text-[11px] text-indigo-600 font-bold mt-1">
            Cobro garantizado por VERTIA
          </div>
        </Card>
      </div>

      {/* Buscador y Controles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por producto, SKU o categoría..."
            className="pl-9 h-9 text-xs border-slate-200 rounded-xl"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Mostrando <strong className="text-slate-800">{productosFiltrados.length}</strong> de{" "}
          <strong className="text-slate-800">{productosExpuestos.length}</strong> materiales en catálogo
        </div>
      </div>

      {/* Tabla de Productos Expuestos a la Red */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Material / SKU</th>
                <th className="py-3 px-4">Ubicación Bodega</th>
                <th className="py-3 px-4 text-center">Físico Real</th>
                <th className="py-3 px-4 text-center">Apartado Red</th>
                <th className="py-3 px-4 text-right">Precio Mostrador</th>
                <th className="py-3 px-4 text-right">Precio Red VERTIA</th>
                <th className="py-3 px-4 text-center">Exposición</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productosFiltrados.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 text-xs">
                      {prod.producto_nombre}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-mono">{prod.sku}</span>
                      <span>•</span>
                      <span>{prod.categoria}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                    {prod.ubicacion_pasillo}
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    {prod.stock_fisico_bodega} {prod.unidad}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-black px-2 py-0.5 rounded-full text-xs ${
                        prod.stock_expuesto_red > 0
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "text-slate-400"
                      }`}
                    >
                      {prod.stock_expuesto_red} {prod.unidad}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-500 font-medium">
                    ${prod.precio_mostrador.toFixed(2)} MXN
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="font-black text-slate-900 text-sm">
                      ${prod.precio_red_vertia.toFixed(2)}{" "}
                      <span className="text-[10px] font-normal text-slate-500">MXN</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {prod.publicado_en_red ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Expuesto en Red
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        Solo Mostrador
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAbrirEdicion(prod)}
                        className="h-8 px-2.5 text-xs border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Precio / Stock
                      </Button>

                      <Button
                        size="sm"
                        variant={prod.publicado_en_red ? "ghost" : "default"}
                        onClick={() => handleTogglePublicacion(prod.id)}
                        className={`h-8 px-2.5 text-xs font-bold ${
                          prod.publicado_en_red
                            ? "text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                      >
                        {prod.publicado_en_red ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 mr-1" /> Pausar
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 mr-1" /> Exponer
                          </>
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Editar Precio y Stock Expuesto a la Red */}
      {modalEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Ajuste de Exposición
              </span>
              <h3 className="text-base font-black text-slate-900 mt-0.5">
                {modalEditar.producto_nombre}
              </h3>
              <p className="text-xs text-slate-500">
                SKU: <span className="font-mono font-bold text-slate-700">{modalEditar.sku}</span> • Ubicación: {modalEditar.ubicacion_pasillo}
              </p>
            </div>

            <form onSubmit={handleGuardarEdicion} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-center">
                <div>
                  <span className="text-slate-400 text-[10px] block">Stock Físico Total</span>
                  <span className="text-base font-black text-slate-800">
                    {modalEditar.stock_fisico_bodega} {modalEditar.unidad}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Precio Mostrador</span>
                  <span className="text-base font-black text-slate-800">
                    ${modalEditar.precio_mostrador.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Cantidad a Exponer para Obras de la Red ({modalEditar.unidad}) *
                </label>
                <Input
                  type="number"
                  min={0}
                  max={modalEditar.stock_fisico_bodega}
                  value={nuevoStockRed}
                  onChange={(e) => setNuevoStockRed(Number(e.target.value))}
                  className="border-slate-300 font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  El restante ({modalEditar.stock_fisico_bodega - nuevoStockRed} {modalEditar.unidad}) queda reservado exclusivamente para tu mostrador.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Precio Exclusivo para la Red VERTIA ($ MXN) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="number"
                    min={1}
                    step={0.5}
                    value={nuevoPrecioRed}
                    onChange={(e) => setNuevoPrecioRed(Number(e.target.value))}
                    className="pl-8 border-slate-300 font-black text-base text-slate-900"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Precio unitario con el que VERTIA cotizará a las obras. La plataforma agrega el costo de flete correspondiente.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalEditar(null)}
                  className="text-xs border-slate-200"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4"
                >
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}