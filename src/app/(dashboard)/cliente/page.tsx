"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  HardHat,
  Building2,
  Plus,
  Search,
  ClipboardList,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Phone,
  Filter,
  Boxes,
  ArrowRight,
  Eye,
  ShieldCheck,
  Calendar,
  Wrench,
  UserCheck,
  Star,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  ObraCliente,
  MultiTenantOrden,
  MOCK_PRODUCTOS,
} from "@/lib/data/mock-multi-tenant";
import {
  getStoredObras,
  getAllStoredOrdenes,
  getStoredProfesionales,
  getStoredSolicitudesServicios,
  updateStoredSolicitudServicio,
} from "@/lib/services/mock-store";
import { RubroProfesional, ProfesionalServicio, SolicitudServicio } from "@/types/domain";
import { NuevaObraModal } from "@/components/cliente/NuevaObraModal";
import { NuevaSolicitudModal } from "@/components/cliente/NuevaSolicitudModal";
import { DetallePedidoClienteModal } from "@/components/cliente/DetallePedidoClienteModal";
import { SolicitarProfesionalModal } from "@/components/cliente/SolicitarProfesionalModal";
import { RegistroProfesionalModal } from "@/components/cliente/RegistroProfesionalModal";

type TabCliente = "pedidos" | "obras" | "servicios" | "catalogo_red";

