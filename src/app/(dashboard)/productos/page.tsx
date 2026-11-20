"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Tag,
  Percent,
  DollarSign,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Save,
  HelpCircle,
  Package,
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
  TipoListaPrecio,
} from "@/lib/data/mock-multi-tenant";
import {
  getStoredProductos,
  updateStoredProducto,
  saveStoredProducto,
} from "@/lib/services/mock-store";

export default function ProductosPage() {
  const { user, tenant, allTenants } = useAuth();
  const isSuperAdmin = user?.is_super_admin ?? false;
  const isAdminEmpresa =
    user?.rol === "administrador" ||
    Boolean(user?.cargo && user.cargo.toLowerCase().includes("administrador"));

  const [superAdminTenantFilter, setSuperAdminTenantFilter] = useState<string>("all");

  // Effective Tenant ID
  const effectiveTenantId = useMemo(() => {
    if (isSuperAdmin) {
      return superAdminTenantFilter;
    }
    return user?.tenant_id || "tenant-los-pinos";
  }, [isSuperAdmin, superAdminTenantFilter, user?.tenant_id]);

  // Lista de productos reactiva inicializada desde el almacén híbrido
  const [productos, setProductos] = useState<MultiTenantProducto[]>(() =>
    getStoredProductos(effectiveTenantId, isSuperAdmin)
  );

  // Recargar al cambiar de tenant
  useEffect(() => {
    const list = getStoredProductos(effectiveTenantId, isSuperAdmin);
    setProductos(list);
  }, [effectiveTenantId, isSuperAdmin]);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("all");
  const [estadoRedFiltro, setEstadoRedFiltro] = useState<"todos" | "publicados" | "no_publicados" | "comprometidos">("todos");
  const [listaFiltro, setListaFiltro] = useState<string>("all");
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  // ========================================================
  // MODAL 1: REGISTRAR NUEVO MATERIAL
  // ========================================================
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoSku, setNuevoSku] = useState("");
  const [nuevoCodigo, setNuevoCodigo] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("Cementos y Adhesivos");
  const [nuevaUnidad, setNuevaUnidad] = useState("BL");
  const [nuevoPrecioMostrador, setNuevoPrecioMostrador] = useState("");
  const [nuevaLista, setNuevaLista] = useState<TipoListaPrecio>("red_vertia");
  const [nuevaBonificacion, setNuevaBonificacion] = useState("5.0");
  const [nuevoStockReal, setNuevoStockReal] = useState("100");
  const [nuevoComprometido, setNuevoComprometido] = useState("0");
  const [nuevoMinimo, setNuevoMinimo] = useState("20");
  const [nuevoUbicacion, setNuevoUbicacion] = useState("Pasillo A • Rack 01");
  const [nuevoPublicarRed, setNuevoPublicarRed] = useState(true);

  const handleCrearProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSuperAdmin) return;
    if (!nuevoNombre.trim()) return;

    const real = Number(nuevoStockReal) || 0;
    const comp = Number(nuevoComprometido) || 0;
    const disp = Math.max(0, real - comp);
    const pMostrador = Number(nuevoPrecioMostrador) || 100;
    const bonif = Number(nuevaBonificacion) || 0;
    const pRed = nuevaLista === "red_vertia"
      ? Math.round((pMostrador * (1 - bonif / 100)) * 100) / 100
      : pMostrador;

    const targetTenant = effectiveTenantId === "all" ? "tenant-los-pinos" : effectiveTenantId;

    const nuevoProd: MultiTenantProducto = {
      id: `prod-${Date.now()}`,
      tenant_id: targetTenant,
      codigo_barras: nuevoCodigo || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      sku: nuevoSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      nombre: nuevoNombre,
      categoria: nuevaCategoria,
      unidad_medida: nuevaUnidad,
      precio: pMostrador,
      precio_mostrador: pMostrador,
      lista_precio_activa: nuevaLista,
      bonificacion_porcentaje: bonif,
      precio_red_vertia: pRed,
      stock_real: real,
      stock_comprometido: comp,
      stock_disponible: disp,
      stock_apartado_red: nuevoPublicarRed ? Math.round(disp * 0.7) : 0,
      modo_disponible: "automatico",
      cantidad_minima: Number(nuevoMinimo) || 10,
      cantidad_maxima: real * 3,
      publicado_en_red: nuevoPublicarRed,
      almacen_id: targetTenant === "tenant-materiales-centro" ? "alm-centro-sucursal" : "alm-pinos-central",
      ubicacion_estanteria: nuevoUbicacion || "Pasillo A • Rack 01",
    };

    saveStoredProducto(nuevoProd);
    setProductos((prev) => [nuevoProd, ...prev]);
    showNotification(`Material "${nuevoNombre}" registrado correctamente.`);
    setModalNuevoAbierto(false);
    setNuevoNombre("");
    setNuevoSku("");
    setNuevoCodigo("");
    setNuevoPrecioMostrador("");
  };

  // ========================================================
  // MODAL 2: GESTIÓN DE PRECIO, LISTA Y BONIFICACIÓN
  // ========================================================
  const [modalPrecioAbierto, setModalPrecioAbierto] = useState(false);
  const [prodEditandoPrecio, setProdEditandoPrecio] = useState<MultiTenantProducto | null>(null);
  const [editPrecioMostrador, setEditPrecioMostrador] = useState<number>(0);
  const [editListaActiva, setEditListaActiva] = useState<TipoListaPrecio>("red_vertia");
  const [editBonificacion, setEditBonificacion] = useState<number>(0);
  const [editPrecioRed, setEditPrecioRed] = useState<number>(0);

  const abrirModalPrecio = (prod: MultiTenantProducto) => {
    if (isSuperAdmin) return;
    setProdEditandoPrecio(prod);
    const pMostrador = prod.precio_mostrador ?? prod.precio;
    const lista = prod.lista_precio_activa || "red_vertia";
    const bonif = prod.bonificacion_porcentaje ?? 5;
    const pRed = prod.precio_red_vertia ?? Math.round(pMostrador * (1 - bonif / 100) * 100) / 100;

    setEditPrecioMostrador(pMostrador);
    setEditListaActiva(lista);
    setEditBonificacion(bonif);
    setEditPrecioRed(pRed);
    setModalPrecioAbierto(true);
  };

  const handleCambioPrecioMostrador = (val: number) => {
    setEditPrecioMostrador(val);
    if (editListaActiva === "red_vertia") {
      setEditPrecioRed(Math.round(val * (1 - editBonificacion / 100) * 100) / 100);
    } else if (editListaActiva === "contratista") {
      setEditPrecioRed(Math.round(val * 0.96 * 100) / 100);
    } else {
      setEditPrecioRed(val);
    }
  };

  const handleCambioBonificacion = (pct: number) => {
    setEditBonificacion(pct);
    setEditPrecioRed(Math.round(editPrecioMostrador * (1 - pct / 100) * 100) / 100);
  };

  const handleCambioPrecioRedDirecto = (val: number) => {
    setEditPrecioRed(val);
    if (editPrecioMostrador > 0) {
      const calcPct = Math.round(((editPrecioMostrador - val) / editPrecioMostrador) * 1000) / 10;
      setEditBonificacion(Math.max(0, calcPct));
    }
  };

  const handleGuardarPrecios = () => {
    if (!prodEditandoPrecio) return;

    const updates: Partial<MultiTenantProducto> = {
      precio: editPrecioMostrador,
      precio_mostrador: editPrecioMostrador,
      lista_precio_activa: editListaActiva,
      bonificacion_porcentaje: editBonificacion,
      precio_red_vertia: editPrecioRed,
    };

    updateStoredProducto(prodEditandoPrecio.id, updates);
    setProductos((prev) =>
      prev.map((p) => (p.id === prodEditandoPrecio.id ? { ...p, ...updates } : p))
    );

    showNotification(
      `Precios actualizados para "${prodEditandoPrecio.nombre}": Mostrador $${editPrecioMostrador.toFixed(
        2
      )} MXN | Red VERTIA $${editPrecioRed.toFixed(2)} MXN (${editBonificacion}% bonificación).`
    );
    setModalPrecioAbierto(false);
    setProdEditandoPrecio(null);
  };

  // ========================================================
  // MODAL 3: GESTIÓN DE STOCK & CUPO COMERCIAL RED
  // ========================================================
  const [modalStockAbierto, setModalStockAbierto] = useState(false);
  const [prodEditandoStock, setProdEditandoStock] = useState<MultiTenantProducto | null>(null);
  const [editStockReal, setEditStockReal] = useState<number>(0);
  const [editModoCupo, setEditModoCupo] = useState<"automatico" | "cupo_manual">("automatico");
  const [editValorCupo, setEditValorCupo] = useState<number>(0);
  const [editPublicarRed, setEditPublicarRed] = useState<boolean>(true);

  const abrirModalStock = (prod: MultiTenantProducto) => {
    if (isSuperAdmin) return;
    setProdEditandoStock(prod);
    setEditStockReal(prod.stock_real);
    setEditModoCupo(prod.modo_disponible || "automatico");
    const libre = Math.max(0, prod.stock_real - prod.stock_comprometido);
    setEditValorCupo(prod.stock_apartado_red ?? prod.cupo_manual_red ?? libre);
    setEditPublicarRed(prod.publicado_en_red);
    setModalStockAbierto(true);
  };

  const handleGuardarStockYCupo = () => {
    if (!prodEditandoStock) return;

    const libre = Math.max(0, editStockReal - prodEditandoStock.stock_comprometido);
    const cupoFinal = editModoCupo === "cupo_manual" ? Math.min(Math.max(0, editValorCupo), libre) : libre;

    const updates: Partial<MultiTenantProducto> = {
      stock_real: editStockReal,
      stock_disponible: libre,
      modo_disponible: editModoCupo,
      cupo_manual_red: editModoCupo === "cupo_manual" ? cupoFinal : undefined,
      stock_apartado_red: editPublicarRed ? cupoFinal : 0,
      publicado_en_red: editPublicarRed,
    };

    updateStoredProducto(prodEditandoStock.id, updates);
    setProductos((prev) =>
      prev.map((p) => (p.id === prodEditandoStock.id ? { ...p, ...updates } : p))
    );

    showNotification(
      `Stock y cupo guardados para "${prodEditandoStock.nombre}": ${editStockReal} ${prodEditandoStock.unidad_medida} en bodega (${cupoFinal} apartados para Red VERTIA).`
    );
    setModalStockAbierto(false);
    setProdEditandoStock(null);
  };

  // ========================================================
  // TOGGLE RÁPIDO DE PUBLICACIÓN EN RED
  // ========================================================
  const togglePublicacionRed = (prod: MultiTenantProducto) => {
    if (isSuperAdmin) return;
    const nuevoEstado = !prod.publicado_en_red;
    const libre = Math.max(0, prod.stock_real - prod.stock_comprometido);
    const nuevoApartado = nuevoEstado ? (prod.stock_apartado_red && prod.stock_apartado_red > 0 ? prod.stock_apartado_red : libre) : 0;

    const updates: Partial<MultiTenantProducto> = {
      publicado_en_red: nuevoEstado,
      stock_apartado_red: nuevoApartado,
    };

    updateStoredProducto(prod.id, updates);
    setProductos((prev) =>
      prev.map((p) => (p.id === prod.id ? { ...p, ...updates } : p))
    );

    showNotification(
      nuevoEstado
        ? `"${prod.nombre}" expuesto a la Red VERTIA ($${(prod.precio_red_vertia ?? prod.precio).toFixed(2)} MXN).`
        : `"${prod.nombre}" pausado de la Red VERTIA (queda exclusivamente para venta de mostrador).`
    );
  };

  // ========================================================
  // MODAL 4: ADMINISTRADOR DE LISTAS DE PRECIOS & BONIFICACIONES
  // ========================================================
  const [modalListasAbierto, setModalListasAbierto] = useState(false);
  const [bonifCategoria, setBonifCategoria] = useState("Cementos y Adhesivos");
  const [bonifPorcentajeMasivo, setBonifPorcentajeMasivo] = useState("5.0");

  const handleAplicarBonificacionMasiva = () => {
    const pct = Number(bonifPorcentajeMasivo) || 0;
    if (pct < 0 || pct > 50) return;

    let modificados = 0;
    const updated = productos.map((p) => {
      if (p.categoria === bonifCategoria) {
        modificados++;
        const pMostrador = p.precio_mostrador ?? p.precio;
        const pRed = Math.round(pMostrador * (1 - pct / 100) * 100) / 100;
        const patch: Partial<MultiTenantProducto> = {
          lista_precio_activa: "red_vertia",
          bonificacion_porcentaje: pct,
          precio_red_vertia: pRed,
        };
        updateStoredProducto(p.id, patch);
        return { ...p, ...patch };
      }
      return p;
    });

    setProductos(updated);
    showNotification(
      `¡Bonificación del ${pct}% aplicada a ${modificados} producto(s) en "${bonifCategoria}"!`
    );
    setModalListasAbierto(false);
  };

  // ========================================================
  // FILTRADO DE PRODUCTOS
  // ========================================================
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      // 1. Tenant Isolation
      if (effectiveTenantId !== "all" && p.tenant_id !== effectiveTenantId) {
        return false;
      }

      // 2. Buscador
      const query = busqueda.toLowerCase().trim();
      const matchBusqueda =
        !query ||
        p.nombre.toLowerCase().includes(query) ||
        p.codigo_barras.includes(query) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        p.categoria.toLowerCase().includes(query) ||
        p.ubicacion_estanteria.toLowerCase().includes(query);

      // 3. Categoría
      const matchCategoria = categoriaFiltro === "all" || p.categoria === categoriaFiltro;

      // 4. Lista de precio
      const matchLista =
        listaFiltro === "all" ||
        (p.lista_precio_activa || "red_vertia") === listaFiltro;

      // 5. Estado en Red
      let matchEstadoRed = true;
      if (estadoRedFiltro === "publicados") {
        matchEstadoRed = p.publicado_en_red;
      } else if (estadoRedFiltro === "no_publicados") {
        matchEstadoRed = !p.publicado_en_red;
      } else if (estadoRedFiltro === "comprometidos") {
        matchEstadoRed = p.stock_comprometido > 0 || p.stock_disponible <= p.cantidad_minima;
      }

      return matchBusqueda && matchCategoria && matchLista && matchEstadoRed;
    });
  }, [productos, effectiveTenantId, busqueda, categoriaFiltro, listaFiltro, estadoRedFiltro]);

  // ========================================================
  // MÉTRICAS GLOBALES
  // ========================================================
  const metricas = useMemo(() => {
    const list = effectiveTenantId === "all"
      ? productos
      : productos.filter((p) => p.tenant_id === effectiveTenantId);

    const totalSkus = list.length;
    const totalFisico = list.reduce((acc, p) => acc + p.stock_real, 0);
    const totalComprometido = list.reduce((acc, p) => acc + p.stock_comprometido, 0);
    const totalApartadoRed = list
      .filter((p) => p.publicado_en_red)
      .reduce((acc, p) => acc + (p.stock_apartado_red || p.stock_disponible), 0);
    const totalPublicados = list.filter((p) => p.publicado_en_red).length;
    const valorInventario = list.reduce(
      (acc, p) => acc + p.stock_real * (p.precio_mostrador ?? p.precio),
      0
    );
    const valorExpuestoRed = list
      .filter((p) => p.publicado_en_red)
      .reduce(
        (acc, p) =>
          acc +
          (p.stock_apartado_red || p.stock_disponible) *
            (p.precio_red_vertia ?? p.precio),
        0
      );

    return {
      totalSkus,
      totalFisico,
      totalComprometido,
      totalApartadoRed,
      totalPublicados,
      valorInventario,
      valorExpuestoRed,
    };
  }, [productos, effectiveTenantId]);

  // Categorías únicas
  const categoriasDisponibles = useMemo(() => {
    const setCats = new Set<string>();
    productos.forEach((p) => {
      if (p.categoria) setCats.add(p.categoria);
    });
    return Array.from(setCats);
  }, [productos]);

  const getTenantName = (tId: string) => {
    const found = allTenants.find((t) => t.id === tId) || MOCK_TENANTS.find((t) => t.id === tId);
    return found?.nombre || tId;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ======================================================== */}
      {/* 1. HEADER CORPORATIVO UNIFICADO                          */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Materiales y Stock
              </h1>
              <p className="text-xs text-slate-500">
                Catálogo general de bodega, existencias físicas vs. comprometidas, listas de precios, bonificaciones y exposición a la Red VERTIA.
              </p>
            </div>
          </div>
        </div>

        {/* Controles de Tenant y Botones Principales */}
        <div className="flex flex-wrap items-center gap-2.5">
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
                Bodega: <strong className="text-slate-900">{tenant?.nombre || user?.tenant_nombre || "Corralón Asignado"}</strong>
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                Aislamiento Activo
              </span>
            </div>
          )}

          {!isSuperAdmin && (
            <>
              <Button
                variant="outline"
                onClick={() => setModalListasAbierto(true)}
                className="text-xs font-semibold border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <Tag className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Listas & Bonificaciones
              </Button>

              <Button
                onClick={() => setModalNuevoAbierto(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Registrar Material
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Banner de Confidencialidad / Privacidad */}
      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-800 block">Privacidad y Control Total de tu Negocio</span>
            <span className="text-[11px] text-slate-500">
              Tus competidores no tienen acceso a tu inventario ni a tus listas de precios. Aquí administras tu stock físico, con qué lista o bonificación expones stock a la Red VERTIA y qué productos mantienes exclusivamente para mostrador.
            </span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded bg-white border border-indigo-200 text-[11px] font-semibold text-indigo-700">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Garantía Escrow 100%</span>
        </div>
      </div>

      {/* Notificación Toast */}
      {mensajeExito && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TARJETAS DE MÉTRICAS OPERATIVAS & FINANCIERAS         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Catálogo Activo</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metricas.totalSkus}</span>
            <span className="text-xs text-slate-500 font-medium">SKUs registrados</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{metricas.totalPublicados} materiales expuestos en Red</span>
          </div>
        </Card>

        <Card className="p-3.5 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Stock Físico Real</span>
            <Warehouse className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metricas.totalFisico}</span>
            <span className="text-xs text-slate-500 font-medium">unidades en bodega</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>{metricas.totalComprometido} unidades comprometidas en obras</span>
          </div>
        </Card>

        <Card className="p-3.5 bg-white border-indigo-200/80 bg-indigo-50/15 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-900 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Apartado Red VERTIA</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-950">{metricas.totalApartadoRed}</span>
            <span className="text-xs text-indigo-700 font-medium">unidades cotizables</span>
          </div>
          <div className="mt-1 text-[11px] text-indigo-600 font-medium">
            Ruteo automático para contratistas B2B
          </div>
        </Card>

        <Card className="p-3.5 bg-white border-emerald-200/80 bg-emerald-50/15 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-900 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Valor Inventariado</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-950">
              ${metricas.valorInventario.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-emerald-700 font-bold">MXN</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium truncate">
            ${metricas.valorExpuestoRed.toLocaleString("es-MX", { minimumFractionDigits: 0 })} MXN expuesto a red
          </div>
        </Card>
      </div>

      {/* ======================================================== */}
      {/* 3. FILTROS Y PESTAÑAS DE VISTA RÁPIDA                    */}
      {/* ======================================================== */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Pestañas de estado rápido */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setEstadoRedFiltro("todos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                estadoRedFiltro === "todos"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todos ({metricas.totalSkus})
            </button>

            <button
              onClick={() => setEstadoRedFiltro("publicados")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                estadoRedFiltro === "publicados"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Expuestos en Red ({metricas.totalPublicados})</span>
            </button>

            <button
              onClick={() => setEstadoRedFiltro("no_publicados")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                estadoRedFiltro === "no_publicados"
                  ? "bg-slate-700 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Solo Mostrador ({metricas.totalSkus - metricas.totalPublicados})</span>
            </button>

            <button
              onClick={() => setEstadoRedFiltro("comprometidos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                estadoRedFiltro === "comprometidos"
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Comprometido / Crítico</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Mostrando {productosFiltrados.length} de {metricas.totalSkus} materiales
          </div>
        </div>

        {/* Barra de Búsqueda y Dropdowns */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por material, SKU, código de barras o pasillo..."
              className="pl-9 h-9 text-xs border-slate-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Categorías */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">Todas las Categorías</option>
                {categoriasDisponibles.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Listas de Precios */}
            <select
              value={listaFiltro}
              onChange={(e) => setListaFiltro(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Todas las Listas</option>
              <option value="red_vertia">Lista Red VERTIA</option>
              <option value="contratista">Lista Contratistas</option>
              <option value="mostrador">Lista Mostrador Base</option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. TABLA UNIFICADA DE MATERIALES, PRECIOS Y STOCK        */}
      {/* ======================================================== */}
      <Card className="bg-white border-slate-200 shadow-xs overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Material / SKU</th>
                {isSuperAdmin && effectiveTenantId === "all" && (
                  <th className="py-3 px-3">Bodega</th>
                )}
                <th className="py-3 px-3">Ubicación Bodega</th>
                <th className="py-3 px-3 text-center bg-slate-100/60 font-black text-slate-800">
                  Físico Real
                </th>
                <th className="py-3 px-3 text-center text-amber-700">Comprometido</th>
                <th className="py-3 px-3 text-center bg-emerald-50/50 font-bold text-emerald-800">
                  Disp. Mostrador
                </th>
                <th className="py-3 px-3 text-center bg-indigo-50/50 font-bold text-indigo-900">
                  Apartado Red
                </th>
                <th className="py-3 px-3 text-right">Precio Mostrador</th>
                <th className="py-3 px-3 text-center">Lista / Bonif.</th>
                <th className="py-3 px-3 text-right font-black text-indigo-700">Precio Red VERTIA</th>
                <th className="py-3 px-3 text-center">Estado Red</th>
                {!isSuperAdmin && <th className="py-3 px-4 text-center">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={isSuperAdmin && effectiveTenantId === "all" ? 12 : 11}
                    className="py-12 text-center text-slate-400"
                  >
                    No se encontraron materiales que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((p) => {
                  const pMostrador = p.precio_mostrador ?? p.precio;
                  const bonif = p.bonificacion_porcentaje ?? (p.lista_precio_activa === "red_vertia" ? 5 : 0);
                  const pRed = p.precio_red_vertia ?? Math.round(pMostrador * (1 - bonif / 100) * 100) / 100;
                  const stockCritico = p.stock_disponible <= p.cantidad_minima;
                  const apartadoRed = p.stock_apartado_red ?? (p.publicado_en_red ? p.stock_disponible : 0);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Material / SKU */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.nombre}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            {p.sku || p.codigo_barras}
                          </span>
                          <span>•</span>
                          <span>{p.categoria}</span>
                        </div>
                      </td>

                      {/* Corralón (Super Admin) */}
                      {isSuperAdmin && effectiveTenantId === "all" && (
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-[11px]">
                            <Building2 className="w-3 h-3" />
                            {getTenantName(p.tenant_id)}
                          </span>
                        </td>
                      )}

                      {/* Ubicación Bodega */}
                      <td className="py-3 px-3 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1">
                          <Warehouse className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium truncate">{p.ubicacion_estanteria}</span>
                        </div>
                      </td>

                      {/* Stock Físico Real */}
                      <td className="py-3 px-3 text-center bg-slate-50/60">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {p.stock_real}
                        </span>{" "}
                        <span className="text-[10px] text-slate-500 font-bold">{p.unidad_medida}</span>
                      </td>

                      {/* Stock Comprometido */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-amber-600 text-xs">
                          {p.stock_comprometido}
                        </span>{" "}
                        <span className="text-[10px] text-amber-700/70">{p.unidad_medida}</span>
                      </td>

                      {/* Disponible Mostrador */}
                      <td className="py-3 px-3 text-center bg-emerald-50/30">
                        <span
                          className={`font-black text-xs ${
                            stockCritico ? "text-amber-600" : "text-emerald-700"
                          }`}
                        >
                          {p.stock_disponible}
                        </span>{" "}
                        <span className="text-[10px] text-emerald-800/70">{p.unidad_medida}</span>
                      </td>

                      {/* Apartado Red VERTIA */}
                      <td className="py-3 px-3 text-center bg-indigo-50/30">
                        {p.publicado_en_red ? (
                          <div className="flex flex-col items-center">
                            <span className="font-black text-xs text-indigo-700">
                              {apartadoRed} {p.unidad_medida}
                            </span>
                            <span className="text-[9px] text-indigo-500 font-semibold">
                              {p.modo_disponible === "cupo_manual" ? "Cupo Manual" : "100% Auto"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-semibold italic">0 (Pausado)</span>
                        )}
                      </td>

                      {/* Precio Mostrador */}
                      <td className="py-3 px-3 text-right font-medium text-slate-600">
                        ${pMostrador.toFixed(2)} <span className="text-[10px] text-slate-400">MXN</span>
                      </td>

                      {/* Lista / Bonificación */}
                      <td className="py-3 px-3 text-center">
                        {p.lista_precio_activa === "red_vertia" ? (
                          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-bold">
                            Red VERTIA (-{bonif}%)
                          </Badge>
                        ) : p.lista_precio_activa === "contratista" ? (
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold">
                            Contratista (-{bonif}%)
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] font-medium">
                            Mostrador (0%)
                          </Badge>
                        )}
                      </td>

                      {/* Precio Red VERTIA */}
                      <td className="py-3 px-3 text-right">
                        <div className="font-black text-sm text-indigo-900">
                          ${pRed.toFixed(2)}
                        </div>
                        <span className="text-[9px] text-indigo-500 block">MXN p/ cotización</span>
                      </td>

                      {/* Estado Red (Toggle / Badge) */}
                      <td className="py-3 px-3 text-center">
                        {p.publicado_en_red ? (
                          <button
                            onClick={() => togglePublicacionRed(p)}
                            disabled={isSuperAdmin}
                            title="Haga clic para pausar este material de la Red VERTIA"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors border border-emerald-300/60"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span>Expuesto en Red</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => togglePublicacionRed(p)}
                            disabled={isSuperAdmin}
                            title="Haga clic para exponer este material a la Red VERTIA"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border border-slate-200"
                          >
                            <EyeOff className="w-3 h-3 text-slate-400" />
                            <span>Solo Mostrador</span>
                          </button>
                        )}
                      </td>

                      {/* Acciones */}
                      {!isSuperAdmin && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => abrirModalPrecio(p)}
                              className="h-7 px-2 text-[11px] font-semibold text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-indigo-600"
                              title="Configurar precio base mostrador, lista activa y bonificación"
                            >
                              <Edit2 className="w-3 h-3 mr-1 text-slate-400" />
                              Precios
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => abrirModalStock(p)}
                              className="h-7 px-2 text-[11px] font-semibold text-indigo-700 border-indigo-200 bg-indigo-50/30 hover:bg-indigo-100"
                              title="Ajustar stock físico y cupo asignado a la Red VERTIA"
                            >
                              <SlidersHorizontal className="w-3 h-3 mr-1 text-indigo-500" />
                              Stock / Cupo
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

      {/* ======================================================== */}
      {/* MODAL: EDITAR PRECIO, LISTA Y BONIFICACIÓN               */}
      {/* ======================================================== */}
      {modalPrecioAbierto && prodEditandoPrecio && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border-slate-200 animate-in fade-in-50 zoom-in-95 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Precios, Lista & Bonificación
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {prodEditandoPrecio.nombre} ({prodEditandoPrecio.sku || prodEditandoPrecio.codigo_barras})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalPrecioAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Precio Mostrador Base */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  1. Precio Regular Mostrador ($ MXN)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  <Input
                    type="number"
                    step="0.5"
                    value={editPrecioMostrador}
                    onChange={(e) => handleCambioPrecioMostrador(Number(e.target.value) || 0)}
                    className="pl-7 font-bold text-slate-800 text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                    MXN / {prodEditandoPrecio.unidad_medida}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Precio de venta al público en el mostrador del corralón.
                </p>
              </div>

              {/* Selector de Lista de Precio */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  2. Lista de Precio Asignada para Cotizaciones de Red
                </label>
                <select
                  value={editListaActiva}
                  onChange={(e) => {
                    const nueva = e.target.value as TipoListaPrecio;
                    setEditListaActiva(nueva);
                    if (nueva === "mostrador") {
                      setEditBonificacion(0);
                      setEditPrecioRed(editPrecioMostrador);
                    } else if (nueva === "contratista") {
                      setEditBonificacion(4.0);
                      setEditPrecioRed(Math.round(editPrecioMostrador * 0.96 * 100) / 100);
                    } else {
                      setEditBonificacion(5.0);
                      setEditPrecioRed(Math.round(editPrecioMostrador * 0.95 * 100) / 100);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="red_vertia">🌐 Lista Red VERTIA (Precio preferencial con 100% Escrow)</option>
                  <option value="contratista">👷 Lista Contratistas & Obra Frecuente</option>
                  <option value="mostrador">🏪 Lista Mostrador Base (Sin bonificación)</option>
                </select>
              </div>

              {/* Bonificación y Precio Red VERTIA */}
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-indigo-900 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Bonificación / Descuento a la Red (%)</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="50"
                      value={editBonificacion}
                      onChange={(e) => handleCambioBonificacion(Number(e.target.value) || 0)}
                      className="w-20 h-7 text-xs font-black text-right pr-2 bg-white"
                    />
                    <span className="font-bold text-indigo-700">%</span>
                  </div>
                </div>

                <div className="border-t border-indigo-100 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-950 block">
                      Precio Neto Resultante Red VERTIA:
                    </span>
                    <span className="text-[10px] text-indigo-600">
                      Importe exacto al que el sistema cotizará este SKU a constructoras.
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-indigo-600">$</span>
                    <Input
                      type="number"
                      step="0.5"
                      value={editPrecioRed}
                      onChange={(e) => handleCambioPrecioRedDirecto(Number(e.target.value) || 0)}
                      className="w-28 pl-6 h-8 text-sm font-black text-indigo-900 bg-white border-indigo-300"
                    />
                  </div>
                </div>
              </div>

              {/* Resumen comparativo */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] flex items-center justify-between">
                <span className="text-slate-500">Diferencial vs Mostrador:</span>
                <span className="font-bold text-emerald-700">
                  -${(editPrecioMostrador - editPrecioRed).toFixed(2)} MXN por {prodEditandoPrecio.unidad_medida} (
                  {editBonificacion}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setModalPrecioAbierto(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGuardarPrecios}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Guardar Precios & Lista
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: AJUSTE DE STOCK & CUPO COMERCIAL RED             */}
      {/* ======================================================== */}
      {modalStockAbierto && prodEditandoStock && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border-slate-200 animate-in fade-in-50 zoom-in-95 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Stock Físico & Cupo de Red VERTIA
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {prodEditandoStock.nombre} ({prodEditandoStock.unidad_medida})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalStockAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Existencia Física Real */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Existencia Física Real en Bodega
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editStockReal}
                    onChange={(e) => setEditStockReal(Number(e.target.value) || 0)}
                    className="font-black text-slate-900 text-sm"
                  />
                  <span className="font-bold text-slate-500 uppercase">{prodEditandoStock.unidad_medida}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Comprometido en órdenes: <strong>{prodEditandoStock.stock_comprometido} {prodEditandoStock.unidad_medida}</strong></span>
                  <span>Saldo libre disponible: <strong>{Math.max(0, editStockReal - prodEditandoStock.stock_comprometido)} {prodEditandoStock.unidad_medida}</strong></span>
                </div>
              </div>

              {/* Modo de Exposición de Cupo */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="font-bold text-slate-800 block">
                  Modo de Asignación de Cupo para la Red VERTIA
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditModoCupo("automatico");
                      setEditValorCupo(Math.max(0, editStockReal - prodEditandoStock.stock_comprometido));
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      editModoCupo === "automatico"
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between mb-1">
                      <span>100% Automático</span>
                      {editModoCupo === "automatico" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Ofrece a la red todo el stock disponible (Real - Comprometido).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditModoCupo("cupo_manual")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      editModoCupo === "cupo_manual"
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between mb-1">
                      <span>Cupo Manual Fijo</span>
                      {editModoCupo === "cupo_manual" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Limita un número máximo de bultos apartados para cotización.
                    </p>
                  </button>
                </div>

                {editModoCupo === "cupo_manual" && (
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-1.5 mt-2">
                    <label className="font-bold text-indigo-900 text-xs block">
                      Cantidad Apartada Fija para Red VERTIA ({prodEditandoStock.unidad_medida}):
                    </label>
                    <Input
                      type="number"
                      max={Math.max(0, editStockReal - prodEditandoStock.stock_comprometido)}
                      value={editValorCupo}
                      onChange={(e) => setEditValorCupo(Number(e.target.value) || 0)}
                      className="font-bold text-sm bg-white"
                    />
                    <p className="text-[10px] text-slate-500">
                      Máximo asignable sin afectar compromisos: {Math.max(0, editStockReal - prodEditandoStock.stock_comprometido)} {prodEditandoStock.unidad_medida}.
                    </p>
                  </div>
                )}
              </div>

              {/* Toggle Publicar en Red */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Exponer a la Red VERTIA</span>
                  <span className="text-[10px] text-slate-500">
                    Si se desactiva, el producto permanecerá solo para venta de mostrador.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editPublicarRed}
                  onChange={(e) => setEditPublicarRed(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setModalStockAbierto(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGuardarStockYCupo}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Actualizar Stock & Cupo
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADMINISTRADOR MAESTRO DE LISTAS & BONIFICACIONES   */}
      {/* ======================================================== */}
      {modalListasAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border-slate-200 animate-in fade-in-50 zoom-in-95 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Administrador de Listas de Precios & Bonificaciones
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Estrategia comercial de la bodega para ventas de mostrador vs. ruteo Red VERTIA
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalListasAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Las 3 listas */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block text-xs">Listas Activas en el Sistema:</span>

                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 block">1. Lista Mostrador / Pública</span>
                    <span className="text-[10px] text-slate-500">
                      Precio regular base de venta al público sin descuentos. Cobro en caja.
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold">Base (0%)</Badge>
                </div>

                <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/30 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-blue-900 block">2. Lista Contratistas Frecuentes</span>
                    <span className="text-[10px] text-slate-500">
                      Descuento comercial por volumen para clientes habituales de la bodega.
                    </span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] font-bold">~4% a 5%</Badge>
                </div>

                <div className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-indigo-900 block">3. Lista Red VERTIA (B2B Escrow)</span>
                    <span className="text-[10px] text-slate-500">
                      Precio preferencial cotizado automáticamente a solicitudes de obras. Garantía de pago asegurada por VERTIA.
                    </span>
                  </div>
                  <Badge className="bg-indigo-600 text-white text-[10px] font-bold">Bonificación Pactada</Badge>
                </div>
              </div>

              {/* Bonificación masiva por rubro */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Percent className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Aplicar Bonificación Masiva a la Red VERTIA por Categoría</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Aplica un porcentaje de descuento unificado a todos los materiales de un rubro para agilizar su cotización en la Red VERTIA.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Categoría</label>
                    <select
                      value={bonifCategoria}
                      onChange={(e) => setBonifCategoria(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-semibold"
                    >
                      {categoriasDisponibles.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Bonificación (%)</label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="30"
                        value={bonifPorcentajeMasivo}
                        onChange={(e) => setBonifPorcentajeMasivo(e.target.value)}
                        className="h-8 text-xs font-bold bg-white"
                      />
                      <span className="font-bold text-slate-600">%</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAplicarBonificacionMasiva}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold h-8"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Aplicar Bonificación a {bonifCategoria}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setModalListasAbierto(false)}
                className="text-xs"
              >
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REGISTRAR NUEVO MATERIAL                          */}
      {/* ======================================================== */}
      {modalNuevoAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border-slate-200 animate-in fade-in-50 zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Registrar Nuevo Material en Bodega
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Alta de insumo con control de stock y parametrización de precios para la Red VERTIA
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalNuevoAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearProducto} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nombre Comercial *</label>
                  <Input
                    required
                    placeholder="ej: Cemento Cruz Azul Gris 50kg"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    className="h-8 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">SKU / Clave Interna</label>
                  <Input
                    placeholder="ej: CEM-CAZ-50"
                    value={nuevoSku}
                    onChange={(e) => setNuevoSku(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    className="w-full h-8 bg-white border border-slate-200 rounded px-2 text-xs font-medium"
                  >
                    <option value="Cementos y Adhesivos">Cementos y Adhesivos</option>
                    <option value="Aceros y Perfiles">Aceros y Perfiles</option>
                    <option value="Áridos y Graneles">Áridos y Graneles</option>
                    <option value="Mampostería y Tabiques">Mampostería y Tabiques</option>
                    <option value="Tuberías y Plomería">Tuberías y Plomería</option>
                    <option value="Electricidad & Canalizaciones">Electricidad & Canalizaciones</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unidad de Medida</label>
                  <select
                    value={nuevaUnidad}
                    onChange={(e) => setNuevaUnidad(e.target.value)}
                    className="w-full h-8 bg-white border border-slate-200 rounded px-2 text-xs font-medium"
                  >
                    <option value="BL">Bolsa (BL)</option>
                    <option value="PZA">Pieza (PZA)</option>
                    <option value="M3">Metro Cúbico (M3)</option>
                    <option value="MIL">Millar (MIL)</option>
                    <option value="KG">Kilogramo (KG)</option>
                    <option value="TN">Tonelada (TN)</option>
                    <option value="ROL">Rollo (ROL)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ubicación Bodega</label>
                  <Input
                    placeholder="ej: Pasillo A • Rack 01"
                    value={nuevoUbicacion}
                    onChange={(e) => setNuevoUbicacion(e.target.value)}
                    className="h-8 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Físico Inicial</label>
                  <Input
                    type="number"
                    value={nuevoStockReal}
                    onChange={(e) => setNuevoStockReal(e.target.value)}
                    className="h-8 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Comprometido</label>
                  <Input
                    type="number"
                    value={nuevoComprometido}
                    onChange={(e) => setNuevoComprometido(e.target.value)}
                    className="h-8 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Alerta Stock Mínimo</label>
                  <Input
                    type="number"
                    value={nuevoMinimo}
                    onChange={(e) => setNuevoMinimo(e.target.value)}
                    className="h-8 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Precios y Red */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Precio Mostrador ($ MXN) *</label>
                  <Input
                    required
                    type="number"
                    step="0.5"
                    placeholder="ej: 245.00"
                    value={nuevoPrecioMostrador}
                    onChange={(e) => setNuevoPrecioMostrador(e.target.value)}
                    className="h-8 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lista para Red VERTIA</label>
                  <select
                    value={nuevaLista}
                    onChange={(e) => setNuevaLista(e.target.value as TipoListaPrecio)}
                    className="w-full h-8 bg-white border border-slate-200 rounded px-2 text-xs font-medium"
                  >
                    <option value="red_vertia">Lista Red VERTIA</option>
                    <option value="contratista">Lista Contratista</option>
                    <option value="mostrador">Lista Mostrador Base</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bonificación Red (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={nuevaBonificacion}
                    onChange={(e) => setNuevaBonificacion(e.target.value)}
                    className="h-8 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chkPublicar"
                  checked={nuevoPublicarRed}
                  onChange={(e) => setNuevoPublicarRed(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="chkPublicar" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Exponer inmediatamente a la Red VERTIA para cotizaciones a constructoras
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalNuevoAbierto(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Registrar Material
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
