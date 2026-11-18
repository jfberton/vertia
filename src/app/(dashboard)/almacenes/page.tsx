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
  Sparkles,
  PackageOpen,
  ArrowRight,
  Info,
  Check,
  Send,
  ArrowDownToLine,
  ArrowUpFromLine,
  LayoutGrid,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  MOCK_ALMACENES,
  MOCK_TENANTS,
  MultiTenantAlmacen,
} from "@/lib/data/mock-multi-tenant";
import {
  SpatialCell,
  RecepcionItem,
  EmbarqueItem,
  EmbarqueEstado,
  CellStatus,
  MOCK_RECEPCION_ITEMS,
  MOCK_EMBARQUE_ITEMS,
  getSpatialCellsForWarehouse,
  calculateCellStatus,
} from "@/lib/data/mock-spatial-warehouse";
import { WarehouseReceptionCard } from "@/components/warehouses/WarehouseReceptionCard";
import { WarehouseEmbarqueCard } from "@/components/warehouses/WarehouseEmbarqueCard";
import { WarehouseMatrix2D } from "@/components/warehouses/WarehouseMatrix2D";
import { WarehouseCellInspector } from "@/components/warehouses/WarehouseCellInspector";
import { WarehouseSlottingModal } from "@/components/warehouses/WarehouseSlottingModal";

type TabOperativa = "integral" | "recepcion" | "matriz" | "embarque";