export default function ClientePage() {
  const { user } = useAuth();

  const clienteId = user?.id || "usr-sofia-valenzuela";
  const clienteNombre = user?.tenant_nombre || "Constructora Arcos S.A.";

  const [tabActiva, setTabActiva] = useState<TabCliente>("pedidos");
  const [obras, setObras] = useState<ObraCliente[]>([]);
  const [ordenes, setOrdenes] = useState<MultiTenantOrden[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("all");

  // Servicios & Profesionales
  const [solicitudesServicios, setSolicitudesServicios] = useState<SolicitudServicio[]>([]);
  const [profesionales, setProfesionales] = useState<ProfesionalServicio[]>([]);

  // Modales
  const [modalNuevaObra, setModalNuevaObra] = useState(false);
  const [modalNuevaSolicitud, setModalNuevaSolicitud] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<MultiTenantOrden | null>(null);
  const [modalSolicitarProfesional, setModalSolicitarProfesional] = useState(false);
  const [modalRegistroProfesional, setModalRegistroProfesional] = useState(false);

  // Notificación
  const [mensajeToast, setMensajeToast] = useState<string | null>(null);

  const mostrarToast = (msg: string) => {
    setMensajeToast(msg);
    setTimeout(() => setMensajeToast(null), 4000);
  };

  useEffect(() => {
    // Carga de obras y órdenes asociadas al cliente
    const obrasGuardadas = getStoredObras(clienteId);
    setObras(obrasGuardadas);

    const todasOrdenes = getAllStoredOrdenes();
    // Filtro por cliente o de muestra para Sofia Valenzuela
    const ordenesCliente = todasOrdenes.filter(
      (o) =>
        o.cliente_id === clienteId ||
        o.cliente.toLowerCase().includes("arcos") ||
        o.cliente.toLowerCase().includes("constructora")
    );
    setOrdenes(ordenesCliente.length > 0 ? ordenesCliente : todasOrdenes.slice(0, 3));

    // Cargar solicitudes de servicios y profesionales
    const srvs = getStoredSolicitudesServicios(clienteId);
    setSolicitudesServicios(srvs);
    const profs = getStoredProfesionales();
    setProfesionales(profs);
  }, [clienteId]);

  // Filtrado de órdenes
  const ordenesFiltradas = useMemo(() => {
    return ordenes.filter((ord) => {
      const matchTexto =
        ord.folio.toLowerCase().includes(busqueda.toLowerCase()) ||
        ord.proyectoUbicacion.toLowerCase().includes(busqueda.toLowerCase()) ||
        ord.detalles.some((d) => d.material.toLowerCase().includes(busqueda.toLowerCase()));

      const matchEstado =
        filtroEstado === "all" || ord.estado === filtroEstado;

      return matchTexto && matchEstado;
    });
  }, [ordenes, busqueda, filtroEstado]);

  // KPIs
  const totalObras = obras.length;
  const pedidosEnTransito = ordenes.filter((o) => o.estado === "En camino").length;
  const pedidosPorCotizar = ordenes.filter((o) => o.estado === "Por cotizar" || o.estado === "Asignada").length;
  const pedidosEntregados = ordenes.filter((o) => o.estado === "Entregada").length;

  const handleObraCreada = (nuevaObra: ObraCliente) => {
    setObras((prev) => [nuevaObra, ...prev]);
    mostrarToast(`Frente de obra "${nuevaObra.nombre_obra}" registrado con éxito.`);
  };

  const handleOrdenCreada = (nuevaOrden: MultiTenantOrden) => {
    setOrdenes((prev) => [nuevaOrden, ...prev]);
    mostrarToast(`Solicitud "${nuevaOrden.folio}" enviada a Vertia para cotización y asignación.`);
  };

  const handleOrdenActualizada = (ordenActualizada: MultiTenantOrden) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === ordenActualizada.id ? ordenActualizada : o))
    );
    if (ordenSeleccionada?.id === ordenActualizada.id) {
      setOrdenSeleccionada(ordenActualizada);
    }
  };

  const handleSolicitudServicioCreada = (nueva: SolicitudServicio) => {
    setSolicitudesServicios((prev) => [nueva, ...prev]);
    mostrarToast(`Requerimiento de ${nueva.rubro} ("${nueva.folio}") enviado a la Red Vertia.`);
  };

  const handleProfesionalRegistrado = (nuevo: ProfesionalServicio) => {
    setProfesionales((prev) => [nuevo, ...prev]);
    mostrarToast(`¡Bienvenido! Profesional "${nuevo.nombre}" dado de alta en Red Vertia.`);
  };

  const handleDarConformidadServicio = (srvId: string) => {
    const updated = updateStoredSolicitudServicio(srvId, {
      estado: "Finalizado con Conformidad",
      conformidad_cliente: true,
    });
    if (updated) {
      setSolicitudesServicios((prev) =>
        prev.map((s) => (s.id === srvId ? updated : s))
      );
      mostrarToast("¡Conformidad otorgada! Se ha notificado a Vertia para liberar el pago al profesional.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Toast Alert */}
      {mensajeToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{mensajeToast}</span>
          </div>
          <button
            onClick={() => setMensajeToast(null)}
            className="text-emerald-500 hover:text-emerald-700 font-bold ml-2 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Header Corporativo de Cliente */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shadow-2xs">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Portal de Abastecimiento & Obras
              </h1>
              <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-xs font-semibold">
                Constructora / Cliente
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              {clienteNombre} • Gestión de requerimientos de materiales, seguimiento de camiones y remitos oficiales.
            </p>
          </div>
        </div>

        {/* Botones de Acción Primarios */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalNuevaObra(true)}
            className="text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Frente de Obra</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalRegistroProfesional(true)}
            className="text-xs gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 cursor-pointer shadow-2xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Alta Profesional</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalSolicitarProfesional(true)}
            className="text-xs gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-50 cursor-pointer shadow-2xs"
          >
            <Wrench className="w-3.5 h-3.5 text-indigo-600" />
            <span>Solicitar Oficio / Servicio</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setModalNuevaSolicitud(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Solicitud Material</span>
          </Button>
        </div>
      </div>

      {/* Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Obras Activas
            </span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {totalObras}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Destinos de entrega</div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              En Camino
            </span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {pedidosEnTransito}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Fletes hacia obra</div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Mesa Vertia
            </span>
            <ClipboardList className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {pedidosPorCotizar}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">En coordinación</div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Servicios Red
            </span>
            <Wrench className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">
            {solicitudesServicios.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Oficios solicitados</div>
        </Card>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-px">
        <button
          onClick={() => setTabActiva("pedidos")}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
            tabActiva === "pedidos"
              ? "bg-white border-t border-x border-slate-200 text-indigo-700 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Mis Solicitudes & Pedidos ({ordenes.length})</span>
        </button>

        <button
          onClick={() => setTabActiva("servicios")}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
            tabActiva === "servicios"
              ? "bg-white border-t border-x border-slate-200 text-indigo-700 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Servicios & Oficios ({solicitudesServicios.length})</span>
        </button>

        <button
          onClick={() => setTabActiva("obras")}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
            tabActiva === "obras"
              ? "bg-white border-t border-x border-slate-200 text-indigo-700 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Frentes de Obra ({obras.length})</span>
        </button>

        <button
          onClick={() => setTabActiva("catalogo_red")}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
            tabActiva === "catalogo_red"
              ? "bg-white border-t border-x border-slate-200 text-indigo-700 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Materiales Disponibles en Red</span>
        </button>
      </div>

      {/* PESTAÑA 1: SOLICITUDES Y PEDIDOS */}
      {tabActiva === "pedidos" && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar por folio VT, obra o material..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Todos los estados</option>
                <option value="Por cotizar">Por cotizar (Vertia)</option>
                <option value="Asignada">Asignada a Corralón</option>
                <option value="En preparación">En preparación (Picking)</option>
                <option value="En camino">En camino (Flete)</option>
                <option value="Entregada">Entregada</option>
              </select>
            </div>
          </div>

          {/* Tabla de Órdenes */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            {ordenesFiltradas.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <ClipboardList className="w-10 h-10 mx-auto text-slate-300" />
                <div className="text-sm font-semibold text-slate-700">No se encontraron solicitudes</div>
                <p className="text-xs text-slate-400">
                  Crea tu primer requerimiento de material para abastecer tus obras desde la Red Vertia.
                </p>
                <Button
                  size="sm"
                  onClick={() => setModalNuevaSolicitud(true)}
                  className="mt-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Nueva Solicitud
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Folio / Fecha</th>
                      <th className="py-3 px-4">Frente de Obra</th>
                      <th className="py-3 px-4">Corralón Asignado</th>
                      <th className="py-3 px-4">Materiales</th>
                      <th className="py-3 px-4">Estado Logístico</th>
                      <th className="py-3 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ordenesFiltradas.map((ord) => (
                      <tr
                        key={ord.id}
                        onClick={() => setOrdenSeleccionada(ord)}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {ord.folio}
                          </div>
                          <div className="text-[10px] text-slate-400">{ord.fecha}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 max-w-[200px] truncate">
                            {ord.proyectoUbicacion}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Distancia: {ord.distanciaKm} km
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {ord.corralonAsignado}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-slate-800 font-medium">
                            {ord.detalles[0]?.material}
                            {ord.detalles.length > 1 && (
                              <span className="ml-1 text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                                +{ord.detalles.length - 1} más
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Total: {ord.detalles.reduce((acc, d) => acc + d.cantidadSolicitada, 0)} unidades
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold px-2 py-0.5 ${
                              ord.estado === "Entregada"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : ord.estado === "Presupuesto listo"
                                ? "bg-purple-50 text-purple-800 border-purple-300 font-extrabold ring-1 ring-purple-200"
                                : ord.estado === "En camino"
                                ? "bg-amber-50 text-amber-800 border-amber-200 animate-pulse"
                                : ord.estado === "En preparación"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {ord.estado}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Button
                            variant={ord.estado === "Presupuesto listo" ? "default" : "ghost"}
                            size="sm"
                            className={`text-xs h-7 gap-1 ${
                              ord.estado === "Presupuesto listo"
                                ? "bg-purple-600 hover:bg-purple-700 text-white font-bold"
                                : "text-indigo-700 hover:bg-indigo-50"
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{ord.estado === "Presupuesto listo" ? "Ver Presupuesto" : "Detalle"}</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA: SERVICIOS Y OFICIOS */}
      {tabActiva === "servicios" && (
        <div className="space-y-6">
          {/* Banner de Garantía y Acciones */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900">
                  Garantía de Oficios & Pagos en Custodia Vertia
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl">
                Contrata gasistas, electricistas, plomeros y albañiles matriculados de la Red Vertia para tus obras. Tu pago queda en custodia y solo se transfiere al profesional cuando otorgas la <strong>Conformidad de Finalización</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalRegistroProfesional(true)}
                className="text-xs gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-100/50"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Alta Profesional</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setModalSolicitarProfesional(true)}
                className="text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Solicitar Profesional</span>
              </Button>
            </div>
          </div>

          {/* Tabla de Requerimientos de Servicios */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-purple-600" />
                <span>Requerimientos de Servicios en Curso</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {solicitudesServicios.length} solicitud(es)
              </span>
            </div>

            {solicitudesServicios.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Wrench className="w-8 h-8 mx-auto text-slate-300" />
                <div className="text-xs font-semibold text-slate-600">No hay servicios solicitados actualmente</div>
                <p className="text-[11px] text-slate-400">
                  Solicita gasistas, electricistas o albañiles de la red para tus obras.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Folio / Fecha</th>
                      <th className="py-3 px-4">Frente de Obra</th>
                      <th className="py-3 px-4">Rubro & Tarea</th>
                      <th className="py-3 px-4">Profesional Designado</th>
                      <th className="py-3 px-4">Presupuesto / Custodia</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Conformidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {solicitudesServicios.map((srv) => (
                      <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900">{srv.folio}</div>
                          <div className="text-[10px] text-slate-400">Req: {srv.fecha_requerida}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{srv.obra_nombre}</div>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200 font-bold mb-1">
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
                            <span className="text-[11px] text-amber-600 font-medium italic">
                              Buscando en red...
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900">
                            ${srv.costo_estimado.toLocaleString("es-AR")}
                          </div>
                          <div className="text-[10px]">
                            {srv.cobrado_cliente ? (
                              <span className="text-emerald-600 font-bold">✓ En custodia Vertia</span>
                            ) : (
                              <span className="text-amber-600 font-medium">Pendiente cobro</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold px-2 py-0.5 ${
                              srv.estado === "Finalizado con Conformidad" || srv.estado === "Liquidado y Pagado"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : srv.estado === "En ejecución"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {srv.estado}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-right">
                          {srv.conformidad_cliente ? (
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Conforme</span>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleDarConformidadServicio(srv.id)}
                              className="text-xs h-7 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-2xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Dar Conformidad</span>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Directorio de Profesionales de la Red */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Profesionales & Oficios Matriculados en Red Vertia</span>
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {profesionales.length} profesionales registrados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profesionales.map((prof) => (
                <Card key={prof.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200 font-bold">
                        {prof.rubro}
                      </Badge>
                      <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{prof.calificacion.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="font-bold text-xs text-slate-900 mt-2">{prof.nombre}</div>
                    {prof.matricula && (
                      <div className="text-[10px] text-slate-400 font-medium">
                        Matrícula: {prof.matricula}
                      </div>
                    )}

                    <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{prof.zona_cobertura}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{prof.telefono}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-2">
                    <span className="text-xs font-extrabold text-slate-800">
                      ${prof.tarifa_hora_estimada?.toLocaleString("es-AR") || "8.500"}/h
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setModalSolicitarProfesional(true)}
                      className="text-xs h-7 text-purple-700 border-purple-200 hover:bg-purple-50"
                    >
                      Solicitar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: FRENTES DE OBRA */}
      {tabActiva === "obras" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Frentes de obra registrados con puntos de descarga y capataces autorizados.
            </p>
            <Button
              size="sm"
              onClick={() => setModalNuevaObra(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Frente de Obra</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {obras.map((obra) => (
              <Card
                key={obra.id}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 font-bold px-2 py-0.5 rounded-full">
                      Obra Activa
                    </span>
                    <span className="text-[10px] text-slate-400">Inicio: {obra.fecha_inicio}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mt-2">
                    {obra.nombre_obra}
                  </h3>

                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{obra.direccion}, {obra.ciudad}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HardHat className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{obra.responsable_contacto}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{obra.telefono_contacto}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Pedidos vinculados: <strong>{ordenes.filter((o) => o.obra_id === obra.id || o.proyectoUbicacion.includes(obra.nombre_obra)).length}</strong>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTabActiva("pedidos");
                      setBusqueda(obra.nombre_obra);
                    }}
                    className="text-xs h-7 text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                  >
                    Ver Pedidos
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: CATÁLOGO RED B2B */}
      {tabActiva === "catalogo_red" && (
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-indigo-700 shrink-0" />
              <span>
                Materiales publicados con stock disponible por los corralones de la Red Vertia dentro de tu radio logístico.
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => setModalNuevaSolicitud(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
            >
              Solicitar Material
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOCK_PRODUCTOS.filter((p) => p.publicado_en_red).map((prod) => (
              <Card key={prod.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 font-bold">
                    {prod.categoria}
                  </Badge>
                  <span className="text-xs font-extrabold text-indigo-700">
                    ${prod.precio.toLocaleString("es-AR")} / {prod.unidad_medida}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900">{prod.nombre}</div>
                <div className="text-[11px] text-slate-500">
                  Stock Disponible en Red: <strong>{prod.stock_disponible} {prod.unidad_medida}</strong>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setModalNuevaSolicitud(true)}
                  className="w-full text-xs h-7 text-indigo-700 border-indigo-200 hover:bg-indigo-50 mt-1"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Agregar a mi Solicitud
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal Nueva Obra */}
      {modalNuevaObra && (
        <NuevaObraModal
          isOpen={modalNuevaObra}
          onClose={() => setModalNuevaObra(false)}
          clienteId={clienteId}
          clienteNombre={clienteNombre}
          onObraCreada={handleObraCreada}
        />
      )}

      {/* Modal Nueva Solicitud */}
      {modalNuevaSolicitud && (
        <NuevaSolicitudModal
          isOpen={modalNuevaSolicitud}
          onClose={() => setModalNuevaSolicitud(false)}
          clienteId={clienteId}
          clienteNombre={clienteNombre}
          obras={obras}
          onOrdenCreada={handleOrdenCreada}
        />
      )}

      {/* Modal Detalle de Pedido */}
      {ordenSeleccionada && (
        <DetallePedidoClienteModal
          isOpen={Boolean(ordenSeleccionada)}
          onClose={() => setOrdenSeleccionada(null)}
          orden={ordenSeleccionada}
          onOrdenActualizada={handleOrdenActualizada}
        />
      )}

      {/* Modal Solicitar Profesional */}
      {modalSolicitarProfesional && (
        <SolicitarProfesionalModal
          isOpen={modalSolicitarProfesional}
          onClose={() => setModalSolicitarProfesional(false)}
          clienteId={clienteId}
          clienteNombre={clienteNombre}
          obras={obras}
          onSolicitudCreada={handleSolicitudServicioCreada}
        />
      )}

      {/* Modal Registro Profesional */}
      {modalRegistroProfesional && (
        <RegistroProfesionalModal
          isOpen={modalRegistroProfesional}
          onClose={() => setModalRegistroProfesional(false)}
          onProfesionalRegistrado={handleProfesionalRegistrado}
        />
      )}
    </div>
  );
}
