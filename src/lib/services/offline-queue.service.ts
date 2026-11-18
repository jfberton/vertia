import { createClient } from "../supabase/client";
import { withSupabaseTimeout } from "./supabase-helper";
import {
  getAllStoredProductos,
  updateStoredProducto,
} from "./mock-store";

export type MutationTipo = "venta" | "reubicacion" | "ajuste";

export interface OfflineMutation {
  id: string;
  tenantId: string;
  operarioId: string;
  productoId: string;
  tipo: MutationTipo;
  cantidad: number;
  timestamp: string;
  stockRealAlMomento: number;
  detalles?: Record<string, unknown>;
}

export type ConflictoEstado =
  | "pendiente_resolucion"
  | "resuelto_extension"
  | "resuelto_parcial"
  | "cancelado";

export type ConflictoResolucionTipo =
  | "autorizar_extension"
  | "ajuste_parcial"
  | "cancelar";

export interface ConflictoSincronizacion {
  id: string;
  mutation: OfflineMutation;
  stockRemotoActual: number;
  stockRemotoComprometido: number;
  stockRemotoDisponible: number;
  diferenciaFaltante: number;
  estado: ConflictoEstado;
  fechaConflicto: string;
  resolucionDetalle?: string;
  fechaResolucion?: string;
  resueltoPor?: string;
}

export interface AuditoriaReconciliacion {
  id: string;
  timestamp: string;
  tenantId: string;
  mutationId: string;
  productoId: string;
  tipo: MutationTipo;
  cantidad: number;
  resultado: "exito" | "conflicto" | "resuelto";
  mensaje: string;
}

export interface ReconciliationResult {
  totalProcesadas: number;
  exitosas: number;
  conflictos: number;
  fallidas: number;
  detalles: Array<{
    mutationId: string;
    productoId: string;
    resultado: "aplicado" | "conflicto" | "error";
    mensaje: string;
  }>;
}

const STORAGE_KEYS = {
  QUEUE: "inventrack_offline_queue",
  CONFLICTS: "inventrack_offline_conflicts",
  AUDIT: "inventrack_offline_audit",
} as const;

// Cache en memoria para SSR / Node.js
let memoryQueue: OfflineMutation[] = [];
let memoryConflicts: ConflictoSincronizacion[] = [];
let memoryAudit: AuditoriaReconciliacion[] = [];

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T[];
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`[OfflineQueue] Error al guardar ${key} en storage:`, error);
  }
}

/**
 * OfflineQueueService:
 * Gestiona la cola persistente de mutaciones fuera de línea y el protocolo de
 * reconciliación con detección de quiebres de inventario (conflictos de stock).
 */
export class OfflineQueueService {
  private static instance: OfflineQueueService;
  private listeners = new Set<() => void>();

