/**
 * Capa de Servicios Híbrida para InvenTrack v2 / Vertia
 *
 * Exporta todos los servicios de negocio con soporte para:
 * - Supabase PostgreSQL + RLS
 * - Aislamiento Multi-Tenant estricto (Zero Leakage)
 * - Invariante Dual Stock (stock_disponible = stock_real - stock_comprometido)
 * - Fallback transparente a almacenamiento local (offline / demo / staging)
 * - Monitor de conectividad, Heartbeat Supabase y Protocolo de Reconciliación de Conflictos de Stock
 */

export * from "./productos.service";
export * from "./almacenes.service";
export * from "./ordenes.service";
export * from "./mock-store";
export * from "./sync-monitor.service";
export * from "./offline-queue.service";
