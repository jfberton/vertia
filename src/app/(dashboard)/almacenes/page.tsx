"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Warehouse,
  Plus,
  Layers,
  MapPin,
  Box,
  CheckCircle2,
  Search,
  Filter,
  Navigation,
  Compass,
  Building2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  MOCK_ALMACENES,
  MOCK_UBICACIONES,
  MOCK_TENANTS,
  MultiTenantAlmacen,
  MultiTenantUbicacion,
} from "@/lib/data/mock-multi-tenant";

export default function AlmacenesPage() {
  const { user, tenant, allTenants } = useAuth();
  const isSuperAdmin = user?.is_super_admin ?? false;

  const [superAdminTenantFilter, setSuperAdminTenantFilter] = useState<string>("all");
  const [almacenes, setAlmacenes] = useState<MultiTenantAlmacen[]>(MOCK_ALMACENES);
  const [ubicaciones, setUbicaciones] = useState<MultiTenantUbicacion[]>(MOCK_UBICACIONES);

  // Modal para nuevo galpón
  const [modalNuevoAlmacen, setModalNuevoAlmacen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDireccion, setNuevaDireccion] = useState("");
  const [nuevoRadio, setNuevoRadio] = useState("25");
  const [esZonaRecepcion, setEsZonaRecepcion] = useState(false);

  // Effective Tenant ID
  const effectiveTenantId = useMemo(() => {
    if (isSuperAdmin) {
      return superAdminTenantFilter;
    }
    return user?.tenant_id || "tenant-los-pinos";
  }, [isSuperAdmin, superAdminTenantFilter, user?.tenant_id]);

  // Filtered warehouses by tenant
  const almacenesFiltrados = useMemo(() => {
    if (effectiveTenantId === "all") {
      return almacenes;
    }
    return almacenes.filter((a) => a.tenant_id === effectiveTenantId);
  }, [almacenes, effectiveTenantId]);

  // Selected warehouse
  const [almacenSeleccionadoId, setAlmacenSeleccionadoId] = useState<string>("");

  useEffect(() => {
    if (almacenesFiltrados.length > 0) {
      // If current selected is not in filtered list, pick the first
      const stillValid = almacenesFiltrados.some((a) => a.id === almacenSeleccionadoId);
      if (!stillValid) {
        setAlmacenSeleccionadoId(almacenesFiltrados[0].id);
      }
    } else {
      setAlmacenSeleccionadoId("");
    }
  }, [almacenesFiltrados, almacenSeleccionadoId]);

  const almacenSeleccionado = useMemo(() => {
    return almacenesFiltrados.find((a) => a.id === almacenSeleccionadoId) || almacenesFiltrados[0];
  }, [almacenesFiltrados, almacenSeleccionadoId]);

  // Ubicaciones del almacén seleccionado
  const ubicacionesAlmacen = useMemo(() => {
    if (!almacenSeleccionado) return [];
    return ubicaciones.filter((u) => u.almacen_id === almacenSeleccionado.id);
  }, [ubicaciones, almacenSeleccionado]);

  // Ubicacion seleccionada
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<MultiTenantUbicacion | null>(null);

  useEffect(() => {
    if (ubicacionesAlmacen.length > 0) {
      setUbicacionSeleccionada(ubicacionesAlmacen[0]);
    } else {
      setUbicacionSeleccionada(null);
    }
  }, [ubicacionesAlmacen]);

  const handleCrearAlmacen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevaDireccion) return;

    const targetTenant = effectiveTenantId === "all" ? "tenant-los-pinos" : effectiveTenantId;

    const nuevoAlm: MultiTenantAlmacen = {
      id: `alm-${Date.now()}`,
      tenant_id: targetTenant,
      nombre: nuevoNombre,
      direccion: nuevaDireccion,
      radio_cobertura_km: Number(nuevoRadio) || 25,
      coordenadas_gps: "-32.9550, -60.6600",
      capacidad_maxima: 3000,
      es_zona_recepcion: esZonaRecepcion,
      total_ubicaciones: 60,
      ocupacion_porcentaje: 10,
      descripcion: "Nueva nave de almacenamiento registrada.",
    };

    setAlmacenes([...almacenes, nuevoAlm]);
    setAlmacenSeleccionadoId(nuevoAlm.id);
    setModalNuevoAlmacen(false);
    setNuevoNombre("");
    setNuevaDireccion("");
    setNuevoRadio("25");
    setEsZonaRecepcion(false);
  };

  const getTenantName = (tId: string) => {
    const found = allTenants.find((t) => t.id === tId) || MOCK_TENANTS.find((t) => t.id === tId);
    return found?.nombre || tId;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Almacenes, Matriz Espacial 3D & Radio de Cobertura
              </h1>
              <p className="text-xs text-slate-500">
                Visualización espacial de racks/niveles y configuración de alcance de flete logístico para la red VERTIA.
              </p>
            </div>
          </div>
        </div>

        {/* Controles de Tenant */}
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
            onClick={() => setModalNuevoAlmacen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nuevo Almacén / Galpón
          </Button>
        </div>
      </div>

      {/* Selector de Almacenes (Tarjetas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {almacenesFiltrados.length === 0 ? (
          <div className="col-span-full p-6 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            No hay almacenes registrados para este corralón.
          </div>
        ) : (
          almacenesFiltrados.map((alm) => {
            const esActivo = alm.id === almacenSeleccionado?.id;
            return (
              <button
                key={alm.id}
                onClick={() => setAlmacenSeleccionadoId(alm.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  esActivo
                    ? "bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs">{alm.nombre}</span>
                  {alm.es_zona_recepcion && (
                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]">
                      Zona Recepción
                    </Badge>
                  )}
                </div>

                {isSuperAdmin && effectiveTenantId === "all" && (
                  <div className="text-[10px] text-indigo-600 font-semibold mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {getTenantName(alm.tenant_id)}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{alm.direccion}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                  <span className="text-indigo-600 font-semibold flex items-center gap-1">
                    <Compass className="w-3 h-3" /> Radio: {alm.radio_cobertura_km} km
                  </span>
                  <span className="font-bold text-slate-700">
                    {alm.ocupacion_porcentaje}% ocupación
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Grid: Matriz 3D y Detalle */}
      {almacenSeleccionado && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Matriz 3D (8 columnas) */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Matriz Espacial Nativa InvenTrack
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {almacenSeleccionado.nombre} — Racks, Estantes y Bahías
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span> Completo
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-500"></span> Ocupado
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-xs border border-dashed border-slate-300"></span> Vacío
                  </span>
                </div>
              </div>

              {/* Representación visual de Racks y Niveles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {ubicacionesAlmacen.length === 0 ? (
                  <div className="col-span-full py-6 text-center text-slate-400 text-xs">
                    No hay ubicaciones registradas en esta nave.
                  </div>
                ) : (
                  ubicacionesAlmacen.map((u) => {
                    const esActiva = u.id === ubicacionSeleccionada?.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => setUbicacionSeleccionada(u)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          esActiva
                            ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10 shadow-xs"
                            : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-slate-800">
                            {u.codigo_visual}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              u.estado === "completo"
                                ? "bg-emerald-500"
                                : u.estado === "ocupado"
                                ? "bg-amber-500"
                                : "bg-slate-300"
                            }`}
                          ></span>
                        </div>
                        {u.producto_actual ? (
                          <div>
                            <div className="text-[11px] font-semibold text-slate-800 line-clamp-1">
                              {u.producto_actual}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {u.cantidad} unidades • {u.lote}
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">Posición disponible / Vacío</div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Ficha de Ubicación y Datos GPS (4 columnas) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm p-4 rounded-xl space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Detalle de Posición Espacial
                </span>
                <h3 className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                  {ubicacionSeleccionada?.codigo_visual || "Selecciona una posición"}
                </h3>
              </div>

              {ubicacionSeleccionada && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="text-slate-500 text-[11px]">Material Asignado:</div>
                    <div className="font-bold text-slate-900 text-sm">
                      {ubicacionSeleccionada.producto_actual || "Bahía / Posición Libre"}
                    </div>
                    {typeof ubicacionSeleccionada.cantidad === "number" && ubicacionSeleccionada.cantidad > 0 && (
                      <div className="text-slate-600 text-xs">
                        Cantidad: <strong className="text-slate-900">{ubicacionSeleccionada.cantidad} bultos / u</strong>
                      </div>
                    )}
                    {ubicacionSeleccionada.lote && (
                      <div className="text-slate-500 text-[11px] font-mono">
                        Lote: {ubicacionSeleccionada.lote}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block">Fila / Rack:</span>
                      <span className="font-bold text-slate-700">
                        F0{ubicacionSeleccionada.fila} • R0{ubicacionSeleccionada.rack}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block">Estantería / Nivel:</span>
                      <span className="font-bold text-slate-700">
                        E0{ubicacionSeleccionada.estanteria} • N{ubicacionSeleccionada.nivel}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-800 block">
                      Geolocalización & Radio de Entrega:
                    </span>
                    <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-[11px] space-y-1 text-slate-600">
                      <div>
                        GPS: <span className="font-mono text-slate-800">{almacenSeleccionado.coordenadas_gps}</span>
                      </div>
                      <div>
                        Radio de flete: <strong className="text-indigo-700">{almacenSeleccionado.radio_cobertura_km} km a la redonda</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Modal Registrar Almacén */}
      {modalNuevoAlmacen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 w-full max-w-md space-y-4 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-indigo-600" />
              Nuevo Galpón / Centro de Acopio
            </h2>
            <form onSubmit={handleCrearAlmacen} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre del Galpón</label>
                <Input
                  required
                  placeholder="Ej: Galpón Norte Acero"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dirección / Acceso</label>
                <Input
                  required
                  placeholder="Ej: Ruta 9 Km 285"
                  value={nuevaDireccion}
                  onChange={(e) => setNuevaDireccion(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Radio Cobertura (km)</label>
                  <Input
                    type="number"
                    value={nuevoRadio}
                    onChange={(e) => setNuevoRadio(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={esZonaRecepcion}
                      onChange={(e) => setEsZonaRecepcion(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span className="font-semibold text-slate-700">Zona Recepción</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalNuevoAlmacen(false)}
                  className="h-8 text-xs"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                  Crear Almacén
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
