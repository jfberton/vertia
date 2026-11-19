"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  CreditCard,
  Building2,
  ShieldCheck,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
  X,
  FileText,
  Warehouse,
  Users,
  Activity,
  Headphones,
  ShieldAlert,
  ArrowDownRight,
  ArrowUpRight,
  UserCheck,
  KeyRound,
  Radio,
  Ban,
  Check,
  Gift,
  Truck,
  HardHat,
  Boxes,
  PowerOff,
  Power,
  RotateCcw,
  ClipboardList,
  Wrench,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_TENANTS,
  MOCK_PRODUCTOS,
  MOCK_ALMACENES,
  MultiTenantOrden,
} from "@/lib/data/mock-multi-tenant";
import {
  getAllStoredProductos,
  getAllStoredAlmacenes,
  getAllStoredOrdenes,
  updateStoredOrden,
  getStoredProfesionales,
  getStoredSolicitudesServicios,
  updateStoredSolicitudServicio,
} from "@/lib/services/mock-store";
import { emitirPresupuesto } from "@/lib/services/ordenes.service";
import { RubroProfesional, ProfesionalServicio, SolicitudServicio } from "@/types/domain";

type TabSeccion =
  | "empresas"
  | "consulta_corralones"
  | "profesionales_servicios"
  | "economia"
  | "salud_tickets"
  | "usuarios_admin";

export interface EmpresaLicencia {
  id: string;
  nombre: string;
  cuit_rfc: string;
  tipo: "Corralón de Materiales" | "Contratista / Obras" | "Constructora";
  rolRed: "Proveedor de Materiales" | "Cliente Comprador";
  almacenesContratados: number;
  administradorPrincipal: string;
  emailAdmin: string;
  plan: "Mono-Almacén" | "Multi-Almacén" | "Enterprise" | "Plan Obras";
  precioBaseMensual: number;
  descuentoPorcentaje: number;
  motivoBonificacion?: string;
  precioFinal: number;
  estado: "Activa" | "Prueba Gratuita" | "Suspendida" | "Anulada";
  habilitadoInventrack: boolean;
  catalogoPublicadoRed: number;
  fechaVencimiento: string;
  ultimoPagoEstado: "Al día" | "Pendiente" | "Vencido";
}

interface TicketSoporte {
  id: string;
  empresa: string;
  asunto: string;
  prioridad: "Alta" | "Media" | "Baja";
  estado: "Abierto" | "En revisión" | "Resuelto";
  hora: string;
}

interface UsuarioAdminInterno {
  id: string;
  nombre: string;
  email: string;
  rol: "Super Administrador" | "Administrador Financiero" | "Operaciones & Red" | "Soporte Técnico";
  estado: "Activo" | "Inactivo";
  ultimoAcceso: string;
}

const mockEmpresas: EmpresaLicencia[] = [
  {
    id: "emp-1",
    nombre: "Corralón Los Pinos S.R.L.",
    cuit_rfc: "30-71458921-8",
    tipo: "Corralón de Materiales",
    rolRed: "Proveedor de Materiales",
    almacenesContratados: 1,
    administradorPrincipal: "Ing. Martín Rossi",
    emailAdmin: "martin@corralonlospinos.com.ar",
    plan: "Mono-Almacén",
    precioBaseMensual: 49.0,
    descuentoPorcentaje: 0,
    motivoBonificacion: "Tarifa estándar",
    precioFinal: 49.0,
    estado: "Activa",
    habilitadoInventrack: true,
    catalogoPublicadoRed: 3,
    fechaVencimiento: "15/03/2026",
    ultimoPagoEstado: "Al día",
  },
  {
    id: "emp-2",
    nombre: "Materiales del Centro S.A.",
    cuit_rfc: "30-68945231-4",
    tipo: "Corralón de Materiales",
    rolRed: "Proveedor de Materiales",
    almacenesContratados: 3,
    administradorPrincipal: "Lic. Carlos Benítez",
    emailAdmin: "carlos@materialesdelcentro.com",
    plan: "Multi-Almacén",
    precioBaseMensual: 129.0,
    descuentoPorcentaje: 20,
    motivoBonificacion: "Convenio Cámara de Corralones (-20%)",
    precioFinal: 103.2,
    estado: "Activa",
    habilitadoInventrack: true,
    catalogoPublicadoRed: 3,
    fechaVencimiento: "28/02/2026",
    ultimoPagoEstado: "Al día",
  },
  {
    id: "emp-3",
    nombre: "Herrería & Obras Modernas",
    cuit_rfc: "20-33445566-9",
    tipo: "Contratista / Obras",
    rolRed: "Cliente Comprador",
    almacenesContratados: 0,
    administradorPrincipal: "Arq. Sofia Valenzuela",
    emailAdmin: "sofia@obrasmodernas.com",
    plan: "Plan Obras",
    precioBaseMensual: 39.0,
    descuentoPorcentaje: 100,
    motivoBonificacion: "Prueba Piloto Red B2B (100% bonificado)",
    precioFinal: 0.0,
    estado: "Prueba Gratuita",
    habilitadoInventrack: false,
    catalogoPublicadoRed: 0,
    fechaVencimiento: "01/05/2026",
    ultimoPagoEstado: "Al día",
  },
  {
    id: "emp-4",
    nombre: "Distribuidora Mayorista Norte",
    cuit_rfc: "30-55112233-7",
    tipo: "Corralón de Materiales",
    rolRed: "Proveedor de Materiales",
    almacenesContratados: 6,
    administradorPrincipal: "Roberto Gómez",
    emailAdmin: "rgomez@mayoristanorte.com",
    plan: "Enterprise",
    precioBaseMensual: 299.0,
    descuentoPorcentaje: 0,
    motivoBonificacion: "Sin bonificación",
    precioFinal: 299.0,
    estado: "Suspendida",
    habilitadoInventrack: false,
    catalogoPublicadoRed: 0,
    fechaVencimiento: "05/01/2026",
    ultimoPagoEstado: "Vencido",
  },
];

