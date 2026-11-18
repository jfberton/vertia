"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type TabSeccion = "empresas" | "economia" | "salud_tickets" | "usuarios_admin";

interface EmpresaLicencia {
  id: string;
  nombre: string;
  cuit_rfc: string;
  tipo: "Corralón de Materiales" | "Contratista / Obras" | "Constructora";
  almacenesContratados: number;
  administradorPrincipal: string;
  emailAdmin: string;
  plan: "Mono-Almacén" | "Multi-Almacén" | "Enterprise";
  precioBaseMensual: number;
  descuentoPorcentaje: number;
  precioFinal: number;
  estado: "Activa" | "Prueba Gratuita" | "Suspendida";
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
    almacenesContratados: 1,
    administradorPrincipal: "Ing. Martín Rossi",
    emailAdmin: "martin@corralonlospinos.com.ar",
    plan: "Mono-Almacén",
    precioBaseMensual: 49.0,
    descuentoPorcentaje: 0,
    precioFinal: 49.0,
    estado: "Activa",
    fechaVencimiento: "15/03/2026",
    ultimoPagoEstado: "Al día",
  },
  {
    id: "emp-2",
    nombre: "Materiales del Centro S.A.",
    cuit_rfc: "30-68945231-4",
    tipo: "Corralón de Materiales",
    almacenesContratados: 3,
    administradorPrincipal: "Lic. Carlos Benítez",
    emailAdmin: "carlos@materialesdelcentro.com",
    plan: "Multi-Almacén",
    precioBaseMensual: 129.0,
    descuentoPorcentaje: 20,
    precioFinal: 103.2,
    estado: "Activa",
    fechaVencimiento: "28/02/2026",
    ultimoPagoEstado: "Al día",
  },
  {
    id: "emp-3",
    nombre: "Herrería & Obras Modernas",
    cuit_rfc: "20-33445566-9",
    tipo: "Contratista / Obras",
    almacenesContratados: 1,
    administradorPrincipal: "Arq. Sofia Valenzuela",
    emailAdmin: "sofia@obrasmodernas.com",
    plan: "Mono-Almacén",
    precioBaseMensual: 49.0,
    descuentoPorcentaje: 100,
    precioFinal: 0.0,
    estado: "Prueba Gratuita",
    fechaVencimiento: "01/05/2026",
    ultimoPagoEstado: "Al día",
  },
  {
    id: "emp-4",
    nombre: "Distribuidora Mayorista Norte",
    cuit_rfc: "30-55112233-7",
    tipo: "Corralón de Materiales",
    almacenesContratados: 6,
    administradorPrincipal: "Roberto Gómez",
    emailAdmin: "rgomez@mayoristanorte.com",
    plan: "Enterprise",
    precioBaseMensual: 299.0,
    descuentoPorcentaje: 15,
    precioFinal: 254.15,
    estado: "Suspendida",
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
    nombre: "Lic. Mariana Costa",
    email: "finanzas@vertia.com",
    rol: "Administrador Financiero",
    estado: "Activo",
    ultimoAcceso: "Hoy 08:30",
  },
  {
    id: "usr-3",
    nombre: "Ing. Lucas Peralta",
    email: "operaciones@vertia.com",
    rol: "Operaciones & Red",
    estado: "Activo",
    ultimoAcceso: "Hoy 09:15",
  },
  {
    id: "usr-4",
    nombre: "Gabriel Méndez",
    email: "soporte@vertia.com",
    rol: "Soporte Técnico",
    estado: "Activo",
    ultimoAcceso: "Hoy 10:05",
  },
];