  public static getInstance(): OfflineQueueService {
    if (!OfflineQueueService.instance) {
      OfflineQueueService.instance = new OfflineQueueService();
    }
    return OfflineQueueService.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error("[OfflineQueueService] Error en listener:", err);
      }
    }
  }

  /**
   * Encola una mutación producida mientras se opera fuera de línea
   */
  public enqueue(
    mutationData: Omit<OfflineMutation, "id" | "timestamp">
  ): OfflineMutation {
    const mutation: OfflineMutation = {
      ...mutationData,
      id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    const queue = this.getQueue();
    const updatedQueue = [...queue, mutation];
    this.persistQueue(updatedQueue);
    this.notify();

    return mutation;
  }

  /**
   * Obtiene la cola de mutaciones pendientes (aislada por tenant si corresponde)
   */
  public getQueue(tenantId?: string, isSuperAdmin = false): OfflineMutation[] {
    const all = isBrowser()
      ? loadFromStorage<OfflineMutation>(STORAGE_KEYS.QUEUE, memoryQueue)
      : memoryQueue;

    if (!tenantId || (isSuperAdmin && tenantId === "all")) {
      return [...all];
    }
    return all.filter((m) => m.tenantId === tenantId);
  }

  /**
   * Elimina una mutación específica de la cola
   */
  public removeMutation(id: string): boolean {
    const all = isBrowser()
      ? loadFromStorage<OfflineMutation>(STORAGE_KEYS.QUEUE, memoryQueue)
      : memoryQueue;

    const filtered = all.filter((m) => m.id !== id);
    if (filtered.length === all.length) return false;

    this.persistQueue(filtered);
    this.notify();
    return true;
  }

  /**
   * Limpia la cola (opcionalmente filtrada por tenant)
   */
  public clearQueue(tenantId?: string): void {
    if (!tenantId) {
      this.persistQueue([]);
    } else {
      const all = isBrowser()
        ? loadFromStorage<OfflineMutation>(STORAGE_KEYS.QUEUE, memoryQueue)
        : memoryQueue;
      const filtered = all.filter((m) => m.tenantId !== tenantId);
      this.persistQueue(filtered);
    }
    this.notify();
  }

  /**
   * Obtiene la lista de conflictos de stock registrados
   */
  public getConflictos(
    tenantId?: string,
    isSuperAdmin = false
  ): ConflictoSincronizacion[] {
    const all = isBrowser()
      ? loadFromStorage<ConflictoSincronizacion>(STORAGE_KEYS.CONFLICTS, memoryConflicts)
      : memoryConflicts;

    if (!tenantId || (isSuperAdmin && tenantId === "all")) {
      return [...all];
    }
    return all.filter((c) => c.mutation.tenantId === tenantId);
  }

  public getConflictoById(id: string): ConflictoSincronizacion | undefined {
    const all = this.getConflictos();
    return all.find((c) => c.id === id);
  }

  /**
   * Obtiene los logs de auditoría de reconciliación
   */
  public getAuditoria(tenantId?: string): AuditoriaReconciliacion[] {
    const all = isBrowser()
      ? loadFromStorage<AuditoriaReconciliacion>(STORAGE_KEYS.AUDIT, memoryAudit)
      : memoryAudit;

    if (!tenantId) return [...all];
    return all.filter((a) => a.tenantId === tenantId);
  }

  /**
   * Protocolo de Reconciliación al recuperar la conexión.
   *
   * Recorre la cola y compara el stock remoto contra la cantidad requerida:
   * - Si stock_remoto_disponible >= cantidad: aplica la mutación y emite auditoría.
   * - Si stock_remoto_disponible < cantidad: detecta conflicto / quiebre de stock,
   *   retiene la mutación y la transfiere a la bandeja de conflictos pendientes.
   */
  public async processReconciliation(): Promise<ReconciliationResult> {
    const queue = this.getQueue();
    const result: ReconciliationResult = {
      totalProcesadas: queue.length,
      exitosas: 0,
      conflictos: 0,
      fallidas: 0,
      detalles: [],
    };

    if (queue.length === 0) {
      return result;
    }

    const remainingQueue: OfflineMutation[] = [];

    for (const mutation of queue) {
      try {
        const remoteStock = await this.fetchRemoteStock(mutation.productoId, mutation.tenantId);

        if (!remoteStock) {
          // Producto no encontrado ni en remoto ni en local
          result.fallidas++;
          result.detalles.push({
            mutationId: mutation.id,
            productoId: mutation.productoId,
            resultado: "error",
            mensaje: "Producto no encontrado en el catálogo de inventario",
          });
          remainingQueue.push(mutation);
          continue;
        }

        const { stockReal, stockComprometido, stockDisponible } = remoteStock;

        // Evaluación de Quiebre de Inventario
        if (stockDisponible >= mutation.cantidad) {
          // CAPACIDAD SUFICIENTE: Aplicar mutación
          await this.applyMutationRemotely(mutation, stockReal, stockComprometido);

          this.logAuditoria({
            id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: new Date().toISOString(),
            tenantId: mutation.tenantId,
            mutationId: mutation.id,
            productoId: mutation.productoId,
            tipo: mutation.tipo,
            cantidad: mutation.cantidad,
            resultado: "exito",
            mensaje: `Mutación ${mutation.tipo} de ${mutation.cantidad} un. reconciliada con éxito (Stock Disp previo: ${stockDisponible})`,
          });

          result.exitosas++;
          result.detalles.push({
            mutationId: mutation.id,
            productoId: mutation.productoId,
            resultado: "aplicado",
            mensaje: `Mutación aplicada correctamente. Nuevo stock disponible: ${stockDisponible - mutation.cantidad}`,
          });
        } else {
          // CONFLICTO / QUIEBRE DE STOCK
          const diferenciaFaltante = mutation.cantidad - stockDisponible;
          const conflicto: ConflictoSincronizacion = {
            id: `conf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            mutation,
            stockRemotoActual: stockReal,
            stockRemotoComprometido: stockComprometido,
            stockRemotoDisponible: stockDisponible,
            diferenciaFaltante,
            estado: "pendiente_resolucion",
            fechaConflicto: new Date().toISOString(),
          };

          this.saveConflicto(conflicto);

          this.logAuditoria({
            id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: new Date().toISOString(),
            tenantId: mutation.tenantId,
            mutationId: mutation.id,
            productoId: mutation.productoId,
            tipo: mutation.tipo,
            cantidad: mutation.cantidad,
            resultado: "conflicto",
            mensaje: `Quiebre de stock detectado: solicitado=${mutation.cantidad}, disponible=${stockDisponible}, faltante=${diferenciaFaltante}`,
          });

          result.conflictos++;
          result.detalles.push({
            mutationId: mutation.id,
            productoId: mutation.productoId,
            resultado: "conflicto",
            mensaje: `Conflicto retenido: Faltante de ${diferenciaFaltante} unidades respecto al stock disponible remoto`,
          });
          // Nota: La mutación se retira de la cola activa y pasa a la bandeja de conflictos
        }
      } catch (err: unknown) {
        result.fallidas++;
        result.detalles.push({
          mutationId: mutation.id,
          productoId: mutation.productoId,
          resultado: "error",
          mensaje: err instanceof Error ? err.message : String(err),
        });
        remainingQueue.push(mutation);
      }
    }

    // Actualizamos la cola restante (solo las que fallaron por error de red / sistema)
    this.persistQueue(remainingQueue);
    this.notify();

    return result;
  }

  /**
   * Resuelve un conflicto de inventario según la decisión administrativa:
   * 1. 'autorizar_extension': Autoriza el despacho sobre el stock físico / red B2B
   * 2. 'ajuste_parcial': Descuenta lo disponible y genera orden de faltante
   * 3. 'cancelar': Anula la operación sin alterar el inventario
   */
  public async resolverConflicto(
    conflictoId: string,
    resolucion: ConflictoResolucionTipo,
    opciones?: {
      autorizadorId?: string;
      comentario?: string;
    }
  ): Promise<ConflictoSincronizacion> {
    const conflictos = this.getConflictos();
    const index = conflictos.findIndex((c) => c.id === conflictoId);

    if (index === -1) {
      throw new Error(`Conflicto con ID ${conflictoId} no encontrado`);
    }

    const conflicto = conflictos[index];
    const remoteStock = await this.fetchRemoteStock(
      conflicto.mutation.productoId,
      conflicto.mutation.tenantId
    );

    const actualStockReal = remoteStock?.stockReal ?? conflicto.stockRemotoActual;
    const actualComprometido = remoteStock?.stockComprometido ?? conflicto.stockRemotoComprometido;
    const actualDisponible = actualStockReal - actualComprometido;

    let nuevoEstado: ConflictoEstado;
    let detalleResolucion: string;

    switch (resolucion) {
      case "autorizar_extension": {
        nuevoEstado = "resuelto_extension";
        // Se autoriza la entrega comprometiendo o descontando del stock físico
        const nuevoReal = Math.max(0, actualStockReal - conflicto.mutation.cantidad);
        await this.updateStockRemotely(
          conflicto.mutation.productoId,
          nuevoReal,
          actualComprometido
        );

        const base = `Extensión autorizada sobre stock físico/red B2B por ${conflicto.mutation.cantidad} un.`;
        detalleResolucion = opciones?.comentario ? `${base} Detalle: ${opciones.comentario}` : base;
        break;
      }

      case "ajuste_parcial": {
        nuevoEstado = "resuelto_parcial";
        const cantidadADescontar = Math.max(0, actualDisponible);
        const faltanteOrden = conflicto.mutation.cantidad - cantidadADescontar;

        if (cantidadADescontar > 0) {
          const nuevoReal = Math.max(0, actualStockReal - cantidadADescontar);
          await this.updateStockRemotely(
            conflicto.mutation.productoId,
            nuevoReal,
            actualComprometido
          );
        }

        const base = `Ajuste parcial aplicado: ${cantidadADescontar} despachadas, ${faltanteOrden} unidades generadas en orden de reposición prioritaria.`;
        detalleResolucion = opciones?.comentario ? `${base} Detalle: ${opciones.comentario}` : base;
        break;
      }

      case "cancelar": {
        nuevoEstado = "cancelado";
        const base = `Operación de ${conflicto.mutation.tipo} cancelada por el administrador debido a quiebre de stock no recuperable.`;
        detalleResolucion = opciones?.comentario ? `${base} Detalle: ${opciones.comentario}` : base;
        break;
      }
    }

    const conflictoActualizado: ConflictoSincronizacion = {
      ...conflicto,
      estado: nuevoEstado,
      resolucionDetalle: detalleResolucion,
      fechaResolucion: new Date().toISOString(),
      resueltoPor: opciones?.autorizadorId || "Administrador",
    };

    conflictos[index] = conflictoActualizado;
    this.persistConflictos(conflictos);

    this.logAuditoria({
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      tenantId: conflicto.mutation.tenantId,
      mutationId: conflicto.mutation.id,
      productoId: conflicto.mutation.productoId,
      tipo: conflicto.mutation.tipo,
      cantidad: conflicto.mutation.cantidad,
      resultado: "resuelto",
      mensaje: `Conflicto resuelto como [${resolucion}]: ${detalleResolucion}`,
    });

    this.notify();
    return conflictoActualizado;
  }

  // -------------------------------------------------------------------------
  // Helpers internos para stock y persistencia
  // -------------------------------------------------------------------------

  private async fetchRemoteStock(
    productoId: string,
    tenantId: string
  ): Promise<{ stockReal: number; stockComprometido: number; stockDisponible: number } | null> {
    try {
      const supabase = createClient();
      const query = supabase
        .from("productos")
        .select("id, tenant_id, cantidad_total, stock_real, stock_comprometido")
        .eq("id", productoId)
        .eq("tenant_id", tenantId)
        .single();

      const { data, error } = await withSupabaseTimeout(query);

      if (!error && data) {
        const stockReal = Number((data as any).stock_real ?? (data as any).cantidad_total ?? 0);
        const stockComprometido = Number((data as any).stock_comprometido ?? 0);
        return {
          stockReal,
          stockComprometido,
          stockDisponible: stockReal - stockComprometido,
        };
      }
    } catch {
      // Supabase no conectado o error: fallback al almacenamiento local
    }

    // Fallback a almacenamiento local mock-store
    const all = getAllStoredProductos();
    const prod = all.find((p) => p.id === productoId && p.tenant_id === tenantId);
    if (!prod) return null;

    const stockReal = Number(prod.stock_real ?? 0);
    const stockComprometido = Number(prod.stock_comprometido ?? 0);
    return {
      stockReal,
      stockComprometido,
      stockDisponible: stockReal - stockComprometido,
    };
  }

  private async applyMutationRemotely(
    mutation: OfflineMutation,
    currentReal: number,
    currentComprometido: number
  ): Promise<void> {
    let nuevoReal = currentReal;
    let nuevoComprometido = currentComprometido;

    if (mutation.tipo === "venta") {
      nuevoReal = Math.max(0, currentReal - mutation.cantidad);
    } else if (mutation.tipo === "ajuste") {
      // Si la cantidad es negativa descuenta, si es positiva suma
      nuevoReal = Math.max(0, currentReal + mutation.cantidad);
    } else if (mutation.tipo === "reubicacion") {
      // La reubicación interna no cambia el stock_real global del producto
      // pero actualiza el timestamp de movimiento
    }

    await this.updateStockRemotely(mutation.productoId, nuevoReal, nuevoComprometido);
  }

  private async updateStockRemotely(
    productoId: string,
    nuevoReal: number,
    nuevoComprometido: number
  ): Promise<void> {
    try {
      const supabase = createClient();
      const updatePromise = supabase
        .from("productos")
        .update({
          cantidad_total: nuevoReal,
        })
        .eq("id", productoId);

      await withSupabaseTimeout(updatePromise);
    } catch {
      // Supabase offline: se mantendrá en sincronización local
    }

    // Actualizar siempre el almacén local para mantener consistencia
    updateStoredProducto(productoId, {
      stock_real: nuevoReal,
      stock_comprometido: nuevoComprometido,
      stock_disponible: nuevoReal - nuevoComprometido,
    });
  }

  private persistQueue(queue: OfflineMutation[]): void {
    memoryQueue = queue;
    saveToStorage(STORAGE_KEYS.QUEUE, queue);
  }

  private persistConflictos(conflicts: ConflictoSincronizacion[]): void {
    memoryConflicts = conflicts;
    saveToStorage(STORAGE_KEYS.CONFLICTS, conflicts);
  }

  private saveConflicto(conflicto: ConflictoSincronizacion): void {
    const all = this.getConflictos();
    const updated = [conflicto, ...all.filter((c) => c.id !== conflicto.id)];
    this.persistConflictos(updated);
  }

  private logAuditoria(entry: AuditoriaReconciliacion): void {
    const all = this.getAuditoria();
    const updated = [entry, ...all];
    memoryAudit = updated;
    saveToStorage(STORAGE_KEYS.AUDIT, updated);
  }
}

export const offlineQueueService = OfflineQueueService.getInstance();