const mockTickets: TicketSoporte[] = [
  {
    id: "TCK-102",
    empresa: "Corralón Los Pinos",
    asunto: "Error de sincronización con ERP Tango en lote de cal",
    prioridad: "Alta",
    estado: "En revisión",
    hora: "Hoy 10:12",
  },
  {
    id: "TCK-101",
    empresa: "Constructora Arcos",
    asunto: "Consulta sobre validación de evidencia en obra Torre Norte",
    prioridad: "Media",
    estado: "Abierto",
    hora: "Hoy 09:40",
  },
  {
    id: "TCK-098",
    empresa: "Materiales del Centro",
    asunto: "Ampliación de radio de cobertura de 25 km a 40 km",
    prioridad: "Baja",
    estado: "Resuelto",
    hora: "Ayer 16:15",
  },
];

const mockUsuariosAdmin: UsuarioAdminInterno[] = [
  {
    id: "usr-1",
    nombre: "Humberto Rivero Gonzalez",
    email: "humberto@vertia.com",
    rol: "Super Administrador",
    estado: "Activo",
    ultimoAcceso: "En línea",
  },
  {
    id: "usr-2",
    nombre: "Federico Bertoncini",
    email: "federico@vertia.com",
    rol: "Super Administrador",
    estado: "Activo",
    ultimoAcceso: "En línea",
  },
  {
    id: "usr-3",
    nombre: "Lic. Mariana Costa",
    email: "finanzas@vertia.com",
    rol: "Administrador Financiero",
    estado: "Activo",
    ultimoAcceso: "Hoy 08:30",
  },
  {
    id: "usr-4",
    nombre: "Ing. Lucas Peralta",
    email: "operaciones@vertia.com",
    rol: "Operaciones & Red",
    estado: "Activo",
    ultimoAcceso: "Hoy 09:15",
  },
];

