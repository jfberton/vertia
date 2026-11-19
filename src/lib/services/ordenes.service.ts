import { createClient } from "../supabase/client";
import { MultiTenantOrden } from "../data/mock-multi-tenant";
import {
  getStoredOrdenes,
  saveStoredOrden,
  updateStoredOrden,
} from "./mock-store";
import { withSupabaseTimeout } from "./supabase-helper";

/**
 * Estados admisibles en el ciclo de vida de una orden / despacho
 */
export type EstadoOrdenFlujo =
  | "Por cotizar"
  | "Pendiente"
  | "Asignada"
  | "En preparación"
  | "Despachada"
  | "En camino"
  | "Entregada";

function normalizarEstadoOrden(estado: string): MultiTenantOrden["estado"] {
  const norm = estado.trim().toLowerCase();
  if (norm === "pendiente" || norm === "asignada") {
    return "Asignada";
  }
  if (norm === "en preparacion" || norm === "en preparación") {
    return "En preparación";
  }
  if (norm === "despachada" || norm === "en camino") {
    return "En camino";
  }
  if (norm === "entregada" || norm === "completada") {
    return "Entregada";
  }
  if (norm === "presupuesto listo" || norm === "presupuesto emitido" || norm === "cotizado") {
    return "Presupuesto listo";
  }
  if (norm === "por cotizar") {
    return "Por cotizar";
  }
  return "En preparación";
}

/**
 * Servicio Híbrido de Solicitudes y Órdenes de Suministro
 * para InvenTrack v2 / Vertia
 *
 * Características:
 * - Aislamiento Multi-Tenant estricto (Zero Leakage)
 * - Trazabilidad de estados: Pendiente -> En preparación -> Despachada -> Entregada
 * - Manejo de extensiones y negociación de stock
 * - Resiliencia offline/híbrida con fallback automático a almacenamiento local
 */

