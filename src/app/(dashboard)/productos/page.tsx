"use client";

import React, { useState, useMemo } from "react";
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
  Building2,
  CheckCircle2,
  Warehouse,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  MOCK_PRODUCTOS,
  MultiTenantProducto,
  MOCK_TENANTS,
} from "@/lib/data/mock-multi-tenant";

export default function ProductosPage() {
  const { user, tenant, allTenants } = useAuth();

  // State for all products (allows local state modification e.g. toggling network publication)
  const [productos, setProductos] = useState<MultiTenantProducto[]>(MOCK_PRODUCTOS);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("all");
  const [superAdminTenantFilter, setSuperAdminTenantFilter] = useState<string>("all");
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Modal para nuevo producto
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoCodigo, setNuevoCodigo] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("Obra Gruesa");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevoStockReal, setNuevoStockReal] = useState("");
  const [nuevoComprometido, setNuevoComprometido] = useState("");

  const isSuperAdmin = user?.is_super_admin ?? false;

  // Determine active tenant filter:
  // If super admin -> use superAdminTenantFilter ("all" or specific tenant ID)
  // If regular user -> strictly use user.tenant_id
  const effectiveTenantId = useMemo(() => {
    if (isSuperAdmin) {
      return superAdminTenantFilter;
    }
    return user?.tenant_id || "tenant-los-pinos";
  }, [isSuperAdmin, superAdminTenantFilter, user?.tenant_id]);

  // Filter products by Tenant Isolation + Search + Category
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      // 1. Tenant Isolation
      if (effectiveTenantId !== "all" && p.tenant_id !== effectiveTenantId) {
        return false;
      }

      // 2. Search query
      const matchBusqueda =
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigo_barras.includes(busqueda) ||
        p.categoria.toLowerCase().includes(busqueda.toLowerCase());

      // 3. Category filter
      const matchCategoria =
        categoriaFiltro === "all" || p.categoria === categoriaFiltro;

      return matchBusqueda && matchCategoria;
    });
  }, [productos, effectiveTenantId, busqueda, categoriaFiltro]);

  const togglePublicarRed = (id: string) => {
    setProductos((prev) =>
      prev.map((p) => {
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

  const handleCrearProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoCodigo) return;

    const real = Number(nuevoStockReal) || 0;
    const comp = Number(nuevoComprometido) || 0;
    const disp = Math.max(0, real - comp);

    const targetTenant = effectiveTenantId === "all" ? "tenant-los-pinos" : effectiveTenantId;

    const nuevoProd: MultiTenantProducto = {
      id: `prod-${Date.now()}`,
      tenant_id: targetTenant,
      codigo_barras: nuevoCodigo,
      nombre: nuevoNombre,
      categoria: nuevaCategoria,
      unidad_medida: "UN",
      precio: Number(nuevoPrecio) || 1000,
      stock_real: real,
      stock_comprometido: comp,
      stock_disponible: disp,
      cantidad_minima: 10,
      cantidad_maxima: 500,
      publicado_en_red: true,
      almacen_id: targetTenant === "tenant-materiales-centro" ? "alm-centro-sucursal" : "alm-pinos-central",
      ubicacion_estanteria: "Galpón Principal • Sector A • Nivel 1",
    };

    setProductos([nuevoProd, ...productos]);
    setMensajeExito(`Material "${nuevoNombre}" registrado correctamente.`);
    setTimeout(() => setMensajeExito(null), 3000);
    setModalNuevoAbierto(false);
    setNuevoNombre("");
    setNuevoCodigo("");
    setNuevoPrecio("");
    setNuevoStockReal("");
    setNuevoComprometido("");
  };

  const getTenantName = (tId: string) => {
    const found = allTenants.find((t) => t.id === tId) || MOCK_TENANTS.find((t) => t.id === tId);
    return found?.nombre || tId;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Corporativo con Contexto de Tenant */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Catálogo de Materiales & Métrica Dual de Stock
              </h1>
              <p className="text-xs text-slate-500">
                Control de inventario de corralón: Stock Real Físico vs. Stock Disponible para la Red VERTIA.
              </p>
            </div>
          </div>
        </div>

        {/* Tenant Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {isSuperAdmin ? (
            <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs shadow-2xs">
              <Building2 className="w-4 h-4 text-indigo-700 shrink-0" />
              <span className="font-semibold text-indigo-900">Corralón:</span>
              <select
                value={superAdminTenantFilter}
                onChange={(e) => setSuperAdminTenantFilter(e.target.value)}
                className="bg-white border border-indigo-200 rounded px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">🌐 Vista Consolidada (Todos los Corralones)</option>
                {allTenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    🏢 {t.nombre}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-700">
              <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                Corralón: <strong className="text-slate-900">{tenant?.nombre || user?.tenant_nombre || "Corralón Asignado"}</strong>
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                Aislamiento Activo
              </span>
            </div>
          )}

          <Button
            onClick={() => setModalNuevoAbierto(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Registrar Material
          </Button>
        </div>
      </div>

      {mensajeExito && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Tarjetas Explicativas de la Métrica Dual */}
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
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
            >
              <option value="all">Todos los Rubros</option>
              <option value="Obra Gruesa">Obra Gruesa</option>
              <option value="Hierros & Acero">Hierros & Acero</option>
              <option value="Áridos">Áridos</option>
              <option value="Mampostería">Mampostería</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Materiales con Métrica Dual y Aislamiento de Tenant */}
      <Card className="bg-white border-slate-200 shadow-xs overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Material / Insumo</th>
                {isSuperAdmin && effectiveTenantId === "all" && (
                  <th className="py-3 px-4">Corralón Propietario</th>
                )}
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
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin && effectiveTenantId === "all" ? 9 : 8} className="py-8 text-center text-slate-400">
                    No se encontraron materiales para los filtros seleccionados o el corralón activo.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((p) => {
                  const stockCritico = p.stock_disponible <= p.cantidad_minima;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{p.nombre}</div>
                        <div className="text-[11px] text-slate-400">{p.categoria}</div>
                      </td>

                      {isSuperAdmin && effectiveTenantId === "all" && (
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-[11px]">
                            <Building2 className="w-3 h-3" />
                            {getTenantName(p.tenant_id)}
                          </span>
                        </td>
                      )}

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
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Registrar Material */}
      {modalNuevoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 w-full max-w-md space-y-4 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-indigo-600" />
              Registrar Nuevo Material en InvenTrack
            </h2>
            <form onSubmit={handleCrearProducto} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre del Material</label>
                <Input
                  required
                  placeholder="Ej: Pintura Látex Alba 20L"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Código EAN / Barras</label>
                <Input
                  required
                  placeholder="7790001234567"
                  value={nuevoCodigo}
                  onChange={(e) => setNuevoCodigo(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rubro</label>
                  <select
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    className="w-full h-8 bg-white border border-slate-200 rounded px-2 text-xs"
                  >
                    <option value="Obra Gruesa">Obra Gruesa</option>
                    <option value="Hierros & Acero">Hierros & Acero</option>
                    <option value="Áridos">Áridos</option>
                    <option value="Mampostería">Mampostería</option>
                    <option value="Terminaciones">Terminaciones</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Precio Unit. ($)</label>
                  <Input
                    type="number"
                    placeholder="12500"
                    value={nuevoPrecio}
                    onChange={(e) => setNuevoPrecio(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Físico Real</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={nuevoStockReal}
                    onChange={(e) => setNuevoStockReal(e.target.value)}
                    className="h-8 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Comprometido</label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={nuevoComprometido}
                    onChange={(e) => setNuevoComprometido(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalNuevoAbierto(false)}
                  className="h-8 text-xs"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                  Guardar Material
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
