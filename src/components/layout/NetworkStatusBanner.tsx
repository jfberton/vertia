"use client";

import React, { useEffect, useState } from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  Clock,
  Database,
} from "lucide-react";
import { syncMonitor, SyncState } from "@/lib/services/sync-monitor.service";
import { offlineQueueService } from "@/lib/services/offline-queue.service";

export interface NetworkStatusBannerProps {
  /**
   * Determina si se renderiza solo el badge compacto (para ubicar en la navbar)
   * o si incluye la barra flotante de advertencia cuando no hay conexión.
   */
  variant?: "badge-only" | "banner-only" | "full";
}

export function NetworkStatusBanner({ variant = "full" }: NetworkStatusBannerProps) {
  const [syncState, setSyncState] = useState<SyncState>(() => syncMonitor.getState());
  const [pendingMutationsCount, setPendingMutationsCount] = useState<number>(0);
  const [conflictsCount, setConflictsCount] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  useEffect(() => {
    // Suscripción al monitor de red
    const unsubscribeSync = syncMonitor.subscribe((newState) => {
      setSyncState(newState);
    });

    // Suscripción a la cola offline
    const updateQueueCounts = () => {
      const queue = offlineQueueService.getQueue();
      const conflicts = offlineQueueService.getConflictos();
      setPendingMutationsCount(queue.length);
      setConflictsCount(
        conflicts.filter((c) => c.estado === "pendiente_resolucion").length
      );
    };

    updateQueueCounts();
    const unsubscribeQueue = offlineQueueService.subscribe(updateQueueCounts);

    return () => {
      unsubscribeSync();
      unsubscribeQueue();
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await syncMonitor.triggerCheck();
    } finally {
      setIsRetrying(false);
    }
  };

  const formatLastSync = (date: Date | null): string => {
    if (!date) return "Sin registros previos";
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const isOnline = syncState.isOnline;
  const isChecking = syncState.isChecking || isRetrying;

  // ---------------------------------------------------------------------------
  // Componente 1: Badge compacto para Navbar
  // ---------------------------------------------------------------------------
  const renderBadge = () => {
    if (isOnline) {
      return (
        <div
          title={`Conexión activa con Supabase PostgreSQL.\nÚltimo ping exitoso: ${formatLastSync(
            syncState.lastSyncTime
          )}`}
          className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium transition-all shadow-2xs hover:bg-emerald-100 cursor-help"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden lg:inline text-[11px] font-semibold">
            Conectado a Supabase
          </span>

          {/* Tooltip flotante enriquecido */}
          <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-slate-900 text-white text-[10px] py-1.5 px-2.5 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none">
            <span className="font-semibold text-emerald-300">
              🟢 Supabase Online
            </span>
            <span className="text-slate-300">
              Último ping: {formatLastSync(syncState.lastSyncTime)}
            </span>
            <span className="text-slate-400">
              Próximo heartbeat en {syncState.nextRetrySeconds}s
            </span>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={handleRetry}
        disabled={isChecking}
        title="Modo sin conexión. Haz clic para reintentar ping con Supabase."
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold shadow-2xs hover:bg-amber-100 transition-all cursor-pointer"
      >
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        <WifiOff className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-[11px]">Modo Local ({syncState.nextRetrySeconds}s)</span>
        <RefreshCw
          className={`w-3 h-3 text-amber-700 ${isChecking ? "animate-spin" : ""}`}
        />
      </button>
    );
  };

  // ---------------------------------------------------------------------------
  // Componente 2: Barra destacada offline (aparece cuando está desconectado)
  // ---------------------------------------------------------------------------
  const renderOfflineAlertBar = () => {
    if (isOnline) return null;

    return (
      <div className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-4 py-2 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs z-40 transition-all animate-in slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-2 font-medium">
          <div className="p-1 bg-white/20 rounded-md">
            <WifiOff className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold">Modo Sin Conexión</span> — Operando
            localmente con datos persistidos.
            <span className="opacity-90 ml-1">
              (Reintentando automáticamente en {syncState.nextRetrySeconds}s...)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pendingMutationsCount > 0 && (
            <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full text-[11px] font-semibold text-amber-100">
              <Clock className="w-3 h-3" />
              <span>{pendingMutationsCount} mutaciones encoladas</span>
            </div>
          )}

          {conflictsCount > 0 && (
            <div className="flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xs">
              <AlertTriangle className="w-3 h-3" />
              <span>{conflictsCount} conflicto de stock</span>
            </div>
          )}

          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="flex items-center gap-1.5 bg-white text-amber-900 font-bold px-3 py-1 rounded-lg text-xs hover:bg-amber-50 active:scale-95 transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-amber-700 ${
                isChecking ? "animate-spin" : ""
              }`}
            />
            <span>{isChecking ? "Verificando..." : "Reintentar ahora"}</span>
          </button>
        </div>
      </div>
    );
  };

  if (variant === "badge-only") {
    return renderBadge();
  }

  if (variant === "banner-only") {
    return renderOfflineAlertBar();
  }

  return (
    <>
      {renderOfflineAlertBar()}
      {/* Si se usa en variant="full", solo renderiza el banner de alerta offline */}
    </>
  );
}

export default NetworkStatusBanner;