export default function MetaAdminPage() {
  const [seccionActiva, setSeccionActiva] = useState<TabSeccion>("empresas");
  const [empresas, setEmpresas] = useState<EmpresaLicencia[]>(mockEmpresas);
  const [busqueda, setBusqueda] = useState("");
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<EmpresaLicencia | null>(null);
  const [nuevoDescuento, setNuevoDescuento] = useState(0);
  const [nuevoPlan, setNuevoPlan] = useState<"Mono-Almacén" | "Multi-Almacén" | "Enterprise">("Mono-Almacén");
  const [mensajeNotificacion, setMensajeNotificacion] = useState<string | null>(null);

  // Filtrado de empresas
  const empresasFiltradas = empresas.filter(
    (e) =>
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.administradorPrincipal.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.cuit_rfc.includes(busqueda)
  );

  // Totales
  const totalActivas = empresas.filter((e) => e.estado === "Activa").length;
  const totalMontoMensual = empresas
    .filter((e) => e.estado === "Activa")
    .reduce((acc, curr) => acc + curr.precioFinal, 0);

  const guardarCambiosLicencia = () => {
    if (!empresaSeleccionada) return;

    let precioBase = 49;
    if (nuevoPlan === "Multi-Almacén") precioBase = 129;
    if (nuevoPlan === "Enterprise") precioBase = 299;

    const precioFinal = precioBase * (1 - nuevoDescuento / 100);

    setEmpresas(
      empresas.map((e) =>
        e.id === empresaSeleccionada.id
          ? {
              ...e,
              plan: nuevoPlan,
              precioBaseMensual: precioBase,
              descuentoPorcentaje: nuevoDescuento,
              precioFinal: parseFloat(precioFinal.toFixed(2)),
              estado: nuevoDescuento === 100 ? "Prueba Gratuita" : "Activa",
            }
          : e
      )
    );

    setMensajeNotificacion(`Licencia de "${empresaSeleccionada.nombre}" actualizada.`);
    setEmpresaSeleccionada(null);
    setTimeout(() => setMensajeNotificacion(null), 3500);
  };

  const toggleSuspension = (id: string) => {
    setEmpresas(
      empresas.map((e) => {
        if (e.id === id) {
          const nuevoEstado = e.estado === "Suspendida" ? "Activa" : "Suspendida";
          return { ...e, estado: nuevoEstado };
        }
        return e;
      })
    );
  };

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
                  Portal de Administración de Plataforma (VERTIA Core)
                </h1>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold">
                  Consola Interna
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Centro de gobierno para supervisar empresas, finanzas de suscripciones, salud de la red y roles de administración.
              </p>
            </div>
          </div>
        </div>

        {/* Indicador de rol activo */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">
          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
          <span>Sesión: <strong>Super Administrador (Humberto)</strong></span>
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
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            seccionActiva === "empresas"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Empresas & Suscripciones ({empresas.length})
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
          Economía & Finanzas (MRR)
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
          Salud, Tickets & Errores (3)
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
          Usuarios de Administración (4 Roles)
        </button>
      </div>

      {/* =========================================================================
          SECCIÓN 1: EMPRESAS & SUSCRIPCIONES
         ========================================================================= */}
      {seccionActiva === "empresas" && (
        <div className="space-y-4">
          {/* Métricas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Empresas Inscriptas</span>
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{empresas.length}</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                {totalActivas} con licencias operativas activas
              </span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Facturación Mensual (MRR)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                ${totalMontoMensual.toFixed(2)} USD
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Cobro recurrente de licencias InvenTrack
              </span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Bonificaciones & Descuentos</span>
                <Percent className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {empresas.filter((e) => e.descuentoPorcentaje > 0).length}
              </div>
              <span className="text-[11px] text-amber-700 mt-1 block">
                Planes con convenio o períodos de prueba
              </span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Almacenes Conectados</span>
                <Warehouse className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {empresas.reduce((acc, curr) => acc + curr.almacenesContratados, 0)}
              </div>
              <span className="text-[11px] text-purple-700 mt-1 block">
                Mono-almacén y multi-sucursal con matriz 3D
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
                placeholder="Buscar por corralón, CUIT o administrador..."
                className="pl-9 h-9 text-xs border-slate-200"
              />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
              <Plus className="w-4 h-4 mr-1.5" />
              Dar de Alta Corralón / Empresa
            </Button>
          </div>

          {/* Tabla de Empresas */}
          <Card className="bg-white border-slate-200 shadow-xs overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Empresa / Corralón</th>
                    <th className="py-3 px-4">Tipo & Almacenes</th>
                    <th className="py-3 px-4">Administrador</th>
                    <th className="py-3 px-4">Plan Asignado</th>
                    <th className="py-3 px-4 text-center">Descuento</th>
                    <th className="py-3 px-4 text-center">Cobro Mensual</th>
                    <th className="py-3 px-4 text-center">Estado Licencia</th>
                    <th className="py-3 px-4 text-right">Gestión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {empresasFiltradas.map((empresa) => (
                    <tr key={empresa.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{empresa.nombre}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{empresa.cuit_rfc}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{empresa.tipo}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Warehouse className="w-3 h-3 text-slate-400" />
                          {empresa.almacenesContratados === 1
                            ? "1 Almacén (Mono-sede)"
                            : `${empresa.almacenesContratados} Almacenes (Multi-sede)`}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{empresa.administradorPrincipal}</div>
                        <div className="text-[11px] text-slate-400">{empresa.emailAdmin}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] border ${
                            empresa.plan === "Mono-Almacén"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : empresa.plan === "Multi-Almacén"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {empresa.plan}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {empresa.descuentoPorcentaje > 0 ? (
                          <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px]">
                            -{empresa.descuentoPorcentaje}%
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Sin desc.</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-extrabold text-slate-900">
                          ${empresa.precioFinal.toFixed(2)} USD
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                            empresa.estado === "Activa"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : empresa.estado === "Prueba Gratuita"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {empresa.estado}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => {
                              setEmpresaSeleccionada(empresa);
                              setNuevoDescuento(empresa.descuentoPorcentaje);
                              setNuevoPlan(empresa.plan);
                            }}
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] border-slate-200 hover:bg-slate-50 text-slate-700"
                          >
                            Ajustar Plan
                          </Button>
                          <Button
                            onClick={() => toggleSuspension(empresa.id)}
                            variant="ghost"
                            size="sm"
                            className={`h-7 text-[11px] ${
                              empresa.estado === "Suspendida"
                                ? "text-emerald-700 hover:bg-emerald-50"
                                : "text-rose-600 hover:bg-rose-50"
                            }`}
                          >
                            {empresa.estado === "Suspendida" ? "Reactivar" : "Suspender"}
                          </Button>
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
          SECCIÓN 2: ECONOMÍA & FINANZAS
         ========================================================================= */}
      {seccionActiva === "economia" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 bg-white border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Ingresos Mensuales Recurrentes (MRR)</span>
              <div className="text-3xl font-black text-slate-900 mt-2">$3,450.00 USD</div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1">
                <ArrowUpRight className="w-4 h-4" /> +18.5% respecto al mes anterior
              </div>
            </Card>

            <Card className="p-5 bg-white border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Costos de Infraestructura Cloud</span>
              <div className="text-3xl font-black text-slate-700 mt-2">$25.00 USD</div>
              <div className="text-xs text-slate-400 mt-1">
                Cloudflare ($0) + Supabase Pro ($25)
              </div>
            </Card>

            <Card className="p-5 bg-white border-emerald-200 bg-emerald-50/20 shadow-xs">
              <span className="text-xs font-semibold text-emerald-800">Margen Operativo Bruto</span>
              <div className="text-3xl font-black text-emerald-700 mt-2">99.2%</div>
              <div className="text-xs text-emerald-800 font-medium mt-1">
                Negocio SaaS de alta rentabilidad
              </div>
            </Card>
          </div>

          <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Libro de Cobranzas & Movimientos Recientes</h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Corralón Los Pinos S.R.L.</span>
                  <span className="text-slate-400 block text-[11px]">Suscripción Plan Mono-Almacén • Factura #A-0004-1290</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700">+$49.00 USD</span>
                  <span className="text-[10px] text-slate-400 block">Cobrado (Tarjeta)</span>
                </div>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Materiales del Centro S.A.</span>
                  <span className="text-slate-400 block text-[11px]">Suscripción Plan Multi-Almacén (Desc. 20%) • Factura #A-0004-1291</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700">+$103.20 USD</span>
                  <span className="text-[10px] text-slate-400 block">Cobrado (Transferencia)</span>
                </div>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Supabase Inc. (Infraestructura Cloud)</span>
                  <span className="text-slate-400 block text-[11px]">Base de datos PostgreSQL 15 & Storage 100GB</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-rose-600">-$25.00 USD</span>
                  <span className="text-[10px] text-slate-400 block">Débito automático</span>
                </div>
              </div>
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
          SECCIÓN 4: USUARIOS DE ADMINISTRACIÓN (GOBIERNO DE ROLES)
         ========================================================================= */}
      {seccionActiva === "usuarios_admin" && (
        <div className="space-y-4">
          <Card className="p-4 bg-indigo-50/50 border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
            <div>
              <span className="font-bold block">Matriz de Roles de Administración de Plataforma</span>
              <span className="text-[11px] text-indigo-700">
                Los usuarios listados a continuación pertenecen al equipo interno de VERTIA y no a empresas clientes.
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
                          ? "Monitoreo de pedidos, corralones y evidencias"
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

      {/* Modal de Ajuste de Plan / Descuento */}
      {empresaSeleccionada && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="bg-white border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 rounded-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Gestión de Licencia
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
                  Plan de Suscripción InvenTrack:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNuevoPlan("Mono-Almacén")}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      nuevoPlan === "Mono-Almacén"
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-slate-900">Mono-Almacén</div>
                    <div className="text-[10px] text-slate-500">$49 USD/mes</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNuevoPlan("Multi-Almacén")}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      nuevoPlan === "Multi-Almacén"
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-slate-900">Multi-Almacén</div>
                    <div className="text-[10px] text-slate-500">$129 USD/mes</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNuevoPlan("Enterprise")}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      nuevoPlan === "Enterprise"
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-slate-900">Enterprise</div>
                    <div className="text-[10px] text-slate-500">$299 USD/mes</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Porcentaje de Descuento / Bonificación:
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={nuevoDescuento}
                    onChange={(e) => setNuevoDescuento(Number(e.target.value))}
                    className="w-28 text-sm border-slate-200"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNuevoDescuento(0)}
                      className="px-2 py-1 rounded bg-slate-100 text-[11px] text-slate-700"
                    >
                      0%
                    </button>
                    <button
                      type="button"
                      onClick={() => setNuevoDescuento(20)}
                      className="px-2 py-1 rounded bg-slate-100 text-[11px] text-slate-700"
                    >
                      20% Convenio
                    </button>
                    <button
                      type="button"
                      onClick={() => setNuevoDescuento(100)}
                      className="px-2 py-1 rounded bg-amber-100 text-[11px] text-amber-800 font-semibold"
                    >
                      100% Bonificado
                    </button>
                  </div>
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
                onClick={guardarCambiosLicencia}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Aplicar Ajustes
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
