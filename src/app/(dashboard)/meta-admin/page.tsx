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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface EmpresaLicencia {
  id: string;
  nombre: string;
  cuit_rfc: string;
  tipo: "Corralón de Materiales" | "Contratista / Obras" | "Constructora";
  almacenesContratados: number; // 1 para mono-almacén, >1 para multi-almacén
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

const mockEmpresas: EmpresaLicencia[] = [
  {
    id: "emp-1",
    nombre: "Corralón Los Pinos S.R.L.",
    cuit_rfc: "30-71458921-8",
    tipo: "Corralón de Materiales",
    almacenesContratados: 1, // Ejemplo pedido por Humberto: 1 almacén con un administrador
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
    almacenesContratados: 3, // Multi-almacén
    administradorPrincipal: "Lic. Carlos Benítez",
    emailAdmin: "carlos@materialesdelcentro.com",
    plan: "Multi-Almacén",
    precioBaseMensual: 129.0,
    descuentoPorcentaje: 20, // Descuento de convenio
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
    descuentoPorcentaje: 100, // 3 meses gratis de bienvenida
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

export default function MetaAdminPage() {
  const [empresas, setEmpresas] = useState<EmpresaLicencia[]>(mockEmpresas);
  const [busqueda, setBusqueda] = useState("");
  const [empresaSeleccionada, setEmpresaSeleccionada] =
    useState<EmpresaLicencia | null>(null);
  const [nuevoDescuento, setNuevoDescuento] = useState(0);
  const [nuevoPlan, setNuevoPlan] = useState<"Mono-Almacén" | "Multi-Almacén" | "Enterprise">("Mono-Almacén");
  const [mensajeNotificacion, setMensajeNotificacion] = useState<string | null>(null);

  // Filtrado
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

  const abrirModalAjuste = (empresa: EmpresaLicencia) => {
    setEmpresaSeleccionada(empresa);
    setNuevoDescuento(empresa.descuentoPorcentaje);
    setNuevoPlan(empresa.plan);
  };

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

    setMensajeNotificacion(
      `Plan y descuento actualizados con éxito para "${empresaSeleccionada.nombre}".`
    );
    setEmpresaSeleccionada(null);
    setTimeout(() => setMensajeNotificacion(null), 4000);
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
      {/* Header Meta-Admin */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Panel Meta-Administrador (VERTIA Core)
                </h1>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold">
                  Acceso Humberto
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Gestión de empresas cliente (corralones, contratistas), administración de licencias, cobros y políticas de descuentos.
              </p>
            </div>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
          <Plus className="w-4 h-4 mr-1.5" />
          Dar de Alta Nueva Empresa
        </Button>
      </div>

      {mensajeNotificacion && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeNotificacion}</span>
        </div>
      )}

      {/* Métricas Globales del Negocio SaaS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Empresas en la Red</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{empresas.length}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2 este mes
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {totalActivas} con licencias operativas activas
          </span>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Facturación Mensual (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              ${totalMontoMensual.toFixed(2)} USD
            </span>
            <span className="text-xs text-slate-500 font-medium">/ mes</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Ingresos netos por cobro de licencias InvenTrack
          </span>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Descuentos & Becas</span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {empresas.filter((e) => e.descuentoPorcentaje > 0).length}
            </span>
            <span className="text-xs text-amber-700 font-medium">Planes bonificados</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Convenios con cámaras de construcción y pruebas
          </span>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Almacenes Conectados</span>
            <Warehouse className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {empresas.reduce((acc, curr) => acc + curr.almacenesContratados, 0)}
            </span>
            <span className="text-xs text-purple-700 font-medium">Galpones activos</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Mono-almacén y multi-sucursal con matriz 3D
          </span>
        </Card>
      </div>

      {/* Filtros de Búsqueda de Empresas */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por corralón, CUIT o administrador..."
            className="pl-9 h-9 text-xs border-slate-200"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
            Filtro: Todos los planes
          </Badge>
        </div>
      </div>

      {/* Tabla Principal de Empresas y Licencias */}
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
                    {empresa.descuentoPorcentaje > 0 && (
                      <div className="text-[10px] text-slate-400 line-through">
                        ${empresa.precioBaseMensual.toFixed(2)} USD
                      </div>
                    )}
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
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          empresa.estado === "Activa"
                            ? "bg-emerald-600"
                            : empresa.estado === "Prueba Gratuita"
                            ? "bg-indigo-600"
                            : "bg-rose-600"
                        }`}
                      ></span>
                      {empresa.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        onClick={() => abrirModalAjuste(empresa)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] border-slate-200 hover:bg-slate-50 text-slate-700"
                      >
                        Ajustar Licencia
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

      {/* Modal de Ajuste de Licencias, Planes y Descuentos */}
      {empresaSeleccionada && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="bg-white border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 rounded-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Control Meta-Administrador
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Ajustar Licencia: {empresaSeleccionada.nombre}
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
              {/* Selección de Plan */}
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
                    <div className="text-[9px] text-slate-400 mt-0.5">1 Galpón</div>
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
                    <div className="text-[9px] text-slate-400 mt-0.5">Hasta 5 sedes</div>
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
                    <div className="text-[9px] text-slate-400 mt-0.5">Ilimitado</div>
                  </button>
                </div>
              </div>

              {/* Manejo de Descuento */}
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
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700"
                    >
                      0% (Sin desc.)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNuevoDescuento(20)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700"
                    >
                      20% Convenio
                    </button>
                    <button
                      type="button"
                      onClick={() => setNuevoDescuento(100)}
                      className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-[11px] text-amber-800 font-semibold"
                    >
                      100% (Prueba Gratis)
                    </button>
                  </div>
                </div>
              </div>

              {/* Cálculo en vivo */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Precio Base del Plan:</span>
                  <span>
                    ${nuevoPlan === "Mono-Almacén" ? "49.00" : nuevoPlan === "Multi-Almacén" ? "129.00" : "299.00"} USD
                  </span>
                </div>
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Descuento aplicado:</span>
                  <span>-{nuevoDescuento}%</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Cobro Mensual:</span>
                  <span className="text-indigo-600">
                    $
                    {(
                      (nuevoPlan === "Mono-Almacén" ? 49 : nuevoPlan === "Multi-Almacén" ? 129 : 299) *
                      (1 - nuevoDescuento / 100)
                    ).toFixed(2)}{" "}
                    USD
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
                onClick={guardarCambiosLicencia}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Guardar y Aplicar Cambios
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
