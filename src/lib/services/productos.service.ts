import { createClient } from "../supabase/client";
import { MultiTenantProducto } from "../data/mock-multi-tenant";
import {
  getStoredProductos,
  saveStoredProducto,
  updateStoredProducto,
} from "./mock-store";
import { withSupabaseTimeout } from "./supabase-helper";

/**
 * Servicio Híbrido de Productos para InvenTrack v2 / Vertia
 *
 * Características:
 * - Aislamiento Multi-Tenant estricto (Zero Leakage)
 * - Cumplimiento matemático de la invariante:
 *   stock_disponible = stock_real - stock_comprometido
 * - Conmutación transparente a almacenamiento local (localStorage/in-memory)
 *   si Supabase no está conectado o las tablas no están disponibles.
 */

export class ProductosService {
  /**
   * Obtiene la lista de productos filtrada por tenant.
   * Si isSuperAdmin es true y tenantId es 'all', devuelve la vista consolidada.
   */
  async getProductos(
    tenantId: string,
    isSuperAdmin = false
  ): Promise<MultiTenantProducto[]> {
    try {
      const supabase = createClient();
      let query = supabase.from("productos").select("*");

      // Regla de Aislamiento Multi-Tenant estricta:
      // Solo el Super Admin con tenant 'all' puede ver todos los registros
      if (!isSuperAdmin || tenantId !== "all") {
        query = query.eq("tenant_id", tenantId);
      }

      const { data, error } = await withSupabaseTimeout(query);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => {
          const stockReal = Number(item.stock_real ?? item.cantidad_total ?? 0);
          const stockComprometido = Number(item.stock_comprometido ?? 0);
          const stockDisponible = stockReal - stockComprometido;

          return {
            id: String(item.id),
            tenant_id: String(item.tenant_id),
            codigo_barras: String(item.codigo_barras || ""),
            nombre: String(item.nombre || ""),
            categoria: String(item.categoria || "Obra Gruesa"),
            unidad_medida: String(item.unidad_medida || "UN"),
            precio: Number(item.precio) || 0,
            stock_real: stockReal,
            stock_comprometido: stockComprometido,
            stock_disponible: stockDisponible,
            cantidad_minima: Number(item.cantidad_minima) || 0,
            cantidad_maxima: Number(item.cantidad_maxima) || 1000,
            publicado_en_red: Boolean(item.publicado_en_red ?? false),
            almacen_id: String(item.almacen_id || "alm-pinos-central"),
            ubicacion_estanteria: String(
              item.ubicacion_estanteria || "Sector General"
            ),
          };
        });
      }
    } catch {
      // Supabase no disponible o timeout: fallback transparente a datos locales
    }

    return getStoredProductos(tenantId, isSuperAdmin);
  }

  /**
   * Crea un nuevo producto validando la invariante:
   * stock_disponible = stock_real - stock_comprometido
   */
  async createProducto(
    producto: Omit<MultiTenantProducto, "id">
  ): Promise<MultiTenantProducto> {
    const stockReal = Number(producto.stock_real) || 0;
    const stockComprometido = Number(producto.stock_comprometido) || 0;
    // Forzado estricto de la invariante
    const stockDisponible = stockReal - stockComprometido;

    const nuevoProducto: MultiTenantProducto = {
      ...producto,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      stock_real: stockReal,
      stock_comprometido: stockComprometido,
      stock_disponible: stockDisponible,
    };

    try {
      const supabase = createClient();
      const insertPromise = supabase
        .from("productos")
        .insert([
          {
            id: nuevoProducto.id,
            tenant_id: nuevoProducto.tenant_id,
            codigo_barras: nuevoProducto.codigo_barras,
            nombre: nuevoProducto.nombre,
            unidad_medida: nuevoProducto.unidad_medida,
            precio: nuevoProducto.precio,
            cantidad_total: nuevoProducto.stock_real,
            cantidad_minima: nuevoProducto.cantidad_minima,
            cantidad_maxima: nuevoProducto.cantidad_maxima,
            activo: true,
          },
        ])
        .select()
        .single();

      const { data, error } = await withSupabaseTimeout(insertPromise);

      if (!error && data) {
        saveStoredProducto(nuevoProducto);
        return nuevoProducto;
      }
    } catch {
      // Supabase no listo: persitir en mock store
    }

    return saveStoredProducto(nuevoProducto);
  }

  /**
   * Actualiza el stock físico y comprometido de un producto,
   * recalculando y garantizando siempre la invariante de stock_disponible.
   */
  async updateStock(
    productoId: string,
    stockReal: number,
    stockComprometido: number
  ): Promise<MultiTenantProducto> {
    const validReal = Number(stockReal) || 0;
    const validComprometido = Number(stockComprometido) || 0;
    const validDisponible = validReal - validComprometido;

    try {
      const supabase = createClient();
      const updatePromise = supabase
        .from("productos")
        .update({
          cantidad_total: validReal,
        })
        .eq("id", productoId);

      await withSupabaseTimeout(updatePromise);
    } catch {
      // Supabase no listo
    }

    const updated = updateStoredProducto(productoId, {
      stock_real: validReal,
      stock_comprometido: validComprometido,
      stock_disponible: validDisponible,
    });

    if (!updated) {
      throw new Error(`Producto con ID ${productoId} no encontrado`);
    }

    return updated;
  }

  /**
   * Activa o desactiva la publicación del producto en la Red Colaborativa B2B.
   */
  async togglePublicacionRed(
    productoId: string,
    publicada: boolean
  ): Promise<MultiTenantProducto> {
    try {
      const supabase = createClient();
      const updatePromise = supabase
        .from("productos")
        .update({
          publicado_en_red: publicada,
        })
        .eq("id", productoId);

      await withSupabaseTimeout(updatePromise);
    } catch {
      // Supabase no listo
    }

    const updated = updateStoredProducto(productoId, {
      publicado_en_red: publicada,
    });

    if (!updated) {
      throw new Error(`Producto con ID ${productoId} no encontrado`);
    }

    return updated;
  }
}

export const productosService = new ProductosService();

// Exportaciones directas de funciones
export const getProductos = (tenantId: string, isSuperAdmin?: boolean) =>
  productosService.getProductos(tenantId, isSuperAdmin);

export const createProducto = (producto: Omit<MultiTenantProducto, "id">) =>
  productosService.createProducto(producto);

export const updateStock = (
  productoId: string,
  stockReal: number,
  stockComprometido: number
) => productosService.updateStock(productoId, stockReal, stockComprometido);

export const togglePublicacionRed = (productoId: string, publicada: boolean) =>
  productosService.togglePublicacionRed(productoId, publicada);