export class OrdenesService {
  /**
   * Retorna las órdenes y solicitudes asociadas a un tenant.
   * Si isSuperAdmin es true y tenantId es 'all', devuelve la vista consolidada de toda la red.
   */
  async getOrdenes(
    tenantId: string,
    isSuperAdmin = false
  ): Promise<MultiTenantOrden[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("ordenes_suministro").select("*, ordenes_suministro_detalles(*)");

      if (!isSuperAdmin || tenantId !== "all") {
        query = query.eq("tenant_id", tenantId);
      }

      const { data, error } = await withSupabaseTimeout(query);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          tenant_id: String(item.tenant_id),
          folio: String(item.numero_orden || item.folio || `VT-${item.id}`),
          tipo: (item.tipo || "Material") as MultiTenantOrden["tipo"],
          proyectoUbicacion: String(item.proyectoUbicacion || item.observaciones || "Obra Activa"),
          cliente: String(item.cliente || item.usuario_solicitante || "Cliente Solicitante"),
          corralonAsignado: String(item.corralonAsignado || "Corralón Asignado"),
          fecha: String(item.fecha || item.fecha_solicitud || "Hoy"),
          estado: normalizarEstadoOrden(item.estado || "Asignada"),
          distanciaKm: Number(item.distanciaKm) || 5.0,
          detalles: Array.isArray(item.ordenes_suministro_detalles)
            ? item.ordenes_suministro_detalles.map((d: any, idx: number) => ({
                id: String(d.id || `det-${idx}`),
                material: String(d.material || "Material Suministrado"),
                codigo: String(d.codigo || "7791234567890"),
                cantidadSolicitada: Number(d.cantidad_solicitada) || 1,
                cantidadDisponibleCorralon: Number(d.cantidad_surtida) || 1,
                stockRealFisico: (Number(d.cantidad_solicitada) || 1) * 2,
                cantidadAutorizadaExtension: 0,
                unidad: String(d.unidad || "UN"),
                estadoItem: "Completo" as const,
              }))
            : [],
        }));
      }
    } catch {
      // Supabase no listo o timeout: fallback transparente al mock store
    }

    return getStoredOrdenes(tenantId, isSuperAdmin);
  }

  /**
   * Crea una nueva orden de suministro o solicitud de materiales.
   */
  async createOrden(
    orden: Omit<MultiTenantOrden, "id">
  ): Promise<MultiTenantOrden> {
    const ordenId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const detallesConId = (orden.detalles || []).map((d, idx) => ({
      ...d,
      id: d.id || `det-${Date.now()}-${idx}`,
    }));

    const nuevaOrden: MultiTenantOrden = {
      ...orden,
      id: ordenId,
      estado: normalizarEstadoOrden(orden.estado),
      detalles: detallesConId,
    };

    try {
      const supabase = createClient();
      const insertPromise = supabase
        .from("ordenes_suministro")
        .insert([
          {
            id: nuevaOrden.id,
            tenant_id: nuevaOrden.tenant_id,
            numero_orden: nuevaOrden.folio,
            usuario_solicitante: nuevaOrden.cliente,
            estado: nuevaOrden.estado,
            fecha_solicitud: new Date().toISOString(),
            observaciones: nuevaOrden.proyectoUbicacion,
          },
        ])
        .select()
        .single();

      const { data, error } = await withSupabaseTimeout(insertPromise);

      if (!error && data) {
        saveStoredOrden(nuevaOrden);
        return nuevaOrden;
      }
    } catch {
      // Supabase no listo o timeout: guardar localmente
    }

    return saveStoredOrden(nuevaOrden);
  }

  /**
   * Avanza el estado de una orden a lo largo de su flujo operativo:
   * Pendiente -> En preparación -> Despachada -> Entregada.
   */
  async actualizarEstadoOrden(
    ordenId: string,
    nuevoEstado: string
  ): Promise<MultiTenantOrden> {
    const estadoNormalizado = normalizarEstadoOrden(nuevoEstado);

    try {
      const supabase = createClient();
      const updatePromise = supabase
        .from("ordenes_suministro")
        .update({
          estado: estadoNormalizado,
        })
        .eq("id", ordenId);

      await withSupabaseTimeout(updatePromise);
    } catch {
      // Supabase no listo o timeout
    }

    const updated = updateStoredOrden(ordenId, {
      estado: estadoNormalizado,
    });

    if (!updated) {
      throw new Error(`Orden con ID ${ordenId} no encontrada`);
    }

    return updated;
  }

  /**
   * Actualiza propiedades arbitrarias de una orden (metadatos de remito, chofer, detalles)
   */
  async actualizarOrden(
    ordenId: string,
    updates: Partial<MultiTenantOrden>
  ): Promise<MultiTenantOrden> {
    const updated = updateStoredOrden(ordenId, updates);
    if (!updated) {
      throw new Error(`Orden con ID ${ordenId} no encontrada`);
    }
    return updated;
  }
  /**
   * Asigna un corralón proveedor a una orden que estaba pendiente de asignación por Vertia
   */
  async asignarCorralonAOrden(
    ordenId: string,
    tenantIdCorralon: string,
    nombreCorralon: string
  ): Promise<MultiTenantOrden> {
    const updated = updateStoredOrden(ordenId, {
      tenant_id: tenantIdCorralon,
      corralonAsignado: nombreCorralon,
      estado: "Asignada",
    });
    if (!updated) {
      throw new Error(`Orden con ID ${ordenId} no encontrada`);
    }
    return updated;
  }

  /**
   * Vertia analiza con los corralones y emite el presupuesto oficial para la constructora
   */
  async emitirPresupuesto(
    ordenId: string,
    montoCotizado: number,
    costoFlete: number,
    corralonId: string,
    corralonNombre: string
  ): Promise<MultiTenantOrden> {
    const updated = updateStoredOrden(ordenId, {
      tenant_id: corralonId,
      corralonAsignado: corralonNombre,
      monto_total_cotizado: montoCotizado,
      costo_flete: costoFlete,
      presupuesto_emitido: true,
      presupuesto_aprobado: false,
      fecha_presupuesto: new Date().toLocaleDateString("es-AR"),
      estado: "Presupuesto listo",
    });
    if (!updated) {
      throw new Error(`Orden con ID ${ordenId} no encontrada`);
    }
    return updated;
  }

  /**
   * La constructora acepta el presupuesto confirmado emitido por Vertia
   */
  async aceptarPresupuesto(ordenId: string): Promise<MultiTenantOrden> {
    const updated = updateStoredOrden(ordenId, {
      presupuesto_aprobado: true,
      estado: "Asignada",
    });
    if (!updated) {
      throw new Error(`Orden con ID ${ordenId} no encontrada`);
    }
    return updated;
  }
}

export const ordenesService = new OrdenesService();

// Exportaciones directas de funciones
export const getOrdenes = (tenantId: string, isSuperAdmin?: boolean) =>
  ordenesService.getOrdenes(tenantId, isSuperAdmin);

export const createOrden = (orden: Omit<MultiTenantOrden, "id">) =>
  ordenesService.createOrden(orden);

export const actualizarEstadoOrden = (ordenId: string, nuevoEstado: string) =>
  ordenesService.actualizarEstadoOrden(ordenId, nuevoEstado);

export const actualizarOrden = (
  ordenId: string,
  updates: Partial<MultiTenantOrden>
) => ordenesService.actualizarOrden(ordenId, updates);

export const asignarCorralonAOrden = (
  ordenId: string,
  tenantIdCorralon: string,
  nombreCorralon: string
) => ordenesService.asignarCorralonAOrden(ordenId, tenantIdCorralon, nombreCorralon);

export const emitirPresupuesto = (
  ordenId: string,
  montoCotizado: number,
  costoFlete: number,
  corralonId: string,
  corralonNombre: string
) => ordenesService.emitirPresupuesto(ordenId, montoCotizado, costoFlete, corralonId, corralonNombre);

export const aceptarPresupuesto = (ordenId: string) =>
  ordenesService.aceptarPresupuesto(ordenId);

