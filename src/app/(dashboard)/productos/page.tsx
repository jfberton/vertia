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
  Lock,
  Check,
  X,
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
import { updateStoredProducto } from "@/lib/services/mock-store";

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
  const isAdminEmpresa =
    user?.rol === "administrador" ||
    Boolean(user?.cargo && user.cargo.toLowerCase().includes("administrador"));

  // Modal para configurar cupo de disponible comercial
  const [productoParaCupo, setProductoParaCupo] = useState<MultiTenantProducto | null>(null);
  const [modoCupo, setModoCupo] = useState<"automatico" | "cupo_manual">("automatico");
  const [valorCupoManual, setValorCupoManual] = useState<number>(0);
  const [publicarEnRedCupo, setPublicarEnRedCupo] = useState<boolean>(true);

  const abrirModalCupo = (prod: MultiTenantProducto) => {
    if (isSuperAdmin) return;
    if (!isAdminEmpresa) {
      setMensajeExito("⚠️ Acción restringida: Solo el Administrador del corralón puede modificar el cupo disponible comercial.");
      setTimeout(() => setMensajeExito(null), 3500);
      return;
    }
    setProductoParaCupo(prod);
    setModoCupo(prod.modo_disponible || "automatico");
    const maxLibre = Math.max(0, prod.stock_real - prod.stock_comprometido);
    setValorCupoManual(prod.cupo_manual_red ?? maxLibre);
    setPublicarEnRedCupo(prod.publicado_en_red);
  };

  const handleGuardarCupo = () => {
    if (!productoParaCupo) return;
    const maxLibre = Math.max(0, productoParaCupo.stock_real - productoParaCupo.stock_comprometido);
    const cupoFinal =
      modoCupo === "cupo_manual"
        ? Math.min(Math.max(0, Number(valorCupoManual) || 0), maxLibre)
        : maxLibre;

    setProductos((prev) =>
      prev.map((p) => {
        if (p.id === productoParaCupo.id) {
          return {
            ...p,
            modo_disponible: modoCupo,
            cupo_manual_red: modoCupo === "cupo_manual" ? cupoFinal : undefined,
            stock_disponible: cupoFinal,
            publicado_en_red: publicarEnRedCupo,
          };
        }
        return p;
      })
    );

    updateStoredProducto(productoParaCupo.id, {
      modo_disponible: modoCupo,
      cupo_manual_red: modoCupo === "cupo_manual" ? cupoFinal : undefined,
      stock_disponible: cupoFinal,
      publicado_en_red: publicarEnRedCupo,
    });

    setMensajeExito(
      modoCupo === "cupo_manual"
        ? `Cupo comercial manual de "${productoParaCupo.nombre}" fijado en ${cupoFinal} ${productoParaCupo.unidad_medida}.`
        : `"${productoParaCupo.nombre}" configurado al 100% automático (${cupoFinal} ${productoParaCupo.unidad_medida} disponibles).`
    );
    setTimeout(() => setMensajeExito(null), 4000);
    setProductoParaCupo(null);
  };

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
    if (isSuperAdmin) return;
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
    if (isSuperAdmin) return;
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

          {isSuperAdmin ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Modo Auditoría · Solo Lectura</span>
            </div>
          ) : (
            <Button
              onClick={() => setModalNuevoAbierto(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Registrar Material
            </Button>
          )}
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
            Saldo inmediato para despachar sin afectar compromisos previos. Visible en la Red Vertia.
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
                {!isSuperAdmin && <th className="py-3 px-4 text-right">Acciones</th>}
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
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex items-center gap-1.5">
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
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                              p.modo_disponible === "cupo_manual"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {p.modo_disponible === "cupo_manual"
                              ? `Cupo Red: ${p.stock_disponible}`
                              : "100% Auto"}
                          </span>
                        </div>
                      </td>

                      {/* Red B2B Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            if (isSuperAdmin) return;
                            if (!isAdminEmpresa) {
                              setMensajeExito("⚠️ Acción restringida: Solo el Administrador de la empresa puede modificar la visibilidad en red.");
                              setTimeout(() => setMensajeExito(null), 3500);
                              return;
                            }
                            togglePublicarRed(p.id);
                          }}
                          disabled={isSuperAdmin}
                          title={
                            isSuperAdmin
                              ? "Solo el administrador del corralón puede definir la visibilidad en red"
                              : !isAdminEmpresa
                              ? "Solo el Administrador del corralón puede cambiar la publicación"
                              : "Cambiar publicación en Red Vertia"
                          }
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                            isSuperAdmin || !isAdminEmpresa
                              ? "cursor-default opacity-85"
                              : "cursor-pointer"
                          } ${
                            p.publicado_en_red
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <Share2 className="w-3 h-3" />
                          <span>{p.publicado_en_red ? "Publicado en Red" : "Solo Local"}</span>
                        </button>
                      </td>

                      {!isSuperAdmin && (
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => abrirModalCupo(p)}
                              title={
                                isAdminEmpresa
                                  ? "Configurar Disponible & Cupo Red Vertia"
                                  : "Solo el Administrador del corralón puede modificar el cupo comercial"
                              }
                              className={`h-7 px-2 text-xs gap-1 font-semibold ${
                                isAdminEmpresa
                                  ? "text-indigo-700 border-indigo-200 hover:bg-indigo-50 cursor-pointer"
                                  : "text-slate-400 border-slate-200 opacity-60 cursor-not-allowed"
                              }`}
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">Cupo Red</span>
                            </Button>
                          </div>
                        </td>
                      )}
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

      {/* Modal Configurar Disponible & Cupo Red B2B */}
      {productoParaCupo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Configurar Cupo Comercial & Red B2B
                  </h2>
                  <p className="text-xs text-slate-500">
                    {productoParaCupo.nombre} ({productoParaCupo.codigo_barras})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setProductoParaCupo(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Métricas físicas actuales */}
            <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Stock Real Físico</div>
                <div className="text-base font-extrabold text-slate-900">
                  {productoParaCupo.stock_real} {productoParaCupo.unidad_medida}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-500">Comprometido</div>
                <div className="text-base font-extrabold text-amber-600">
                  {productoParaCupo.stock_comprometido} {productoParaCupo.unidad_medida}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-600">Máx. Físico Libre</div>
                <div className="text-base font-extrabold text-emerald-700">
                  {Math.max(0, productoParaCupo.stock_real - productoParaCupo.stock_comprometido)} {productoParaCupo.unidad_medida}
                </div>
              </div>
            </div>

            {/* Modalidad de Disponible */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Modalidad de Disponibilidad Comercial:
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModoCupo("automatico")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    modoCupo === "automatico"
                      ? "bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-200 text-indigo-900"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>100% Automático</span>
                    {modoCupo === "automatico" && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Todo el disponible libre ({Math.max(0, productoParaCupo.stock_real - productoParaCupo.stock_comprometido)} {productoParaCupo.unidad_medida}) queda abierto a mostrador y red.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setModoCupo("cupo_manual")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    modoCupo === "cupo_manual"
                      ? "bg-purple-50/80 border-purple-400 ring-2 ring-purple-200 text-purple-900"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Cupo Manual Reservado</span>
                    {modoCupo === "cupo_manual" && <Check className="w-4 h-4 text-purple-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Fijas un cupo tope específico para la Red Vertia y reservas saldo para venta directa.
                  </p>
                </button>
              </div>

              {modoCupo === "cupo_manual" && (
                <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-purple-900">
                      Cupo disponible para la Red Vertia:
                    </label>
                    <span className="text-[11px] text-purple-700 font-semibold">
                      Máximo permitido: {Math.max(0, productoParaCupo.stock_real - productoParaCupo.stock_comprometido)} {productoParaCupo.unidad_medida}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max={Math.max(0, productoParaCupo.stock_real - productoParaCupo.stock_comprometido)}
                      value={valorCupoManual}
                      onChange={(e) => setValorCupoManual(Number(e.target.value))}
                      className="h-9 text-sm font-black text-purple-950 bg-white"
                    />
                    <span className="text-xs font-bold text-slate-600 px-2">
                      {productoParaCupo.unidad_medida}
                    </span>
                  </div>
                  <p className="text-[10px] text-purple-600">
                    Ante un nuevo pedido, la cantidad requerida se sumará a Stock Comprometido y se descontará automáticamente de este cupo.
                  </p>
                </div>
              )}

              {/* Toggle Publicado en Red */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Publicar en la Red B2B de Vertia
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Permite que constructoras y corralones cercanos vean este producto.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPublicarEnRedCupo(!publicarEnRedCupo)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    publicarEnRedCupo ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      publicarEnRedCupo ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setProductoParaCupo(null)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleGuardarCupo}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Guardar Configuración Comercial</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
