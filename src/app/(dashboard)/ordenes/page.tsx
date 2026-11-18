"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  PackageCheck,
  AlertTriangle,
  Globe2,
  Warehouse,
  Barcode,
  MessageSquare,
  ShieldCheck,
  Truck,
  Send,
  X,
  MapPin,
  Building2,
  Filter,
  FileText,
  Printer,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  MOCK_ORDENES,
  MultiTenantOrden,
  MOCK_TENANTS,
} from "@/lib/data/mock-multi-tenant";
import { ordenesService } from "@/lib/services/ordenes.service";
import { productosService } from "@/lib/services/productos.service";
import {
  saveStoredEmbarque,
  updateStoredEmbarque,
  getStoredOrdenes,
} from "@/lib/services/mock-store";
import { PickingModal, PickingSummary } from "@/components/orders/PickingModal";
import { RemitoPdfModal } from "@/components/orders/RemitoPdfModal";

export default function OrdenesPage() {
  const { user, tenant, allTenants } = useAuth();
  const isSuperAdmin = user?.is_super_admin ?? false;

  const [superAdminTenantFilter, setSuperAdminTenantFilter] = useState<string>("all");
  const [solicitudes, setSolicitudes] = useState<MultiTenantOrden[]>(MOCK_ORDENES);
  const [solicitudActivaId, setSolicitudActivaId] = useState<string>("");

  // Modales
  const [modalChatAbierto, setModalChatAbierto] = useState(false);
  const [modalNuevaOrden, setModalNuevaOrden] = useState(false);
  const [modalPickingAbierto, setModalPickingAbierto] = useState(false);
  const [modalRemitoAbierto, setModalRemitoAbierto] = useState(false);
  const [despachando, setDespachando] = useState(false);

  // Notificación Toast
  const [toastNotificacion, setToastNotificacion] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  const mostrarToast = (message: string, type: "success" | "info" = "success") => {
    setToastNotificacion({ message, type });
    setTimeout(() => {
      setToastNotificacion(null);
    }, 5000);
  };

  const [mensajesChat, setMensajesChat] = useState<{ remitente: string; texto: string; hora: string }[]>([
    {
      remitente: "Operador VERTIA",
      texto:
        "Hola Corralón. Notamos que la orden requiere más cantidad que el stock disponible marcado en la red, pero cuentan con stock físico real en su galpón. ¿Podrían autorizar extenderse de su inventario físico para completar el pedido?",
      hora: "10:18 hs",
    },
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [extensionConfirmada, setExtensionConfirmada] = useState(false);

  // Form nueva orden
  const [nuevoFolio, setNuevoFolio] = useState(`VT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [nuevoCliente, setNuevoCliente] = useState("");
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  const [nuevoMaterial, setNuevoMaterial] = useState("Cemento Loma Negra 50kg (Bolsa)");
  const [nuevaCantidad, setNuevaCantidad] = useState("50");

  // Effective tenant ID
  const effectiveTenantId = useMemo(() => {
    if (isSuperAdmin) {
      return superAdminTenantFilter;
    }
    return user?.tenant_id || "tenant-los-pinos";
  }, [isSuperAdmin, superAdminTenantFilter, user?.tenant_id]);

  // Sincronizar órdenes desde el servicio híbrido al montar o cambiar filtro
  useEffect(() => {
    async function cargarOrdenes() {
      try {
        const ords = await ordenesService.getOrdenes(effectiveTenantId, isSuperAdmin);
        if (ords && ords.length > 0) {
          setSolicitudes(ords);
        }
      } catch {
        // Fallback transparente a datos de memoria
      }
    }
    cargarOrdenes();
  }, [effectiveTenantId, isSuperAdmin]);

  // Filtered orders by tenant
  const solicitudesFiltradas = useMemo(() => {
    if (effectiveTenantId === "all") {
      return solicitudes;
    }
    return solicitudes.filter((s) => s.tenant_id === effectiveTenantId);
  }, [solicitudes, effectiveTenantId]);

  // Keep active order valid
  useEffect(() => {
    if (solicitudesFiltradas.length > 0) {
      const stillValid = solicitudesFiltradas.some((s) => s.id === solicitudActivaId);
      if (!stillValid) {
        setSolicitudActivaId(solicitudesFiltradas[0].id);
      }
    } else {
      setSolicitudActivaId("");
    }
  }, [solicitudesFiltradas, solicitudActivaId]);

  const solicitudActiva = useMemo(() => {
    return solicitudesFiltradas.find((s) => s.id === solicitudActivaId) || solicitudesFiltradas[0];
  }, [solicitudesFiltradas, solicitudActivaId]);

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;
    setMensajesChat((prev) => [
      ...prev,
      { remitente: `${user?.nombre_completo || "Usuario"} (Plataforma)`, texto: nuevoMensaje, hora: "Ahora" },
    ]);
    setNuevoMensaje("");
  };

  const autorizarExtensionCorralon = () => {
    if (!solicitudActiva) return;

    const nombreEmisor = user?.nombre_completo || "Administrador Corralón";

    setMensajesChat((prev) => [
      ...prev,
      {
        remitente: `${solicitudActiva.corralonAsignado} (${nombreEmisor})`,
        texto:
          "¡Confirmado! Revisamos el galpón y autorizamos liberar las unidades necesarias de nuestro stock físico de seguridad para cubrir la orden al 100%. Ya generamos la orden de carga.",
        hora: "Ahora",
      },
    ]);

    setSolicitudes((prev) =>
      prev.map((s) => {
        if (s.id === solicitudActiva.id) {
          return {
            ...s,
            estado: "En preparación",
            detalles: s.detalles.map((d) => ({
              ...d,
              cantidadAutorizadaExtension: Math.max(0, d.cantidadSolicitada - d.cantidadDisponibleCorralon),
              estadoItem: "Extensión autorizada",
            })),
          };
        }
        return s;
      })
    );

    setExtensionConfirmada(true);
    mostrarToast("Extensión de stock autorizada. La orden está lista para el picking.", "success");
  };

  const handleCrearOrden = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCliente || !nuevoProyecto) return;

    const targetTenant = effectiveTenantId === "all" ? "tenant-los-pinos" : effectiveTenantId;
    const targetTenantObj = allTenants.find((t) => t.id === targetTenant) || MOCK_TENANTS.find((t) => t.id === targetTenant);

    const cant = Number(nuevaCantidad) || 10;

    const nuevaSol: MultiTenantOrden = {
      id: `ord-${Date.now()}`,
      tenant_id: targetTenant,
      folio: nuevoFolio,
      tipo: "Material",
      proyectoUbicacion: nuevoProyecto,
      cliente: nuevoCliente,
      corralonAsignado: targetTenantObj?.nombre || "Corralón Asignado",
      fecha: "Recién",
      estado: "Asignada",
      distanciaKm: 5.5,
      detalles: [
        {
          id: `det-${Date.now()}`,
          material: nuevoMaterial,
          codigo: "7791234567890",
          cantidadSolicitada: cant,
          cantidadDisponibleCorralon: cant,
          stockRealFisico: cant * 2,
          cantidadAutorizadaExtension: 0,
          unidad: "UN",
          estadoItem: "Completo",
        },
      ],
    };

    setSolicitudes([nuevaSol, ...solicitudes]);
    setSolicitudActivaId(nuevaSol.id);
    setModalNuevaOrden(false);
    setNuevoCliente("");
    setNuevoProyecto("");
    setNuevoFolio(`VT-${Math.floor(1000 + Math.random() * 9000)}`);
    mostrarToast(`Solicitud ${nuevaSol.folio} creada y asignada con éxito.`, "success");
  };

  // ==========================================
  // COMPLETAR PICKING Y TRASLADAR A EMBARQUE
  // ==========================================
  const handleCompletarPicking = async (orderId: string, summary: PickingSummary) => {
    if (!solicitudActiva) return;

    const digits = solicitudActiva.folio.replace(/\D/g, "");
    const sufijo = digits ? digits.padStart(8, "0") : "00004921";
    const remitoOficial = `R-0001-${sufijo}`;

    const chofer = "Ramón González";
    const dniChofer = "28.491.802";
    const vehiculo = "Mercedes-Benz 1634 Chasis con Cabina";
    const patente = "AB-492-CD";

    // 1. Crear / Registrar ítem en Pulmón de Salida (Zona de Embarque)
    saveStoredEmbarque({
      id: `emb-${solicitudActiva.id}`,
      almacen_id: "alm-pinos-central",
      tenant_id: solicitudActiva.tenant_id,
      folio: solicitudActiva.folio,
      cliente: solicitudActiva.cliente,
      destino_obra: solicitudActiva.proyectoUbicacion,
      chofer_asignado: `${chofer} (${vehiculo} - Dominio ${patente})`,
      bultos: summary.totalBultos,
      peso_kg: summary.totalPesoKg,
      hora_limite_salida: "16:30 hs",
      estado: "Listo para cargar",
      items_resumen: `${summary.totalBultos} bultos (${solicitudActiva.detalles
        .map((d) => `${d.cantidadSolicitada} ${d.unidad} ${d.material}`)
        .join(", ")})`,
      muelle_embarque: summary.muelleSalida,
      prioridad: "alta",
      remito_numero: remitoOficial,
      fecha_hora_preparado: "Hoy, hace instantes",
    });

    // 2. Persistir actualización de orden a 'En preparación' con datos de remito
    try {
      await ordenesService.actualizarOrden(orderId, {
        estado: "En preparación",
        remito_numero: remitoOficial,
        chofer_asignado: chofer,
        dni_chofer: dniChofer,
        vehiculo_asignado: vehiculo,
        patente_asignada: patente,
        zona_embarque: summary.muelleSalida,
      });
    } catch {
      // Continuar con actualización en memoria
    }

    // 3. Actualizar estado local
    setSolicitudes((prev) =>
      prev.map((s) => {
        if (s.id === orderId) {
          return {
            ...s,
            estado: "En preparación",
            remito_numero: remitoOficial,
            chofer_asignado: chofer,
            dni_chofer: dniChofer,
            vehiculo_asignado: vehiculo,
            patente_asignada: patente,
            zona_embarque: summary.muelleSalida,
          };
        }
        return s;
      })
    );

    mostrarToast(
      `¡Picking completado! ${summary.totalBultos} bultos trasladados a Pulmón de Salida (${summary.muelleSalida}). Remito ${remitoOficial} generado.`,
      "success"
    );
  };

  // ==========================================
  // CONFIRMAR DESPACHO / SALIDA DE CAMIÓN
  // ==========================================
  const handleConfirmarDespacho = async () => {
    if (!solicitudActiva || despachando) return;

    setDespachando(true);

    try {
      // 1. Descontar simultáneamente el Stock Real y liberar el Stock Comprometido
      // Invocando updateStock de ProductosService
      const tenantProds = await productosService.getProductos(solicitudActiva.tenant_id);

      for (const det of solicitudActiva.detalles) {
        const matchingProd = tenantProds.find(
          (p) =>
            p.codigo_barras === det.codigo ||
            p.nombre.toLowerCase().includes(det.material.toLowerCase())
        );

        if (matchingProd) {
          const qty = det.cantidadSolicitada;
          const newStockReal = Math.max(0, matchingProd.stock_real - qty);
          const newStockComprometido = Math.max(0, matchingProd.stock_comprometido - qty);

          await productosService.updateStock(matchingProd.id, newStockReal, newStockComprometido);
        }
      }

      // 2. Avanzar el estado de la orden a 'En camino' / 'Despachada'
      await ordenesService.actualizarEstadoOrden(solicitudActiva.id, "En camino");

      // 3. Actualizar el estado del embarque en el muelle de expedición
      updateStoredEmbarque(solicitudActiva.folio, { estado: "Despachado" });

      // 4. Actualizar el estado en el componente
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === solicitudActiva.id ? { ...s, estado: "En camino" } : s))
      );

      mostrarToast(
        `¡Despacho Confirmado! Camión en camino hacia la obra. Stock Real descontado y Stock Comprometido liberado en galpón.`,
        "success"
      );
    } catch (err) {
      console.error("Error al despachar orden:", err);
      mostrarToast("Ocurrió un error al procesar el despacho.", "info");
    } finally {
      setDespachando(false);
    }
  };

  const getStatusBadge = (estado: MultiTenantOrden["estado"]) => {
    switch (estado) {
      case "Asignada":
        return (
          <Badge className="text-[10px] font-semibold bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Asignada
          </Badge>
        );
      case "En preparación":
        return (
          <Badge className="text-[10px] font-semibold bg-amber-50 text-amber-800 border-amber-300">
            <PackageCheck className="w-3 h-3 mr-1 text-amber-600" />
            En Embarque (Listo)
          </Badge>
        );
      case "En camino":
        return (
          <Badge className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border-emerald-300">
            <Truck className="w-3 h-3 mr-1 text-emerald-600" />
            En Camino (Despachada)
          </Badge>
        );
      case "Entregada":
        return (
          <Badge className="text-[10px] font-semibold bg-slate-100 text-slate-700 border-slate-300">
            <CheckCircle2 className="w-3 h-3 mr-1 text-slate-500" />
            Entregada
          </Badge>
        );
      case "Por cotizar":
      default:
        return (
          <Badge className="text-[10px] font-semibold bg-purple-50 text-purple-700 border-purple-200">
            Por cotizar
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification Flotante */}
      {toastNotificacion && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`p-4 rounded-xl shadow-xl border flex items-center gap-3 text-xs font-semibold ${
              toastNotificacion.type === "success"
                ? "bg-slate-900 text-white border-slate-800"
                : "bg-indigo-900 text-white border-indigo-800"
            }`}
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span>{toastNotificacion.message}</span>
            <button
              onClick={() => setToastNotificacion(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Flujo Operativo de Órdenes, Picking & Despacho
              </h1>
              <p className="text-xs text-slate-500">
                Gestión de pedidos, recolección guiada por celda WMS, traslado a zona de embarque y remitos oficiales.
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
            onClick={() => setModalNuevaOrden(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nueva Solicitud de Material
          </Button>
        </div>
      </div>

      {/* Grid de Solicitudes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Lista de Solicitudes (5 columnas) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Solicitudes Recibidas (Vistas Proveedor & Red)
            </h3>
            <span className="text-[11px] font-semibold text-indigo-600">
              {solicitudesFiltradas.length} pedidos
            </span>
          </div>

          <div className="space-y-2.5">
            {solicitudesFiltradas.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200 text-xs">
                No hay órdenes registradas para el corralón seleccionado.
              </div>
            ) : (
              solicitudesFiltradas.map((sol) => {
                const esActivo = sol.id === solicitudActiva?.id;
                return (
                  <button
                    key={sol.id}
                    onClick={() => setSolicitudActivaId(sol.id)}
                    className={`w-full p-4 rounded-xl text-left border transition-all ${
                      esActivo
                        ? "bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {sol.folio}
                      </span>
                      {getStatusBadge(sol.estado)}
                    </div>

                    <div className="font-semibold text-slate-800 text-xs line-clamp-1">
                      {sol.detalles[0]?.material}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 truncate max-w-[170px]">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{sol.corralonAsignado}</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <MapPin className="w-3 h-3 text-indigo-600" />
                        {sol.distanciaKm} km
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Columna Derecha: Detalle de Solicitud, Picking, Embarque y Despacho (7 columnas) */}
        <div className="lg:col-span-7 space-y-4">
          {solicitudActiva ? (
            <Card className="bg-white border-slate-200 shadow-sm p-5 rounded-xl space-y-5">
              {/* Header de la Orden Seleccionada */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900 font-mono">
                      {solicitudActiva.folio}
                    </span>
                    <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-600">
                      {solicitudActiva.tipo}
                    </Badge>
                    {getStatusBadge(solicitudActiva.estado)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Cliente: <strong className="text-slate-800">{solicitudActiva.cliente}</strong> • Obra: {solicitudActiva.proyectoUbicacion}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Corralón Asignado</span>
                  <span className="text-xs font-bold text-slate-800">
                    {solicitudActiva.corralonAsignado}
                  </span>
                </div>
              </div>

              {/* BANNER ESTACIONAL: ZONA DE EMBARQUE (Si la orden está En preparación o En camino) */}
              {solicitudActiva.estado === "En preparación" && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <PackageCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Mercadería Preparada en Pulmón de Salida (Zona de Embarque)</span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] font-semibold">
                      Listo para Cargar
                    </Badge>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    El picking guiado fue completado con éxito. Los bultos se encuentran en el{" "}
                    <strong>{solicitudActiva.zona_embarque || "Muelle Salida 1 - Grúa Autopropulsada"}</strong>.
                    El remito oficial <strong>{solicitudActiva.remito_numero || "R-0001-00004921"}</strong> ya fue generado y está listo para ser firmado por el chofer.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <Button
                      onClick={() => setModalRemitoAbierto(true)}
                      variant="outline"
                      size="sm"
                      className="bg-white text-xs border-amber-300 text-amber-900 hover:bg-amber-100 font-semibold h-8"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1 text-amber-700" />
                      Ver Remito de Entrega Oficial
                    </Button>
                    <Button
                      disabled={despachando}
                      onClick={handleConfirmarDespacho}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5 mr-1.5" />
                      {despachando ? "Procesando salida..." : "Confirmar Despacho / Salida de Camión"}
                    </Button>
                  </div>
                </div>
              )}

              {/* BANNER EN CAMINO (Despacho completado) */}
              {solicitudActiva.estado === "En camino" && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Orden Despachada — En Tránsito hacia la Obra</span>
                    </div>
                    <Badge className="bg-emerald-600 text-white border-transparent text-[10px] font-bold">
                      Stock Descontado
                    </Badge>
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    El transporte ya partió del corralón hacia <strong>{solicitudActiva.proyectoUbicacion}</strong>.
                    El stock físico real fue descontado y el stock comprometido fue liberado en el inventario.
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <Button
                      onClick={() => setModalRemitoAbierto(true)}
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold h-8 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1.5" />
                      Imprimir / Descargar Remito de Entrega
                    </Button>
                  </div>
                </div>
              )}

              {/* Listado de Materiales y Comparativa Real vs Disponible */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Desglose de Materiales & Cobertura de Stock
                  </h4>
                  {solicitudActiva.estado === "Asignada" && (
                    <Button
                      onClick={() => setModalPickingAbierto(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-7 px-3 shadow-2xs"
                    >
                      <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
                      Iniciar Picking Guiado
                    </Button>
                  )}
                </div>

                {solicitudActiva.detalles.map((det) => {
                  const necesitaExtension =
                    det.cantidadSolicitada > det.cantidadDisponibleCorralon &&
                    det.cantidadAutorizadaExtension === 0;

                  return (
                    <div
                      key={det.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{det.material}</div>
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Barcode className="w-3.5 h-3.5" />
                            {det.codigo}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-500 block">Requerido por Obra</span>
                          <span className="text-base font-black text-slate-900">
                            {det.cantidadSolicitada} {det.unidad}
                          </span>
                        </div>
                      </div>

                      {/* Comparativa de Stock del Corralón */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Stock Disponible (Venta)</span>
                          <span className="font-extrabold text-slate-800 text-sm">
                            {det.cantidadDisponibleCorralon} {det.unidad}
                          </span>
                        </div>

                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Stock Real (Físico Galpón)</span>
                          <span className="font-extrabold text-indigo-700 text-sm">
                            {det.stockRealFisico} {det.unidad}
                          </span>
                        </div>

                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Estado Cobertura</span>
                          <span
                            className={`font-bold text-xs ${
                              det.estadoItem === "Extensión autorizada"
                                ? "text-emerald-700"
                                : necesitaExtension
                                ? "text-amber-700"
                                : "text-slate-700"
                            }`}
                          >
                            {det.estadoItem}
                          </span>
                        </div>
                      </div>

                      {/* Banner de Negociación si falta stock disponible pero hay stock real físico */}
                      {necesitaExtension && (
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-2">
                          <div className="flex items-center gap-2 text-amber-900 font-bold">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              Stock disponible insuficiente para cubrir las {det.cantidadSolicitada} {det.unidad} (+{det.cantidadSolicitada - det.cantidadDisponibleCorralon} faltantes)
                            </span>
                          </div>
                          <p className="text-amber-800 text-[11px] leading-relaxed">
                            El corralón cuenta con <strong>{det.stockRealFisico} {det.unidad} en stock físico real</strong> en su galpón.
                            Puedes abrir un canal directo de mensajería para solicitar que autorice liberar {det.cantidadSolicitada - det.cantidadDisponibleCorralon} {det.unidad}.
                          </p>
                          <Button
                            onClick={() => setModalChatAbierto(true)}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2 shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                            Negociar Extensión de Stock con Corralón
                          </Button>
                        </div>
                      )}

                      {det.estadoItem === "Extensión autorizada" && (
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between text-emerald-800 font-medium">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Extensión de {det.cantidadAutorizadaExtension} {det.unidad} autorizada por el corralón. Pedido 100% cubierto.
                          </span>
                          <Button
                            onClick={() => setModalChatAbierto(true)}
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                          >
                            Ver Chat & Registro
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Acciones Finales */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Radio logístico: <strong className="text-slate-800">{solicitudActiva.distanciaKm} km</strong> de distancia.
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={() => setModalChatAbierto(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs border-slate-200 text-slate-700"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Mensajería
                  </Button>

                  {/* Botón Ver Remito */}
                  <Button
                    onClick={() => setModalRemitoAbierto(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs border-slate-300 text-slate-800 font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Ver Remito de Entrega
                  </Button>

                  {/* Botón Iniciar Picking (si Asignada) */}
                  {solicitudActiva.estado === "Asignada" && (
                    <Button
                      onClick={() => setModalPickingAbierto(true)}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                    >
                      <PackageCheck className="w-3.5 h-3.5 mr-1" />
                      Iniciar Picking
                    </Button>
                  )}

                  {/* Botón Confirmar Despacho (si En preparación) */}
                  {solicitudActiva.estado === "En preparación" && (
                    <Button
                      disabled={despachando}
                      onClick={handleConfirmarDespacho}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5 mr-1" />
                      {despachando ? "Despachando..." : "Confirmar Despacho / Salida Camión"}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 bg-white border-slate-200 text-xs">
              Seleccione una orden para ver su desglose.
            </Card>
          )}
        </div>
      </div>

      {/* Modal Guiado de Picking para Operarios de Depósito */}
      {solicitudActiva && (
        <PickingModal
          isOpen={modalPickingAbierto}
          onClose={() => setModalPickingAbierto(false)}
          order={solicitudActiva}
          onCompletePicking={handleCompletarPicking}
        />
      )}

      {/* Modal Oficial de Remito de Entrega / Despacho en PDF */}
      {solicitudActiva && (
        <RemitoPdfModal
          isOpen={modalRemitoAbierto}
          onClose={() => setModalRemitoAbierto(false)}
          order={solicitudActiva}
          transportInfo={{
            chofer: solicitudActiva.chofer_asignado || "Ramón González",
            dni: solicitudActiva.dni_chofer || "28.491.802",
            vehiculo: solicitudActiva.vehiculo_asignado || "Mercedes-Benz 1634 Chasis con Cabina",
            patente: solicitudActiva.patente_asignada || "AB-492-CD",
            muelle: solicitudActiva.zona_embarque || "Muelle Salida 1 - Grúa Autopropulsada",
          }}
        />
      )}

      {/* Modal Interactivo de Chat & Negociación de Extensión de Stock */}
      {modalChatAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="bg-white border-slate-200 shadow-xl max-w-xl w-full p-5 space-y-4 rounded-xl flex flex-col max-h-[90vh]">
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Canal Directo de Negociación de Stock — {solicitudActiva?.folio}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Diálogo en tiempo real entre VERTIA y el Corralón {solicitudActiva?.corralonAsignado}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalChatAbierto(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mensajes del Chat */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-lg bg-slate-50/70 border border-slate-100 min-h-[220px] max-h-[350px]">
              {mensajesChat.map((m, i) => (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span>{m.remitente}</span>
                    <span className="text-[10px] font-normal text-slate-400">{m.hora}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 leading-relaxed shadow-2xs">
                    {m.texto}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón Acción Rápida del Corralón */}
            {!extensionConfirmada && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-amber-900 block">Acción Operativa del Corralón:</span>
                  <span className="text-amber-800 text-[11px]">
                    ¿Liberar unidades del stock físico para cubrir la orden?
                  </span>
                </div>
                <Button
                  onClick={autorizarExtensionCorralon}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Autorizar Extensión Físico
                </Button>
              </div>
            )}

            {/* Input para responder */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <Input
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
                placeholder="Escribe un mensaje al corralón..."
                className="text-xs h-9"
              />
              <Button onClick={enviarMensaje} className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Nueva Orden */}
      {modalNuevaOrden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 w-full max-w-md space-y-4 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              Nueva Solicitud de Materiales
            </h2>
            <form onSubmit={handleCrearOrden} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Folio</label>
                <Input
                  disabled
                  value={nuevoFolio}
                  className="h-8 text-xs font-mono bg-slate-100 text-slate-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cliente / Empresa</label>
                <Input
                  required
                  placeholder="Ej: Constructora San Martín"
                  value={nuevoCliente}
                  onChange={(e) => setNuevoCliente(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Proyecto / Ubicación de Obra</label>
                <Input
                  required
                  placeholder="Ej: Torre Delta - Piso 4"
                  value={nuevoProyecto}
                  onChange={(e) => setNuevoProyecto(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Material</label>
                  <select
                    value={nuevoMaterial}
                    onChange={(e) => setNuevoMaterial(e.target.value)}
                    className="w-full h-8 bg-white border border-slate-200 rounded px-2 text-xs"
                  >
                    <option value="Cemento Loma Negra 50kg (Bolsa)">Cemento Loma Negra 50kg</option>
                    <option value="Hierro Nervado Ø 10mm (Barra 12m)">Hierro Nervado Ø 10mm</option>
                    <option value="Arena Fina de Río (Bolsón 1m³)">Arena Fina de Río</option>
                    <option value="Cal Santa Elena Hidratada (Bolsa 25kg)">Cal Santa Elena Hidratada</option>
                    <option value="Ladrillo Hueco 12x18x33 (Pallet x 144u)">Ladrillo Hueco 12x18x33</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cantidad Solicitada</label>
                  <Input
                    type="number"
                    value={nuevaCantidad}
                    onChange={(e) => setNuevaCantidad(e.target.value)}
                    className="h-8 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalNuevaOrden(false)}
                  className="h-8 text-xs"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                  Generar Solicitud
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