export default function MetaAdminPage() {
  const { user } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState<TabSeccion>("empresas");
  const [empresas, setEmpresas] = useState<EmpresaLicencia[]>(mockEmpresas);
  const [busqueda, setBusqueda] = useState("");
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<EmpresaLicencia | null>(null);
  const [nuevoDescuento, setNuevoDescuento] = useState(0);
  const [nuevoMotivo, setNuevoMotivo] = useState("");
  const [nuevoPlan, setNuevoPlan] = useState<"Mono-Almacén" | "Multi-Almacén" | "Enterprise" | "Plan Obras">("Mono-Almacén");
  const [mensajeNotificacion, setMensajeNotificacion] = useState<string | null>(null);

  // Consulta de Corralones & Asignación de Pedidos
  const [corralonSeleccionadoId, setCorralonSeleccionadoId] = useState<string>("tenant-los-pinos");
  const [ordenesPendientesAsignacion, setOrdenesPendientesAsignacion] = useState(() => {
    return getAllStoredOrdenes().filter(
      (o) =>
        o.estado === "Por cotizar" ||
        o.estado === "Presupuesto listo" ||
        o.corralonAsignado.toLowerCase().includes("pendiente")
    );
  });

  // Modal / Proceso de Cotización Confirmada
  const [ordenParaCotizar, setOrdenParaCotizar] = useState<MultiTenantOrden | null>(null);
  const [cotizacionMonto, setCotizacionMonto] = useState<number>(185000);
  const [cotizacionFlete, setCotizacionFlete] = useState<number>(32000);
  const [cotizacionCorralonId, setCotizacionCorralonId] = useState<string>("tenant-los-pinos");

  const handleEmitirPresupuesto = (ordenId: string) => {
    const corralonInfo = MOCK_TENANTS.find((t) => t.id === cotizacionCorralonId);
    const nombre = corralonInfo?.nombre || "Corralón Asignado";
    emitirPresupuesto(
      ordenId,
      Number(cotizacionMonto) || 0,
      Number(cotizacionFlete) || 0,
      cotizacionCorralonId,
      nombre
    );
    setOrdenesPendientesAsignacion((prev) =>
      prev.map((o) =>
        o.id === ordenId
          ? {
              ...o,
              estado: "Presupuesto listo",
              corralonAsignado: nombre,
              tenant_id: cotizacionCorralonId,
              monto_total_cotizado: cotizacionMonto,
              costo_flete: cotizacionFlete,
            }
          : o
      )
    );
    setOrdenParaCotizar(null);
    setMensajeNotificacion(
      `Presupuesto confirmado emitido ($${cotizacionMonto.toLocaleString("es-AR")} incl. flete $${cotizacionFlete.toLocaleString("es-AR")}) asignado a "${nombre}". Notificado a la constructora para su aprobación en la app.`
    );
    setTimeout(() => setMensajeNotificacion(null), 5000);
  };

  const handleAsignarOrdenACorralon = (ordenId: string, corralonId: string) => {
    const corralonInfo = MOCK_TENANTS.find((t) => t.id === corralonId);
    const nombre = corralonInfo?.nombre || "Corralón Asignado";
    updateStoredOrden(ordenId, {
      tenant_id: corralonId,
      corralonAsignado: nombre,
      estado: "Asignada",
    });
    setOrdenesPendientesAsignacion((prev) => prev.filter((o) => o.id !== ordenId));
    setMensajeNotificacion(`Orden asignada exitosamente a "${nombre}". Ahora figura en su panel de InvenTrack para picking.`);
    setTimeout(() => setMensajeNotificacion(null), 4500);
  };

  // Profesionales & Servicios Red Vertia
  const [solicitudesServiciosMeta, setSolicitudesServiciosMeta] = useState<SolicitudServicio[]>(() =>
    getStoredSolicitudesServicios("all")
  );
  const [profesionalesMeta, setProfesionalesMeta] = useState<ProfesionalServicio[]>(() =>
    getStoredProfesionales()
  );

  const handleRegistrarCobroCliente = (srvId: string) => {
    const updated = updateStoredSolicitudServicio(srvId, {
      cobrado_cliente: true,
      fecha_cobro: new Date().toLocaleDateString("es-AR"),
      estado: "En ejecución",
    });
    if (updated) {
      setSolicitudesServiciosMeta((prev) =>
        prev.map((s) => (s.id === srvId ? updated : s))
      );
      setMensajeNotificacion(
        `Cobro al cliente registrado para la solicitud ${updated.folio}. Fondos en custodia en Vertia.`
      );
      setTimeout(() => setMensajeNotificacion(null), 4500);
    }
  };

  const handleLiberarPagoProfesional = (srvId: string) => {
    const updated = updateStoredSolicitudServicio(srvId, {
      pagado_profesional: true,
      fecha_pago: new Date().toLocaleDateString("es-AR"),
      estado: "Liquidado y Pagado",
    });
    if (updated) {
      setSolicitudesServiciosMeta((prev) =>
        prev.map((s) => (s.id === srvId ? updated : s))
      );
      setMensajeNotificacion(
        `Pago de $${updated.costo_mano_obra.toLocaleString("es-AR")} liberado al profesional para solicitud ${updated.folio}. Comisión Vertia: $${updated.comision_vertia.toLocaleString("es-AR")}.`
      );
      setTimeout(() => setMensajeNotificacion(null), 4500);
    }
  };

  const handleAsignarProfesionalASolicitud = (srvId: string, profId: string) => {
    const prof = profesionalesMeta.find((p) => p.id === profId);
    if (!prof) return;
    const updated = updateStoredSolicitudServicio(srvId, {
      profesional_id: prof.id,
      profesional_nombre: prof.nombre,
      estado: "Asignado",
    });
    if (updated) {
      setSolicitudesServiciosMeta((prev) =>
        prev.map((s) => (s.id === srvId ? updated : s))
      );
      setMensajeNotificacion(
        `Profesional "${prof.nombre}" asignado a la solicitud ${updated.folio}.`
      );
      setTimeout(() => setMensajeNotificacion(null), 4000);
    }
  };

  // Filtrado de empresas
  const empresasFiltradas = empresas.filter(
    (e) =>
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.administradorPrincipal.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.cuit_rfc.includes(busqueda)
  );

  // Cálculos contables simples (Suma, Resta, MRR)
  const totalEmpresas = empresas.length;
  const empresasActivas = empresas.filter((e) => e.estado === "Activa" || e.estado === "Prueba Gratuita");
  const totalFacturacionBruta = empresasActivas.reduce((acc, curr) => acc + curr.precioBaseMensual, 0);
  const totalBonificacionesOtorgadas = empresasActivas.reduce(
    (acc, curr) => acc + (curr.precioBaseMensual * curr.descuentoPorcentaje) / 100,
    0
  );
  const totalFacturacionNeta = totalFacturacionBruta - totalBonificacionesOtorgadas;
  const totalInvenTrackHabilitados = empresas.filter((e) => e.habilitadoInventrack).length;

  // Acciones sobre clientes de la red
  const toggleHabilitacionInventrack = (id: string) => {
    setEmpresas(
      empresas.map((e) => {
        if (e.id === id) {
          const nuevoHabilitado = !e.habilitadoInventrack;
          const texto = nuevoHabilitado
            ? `Módulo InvenTrack HABILITADO para "${e.nombre}". La empresa puede operar con su WMS.`
            : `Módulo InvenTrack INHABILITADO para "${e.nombre}". Se bloqueó el acceso al aplicativo de galpón.`;
          setMensajeNotificacion(texto);
          return { ...e, habilitadoInventrack: nuevoHabilitado };
        }
        return e;
      })
    );
    setTimeout(() => setMensajeNotificacion(null), 4000);
  };

  const anularSuscripcion = (id: string) => {
    setEmpresas(
      empresas.map((e) => {
        if (e.id === id) {
          setMensajeNotificacion(
            `Suscripción de "${e.nombre}" a la Red Vertia ANULADA definitivamente. La empresa quedó inhabilitada.`
          );
          return {
            ...e,
            estado: "Anulada" as const,
            habilitadoInventrack: false,
            catalogoPublicadoRed: 0,
            ultimoPagoEstado: "Vencido" as const,
          };
        }
        return e;
      })
    );
    setTimeout(() => setMensajeNotificacion(null), 4500);
  };

  const reactivarSuscripcion = (id: string) => {
    setEmpresas(
      empresas.map((e) => {
        if (e.id === id) {
          setMensajeNotificacion(`Suscripción de "${e.nombre}" REACTIVADA en la Red Vertia.`);
          return {
            ...e,
            estado: "Activa" as const,
            habilitadoInventrack: e.tipo === "Corralón de Materiales",
          };
        }
        return e;
      })
    );
    setTimeout(() => setMensajeNotificacion(null), 4000);
  };

  const guardarCambiosBonificacion = () => {
    if (!empresaSeleccionada) return;

    let precioBase = 49;
    if (nuevoPlan === "Multi-Almacén") precioBase = 129;
    if (nuevoPlan === "Enterprise") precioBase = 299;
    if (nuevoPlan === "Plan Obras") precioBase = 39;

    const precioFinal = precioBase * (1 - nuevoDescuento / 100);

    setEmpresas(
      empresas.map((e) =>
        e.id === empresaSeleccionada.id
          ? {
              ...e,
              plan: nuevoPlan,
              precioBaseMensual: precioBase,
              descuentoPorcentaje: nuevoDescuento,
              motivoBonificacion: nuevoMotivo.trim() || (nuevoDescuento > 0 ? "Bonificación acordada" : "Tarifa estándar"),
              precioFinal: parseFloat(precioFinal.toFixed(2)),
              estado: nuevoDescuento === 100 ? "Prueba Gratuita" : "Activa",
            }
          : e
      )
    );

    setMensajeNotificacion(
      `Bonificación y plan de "${empresaSeleccionada.nombre}" actualizados: ${nuevoDescuento}% de descuento (${nuevoMotivo || "Bonificación comercial"}).`
    );
    setEmpresaSeleccionada(null);
    setTimeout(() => setMensajeNotificacion(null), 4000);
  };

  if (user && !user.is_super_admin) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Acceso Restringido: Consola de Administración de Plataforma
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Esta sección es exclusiva para el equipo directivo de VERTIA. Tu usuario actual pertenece a{" "}
            <strong>{user.tenant_nombre || user.nombre_completo}</strong>.
          </p>
        </div>
        <Link href="/productos">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
            Volver a mi Módulo InvenTrack
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Corporativo de Administración de Plataforma */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Gestión de Empresas & Red Vertia (Meta-Administrador)
                </h1>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold">
                  Consola de Operador
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Supervisión comercial de corralones (proveedores) y constructoras (clientes). Control de licencias InvenTrack, bonificaciones y cobros.
              </p>
            </div>
          </div>
        </div>

        {/* Indicador de rol activo */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">
          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
          <span>Sesión: <strong>Operador Vertia (Humberto & Federico)</strong></span>
        </div>
      </div>

      {mensajeNotificacion && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeNotificacion}</span>
        </div>
      )}

      {/* Selector de Pestañas / Módulos de la Herramienta */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs font-semibold">
        <button
          onClick={() => setSeccionActiva("empresas")}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            seccionActiva === "empresas"
              ? "border-indigo-600 text-indigo-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Clientes & Proveedores de la Red ({empresas.length})
        </button>

        <button
          onClick={() => setSeccionActiva("consulta_corralones")}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            seccionActiva === "consulta_corralones"
              ? "border-indigo-600 text-indigo-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Warehouse className="w-4 h-4" />
          Consulta de Corralones & Stock (InvenTrack)
        </button>

        <button
          onClick={() => setSeccionActiva("profesionales_servicios")}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            seccionActiva === "profesionales_servicios"
              ? "border-indigo-600 text-indigo-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wrench className="w-4 h-4" />
          Profesionales & Oficios Red ({solicitudesServiciosMeta.length})
        </button>

        <button
          onClick={() => setSeccionActiva("economia")}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            seccionActiva === "economia"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Contabilidad, Licencias & Cobros
        </button>

        <button
          onClick={() => setSeccionActiva("salud_tickets")}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            seccionActiva === "salud_tickets"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity className="w-4 h-4" />
          Mesa de Ayuda & Tickets (3)
        </button>

        <button
          onClick={() => setSeccionActiva("usuarios_admin")}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            seccionActiva === "usuarios_admin"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Staff Interno de Vertia
        </button>
      </div>

      {/* =========================================================================
          SECCIÓN 1: CLIENTES & PROVEEDORES DE LA RED (CORRALONES Y CONSTRUCTORAS)
         ========================================================================= */}
      {seccionActiva === "empresas" && (
        <div className="space-y-4">
          {/* Métricas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Empresas en la Red</span>
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalEmpresas}</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                {empresas.filter((e) => e.rolRed === "Proveedor de Materiales").length} Proveedores •{" "}
                {empresas.filter((e) => e.rolRed === "Cliente Comprador").length} Clientes Obra
              </span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>InvenTrack Operativo</span>
                <Boxes className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalInvenTrackHabilitados}</div>
              <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
                Corralones con módulo de galpón habilitado
              </span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Bonificaciones Comerciales</span>
                <Percent className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {empresas.filter((e) => e.descuentoPorcentaje > 0).length}
              </div>
              <span className="text-[11px] text-amber-700 mt-1 block">
                Convenios, cámaras o bonificaciones 100%
              </span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Cobro Mensual Neto (MRR)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                ${totalFacturacionNeta.toFixed(2)} USD
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Base ${totalFacturacionBruta.toFixed(2)} - Desc. ${totalBonificacionesOtorgadas.toFixed(2)}
              </span>
            </Card>
          </div>

          {/* Buscador */}
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por empresa, CUIT o administrador..."
                className="pl-9 h-9 text-xs border-slate-200"
              />
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Gestión de licencias sin injerencia en el stock interno del corralón</span>
            </div>
          </div>

          {/* Tabla de Empresas como Clientes/Proveedores de la Red */}
          <Card className="bg-white border-slate-200 shadow-xs overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Empresa & Rol en Red</th>
                    <th className="py-3 px-4">Módulo InvenTrack (WMS)</th>
                    <th className="py-3 px-4">Suscripción & Estado</th>
                    <th className="py-3 px-4 text-center">Bonificación Comercial</th>
                    <th className="py-3 px-4 text-center">Cobro Neto</th>
                    <th className="py-3 px-4 text-right">Gestión de Red & Licencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {empresasFiltradas.map((empresa) => (
                    <tr key={empresa.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Empresa & Rol en Red */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{empresa.nombre}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{empresa.cuit_rfc}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {empresa.rolRed === "Proveedor de Materiales" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                              <Truck className="w-3 h-3 text-indigo-600" />
                              Proveedor de Materiales
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              <HardHat className="w-3 h-3 text-emerald-600" />
                              Cliente Comprador (Obras)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Módulo InvenTrack (Operativo vs Inhabilitado) */}
                      <td className="py-3.5 px-4">
                        {empresa.tipo === "Corralón de Materiales" ? (
                          <div className="space-y-1">
                            {empresa.habilitadoInventrack ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                                <Check className="w-3 h-3" /> InvenTrack Operativo
                              </Badge>
                            ) : (
                              <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                                <Ban className="w-3 h-3" /> InvenTrack Inhabilitado
                              </Badge>
                            )}
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Boxes className="w-3 h-3 text-slate-400" />
                              {empresa.catalogoPublicadoRed > 0
                                ? `${empresa.catalogoPublicadoRed} materiales en Red B2B`
                                : "Sin catálogo en Red"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">
                            No aplica (Solo compras)
                          </span>
                        )}
                      </td>

                      {/* Suscripción & Plan */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{empresa.plan}</div>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] border ${
                              empresa.estado === "Activa"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : empresa.estado === "Prueba Gratuita"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : empresa.estado === "Suspendida"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {empresa.estado}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Vence: {empresa.fechaVencimiento}
                        </div>
                      </td>

                      {/* Descuento / Bonificación */}
                      <td className="py-3.5 px-4 text-center">
                        {empresa.descuentoPorcentaje > 0 ? (
                          <div>
                            <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1">
                              <Gift className="w-3 h-3" /> -{empresa.descuentoPorcentaje}%
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1 max-w-[140px] truncate mx-auto" title={empresa.motivoBonificacion}>
                              {empresa.motivoBonificacion || "Bonificación acordada"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Tarifa Plena</span>
                        )}
                      </td>

                      {/* Cobro Mensual */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-extrabold text-slate-900 text-sm">
                          ${empresa.precioFinal.toFixed(2)} USD
                        </div>
                        <div className="text-[10px] text-slate-400 line-through">
                          {empresa.descuentoPorcentaje > 0 && `Base: $${empresa.precioBaseMensual.toFixed(2)}`}
                        </div>
                      </td>

                      {/* Gestión como Cliente/Proveedor de la Red */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Otorgar Bonificación */}
                          <Button
                            onClick={() => {
                              setEmpresaSeleccionada(empresa);
                              setNuevoDescuento(empresa.descuentoPorcentaje);
                              setNuevoPlan(empresa.plan);
                              setNuevoMotivo(empresa.motivoBonificacion || "");
                            }}
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] border-slate-200 hover:bg-amber-50 hover:text-amber-800 text-slate-700 flex items-center gap-1"
                            title="Otorgar bonificación o ajustar plan"
                          >
                            <Gift className="w-3 h-3 text-amber-600" />
                            Bonificar
                          </Button>

                          {/* Inhabilitar / Habilitar InvenTrack (si es corralón) */}
                          {empresa.tipo === "Corralón de Materiales" && (
                            <Button
                              onClick={() => toggleHabilitacionInventrack(empresa.id)}
                              variant="outline"
                              size="sm"
                              className={`h-7 text-[11px] flex items-center gap-1 ${
                                empresa.habilitadoInventrack
                                  ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                              title={
                                empresa.habilitadoInventrack
                                  ? "Inhabilitar para operar con InvenTrack"
                                  : "Habilitar para operar con InvenTrack"
                              }
                            >
                              {empresa.habilitadoInventrack ? (
                                <>
                                  <PowerOff className="w-3 h-3 text-rose-600" />
                                  Inhabilitar
                                </>
                              ) : (
                                <>
                                  <Power className="w-3 h-3 text-emerald-600" />
                                  Habilitar
                                </>
                              )}
                            </Button>
                          )}

                          {/* Anular / Reactivar Suscripción */}
                          {empresa.estado === "Anulada" ? (
                            <Button
                              onClick={() => reactivarSuscripcion(empresa.id)}
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[11px] text-emerald-700 hover:bg-emerald-50 flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Reactivar
                            </Button>
                          ) : (
                            <Button
                              onClick={() => anularSuscripcion(empresa.id)}
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[11px] text-slate-400 hover:text-rose-700 hover:bg-rose-50 flex items-center gap-1"
                              title="Anular suscripción a la red"
                            >
                              <Ban className="w-3 h-3" />
                              Anular
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* =========================================================================
          SECCIÓN 1.5: CONSULTA DE CORRALONES & INVENTARIOS (INVENTRACK)
         ========================================================================= */}
      {seccionActiva === "consulta_corralones" && (() => {
        const corralonActual =
          MOCK_TENANTS.find((t) => t.id === corralonSeleccionadoId) || MOCK_TENANTS[0];
        const productosCorralon = getAllStoredProductos().filter(
          (p) => p.tenant_id === corralonActual.id
        );
        const almacenesCorralon = getAllStoredAlmacenes().filter(
          (a) => a.tenant_id === corralonActual.id
        );

        const stockRealTotal = productosCorralon.reduce((a, b) => a + b.stock_real, 0);
        const stockComprometidoTotal = productosCorralon.reduce(
          (a, b) => a + b.stock_comprometido,
          0
        );
        const stockDisponibleTotal = productosCorralon.reduce(
          (a, b) => a + b.stock_disponible,
          0
        );

        return (
          <div className="space-y-5 animate-in fade-in">
            {/* Selector de Corralón Conectado */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Corralón Proveedor Conectado a Vertia
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <select
                    value={corralonSeleccionadoId}
                    onChange={(e) => setCorralonSeleccionadoId(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {MOCK_TENANTS.filter((t) => t.tipo_empresa === "corralon").map((t) => (
                      <option key={t.id} value={t.id}>
                        🏭 {t.nombre} ({t.ciudad})
                      </option>
                    ))}
                  </select>
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-semibold"
                  >
                    Módulo InvenTrack Activo
                  </Badge>
                </div>
              </div>

              {/* Indicador de Modo Auditoría */}
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Modo Auditoría Vertia: Solo lectura de inventarios (sin permisos de edición sobre el corralón)
                </span>
              </div>
            </div>

            {/* Tarjetas de Métricas de Stock de este Corralón */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Stock Físico Real
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {stockRealTotal.toLocaleString("es-AR")}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">En racks y galpones</div>
              </Card>

              <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Comprometido
                </span>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {stockComprometidoTotal.toLocaleString("es-AR")}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Reservado en órdenes</div>
              </Card>

              <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Disponible para Red
                </span>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {stockDisponibleTotal.toLocaleString("es-AR")}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Capacidad de venta</div>
              </Card>

              <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Almacenes Activos
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {almacenesCorralon.length}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Depósitos / Muelles</div>
              </Card>
            </div>

            {/* Mesa de Asignación de Solicitudes de Clientes */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs space-y-3 p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Mesa de Asignación de Solicitudes de Clientes
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pedidos generados por empresas constructoras pendientes de asignación por el Operador Vertia.
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs font-semibold bg-amber-50 text-amber-800 border-amber-200">
                  {ordenesPendientesAsignacion.length} pendiente(s)
                </Badge>
              </div>

              {ordenesPendientesAsignacion.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No hay solicitudes de clientes pendientes de asignación en este momento.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {ordenesPendientesAsignacion.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-indigo-700">{ord.folio}</span>
                          <span className="text-xs font-bold text-slate-800">• {ord.cliente}</span>
                          <Badge variant="outline" className="text-[10px] bg-white text-slate-600">
                            {ord.tipo}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Destino: <strong>{ord.proyectoUbicacion}</strong> ({ord.distanciaKm} km)
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Materiales: {ord.detalles.map((d) => `${d.cantidadSolicitada} ${d.unidad} ${d.material}`).join(", ")}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {ord.estado === "Presupuesto listo" ? (
                          <div className="text-right bg-white p-2 rounded-lg border border-purple-200">
                            <Badge className="bg-purple-50 text-purple-800 border-purple-300 text-xs font-bold">
                              Presupuesto Emitido: ${(ord.monto_total_cotizado || 0).toLocaleString("es-AR")}
                            </Badge>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Asignado a: <strong>{ord.corralonAsignado}</strong> • Aguardando aprobación cliente
                            </div>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setOrdenParaCotizar(ord);
                                setCotizacionCorralonId(corralonActual.id);
                                const estMat = ord.detalles.reduce((acc, d) => acc + d.cantidadSolicitada * 2200, 0);
                                setCotizacionMonto(estMat + 35000);
                                setCotizacionFlete(35000);
                              }}
                              className="text-xs h-8 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold gap-1"
                            >
                              <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Emitir Presupuesto</span>
                            </Button>

                            <Button
                              size="sm"
                              onClick={() => handleAsignarOrdenACorralon(ord.id, corralonActual.id)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 gap-1.5 shadow-xs h-8"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Asignar Directo a {corralonActual.nombre}</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Catálogo de Productos del Corralón (Solo Lectura) */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Catálogo de Productos & Métrica Dual de Stock (Consulta InvenTrack)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Monitoreo en vivo de inventarios de {corralonActual.nombre}.
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {productosCorralon.length} materiales registrados
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Material / SKU</th>
                      <th className="py-3 px-4">Rubro</th>
                      <th className="py-3 px-4">Precio Lista</th>
                      <th className="py-3 px-4 text-center">Stock Físico Real</th>
                      <th className="py-3 px-4 text-center">Comprometido</th>
                      <th className="py-3 px-4 text-center">Disponible para Red</th>
                      <th className="py-3 px-4 text-center">Modalidad Cupo</th>
                      <th className="py-3 px-4 text-center">Red B2B</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productosCorralon.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{prod.nombre}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{prod.codigo_barras}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                            {prod.categoria}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          ${prod.precio.toLocaleString("es-AR")}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800 bg-slate-50/40">
                          {prod.stock_real} {prod.unidad_medida}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-600">
                          {prod.stock_comprometido} {prod.unidad_medida}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-emerald-700 bg-emerald-50/30">
                          {prod.stock_disponible} {prod.unidad_medida}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              prod.modo_disponible === "cupo_manual"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {prod.modo_disponible === "cupo_manual"
                              ? `Cupo: ${prod.stock_disponible}`
                              : "100% Auto"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              prod.publicado_en_red
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {prod.publicado_en_red ? "Publicado" : "Solo Local"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          SECCIÓN: PROFESIONALES & SERVICIOS RED VERTIA (MEDIACIÓN & ESCROW)
         ========================================================================= */}
      {seccionActiva === "profesionales_servicios" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header de Mediación */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-purple-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Mesa de Control de Servicios & Profesionales Red Vertia
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl">
                Supervisión de solicitudes de oficios (gasistas, plomeros, electricistas, albañiles). Gestión del cobro a la constructora (custodia) y liberación de liquidaciones al profesional una vez obtenida la conformidad de obra.
              </p>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs font-bold py-1 px-3">
              Mesa de Mediación & Pagos
            </Badge>
          </div>

          {/* Tarjetas de Métricas de Servicios */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Solicitudes Totales
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {solicitudesServiciosMeta.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Pedidos de oficios</div>
            </Card>

            <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                En Custodia (Cobrado)
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                $
                {solicitudesServiciosMeta
                  .filter((s) => s.cobrado_cliente && !s.pagado_profesional)
                  .reduce((acc, curr) => acc + curr.costo_estimado, 0)
                  .toLocaleString("es-AR")}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Fondos retenidos en Vertia</div>
            </Card>

            <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Comisiones Vertia
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                $
                {solicitudesServiciosMeta
                  .reduce((acc, curr) => acc + curr.comision_vertia, 0)
                  .toLocaleString("es-AR")}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Fee de red (12-15%)</div>
            </Card>

            <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                Profesionales Activos
              </span>
              <div className="text-2xl font-black text-purple-700 mt-1">
                {profesionalesMeta.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Gasistas, plomeros, etc.</div>
            </Card>
          </div>

          {/* Tabla de Gestión de Solicitudes y Cobros/Pagos */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Bandeja de Requerimientos de Servicios y Liquidaciones Escrow
                </h3>
                <p className="text-[11px] text-slate-500">
                  Control de asignación, cobro a cliente y desembolso al profesional tras la conformidad.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {solicitudesServiciosMeta.length} servicios registrados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Folio / Fecha</th>
                    <th className="py-3 px-4">Cliente / Obra</th>
                    <th className="py-3 px-4">Rubro / Tarea</th>
                    <th className="py-3 px-4">Profesional Designado</th>
                    <th className="py-3 px-4">Desglose Montos</th>
                    <th className="py-3 px-4">Cobro Cliente</th>
                    <th className="py-3 px-4">Conformidad</th>
                    <th className="py-3 px-4 text-right">Pago Profesional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {solicitudesServiciosMeta.map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">{srv.folio}</div>
                        <div className="text-[10px] text-slate-400">{srv.fecha_requerida}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{srv.cliente_nombre}</div>
                        <div className="text-[10px] text-slate-500">{srv.obra_nombre}</div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200 font-bold mb-0.5">
                          {srv.rubro}
                        </Badge>
                        <div className="text-[11px] text-slate-600 truncate" title={srv.descripcion_tarea}>
                          {srv.descripcion_tarea}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {srv.profesional_nombre ? (
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{srv.profesional_nombre}</span>
                          </div>
                        ) : (
                          <select
                            onChange={(e) => handleAsignarProfesionalASolicitud(srv.id, e.target.value)}
                            defaultValue=""
                            className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 font-semibold text-slate-700"
                          >
                            <option value="" disabled>
                              Asignar Profesional...
                            </option>
                            {profesionalesMeta
                              .filter((p) => p.rubro === srv.rubro || true)
                              .map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.nombre} ({p.rubro})
                                </option>
                              ))}
                          </select>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          Total: ${srv.costo_estimado.toLocaleString("es-AR")}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Mano Obra: ${srv.costo_mano_obra.toLocaleString("es-AR")} • Vertia: ${srv.comision_vertia.toLocaleString("es-AR")}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {srv.cobrado_cliente ? (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Cobrado</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleRegistrarCobroCliente(srv.id)}
                            className="text-[10px] h-6 px-2 bg-amber-600 hover:bg-amber-700 text-white font-bold"
                          >
                            Registrar Cobro
                          </Button>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {srv.conformidad_cliente ? (
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                            ✓ Conforme
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-slate-500 bg-slate-50">
                            En espera
                          </Badge>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {srv.pagado_profesional ? (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Liquidado</span>
                          </div>
                        ) : srv.conformidad_cliente && srv.cobrado_cliente ? (
                          <Button
                            size="sm"
                            onClick={() => handleLiberarPagoProfesional(srv.id)}
                            className="text-xs h-7 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                          >
                            <DollarSign className="w-3 h-3" />
                            <span>Liberar Pago</span>
                          </Button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            Requiere cobro y conformidad
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Directorio de Profesionales Registrados */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Directorio de Profesionales & Oficios Habilitados
                </h3>
                <p className="text-[11px] text-slate-500">
                  Gasistas matriculados, plomeros, electricistas y constructores asociados a la red.
                </p>
              </div>
              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold">
                {profesionalesMeta.length} activos
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Nombre / Razón Social</th>
                    <th className="py-3 px-4">Rubro / Especialidad</th>
                    <th className="py-3 px-4">Matrícula / CUIT</th>
                    <th className="py-3 px-4">Contacto / Teléfono</th>
                    <th className="py-3 px-4">Zona Cobertura</th>
                    <th className="py-3 px-4">Tarifa Estimada</th>
                    <th className="py-3 px-4 text-center">Calificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profesionalesMeta.map((prof) => (
                    <tr key={prof.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {prof.nombre}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200 font-semibold">
                          {prof.rubro}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {prof.matricula ? (
                          <span className="font-semibold text-slate-800">{prof.matricula}</span>
                        ) : (
                          <span className="text-slate-400">CUIT: {prof.cuit_rut || "—"}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {prof.telefono}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {prof.zona_cobertura}
                      </td>

                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        ${prof.tarifa_hora_estimada?.toLocaleString("es-AR") || "8.500"}/h
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{prof.calificacion.toFixed(1)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECCIÓN 2: CONTABILIDAD, LICENCIAS & COBROS (SUMAS Y RESTAS SIMPLES)
         ========================================================================= */}
      {seccionActiva === "economia" && (
        <div className="space-y-4">
          {/* Tarjetas de Desglose Contable */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">1. Facturación Bruta (Suma)</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                ${totalFacturacionBruta.toFixed(2)} USD
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Suma de planes contratados según tarifa plena
              </div>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-amber-700">2. Bonificaciones Otorgadas (Resta)</span>
              <div className="text-2xl font-black text-amber-700 mt-2">
                -${totalBonificacionesOtorgadas.toFixed(2)} USD
              </div>
              <div className="text-[11px] text-amber-700 mt-1">
                Descuentos comerciales, convenios y pruebas
              </div>
            </Card>

            <Card className="p-4 bg-emerald-50/50 border-emerald-200 shadow-xs">
              <span className="text-xs font-semibold text-emerald-800">3. Facturación Neta a Cobrar (MRR)</span>
              <div className="text-3xl font-black text-emerald-700 mt-2">
                ${totalFacturacionNeta.toFixed(2)} USD
              </div>
              <div className="text-[11px] text-emerald-800 font-bold mt-1">
                Ingreso recurrente neto mensual
              </div>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">4. Costo Infraestructura</span>
              <div className="text-2xl font-black text-slate-700 mt-2">$25.00 USD</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Supabase Pro ($25) + Cloudflare ($0)
              </div>
            </Card>
          </div>

          {/* Libro de Cobranzas & Estado de Cuenta */}
          <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Detalle Contable de Cobranzas por Empresa (Mes en Curso)
              </h3>
              <Badge className="bg-slate-100 text-slate-700 text-xs">
                Contabilidad Simple
              </Badge>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {empresas.map((emp) => (
                <div key={emp.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{emp.nombre}</span>
                      <span className="text-slate-400 font-mono text-[11px]">({emp.plan})</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {emp.descuentoPorcentaje > 0 ? (
                        <span className="text-amber-700 font-medium">
                          Base: ${emp.precioBaseMensual.toFixed(2)} - Bonificación {emp.descuentoPorcentaje}% ({emp.motivoBonificacion}): -${((emp.precioBaseMensual * emp.descuentoPorcentaje) / 100).toFixed(2)} USD
                        </span>
                      ) : (
                        <span>Sin bonificación • Tarifa plena: ${emp.precioBaseMensual.toFixed(2)} USD</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-sm text-slate-900">
                      ${emp.precioFinal.toFixed(2)} USD
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        emp.ultimoPagoEstado === "Al día"
                          ? "bg-emerald-50 text-emerald-700"
                          : emp.ultimoPagoEstado === "Pendiente"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {emp.ultimoPagoEstado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* =========================================================================
          SECCIÓN 3: SALUD, TICKETS & ERRORES
         ========================================================================= */}
      {seccionActiva === "salud_tickets" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-white border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold">Estado de la Plataforma</span>
                <div className="text-lg font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  100% Operativa (Uptime 99.98%)
                </div>
              </div>
              <Radio className="w-6 h-6 text-emerald-600" />
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold">Operaciones Mensuales</span>
                <div className="text-lg font-bold text-slate-900 mt-1">2,480 Pedidos</div>
              </div>
              <Activity className="w-6 h-6 text-indigo-600" />
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold">Tickets Pendientes</span>
                <div className="text-lg font-bold text-amber-700 mt-1">2 en curso</div>
              </div>
              <Headphones className="w-6 h-6 text-amber-600" />
            </Card>
          </div>

          {/* Tabla de Tickets de Mesa de Ayuda */}
          <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Mesa de Ayuda & Reclamos Reportados</h3>
              <Badge variant="outline" className="text-xs border-slate-200">
                Soporte Tier 2
              </Badge>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {mockTickets.map((tck) => (
                <div key={tck.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600">{tck.id}</span>
                      <span className="font-bold text-slate-900">{tck.asunto}</span>
                      <Badge
                        className={`text-[10px] ${
                          tck.prioridad === "Alta"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {tck.prioridad}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Reportado por <strong>{tck.empresa}</strong> • {tck.hora}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        tck.estado === "Resuelto"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : tck.estado === "En revisión"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {tck.estado}
                    </span>
                    <Button variant="outline" size="sm" className="h-7 text-[11px] border-slate-200">
                      Ver Caso
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* =========================================================================
          SECCIÓN 4: USUARIOS DE ADMINISTRACIÓN (STAFF INTERNO DE VERTIA)
         ========================================================================= */}
      {seccionActiva === "usuarios_admin" && (
        <div className="space-y-4">
          <Card className="p-4 bg-indigo-50/50 border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
            <div>
              <span className="font-bold block">Matriz de Roles de Administración de Plataforma</span>
              <span className="text-[11px] text-indigo-700">
                Los usuarios listados a continuación pertenecen al equipo interno de VERTIA (operadores y directivos).
              </span>
            </div>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Crear Operador de Staff
            </Button>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Usuario / Funcionario</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Rol Asignado</th>
                    <th className="py-3 px-4">Alcance de Vistas</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockUsuariosAdmin.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{u.nombre}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <Badge
                          className={`font-semibold ${
                            u.rol === "Super Administrador"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : u.rol === "Administrador Financiero"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : u.rol === "Operaciones & Red"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          {u.rol}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {u.rol === "Super Administrador"
                          ? "Acceso total 360° (Finanzas, Red, Licencias y Staff)"
                          : u.rol === "Administrador Financiero"
                          ? "Módulo de Economía, Facturación y Cobranzas"
                          : u.rol === "Operaciones & Red"
                          ? "Monitoreo de pedidos, red y evidencias"
                          : "Tickets de soporte y logs de errores de sistema"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          {u.estado}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 hover:text-slate-800">
                          Editar Permisos
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Modal: Otorgar Bonificación Comercial & Ajustar Plan */}
      {empresaSeleccionada && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="bg-white border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 rounded-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" /> Otorgar Bonificación Comercial
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {empresaSeleccionada.nombre}
                </h3>
              </div>
              <button
                onClick={() => setEmpresaSeleccionada(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Plan de Suscripción a la Red Vertia:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setNuevoPlan("Mono-Almacén")}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      nuevoPlan === "Mono-Almacén"
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-slate-900">Mono-Alm.</div>
                    <div className="text-[10px] text-slate-500">$49 USD/mes</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNuevoPlan("Multi-Almacén")}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      nuevoPlan === "Multi-Almacén"
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-slate-900">Multi-Alm.</div>
                    <div className="text-[10px] text-slate-500">$129 USD/mes</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNuevoPlan("Enterprise")}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      nuevoPlan === "Enterprise"
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-slate-900">Enterprise</div>
                    <div className="text-[10px] text-slate-500">$299 USD/mes</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNuevoPlan("Plan Obras")}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      nuevoPlan === "Plan Obras"
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-slate-900">Plan Obras</div>
                    <div className="text-[10px] text-slate-500">$39 USD/mes</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Porcentaje de Bonificación / Descuento:
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={nuevoDescuento}
                    onChange={(e) => setNuevoDescuento(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-24 text-sm border-slate-200"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setNuevoDescuento(0)}
                      className="px-2 py-1 rounded bg-slate-100 text-[11px] text-slate-700 hover:bg-slate-200"
                    >
                      0% (Pleno)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNuevoDescuento(20)}
                      className="px-2 py-1 rounded bg-slate-100 text-[11px] text-slate-700 hover:bg-slate-200"
                    >
                      20% Convenio
                    </button>
                    <button
                      type="button"
                      onClick={() => setNuevoDescuento(50)}
                      className="px-2 py-1 rounded bg-slate-100 text-[11px] text-slate-700 hover:bg-slate-200"
                    >
                      50% Lanzamiento
                    </button>
                    <button
                      type="button"
                      onClick={() => setNuevoDescuento(100)}
                      className="px-2 py-1 rounded bg-amber-100 text-[11px] text-amber-800 font-semibold hover:bg-amber-200"
                    >
                      100% Bonificado
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Motivo Comercial de la Bonificación:
                </label>
                <Input
                  value={nuevoMotivo}
                  onChange={(e) => setNuevoMotivo(e.target.value)}
                  placeholder="Ej: Convenio Cámara de la Construcción, Prueba Piloto 90 días..."
                  className="text-xs border-slate-200"
                />
              </div>

              {/* Cálculo Contable en Vivo */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Impacto Contable Mensual:
                </span>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Precio Base Mensual:</span>
                  <span>
                    ${nuevoPlan === "Multi-Almacén" ? "129.00" : nuevoPlan === "Enterprise" ? "299.00" : nuevoPlan === "Plan Obras" ? "39.00" : "49.00"} USD
                  </span>
                </div>
                <div className="flex items-center justify-between text-amber-700 font-medium">
                  <span>Bonificación ({nuevoDescuento}%):</span>
                  <span>
                    -${(((nuevoPlan === "Multi-Almacén" ? 129 : nuevoPlan === "Enterprise" ? 299 : nuevoPlan === "Plan Obras" ? 39 : 49) * nuevoDescuento) / 100).toFixed(2)} USD
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-900 font-extrabold pt-1 border-t border-slate-200">
                  <span>Total Neto a Cobrar por Mes:</span>
                  <span className="text-emerald-700">
                    ${(((nuevoPlan === "Multi-Almacén" ? 129 : nuevoPlan === "Enterprise" ? 299 : nuevoPlan === "Plan Obras" ? 39 : 49) * (1 - nuevoDescuento / 100))).toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmpresaSeleccionada(null)}
                className="text-xs border-slate-200"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={guardarCambiosBonificacion}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Confirmar y Aplicar Bonificación
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal / Panel para Emitir Presupuesto Confirmado */}
      {ordenParaCotizar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <Card className="w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Emitir Presupuesto Confirmado
                  </h3>
                  <p className="text-xs text-slate-500">
                    Orden {ordenParaCotizar.folio} • {ordenParaCotizar.cliente}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOrdenParaCotizar(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="text-slate-500 font-medium">Destino de obra:</div>
              <div className="font-bold text-slate-800">{ordenParaCotizar.proyectoUbicacion}</div>
              <div className="text-[11px] text-slate-500 pt-1">
                Materiales: {ordenParaCotizar.detalles.map((d) => `${d.cantidadSolicitada} ${d.unidad} ${d.material}`).join(", ")}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corralón Proveedor Asignado *
                </label>
                <select
                  value={cotizacionCorralonId}
                  onChange={(e) => setCotizacionCorralonId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {MOCK_TENANTS.filter((t) => t.tipo_empresa === "corralon").map((t) => (
                    <option key={t.id} value={t.id}>
                      🏭 {t.nombre} ({t.ciudad})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Costo Materiales ($ ARS)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1000"
                    value={Math.max(0, cotizacionMonto - cotizacionFlete)}
                    onChange={(e) =>
                      setCotizacionMonto(Number(e.target.value) + cotizacionFlete)
                    }
                    className="text-xs h-9 bg-slate-50 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Costo Flete Consolidado ($ ARS)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1000"
                    value={cotizacionFlete}
                    onChange={(e) => {
                      const nuevoFlete = Number(e.target.value);
                      const baseMat = Math.max(0, cotizacionMonto - cotizacionFlete);
                      setCotizacionFlete(nuevoFlete);
                      setCotizacionMonto(baseMat + nuevoFlete);
                    }}
                    className="text-xs h-9 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              {/* Total Final */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-950">Total Final Presupuestado:</span>
                <span className="text-base font-extrabold text-indigo-700">
                  ${cotizacionMonto.toLocaleString("es-AR")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOrdenParaCotizar(null)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={() => handleEmitirPresupuesto(ordenParaCotizar.id)}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Emitir Presupuesto a Constructora</span>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
