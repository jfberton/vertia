import { createClient } from "../supabase/client";
import { withSupabaseTimeout } from "./supabase-helper";

/**
 * Estado reactivo del monitor de conectividad de Supabase
 */
export interface SyncState {
  isOnline: boolean;
  lastSyncTime: Date | null;
  nextRetrySeconds: number;
  isChecking: boolean;
  error?: string | null;
}

export type SyncListener = (state: SyncState) => void;

const HEARTBEAT_INTERVAL_SECONDS = 15;
const HEARTBEAT_TIMEOUT_MS = 2500;

/**
 * SyncMonitorService:
 * Singleton responsable de supervisar en tiempo real la conectividad con Supabase.
 *
 * Características:
 * - Heartbeat periódico cada 15 segundos con consulta ultraliviana.
 * - Escucha de eventos nativos window 'online' y 'offline'.
 * - Cuenta regresiva exacta para el próximo intento (nextRetrySeconds).
 * - Forzado manual de reintento con triggerCheck().
 * - Soporte para entornos SSR / scripts Node y modo mock para testing.
 */
export class SyncMonitorService {
  private static instance: SyncMonitorService;

  private isOnline = true;
  private lastSyncTime: Date | null = null;
  private nextRetrySeconds = HEARTBEAT_INTERVAL_SECONDS;
  private isChecking = false;
  private lastError: string | null = null;

  private listeners = new Set<SyncListener>();
  private countdownTimer: NodeJS.Timeout | number | null = null;
  private isMockMode = false;
  private mockOnlineStatus: boolean | null = null;
  private isStarted = false;

  private constructor() {
    if (typeof window !== "undefined") {
      // Estado inicial del navegador
      this.isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
      this.initBrowserListeners();
      this.startHeartbeat();
    }
  }

  public static getInstance(): SyncMonitorService {
    if (!SyncMonitorService.instance) {
      SyncMonitorService.instance = new SyncMonitorService();
    }
    return SyncMonitorService.instance;
  }

  /**
   * Obtiene una copia del estado actual
   */
  public getState(): SyncState {
    return {
      isOnline: this.isMockMode && this.mockOnlineStatus !== null ? this.mockOnlineStatus : this.isOnline,
      lastSyncTime: this.lastSyncTime,
      nextRetrySeconds: this.nextRetrySeconds,
      isChecking: this.isChecking,
      error: this.lastError,
    };
  }

  /**
   * Suscribe un listener a cambios de estado
   */
  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    // Notificar inmediatamente con el estado actual
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Inicia el ciclo de heartbeat si no estaba activo
   */
  public startHeartbeat(): void {
    if (this.isStarted) return;
    this.isStarted = true;
    this.nextRetrySeconds = HEARTBEAT_INTERVAL_SECONDS;

    this.countdownTimer = setInterval(() => {
      this.tick();
    }, 1000);

    // Ejecuta una primera verificación no bloqueante
    this.checkConnection().catch(() => {});
  }

  /**
   * Detiene el monitor y temporizadores
   */
  public stopHeartbeat(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer as any);
      this.countdownTimer = null;
    }
    this.isStarted = false;
  }

  /**
   * Forzar reintento de verificación inmediata ("Reintentar ahora")
   */
  public async triggerCheck(): Promise<boolean> {
    this.nextRetrySeconds = HEARTBEAT_INTERVAL_SECONDS;
    this.notify();
    return await this.checkConnection();
  }

  /**
   * Permite inyectar estado online/offline para pruebas automatizadas
   */
  public setMockOnline(online: boolean | null): void {
    if (online === null) {
      this.isMockMode = false;
      this.mockOnlineStatus = null;
    } else {
      this.isMockMode = true;
      this.mockOnlineStatus = online;
      this.isOnline = online;
      if (online) {
        this.lastSyncTime = new Date();
        this.lastError = null;
      } else {
        this.lastError = "Simulated offline condition";
      }
    }
    this.notify();
  }

  /**
   * Decremento por segundo del contador
   */
  private tick(): void {
    if (this.nextRetrySeconds > 1) {
      this.nextRetrySeconds--;
      this.notify();
    } else {
      this.nextRetrySeconds = HEARTBEAT_INTERVAL_SECONDS;
      this.notify();
      this.checkConnection().catch(() => {});
    }
  }

  /**
   * Ejecuta la consulta ultraliviana a Supabase para verificar salud de la red
   */
  public async checkConnection(): Promise<boolean> {
    if (this.isMockMode && this.mockOnlineStatus !== null) {
      this.notify();
      return this.mockOnlineStatus;
    }

    if (this.isChecking) {
      return this.isOnline;
    }

    this.isChecking = true;
    this.notify();

    try {
      // 1. Verificación rápida de interfaz de red del navegador
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        this.updateStatus(false, "El navegador reporta estar desconectado de internet.");
        return false;
      }

      // 2. Consulta ultraliviana a Supabase (limit 1 a tabla 'tenants' o metadata)
      const supabase = createClient();
      const pingQuery = supabase.from("tenants").select("id").limit(1);

      const { error } = await withSupabaseTimeout(pingQuery, HEARTBEAT_TIMEOUT_MS);

      // Si Supabase responde, incluso con error lógico de RLS o tabla vacía,
      // la conexión TCP/HTTP está viva. Solo consideramos offline si hay timeout o error de fetch.
      if (error && (error.message.includes("fetch failed") || error.message.includes("SupabaseTimeout"))) {
        this.updateStatus(false, `Fallo de conexión con Supabase: ${error.message}`);
        return false;
      }

      this.updateStatus(true, null);
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.updateStatus(false, errorMsg);
      return false;
    } finally {
      this.isChecking = false;
      this.notify();
    }
  }

  private updateStatus(online: boolean, error: string | null): void {
    this.isOnline = online;
    this.lastError = error;
    if (online) {
      this.lastSyncTime = new Date();
    }
    this.notify();
  }

  private notify(): void {
    const state = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch (e) {
        console.error("[SyncMonitorService] Error en listener:", e);
      }
    }
  }

  private initBrowserListeners(): void {
    if (typeof window === "undefined") return;

    window.addEventListener("online", () => {
      this.nextRetrySeconds = HEARTBEAT_INTERVAL_SECONDS;
      this.checkConnection().catch(() => {});
    });

    window.addEventListener("offline", () => {
      this.updateStatus(false, "Desconexión detectada por el navegador");
      this.nextRetrySeconds = HEARTBEAT_INTERVAL_SECONDS;
    });
  }
}

export const syncMonitor = SyncMonitorService.getInstance();