export default function AlmacenesPage() {
  const { user, tenant, allTenants } = useAuth();
  const isSuperAdmin = user?.is_super_admin ?? false;

  const [superAdminTenantFilter, setSuperAdminTenantFilter] = useState<string>("all");
  const [almacenes, setAlmacenes] = useState<MultiTenantAlmacen[]>(MOCK_ALMACENES);
  const [activeTab, setActiveTab] = useState<TabOperativa>("integral");

  // Modal para nuevo galpón
  const [modalNuevoAlmacen, setModalNuevoAlmacen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDireccion, setNuevaDireccion] = useState("");
  const [nuevoRadio, setNuevoRadio] = useState("25");
  const [esZonaRecepcion, setEsZonaRecepcion] = useState(false);
  const [esZonaEmbarque, setEsZonaEmbarque] = useState(false);

  // Notificación de acción / Toast
  const [toastNotification, setToastNotification] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Effective Tenant ID
  const effectiveTenantId = useMemo(() => {
    if (isSuperAdmin) {
      return superAdminTenantFilter;
    }
    return user?.tenant_id || "tenant-los-pinos";
  }, [isSuperAdmin, superAdminTenantFilter, user?.tenant_id]);

  // Almacenes filtrados por corralón
  const almacenesFiltrados = useMemo(() => {
    if (effectiveTenantId === "all") {
      return almacenes;
    }
    return almacenes.filter((a) => a.tenant_id === effectiveTenantId);
  }, [almacenes, effectiveTenantId]);

  // Almacén seleccionado
  const [almacenSeleccionadoId, setAlmacenSeleccionadoId] = useState<string>("");

  useEffect(() => {
    if (almacenesFiltrados.length > 0) {
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

  // ==========================================
  // ESTADO DE MATRIZ ESPACIAL (CELDAS WMS 2D)
  // ==========================================
  const [warehouseCellsMap, setWarehouseCellsMap] = useState<Record<string, SpatialCell[]>>({});

  useEffect(() => {
    if (almacenSeleccionado && !warehouseCellsMap[almacenSeleccionado.id]) {
      const initialCells = getSpatialCellsForWarehouse(
        almacenSeleccionado.id,
        almacenSeleccionado.tenant_id,
        almacenSeleccionado.nombre
      );
      setWarehouseCellsMap((prev) => ({
        ...prev,
        [almacenSeleccionado.id]: initialCells,
      }));
    }
  }, [almacenSeleccionado, warehouseCellsMap]);

  const currentWarehouseCells = useMemo(() => {
    if (!almacenSeleccionado) return [];
    return (
      warehouseCellsMap[almacenSeleccionado.id] ||
      getSpatialCellsForWarehouse(
        almacenSeleccionado.id,
        almacenSeleccionado.tenant_id,
        almacenSeleccionado.nombre
      )
    );
  }, [almacenSeleccionado, warehouseCellsMap]);

  // Celda seleccionada para el Inspector
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  useEffect(() => {
    if (currentWarehouseCells.length > 0) {
      const exists = currentWarehouseCells.find((c) => c.id === selectedCellId);
      if (!exists) {
        setSelectedCellId(currentWarehouseCells[0].id);
      }
    } else {
      setSelectedCellId(null);
    }
  }, [currentWarehouseCells, selectedCellId]);

  const selectedCell = useMemo(() => {
    return currentWarehouseCells.find((c) => c.id === selectedCellId) || null;
  }, [currentWarehouseCells, selectedCellId]);

  // ==========================================
  // 1. ZONA DE RECEPCIÓN / PULMÓN DE INGRESO
  // ==========================================
  const [receptionItems, setReceptionItems] = useState<RecepcionItem[]>(MOCK_RECEPCION_ITEMS);

  const currentReceptionItems = useMemo(() => {
    if (!almacenSeleccionado) return [];
    return receptionItems.filter(
      (item) =>
        item.almacen_id === almacenSeleccionado.id ||
        (item.tenant_id === almacenSeleccionado.tenant_id && !item.almacen_id)
    );
  }, [receptionItems, almacenSeleccionado]);

  // ==========================================
  // 3. ZONA DE EMBARQUE / PULMÓN DE SALIDA
  // ==========================================
  const [embarqueItems, setEmbarqueItems] = useState<EmbarqueItem[]>(MOCK_EMBARQUE_ITEMS);

  const currentEmbarqueItems = useMemo(() => {
    if (!almacenSeleccionado) return [];
    return embarqueItems.filter(
      (item) =>
        item.almacen_id === almacenSeleccionado.id ||
        (item.tenant_id === almacenSeleccionado.tenant_id && !item.almacen_id)
    );
  }, [embarqueItems, almacenSeleccionado]);

  const handleEmbarqueStatusChange = (itemId: string, newStatus: EmbarqueEstado) => {
    setEmbarqueItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, estado: newStatus } : i))
    );
    showNotification(`Despacho actualizado: "${newStatus}".`, "success");
  };

  // ==========================================
  // MODAL DE SLOTTING (ACOMODO DE MERCADERÍA)
  // ==========================================
  const [modalSlottingOpen, setModalSlottingOpen] = useState(false);
  const [slottingPreselectedItem, setSlottingPreselectedItem] = useState<RecepcionItem | null>(null);
  const [slottingPreselectedCell, setSlottingPreselectedCell] = useState<SpatialCell | null>(null);

  const handleOpenSlottingModal = (item?: RecepcionItem, cell?: SpatialCell) => {
    setSlottingPreselectedItem(item || null);
    setSlottingPreselectedCell(cell || selectedCell || null);
    setModalSlottingOpen(true);
  };

  const handlePerformSlotting = ({
    receptionItemId,
    cellId,
    quantity,
    notes,
  }: {
    receptionItemId: string;
    cellId: string;
    quantity: number;
    notes?: string;
  }) => {
    const item = receptionItems.find((i) => i.id === receptionItemId);
    if (!item || !almacenSeleccionado) return;

    // 1. Actualizar lista de recepción (descontar cantidad pendiente)
    setReceptionItems((prev) =>
      prev.map((i) => {
        if (i.id === receptionItemId) {
          const nuevaCantidad = Math.max(0, i.cantidad_pendiente - quantity);
          return {
            ...i,
            cantidad_pendiente: nuevaCantidad,
            estado: nuevaCantidad === 0 ? "completado" : "en_proceso",
          };
        }
        return i;
      })
    );

    // 2. Actualizar la celda de destino en la matriz espacial 2D
    setWarehouseCellsMap((prev) => {
      const currentList = prev[almacenSeleccionado.id] || currentWarehouseCells;
      const updated = currentList.map((cell) => {
        if (cell.id === cellId) {
          const nuevaCantidad = cell.cantidad_actual + quantity;
          const nuevoPorcentaje = Math.round((nuevaCantidad / cell.capacidad_maxima) * 100);
          const nuevoEstado = calculateCellStatus(nuevoPorcentaje);
          const nuevoPeso = cell.peso_actual_kg + Math.round((item.peso_total_kg / item.cantidad_total) * quantity);

          return {
            ...cell,
            cantidad_actual: nuevaCantidad,
            porcentaje_ocupacion: nuevoPorcentaje,
            estado: nuevoEstado,
            producto_actual: item.producto_nombre,
            sku: item.sku,
            categoria: item.categoria,
            lote: item.lote,
            peso_actual_kg: nuevoPeso,
            fecha_ingreso: "Hoy " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            observaciones: notes || cell.observaciones,
          };
        }
        return cell;
      });

      return {
        ...prev,
        [almacenSeleccionado.id]: updated,
      };
    });

    // 3. Actualizar la ocupación promedio del almacén
    const currentCells = warehouseCellsMap[almacenSeleccionado.id] || currentWarehouseCells;
    const totalCap = currentCells.reduce((acc, c) => acc + c.capacidad_maxima, 0) || 1;
    const totalQty = currentCells.reduce((acc, c) => acc + c.cantidad_actual, 0) + quantity;
    const newWarehouseOccupancy = Math.min(100, Math.round((totalQty / totalCap) * 100));

    setAlmacenes((prev) =>
      prev.map((a) => (a.id === almacenSeleccionado.id ? { ...a, ocupacion_porcentaje: newWarehouseOccupancy } : a))
    );

    // 4. Seleccionar la celda actualizada
    setSelectedCellId(cellId);

    // 5. Notificación
    const destCell = currentWarehouseCells.find((c) => c.id === cellId);
    showNotification(
      `¡Stock alojado con éxito! Se acomodaron ${quantity} unidades de "${item.producto_nombre}" en ${
        destCell?.codigo_visual || cellId
      }.`,
      "success"
    );
  };

  // Función para desalojar / sanitizar una celda
  const handleClearCellStock = (cellId: string) => {
    if (!almacenSeleccionado) return;

    setWarehouseCellsMap((prev) => {
      const currentList = prev[almacenSeleccionado.id] || currentWarehouseCells;
      const updated = currentList.map((cell) => {
        if (cell.id === cellId) {
          return {
            ...cell,
            cantidad_actual: 0,
            porcentaje_ocupacion: 0,
            estado: "vacio" as CellStatus,
            producto_actual: null,
            lote: null,
            sku: undefined,
            categoria: undefined,
            peso_actual_kg: 0,
            observaciones: undefined,
          };
        }
        return cell;
      });

      return {
        ...prev,
        [almacenSeleccionado.id]: updated,
      };
    });

    showNotification(`Posición liberada y sanitizada para nuevo slotting.`, "info");
  };

  // Crear almacén
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
      es_zona_embarque: esZonaEmbarque,
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
    setEsZonaEmbarque(false);

    showNotification(`Galpón "${nuevoAlm.nombre}" registrado exitosamente.`, "success");
  };

  const getTenantName = (tId: string) => {
    const found = allTenants.find((t) => t.id === tId) || MOCK_TENANTS.find((t) => t.id === tId);
    return found?.nombre || tId;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification Flotante */}
      {toastNotification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-500/40 flex items-center gap-3 text-xs max-w-md">
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
            <span className="font-medium">{toastNotification.message}</span>
          </div>
        </div>
      )}

      {/* Header y Selector de Tenant */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-2xs">
              <Warehouse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Matriz 2D Industrial & WMS del Galpón
                </h1>
                <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-bold">
                  InvenTrack v2
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Control logístico integral: Pulmón de Recepción, Almacenamiento Activo 2D y Muelle de Salida / Embarque.
              </p>
            </div>
          </div>
        </div>

        {/* Controles de Tenant y Nuevo Galpón */}
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nuevo Almacén / Galpón
          </Button>
        </div>
      </div>

      {/* Selector de Almacenes (Tarjetas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
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
                className={`p-3 rounded-xl text-left border transition-all ${
                  esActivo
                    ? "bg-white border-indigo-600 ring-2 ring-indigo-600/15 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1 gap-1">
                  <span className="font-bold text-slate-900 text-xs truncate">{alm.nombre}</span>
                  {alm.es_zona_recepcion ? (
                    <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[9px] px-1.5 py-0 shrink-0">
                      Recepción
                    </Badge>
                  ) : alm.es_zona_embarque ? (
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[9px] px-1.5 py-0 shrink-0">
                      Embarque
                    </Badge>
                  ) : (
                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[9px] px-1.5 py-0 shrink-0">
                      Racks 2D
                    </Badge>
                  )}
                </div>

                {isSuperAdmin && effectiveTenantId === "all" && (
                  <div className="text-[10px] text-indigo-600 font-semibold mb-1 flex items-center gap-1 truncate">
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span>{getTenantName(alm.tenant_id)}</span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-2 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{alm.direccion}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1 text-[10px]">
                    <Compass className="w-3 h-3 text-indigo-500" /> {alm.radio_cobertura_km} km
                  </span>
                  <span className="font-bold text-slate-700 font-mono text-[10px]">
                    {alm.ocupacion_porcentaje}% ocupado
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {almacenSeleccionado && (
        <div className="space-y-5">
          {/* Barra de Navegación Rápida por Zonas Operativas */}
          <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("integral")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "integral"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                <span>Vista Integral (Flujo Completo)</span>
              </button>

              <button
                onClick={() => setActiveTab("recepcion")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "recepcion"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-amber-600" />
                <span>1. Pulmón de Ingreso ({currentReceptionItems.filter((i) => i.cantidad_pendiente > 0).length})</span>
              </button>

              <button
                onClick={() => setActiveTab("matriz")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "matriz"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>2. Almacenamiento Activo 2D</span>
              </button>

              <button
                onClick={() => setActiveTab("embarque")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "embarque"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <ArrowUpFromLine className="w-3.5 h-3.5 text-emerald-600" />
                <span>3. Pulmón de Salida ({currentEmbarqueItems.filter((i) => i.estado !== "Despachado").length})</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-medium px-2 hidden lg:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sincronización en tiempo real activa</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 1. ZONA DE RECEPCIÓN / PULMÓN OPERATIVO DE INGRESO       */}
          {/* ======================================================== */}
          {(activeTab === "integral" || activeTab === "recepcion") && (
            <div className="space-y-2">
              {activeTab === "integral" && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 px-1">
                  <span className="p-1 rounded bg-amber-100 text-amber-800">
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                  </span>
                  <span>ZONA 1 · PULMÓN DE INGRESO (DESCARGA & ALBARANES)</span>
                </div>
              )}
              <WarehouseReceptionCard
                receptionItems={currentReceptionItems}
                onOpenSlottingModal={(item) => handleOpenSlottingModal(item)}
                warehouseName={almacenSeleccionado.nombre}
              />
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. MATRIZ 2D INDUSTRIAL & INSPECTOR DE CELDA             */}
          {/* ======================================================== */}
          {(activeTab === "integral" || activeTab === "matriz") && (
            <div className="space-y-2">
              {activeTab === "integral" && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 px-1 pt-2">
                  <span className="p-1 rounded bg-indigo-100 text-indigo-800">
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                  <span>ZONA 2 · ALMACENAMIENTO ACTIVO (MATRIZ 2D DE PASILLOS, RACKS Y NIVELES)</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Cuadrícula 2D Industrial (8 columnas) */}
                <div className="lg:col-span-8 space-y-4">
                  <WarehouseMatrix2D
                    cells={currentWarehouseCells}
                    selectedCell={selectedCell}
                    onSelectCell={(cell) => setSelectedCellId(cell.id)}
                    warehouseName={almacenSeleccionado.nombre}
                  />
                </div>

                {/* Inspector de Celda (4 columnas) */}
                <div className="lg:col-span-4 space-y-4">
                  <WarehouseCellInspector
                    cell={selectedCell}
                    warehouseName={almacenSeleccionado.nombre}
                    onOpenSlottingWithCell={(cell) => handleOpenSlottingModal(undefined, cell)}
                    onClearCellStock={handleClearCellStock}
                  />

                  {/* Ficha GPS & Cobertura Logística */}
                  <Card className="bg-white border-slate-200 shadow-2xs p-4 rounded-xl space-y-2 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Geolocalización & Radio de Flota B2B
                    </span>
                    <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-[11px] space-y-1 text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Coordenadas GPS:</span>
                        <strong className="font-mono text-slate-800">{almacenSeleccionado.coordenadas_gps}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Radio de Flete Autorizado:</span>
                        <strong className="text-indigo-700 font-bold">{almacenSeleccionado.radio_cobertura_km} km a la redonda</strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-indigo-100 text-slate-500">
                        <span>Capacidad Físico-Estructural:</span>
                        <strong className="text-slate-800">{almacenSeleccionado.capacidad_maxima} bultos máx.</strong>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. ZONA DE EMBARQUE / PULMÓN DE SALIDA (EXPEDICIÓN)      */}
          {/* ======================================================== */}
          {(activeTab === "integral" || activeTab === "embarque") && (
            <div className="space-y-2">
              {activeTab === "integral" && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 px-1 pt-2">
                  <span className="p-1 rounded bg-emerald-100 text-emerald-800">
                    <ArrowUpFromLine className="w-3.5 h-3.5" />
                  </span>
                  <span>ZONA 3 · PULMÓN DE SALIDA (MUELLE DE EMBARQUE & EXPEDICIÓN VEHICULAR)</span>
                </div>
              )}
              <WarehouseEmbarqueCard
                embarqueItems={currentEmbarqueItems}
                warehouseName={almacenSeleccionado.nombre}
                onStatusChange={handleEmbarqueStatusChange}
              />
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DE SLOTTING (ACOMODAR MERCADERÍA)                  */}
      {/* ======================================================== */}
      <WarehouseSlottingModal
        isOpen={modalSlottingOpen}
        onClose={() => setModalSlottingOpen(false)}
        receptionItems={currentReceptionItems}
        availableCells={currentWarehouseCells}
        preselectedItem={slottingPreselectedItem}
        preselectedCell={slottingPreselectedCell}
        currentOperatorName={user?.nombre_completo || "Lucas Depósito"}
        onPerformSlotting={handlePerformSlotting}
      />

      {/* ======================================================== */}
      {/* MODAL PARA CREAR NUEVO ALMACÉN                           */}
      {/* ======================================================== */}
      {modalNuevoAlmacen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-md space-y-4 animate-in zoom-in-95">
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
                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={esZonaRecepcion}
                      onChange={(e) => setEsZonaRecepcion(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600"
                    />
                    <span className="font-semibold text-slate-700 text-[11px]">Zona Recepción</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={esZonaEmbarque}
                      onChange={(e) => setEsZonaEmbarque(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600"
                    />
                    <span className="font-semibold text-slate-700 text-[11px]">Zona Embarque</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalNuevoAlmacen(false)}
                  className="h-8 text-xs"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold">
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
