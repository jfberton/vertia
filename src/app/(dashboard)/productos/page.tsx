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
  Settings,
  MapPin,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldAlert,
  Truck,
  FileText,
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

  // Verificación estricta de permisos de Administrador de Bodega / Corralón
  const isAdminGalpon =
    isSuperAdmin ||
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

  // Filtros de búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("all");
  const [estadoRedFiltro, setEstadoRedFiltro] = useState<"todos" | "publicados" | "no_publicados" | "comprometidos">("todos");
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  // ========================================================
  // POPUP UNIFICADO: ADMINISTRAR MATERIAL (FICHA INTEGRAL)
  // ========================================================
  const [modalAdminAbierto, setModalAdminAbierto] = useState(false);
  const [prodSeleccionado, setProdSeleccionado] = useState<MultiTenantProducto | null>(null);

  // Estado del formulario editable dentro del popup
  const [formNombre, setFormNombre] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formCategoria, setFormCategoria] = useState("");
  const [formUnidad, setFormUnidad] = useState("BL");
  const [formPrecioMostrador, setFormPrecioMostrador] = useState<number>(0);
  const [formListaActiva, setFormListaActiva] = useState<TipoListaPrecio>("red_vertia");
  const [formBonificacion, setFormBonificacion] = useState<number>(5.0);
  const [formPrecioRed, setFormPrecioRed] = useState<number>(0);
  const [formPublicadoRed, setFormPublicadoRed] = useState<boolean>(true);
  const [formStockReal, setFormStockReal] = useState<number>(0);
  const [formStockMinimo, setFormStockMinimo] = useState<number>(20);
  const [formModoCupo, setFormModoCupo] = useState<"automatico" | "cupo_manual">("automatico");
  const [formCupoManual, setFormCupoManual] = useState<number>(0);

  // ========================================================
  // MODAL: RECIBIR MERCADERÍA / INGRESO DE PROVEEDOR
  // ========================================================
  const [modalRecibirAbierto, setModalRecibirAbierto] = useState(false);
  const [recibirProdId, setRecibirProdId] = useState("");
  const [recibirCantidad, setRecibirCantidad] = useState("100");
  const [recibirProveedor, setRecibirProveedor] = useState("Cooperativa La Cruz Azul S.C.L.");
  const [recibirRemito, setRecibirRemito] = useState("");
  const [recibirLote, setRecibirLote] = useState("");
  const [recibirDestino, setRecibirDestino] = useState<"pulmon" | "directo">("pulmon");

  const abrirModalRecibir = (prod?: MultiTenantProducto) => {
    const target = prod || productos[0];
    if (target) {
      setRecibirProdId(target.id);
      setRecibirProveedor(
        target.nombre.includes("Cruz Azul")
          ? "Cooperativa La Cruz Azul S.C.L."
          : target.nombre.includes("Cal")
          ? "Grupo Calidra S.A. de C.V."
          : target.nombre.includes("Varilla")
          ? "Deacero S.A.P.I. de C.V."
          : "Proveedor de Materiales"
      );
    }
    setRecibirRemito(`REM-PROV-${Math.floor(1000 + Math.random() * 9000)}`);
    setRecibirLote(`LOTE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setModalRecibirAbierto(true);
  };

  const handleConfirmarRecepcion = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = productos.find((p) => p.id === recibirProdId);
    if (!prod) return;
    const qty = Number(recibirCantidad) || 1;

    if (recibirDestino === "directo") {
      const nuevoStock = prod.stock_real + qty;
      const nuevoDisp = Math.max(0, nuevoStock - prod.stock_comprometido);
      updateStoredProducto(prod.id, {
        stock_real: nuevoStock,
        stock_disponible: nuevoDisp,
      });
      setProductos((prev) =>
        prev.map((p) =>
          p.id === prod.id
            ? { ...p, stock_real: nuevoStock, stock_disponible: nuevoDisp }
            : p
        )
      );
      showNotification(
        `¡Ingreso directo registrado! Se sumaron ${qty} ${prod.unidad_medida} al stock físico de "${prod.nombre}".`
      );
    } else {
      showNotification(
        `¡Mercadería ingresada al Pulmón de Recepción! Se registraron ${qty} ${prod.unidad_medida} de "${prod.nombre}" listos para estiba guiada (slotting 2D).`
      );
    }

    setModalRecibirAbierto(false);
    setRecibirRemito("");
    setRecibirLote("");
  };

  const abrirAdministrarMaterial = (prod: MultiTenantProducto) => {
    setProdSeleccionado(prod);
    setFormNombre(prod.nombre);
    setFormSku(prod.sku || prod.codigo_barras);
    setFormCategoria(prod.categoria);
    setFormUnidad(prod.unidad_medida);

    const pMostrador = prod.precio_mostrador ?? prod.precio;
    const lista = prod.lista_precio_activa || "red_vertia";
    const bonif = prod.bonificacion_porcentaje ?? 5;
    const pRed = prod.precio_red_vertia ?? Math.round(pMostrador * (1 - bonif / 100) * 100) / 100;

    setFormPrecioMostrador(pMostrador);
    setFormListaActiva(lista);
    setFormBonificacion(bonif);
    setFormPrecioRed(pRed);
    setFormPublicadoRed(prod.publicado_en_red);
    setFormStockReal(prod.stock_real);
    setFormStockMinimo(prod.cantidad_minima || 20);
    setFormModoCupo(prod.modo_disponible || "automatico");

    const libre = Math.max(0, prod.stock_real - prod.stock_comprometido);
    setFormCupoManual(prod.cupo_manual_red ?? prod.stock_apartado_red ?? libre);

    setModalAdminAbierto(true);
  };

  const handleCambioPrecioMostrador = (val: number) => {
    setFormPrecioMostrador(val);
    if (formListaActiva === "red_vertia") {
      setFormPrecioRed(Math.round(val * (1 - formBonificacion / 100) * 100) / 100);
    } else if (formListaActiva === "contratista") {
      setFormPrecioRed(Math.round(val * 0.96 * 100) / 100);
    } else {
      setFormPrecioRed(val);
    }
  };

  const handleCambioBonificacion = (pct: number) => {
    setFormBonificacion(pct);
    setFormPrecioRed(Math.round(formPrecioMostrador * (1 - pct / 100) * 100) / 100);
  };

  const handleCambioPrecioRedDirecto = (val: number) => {
    setFormPrecioRed(val);
    if (formPrecioMostrador > 0) {
      const calcPct = Math.round(((formPrecioMostrador - val) / formPrecioMostrador) * 1000) / 10;
      setFormBonificacion(Math.max(0, calcPct));
    }
  };

  const handleGuardarAdministracion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodSeleccionado) return;
    if (!isAdminGalpon) {
      showNotification("⚠️ Permisos insuficientes: Solo un Administrador de Galpón puede guardar cambios.");
      return;
    }

    const libre = Math.max(0, formStockReal - prodSeleccionado.stock_comprometido);
    const cupoFinal = formModoCupo === "cupo_manual" ? Math.min(Math.max(0, formCupoManual), libre) : libre;

    const updates: Partial<MultiTenantProducto> = {
      nombre: formNombre,
      sku: formSku,
      categoria: formCategoria,
      unidad_medida: formUnidad,
      precio: formPrecioMostrador,
      precio_mostrador: formPrecioMostrador,
      lista_precio_activa: formListaActiva,
      bonificacion_porcentaje: formBonificacion,
      precio_red_vertia: formPrecioRed,
      publicado_en_red: formPublicadoRed,
      stock_real: formStockReal,
      stock_disponible: libre,
      cantidad_minima: formStockMinimo,
      modo_disponible: formModoCupo,
      cupo_manual_red: formModoCupo === "cupo_manual" ? cupoFinal : undefined,
      stock_apartado_red: formPublicadoRed ? cupoFinal : 0,
    };

    updateStoredProducto(prodSeleccionado.id, updates);
    setProductos((prev) =>
      prev.map((p) => (p.id === prodSeleccionado.id ? { ...p, ...updates } : p))
    );

    showNotification(`¡Material "${formNombre}" actualizado exitosamente!`);
    setModalAdminAbierto(false);
    setProdSeleccionado(null);
  };

  // ========================================================
  // MODAL: REGISTRAR NUEVO MATERIAL
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
  const [nuevoPublicarRed, setNuevoPublicarRed] = useState(true);

  const handleCrearProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminGalpon) return;
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
      ubicacion_estanteria: "Pasillo A • Rack 01",
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
  // MODAL: LISTAS DE PRECIOS & BONIFICACIONES MAESTRAS
  // ========================================================
  const [modalListasAbierto, setModalListasAbierto] = useState(false);
  const [bonifCategoria, setBonifCategoria] = useState("Cementos y Adhesivos");
  const [bonifPorcentajeMasivo, setBonifPorcentajeMasivo] = useState("5.0");

  const handleAplicarBonificacionMasiva = () => {
    if (!isAdminGalpon) return;
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
      if (effectiveTenantId !== "all" && p.tenant_id !== effectiveTenantId) {
        return false;
      }

      const query = busqueda.toLowerCase().trim();
      const matchBusqueda =
        !query ||
        p.nombre.toLowerCase().includes(query) ||
        p.codigo_barras.includes(query) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        p.categoria.toLowerCase().includes(query);

      const matchCategoria = categoriaFiltro === "all" || p.categoria === categoriaFiltro;

      let matchEstadoRed = true;
      if (estadoRedFiltro === "publicados") {
        matchEstadoRed = p.publicado_en_red;
      } else if (estadoRedFiltro === "no_publicados") {
        matchEstadoRed = !p.publicado_en_red;
      } else if (estadoRedFiltro === "comprometidos") {
        matchEstadoRed = p.stock_comprometido > 0 || p.stock_disponible <= p.cantidad_minima;
      }

      return matchBusqueda && matchCategoria && matchEstadoRed;
    });
  }, [productos, effectiveTenantId, busqueda, categoriaFiltro, estadoRedFiltro]);

  // Métricas globales
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

    return {
      totalSkus,
      totalFisico,
      totalComprometido,
      totalApartadoRed,
      totalPublicados,
      valorInventario,
    };
  }, [productos, effectiveTenantId]);

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
      {/* 1. HEADER CORPORATIVO                                    */}
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
                Catálogo general de bodega, existencias físicas, listas de precios, bonificaciones y exposición a la Red VERTIA.
              </p>
            </div>
          </div>
        </div>

        {/* Tenant selector & Acciones */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isSuperAdmin ? (
            <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs shadow-2xs">
              <Building2 className="w-4 h-4 text-indigo-700 shrink-0" />
              <span className="font-semibold text-indigo-900">Bodega:</span>
              <select
                value={superAdminTenantFilter}
                onChange={(e) => setSuperAdminTenantFilter(e.target.value)}
                className="bg-white border border-indigo-200 rounded px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">🌐 Vista Consolidada (Todas las Bodegas)</option>
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
                Bodega: <strong className="text-slate-900">{tenant?.nombre || user?.tenant_nombre || "Bodega Central"}</strong>
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                {isAdminGalpon ? "Administrador" : "Consulta"}
              </span>
            </div>
          )}

          {isAdminGalpon && (
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
                onClick={() => abrirModalRecibir()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                <Truck className="w-4 h-4 mr-1.5" />
                Recibir Mercadería
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

      {/* Notificación Toast */}
      {mensajeExito && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TARJETAS DE RESUMEN OPERATIVO                         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Catálogo de Materiales</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metricas.totalSkus}</span>
            <span className="text-xs text-slate-500 font-medium">SKUs registrados</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{metricas.totalPublicados} expuestos en Red VERTIA</span>
          </div>
        </Card>

        <Card className="p-3.5 bg-white border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Stock Físico Bodega</span>
            <Warehouse className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metricas.totalFisico}</span>
            <span className="text-xs text-slate-500 font-medium">unidades contadas</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>{metricas.totalComprometido} unidades en órdenes activas</span>
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
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            Valuación a precio de lista mostrador
          </div>
        </Card>
      </div>

      {/* ======================================================== */}
      {/* 3. FILTROS Y BÚSQUEDA RÁPIDA                             */}
      {/* ======================================================== */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Pestañas de estado */}
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

        {/* Buscador y Categorías */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por material, SKU o código de barras..."
              className="pl-9 h-9 text-xs border-slate-200"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 w-full sm:w-auto"
            >
              <option value="all">Todas las Categorías</option>
              {categoriasDisponibles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. TABLA SIMPLIFICADA Y LEGIBLE (COLUMNAS ESENCIALES)    */}
      {/* ======================================================== */}
      <Card className="bg-white border-slate-200 shadow-xs overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Material / Insumo</th>
                {isSuperAdmin && effectiveTenantId === "all" && (
                  <th className="py-3 px-3">Bodega</th>
                )}
                <th className="py-3 px-4 text-center bg-slate-100/60 font-black text-slate-800">
                  Físico Real
                </th>
                <th className="py-3 px-4 text-center text-amber-700">Comprometido</th>
                <th className="py-3 px-4 text-center bg-emerald-50/50 font-bold text-emerald-800">
                  Disponible
                </th>
                <th className="py-3 px-4 text-right">Precio Base ($ MXN)</th>
                <th className="py-3 px-4 text-center">Estado Red VERTIA</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={isSuperAdmin && effectiveTenantId === "all" ? 8 : 7}
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

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Material / SKU / Rubro */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">{p.nombre}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                          <span className="font-mono bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">SKU:</span>
                            <span>{p.sku || p.codigo_barras}</span>
                          </span>
                          <span>•</span>
                          <span className="text-slate-500">{p.categoria}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{p.unidad_medida}</span>
                        </div>
                      </td>

                      {/* Corralón (Super Admin) */}
                      {isSuperAdmin && effectiveTenantId === "all" && (
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-[11px]">
                            <Building2 className="w-3 h-3" />
                            {getTenantName(p.tenant_id)}
                          </span>
                        </td>
                      )}

                      {/* Físico Real */}
                      <td className="py-3.5 px-4 text-center bg-slate-50/60">
                        <span className="font-black text-slate-900 text-sm">
                          {p.stock_real}
                        </span>{" "}
                        <span className="text-[10px] text-slate-500 font-bold">{p.unidad_medida}</span>
                      </td>

                      {/* Comprometido */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-amber-600 text-xs">
                          {p.stock_comprometido}
                        </span>{" "}
                        <span className="text-[10px] text-amber-700/70">{p.unidad_medida}</span>
                      </td>

                      {/* Disponible */}
                      <td className="py-3.5 px-4 text-center bg-emerald-50/30">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            className={`font-black text-sm ${
                              stockCritico ? "text-amber-600" : "text-emerald-700"
                            }`}
                          >
                            {p.stock_disponible}
                          </span>{" "}
                          <span className="text-[10px] text-emerald-800/70">{p.unidad_medida}</span>
                          {stockCritico && (
                            <span title="Stock por debajo del mínimo de seguridad">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Precio Base Mostrador */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-slate-900 text-xs">
                          ${pMostrador.toFixed(2)}
                        </span>{" "}
                        <span className="text-[10px] text-slate-400">MXN</span>
                      </td>

                      {/* Estado Red VERTIA */}
                      <td className="py-3.5 px-4 text-center">
                        {p.publicado_en_red ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              <span>Expuesto en Red</span>
                            </span>
                            <span className="text-[10px] text-indigo-700 font-bold mt-0.5">
                              ${pRed.toFixed(2)} MXN (-{bonif}%)
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <Lock className="w-2.5 h-2.5 text-slate-400" />
                            <span>Solo Mostrador</span>
                          </span>
                        )}
                      </td>

                      {/* Botón Administrar Material */}
                      <td className="py-3.5 px-4 text-center">
                        <Button
                          size="sm"
                          onClick={() => abrirAdministrarMaterial(p)}
                          className={`h-8 px-3 text-xs font-semibold shadow-2xs transition-all ${
                            isAdminGalpon
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {isAdminGalpon ? (
                            <>
                              <Settings className="w-3.5 h-3.5 mr-1.5" />
                              Administrar Material
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                              Ver Ficha Detallada
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ======================================================== */}
      {/* 5. POPUP UNIFICADO: ADMINISTRAR MATERIAL (FICHA COMPLETA) */}
      {/* ======================================================== */}
      {modalAdminAbierto && prodSeleccionado && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-slate-200 animate-in fade-in-50 zoom-in-95 my-8 overflow-hidden">
            {/* Cabecera del Popup */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-slate-900 text-base">
                      {isAdminGalpon ? "Administrar Material" : "Ficha Técnica del Material"}
                    </h2>
                    {isAdminGalpon ? (
                      <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-[10px] font-bold">
                        Modo Administrador
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-slate-600 font-bold bg-white">
                        Solo Lectura (Consulta)
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {prodSeleccionado.nombre} • SKU: <span className="font-mono text-slate-700 font-bold">{prodSeleccionado.sku || prodSeleccionado.codigo_barras}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalAdminAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aviso de permisos si no es admin */}
            {!isAdminGalpon && (
              <div className="bg-amber-50 border-b border-amber-200 px-5 py-2 text-xs text-amber-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Has ingresado en <strong>Modo Consulta</strong>. Como no posees rol de Administrador de Galpón, solo puedes visualizar los valores configurados sin alterarlos.
                </span>
              </div>
            )}

            {/* Formulario / Contenido de la Ficha */}
            <form onSubmit={handleGuardarAdministracion} className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
              {/* BLOQUE 1: EXPOSICIÓN A LA RED VERTIA */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-sm">Exposición en Red VERTIA</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isAdminGalpon}
                      checked={formPublicadoRed}
                      onChange={(e) => setFormPublicadoRed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <p className="text-[11px] text-slate-600">
                  {formPublicadoRed
                    ? "Este material está publicado y disponible para el ruteo automático de pedidos de obras y constructoras a través de VERTIA con cobro asegurado 100% Escrow."
                    : "Pausado: Este material se mantiene exclusivamente para venta presencial en el mostrador de tu bodega (no cotiza en la red)."
                  }
                </p>

                {formPublicadoRed && (
                  <div className="pt-2 border-t border-indigo-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Modo de Asignación de Cupo</label>
                      <select
                        disabled={!isAdminGalpon}
                        value={formModoCupo}
                        onChange={(e) => setFormModoCupo(e.target.value as "automatico" | "cupo_manual")}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-800 disabled:bg-slate-100"
                      >
                        <option value="automatico">100% Automático (Todo el saldo libre)</option>
                        <option value="cupo_manual">Cupo Manual Fijo (Tope máximo)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Apartado para Red VERTIA ({formUnidad})
                      </label>
                      <Input
                        type="number"
                        disabled={!isAdminGalpon || formModoCupo === "automatico"}
                        value={formModoCupo === "automatico" ? Math.max(0, formStockReal - prodSeleccionado.stock_comprometido) : formCupoManual}
                        onChange={(e) => setFormCupoManual(Number(e.target.value) || 0)}
                        className="h-8 text-xs font-bold bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* BLOQUE 2: PRECIOS, LISTAS & BONIFICACIONES */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-900 text-sm">Esquema de Precios y Listas</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="font-semibold text-slate-700 block text-xs h-7 flex items-end pb-1">
                      1. Precio Regular Mostrador
                    </label>
                    <div className="relative h-9">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">$</span>
                      <Input
                        type="number"
                        step="0.5"
                        disabled={!isAdminGalpon}
                        value={formPrecioMostrador}
                        onChange={(e) => handleCambioPrecioMostrador(Number(e.target.value) || 0)}
                        className="pl-6 pr-12 h-9 text-xs font-black text-slate-900 bg-white border-slate-200"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">MXN</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block text-xs h-7 flex items-end pb-1">
                      2. Lista Asignada para Red
                    </label>
                    <div className="h-9">
                      <select
                        disabled={!isAdminGalpon}
                        value={formListaActiva}
                        onChange={(e) => {
                          const lista = e.target.value as TipoListaPrecio;
                          setFormListaActiva(lista);
                          if (lista === "mostrador") {
                            setFormBonificacion(0);
                            setFormPrecioRed(formPrecioMostrador);
                          } else if (lista === "contratista") {
                            setFormBonificacion(4.0);
                            setFormPrecioRed(Math.round(formPrecioMostrador * 0.96 * 100) / 100);
                          } else {
                            setFormBonificacion(5.0);
                            setFormPrecioRed(Math.round(formPrecioMostrador * 0.95 * 100) / 100);
                          }
                        }}
                        className="w-full h-9 bg-white border border-slate-200 rounded-lg px-2 text-xs font-semibold text-slate-800 disabled:bg-slate-100 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="red_vertia">Red VERTIA (Escrow)</option>
                        <option value="contratista">Contratistas (~4%)</option>
                        <option value="mostrador">Mostrador Base (0%)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block text-xs h-7 flex items-end pb-1">
                      3. Bonificación a la Red
                    </label>
                    <div className="relative h-9">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="50"
                        disabled={!isAdminGalpon}
                        value={formBonificacion}
                        onChange={(e) => handleCambioBonificacion(Number(e.target.value) || 0)}
                        className="pr-7 pl-3 h-9 text-xs font-bold text-slate-900 bg-white border-slate-200 text-right"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                </div>

                {/* Precio Neto Red VERTIA */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-950 text-xs block">
                      Precio Neto Cotizado en Red VERTIA ($ MXN):
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Importe oficial que se liquida a la cuenta del corralón al entregar en obra.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-indigo-600 text-sm">$</span>
                    <Input
                      type="number"
                      step="0.5"
                      disabled={!isAdminGalpon}
                      value={formPrecioRed}
                      onChange={(e) => handleCambioPrecioRedDirecto(Number(e.target.value) || 0)}
                      className="w-28 h-8 font-black text-sm text-indigo-900 bg-white border-indigo-200 text-right pr-2"
                    />
                    <span className="text-[10px] font-bold text-slate-400">MXN</span>
                  </div>
                </div>
              </div>

              {/* BLOQUE 3: CONTROL DE STOCK & UMBRALES */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Warehouse className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-900 text-sm">Control de Stock & Alertas</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="font-semibold text-slate-700 block text-xs h-7 flex items-end pb-1">
                      Stock Físico Real en Bodega
                    </label>
                    <div className="relative h-9">
                      <Input
                        type="number"
                        disabled={!isAdminGalpon}
                        value={formStockReal}
                        onChange={(e) => setFormStockReal(Number(e.target.value) || 0)}
                        className="pr-10 pl-3 h-9 text-xs font-black text-slate-900 bg-white border-slate-200"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-[10px] uppercase">
                        {formUnidad}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block text-xs h-7 flex items-end pb-1">
                      Stock Comprometido (Órdenes)
                    </label>
                    <div className="relative h-9 flex items-center justify-between px-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 font-bold text-xs">
                      <span>{prodSeleccionado.stock_comprometido}</span>
                      <span className="text-[10px] text-amber-700/80 uppercase">{formUnidad}</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block text-xs h-7 flex items-end pb-1">
                      Alerta Stock Mínimo (Reposición)
                    </label>
                    <div className="relative h-9">
                      <Input
                        type="number"
                        disabled={!isAdminGalpon}
                        value={formStockMinimo}
                        onChange={(e) => setFormStockMinimo(Number(e.target.value) || 0)}
                        className="pr-10 pl-3 h-9 text-xs font-bold text-slate-900 bg-white border-slate-200"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-[10px] uppercase">
                        {formUnidad}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acción rápida: Recibir descarga de este material */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 p-2.5 rounded-lg">
                  <div className="text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800">¿Llegó un camión con este material a bodega?</span>
                    <p className="text-[10px] text-slate-500">Registra la remisión del proveedor en el pulmón de recepción o a stock físico.</p>
                  </div>
                  {isAdminGalpon && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setModalAdminAbierto(false);
                        abrirModalRecibir(prodSeleccionado);
                      }}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shrink-0 shadow-2xs"
                    >
                      <Truck className="w-3.5 h-3.5 mr-1.5" />
                      + Recibir Entrega de este Material
                    </Button>
                  )}
                </div>
              </div>

              {/* BLOQUE 4: DISTRIBUCIÓN EN EL ALMACÉN (WMS MULTI-UBICACIÓN) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-900 text-sm">Distribución en la Bodega (WMS)</span>
                </div>

                <p className="text-[11px] text-slate-500">
                  Este material puede estar distribuido en distintas áreas operativas de la bodega (recepción, racks o embarque):
                </p>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-amber-100 text-amber-800">
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 block text-xs">Zona de Recepción / Entrada</span>
                        <span className="text-[10px] text-slate-500">Bahía de Descarga Oeste • Pallet en verificación de remito</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-700 text-xs">
                      {Math.round(prodSeleccionado.stock_real * 0.15)} {formUnidad}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-indigo-100 text-indigo-800">
                        <Layers className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="font-bold text-indigo-950 block text-xs">
                          Almacenamiento Activo 2D (Racks / Bahías)
                        </span>
                        <span className="text-[10px] text-indigo-700">
                          {prodSeleccionado.ubicacion_estanteria || "Pasillo A • Rack 01 • Nivel 1"}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-indigo-900 text-xs">
                      {Math.round(prodSeleccionado.stock_real * 0.70)} {formUnidad}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-emerald-100 text-emerald-800">
                        <ArrowUpFromLine className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 block text-xs">Muelle de Embarque / Salida</span>
                        <span className="text-[10px] text-slate-500">Bahía de Expedición • Preparado para camión con remito QR</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-700 text-xs">
                      {Math.round(prodSeleccionado.stock_real * 0.15)} {formUnidad}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de Acción al pie del modal */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalAdminAbierto(false)}
                  className="text-xs"
                >
                  Cerrar
                </Button>

                {isAdminGalpon && (
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Guardar Cambios del Material
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL: ADMINISTRADOR MAESTRO DE LISTAS & BONIFICACIONES */}
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
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block text-xs">Listas Comerciales Configuradas:</span>

                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 block">1. Lista Mostrador / Pública</span>
                    <span className="text-[10px] text-slate-500">
                      Precio regular base de venta al público en general. 0% de bonificación.
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold">Base (0%)</Badge>
                </div>

                <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/30 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-blue-900 block">2. Lista Contratistas & Obra</span>
                    <span className="text-[10px] text-slate-500">
                      Bonificación pactada para constructoras y contratistas frecuentes.
                    </span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] font-bold">~4% a 5%</Badge>
                </div>

                <div className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-indigo-900 block">3. Lista Red VERTIA (B2B Escrow)</span>
                    <span className="text-[10px] text-slate-500">
                      Precio preferencial para pedidos ruteados con 100% de garantía de pago protegida por VERTIA.
                    </span>
                  </div>
                  <Badge className="bg-indigo-600 text-white text-[10px] font-bold">Bonificación Preferencial</Badge>
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
                  disabled={!isAdminGalpon}
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
      {/* 7. MODAL: REGISTRAR NUEVO MATERIAL                       */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      {/* ======================================================== */}
      {/* 8. MODAL: RECIBIR MERCADERÍA / DESCARGA DE PROVEEDOR     */}
      {/* ======================================================== */}
      {modalRecibirAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border-slate-200 animate-in fade-in-50 zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Recepción de Mercadería & Descarga
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Registra la llegada de material por camión de proveedor con remisión oficial.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalRecibirAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmarRecepcion} className="space-y-4 text-xs">
              {/* Selector de Material */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Material a Recibir *
                </label>
                <select
                  value={recibirProdId}
                  onChange={(e) => {
                    setRecibirProdId(e.target.value);
                    const sel = productos.find((p) => p.id === e.target.value);
                    if (sel) {
                      setRecibirProveedor(
                        sel.nombre.includes("Cruz Azul")
                          ? "Cooperativa La Cruz Azul S.C.L."
                          : sel.nombre.includes("Cal")
                          ? "Grupo Calidra S.A. de C.V."
                          : sel.nombre.includes("Varilla")
                          ? "Deacero S.A.P.I. de C.V."
                          : "Proveedor de Materiales"
                      );
                    }
                  }}
                  className="w-full h-9 bg-white border border-slate-200 rounded-lg px-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} (SKU: {p.sku || p.codigo_barras}) — Stock actual: {p.stock_real} {p.unidad_medida}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proveedor y Remisión */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Proveedor / Fabricante *
                  </label>
                  <Input
                    required
                    value={recibirProveedor}
                    onChange={(e) => setRecibirProveedor(e.target.value)}
                    placeholder="ej: Cooperativa La Cruz Azul"
                    className="h-9 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    No. Remisión / Factura *
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <Input
                      required
                      value={recibirRemito}
                      onChange={(e) => setRecibirRemito(e.target.value)}
                      placeholder="REM-2026-9810"
                      className="pl-9 h-9 text-xs font-mono font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Cantidad y Lote */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Cantidad a Descargar *
                  </label>
                  <div className="relative">
                    <Input
                      required
                      type="number"
                      min="1"
                      value={recibirCantidad}
                      onChange={(e) => setRecibirCantidad(e.target.value)}
                      className="pr-14 h-9 text-xs font-bold text-slate-900"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                      {productos.find((p) => p.id === recibirProdId)?.unidad_medida || "UN"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Lote / Partida de Fabricación
                  </label>
                  <Input
                    value={recibirLote}
                    onChange={(e) => setRecibirLote(e.target.value)}
                    placeholder="LOTE-2026-402"
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Destino Operativo (WMS Buffer vs Stock Directo) */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="font-semibold text-slate-800 block">
                  Destino del Material en la Bodega
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setRecibirDestino("pulmon")}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      recibirDestino === "pulmon"
                        ? "border-emerald-500 bg-emerald-50/40 text-emerald-950 shadow-2xs"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      <ArrowDownToLine className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Pulmón de Entrada / Descarga</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      <strong>Recomendado WMS:</strong> La carga queda en el muelle de descarga para que el montacarguista realice el <strong>Slotting 2D</strong> hacia los racks y pasillos.
                    </p>
                  </div>

                  <div
                    onClick={() => setRecibirDestino("directo")}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      recibirDestino === "directo"
                        ? "border-indigo-500 bg-indigo-50/40 text-indigo-950 shadow-2xs"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      <Warehouse className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Ingreso Directo a Stock Físico</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Suma inmediatamente la cantidad al <strong>stock físico real</strong> de la bodega sin pasar por el buffer de acomodo previo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalRecibirAbierto(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  <Truck className="w-4 h-4 mr-1.5" />
                  Confirmar Recepción de Mercadería
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
