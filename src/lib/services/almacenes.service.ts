import { createClient } from "../supabase/client";
import {
  MultiTenantAlmacen,
  MultiTenantUbicacion,
} from "../data/mock-multi-tenant";
import {
  getStoredAlmacenes,
  saveStoredAlmacen,
  getStoredUbicaciones,
  updateStoredUbicacion,
  getAllStoredProductos,
} from "./mock-store";
import { withSupabaseTimeout } from "./supabase-helper";

/**
 * Servicio Híbrido de Almacenes y Matriz de Ubicaciones Físicas
 * para InvenTrack v2 / Vertia
 *
 * Características:
 * - Aislamiento Multi-Tenant estricto (Zero Leakage)
 * - Mapeo de Racks, Estanterías, Niveles y Bahías de Recepción
 * - Asignación directa de mercadería y lotes a celdas físicas
 * - Resiliencia offline/híbrida con fallback automático a almacenamiento local
 */

export class AlmacenesService {
  /**
   * Retorna los almacenes asociados a un tenant.
   * Si isSuperAdmin es true y tenantId es 'all', retorna todos los almacenes de la plataforma.
   */
  async getAlmacenes(
    tenantId: string,
    isSuperAdmin = false
  ): Promise<MultiTenantAlmacen[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("almacenes").select("*");

      if (!isSuperAdmin || tenantId !== "all") {
        query = query.eq("tenant_id", tenantId);
      }

      const { data, error } = await withSupabaseTimeout(query);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          tenant_id: String(item.tenant_id),
          nombre: String(item.nombre_almacen || item.nombre || "Almacén Central"),
          direccion: String(item.direccion || ""),
          radio_cobertura_km: Number(item.radio_cobertura_km) || 25,
          coordenadas_gps: String(item.coordenadas_gps || "-32.9511, -60.6663"),
          capacidad_maxima: Number(item.capacidad_maxima) || 5000,
          es_zona_recepcion: Boolean(item.es_zona_recepcion),
          total_ubicaciones: Number(item.total_ubicaciones) || 120,
          ocupacion_porcentaje: Number(item.ocupacion_porcentaje) || 45,
          descripcion: item.descripcion ? String(item.descripcion) : undefined,
        }));
      }
    } catch {
      // Supabase no disponible o timeout: fallback a mock store
    }

    return getStoredAlmacenes(tenantId, isSuperAdmin);
  }

  /**
   * Retorna la matriz de ubicaciones físicas (racks, estanterías, niveles)
   * pertenecientes al almacén especificado.
   */
  async getUbicaciones(almacenId: string): Promise<MultiTenantUbicacion[]> {
    try {
      const supabase = createClient();
      const query = supabase
        .from("ubicaciones")
        .select("*")
        .eq("almacen_id", almacenId);

      const { data, error } = await withSupabaseTimeout(query);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          tenant_id: String(item.tenant_id),
          almacen_id: String(item.almacen_id),
          codigo_visual: String(item.codigo_visual || `UB-${item.id}`),
          tipo: (item.tipo || "rack") as MultiTenantUbicacion["tipo"],
          fila: Number(item.fila) || 1,
          rack: Number(item.rack) || 1,
          estanteria: Number(item.estanteria) || 1,
          nivel: Number(item.nivel) || 1,
          producto_actual: item.producto_actual || null,
          cantidad: Number(item.cantidad) || 0,
          lote: item.lote || undefined,
          estado: (item.estado || "vacio") as MultiTenantUbicacion["estado"],
        }));
      }
    } catch {
      // Supabase no disponible o timeout: fallback a mock store
    }

    return getStoredUbicaciones(almacenId);
  }

  /**
   * Crea un nuevo almacén físico, incluyendo la configuración de zona de recepción.
   */
  async createAlmacen(
    almacen: Omit<MultiTenantAlmacen, "id">
  ): Promise<MultiTenantAlmacen> {
    const nuevoAlmacen: MultiTenantAlmacen = {
      ...almacen,
      id: `alm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      radio_cobertura_km: Number(almacen.radio_cobertura_km) || 25,
      capacidad_maxima: Number(almacen.capacidad_maxima) || 5000,
      total_ubicaciones: Number(almacen.total_ubicaciones) || 60,
      ocupacion_porcentaje: Number(almacen.ocupacion_porcentaje) || 0,
      es_zona_recepcion: Boolean(almacen.es_zona_recepcion),
    };

    try {
      const supabase = createClient();
      const insertPromise = supabase
        .from("almacenes")
        .insert([
          {
            id: nuevoAlmacen.id,
            tenant_id: nuevoAlmacen.tenant_id,
            nombre_almacen: nuevoAlmacen.nombre,
            direccion: nuevoAlmacen.direccion,
            capacidad_maxima: nuevoAlmacen.capacidad_maxima,
            es_zona_recepcion: nuevoAlmacen.es_zona_recepcion,
            activo: true,
          },
        ])
        .select()
        .single();

      const { data, error } = await withSupabaseTimeout(insertPromise);

      if (!error && data) {
        saveStoredAlmacen(nuevoAlmacen);
        return nuevoAlmacen;
      }
    } catch {
      // Supabase no disponible o timeout: persistir localmente
    }

    return saveStoredAlmacen(nuevoAlmacen);
  }

  /**
   * Asocia mercadería a una celda física específica del almacén,
   * asignando producto, lote, cantidad y actualizando el estado de ocupación.
   */
  async asignarProductoAUbicacion(
    ubicacionId: string,
    productoId: string,
    cantidad: number,
    lote?: string
  ): Promise<MultiTenantUbicacion> {
    const cant = Math.max(0, Number(cantidad) || 0);

    // Buscar nombre del producto en el catálogo
    const productos = getAllStoredProductos();
    const productoObj = productos.find((p) => p.id === productoId);
    const nombreProducto = productoObj ? productoObj.nombre : productoId;

    let nuevoEstado: MultiTenantUbicacion["estado"] = "vacio";
    if (cant > 0) {
      nuevoEstado = cant >= 100 ? "completo" : "ocupado";
    }

    const updates: Partial<MultiTenantUbicacion> = {
      producto_actual: cant > 0 ? nombreProducto : null,
      cantidad: cant,
      lote: cant > 0 ? (lote || `LOTE-GEN-${new Date().getFullYear()}`) : undefined,
      estado: nuevoEstado,
    };

    try {
      const supabase = createClient();
      const updatePromise = supabase
        .from("ubicaciones")
        .update({
          producto_actual: updates.producto_actual,
          cantidad: updates.cantidad,
          lote: updates.lote,
          estado: updates.estado,
        })
        .eq("id", ubicacionId);

      await withSupabaseTimeout(updatePromise);
    } catch {
      // Supabase no disponible
    }

    const updated = updateStoredUbicacion(ubicacionId, updates);
    if (!updated) {
      throw new Error(`Ubicación con ID ${ubicacionId} no encontrada`);
    }

    return updated;
  }
}

export const almacenesService = new AlmacenesService();

// Exportaciones directas de funciones
export const getAlmacenes = (tenantId: string, isSuperAdmin?: boolean) =>
  almacenesService.getAlmacenes(tenantId, isSuperAdmin);

export const getUbicaciones = (almacenId: string) =>
  almacenesService.getUbicaciones(almacenId);

export const createAlmacen = (almacen: Omit<MultiTenantAlmacen, "id">) =>
  almacenesService.createAlmacen(almacen);

export const asignarProductoAUbicacion = (
  ubicacionId: string,
  productoId: string,
  cantidad: number,
  lote?: string
) =>
  almacenesService.asignarProductoAUbicacion(
    ubicacionId,
    productoId,
    cantidad,
    lote
  );
