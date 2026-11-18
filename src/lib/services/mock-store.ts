import {
  MOCK_PRODUCTOS,
  MOCK_ALMACENES,
  MOCK_UBICACIONES,
  MOCK_ORDENES,
  MultiTenantProducto,
  MultiTenantAlmacen,
  MultiTenantUbicacion,
  MultiTenantOrden,
} from "../data/mock-multi-tenant";

const STORAGE_KEYS = {
  PRODUCTOS: "inventrack_hybrid_productos",
  ALMACENES: "inventrack_hybrid_almacenes",
  UBICACIONES: "inventrack_hybrid_ubicaciones",
  ORDENES: "inventrack_hybrid_ordenes",
} as const;

// Cache en memoria para SSR o entornos sin window
let memoryCacheProductos: MultiTenantProducto[] = [...MOCK_PRODUCTOS];
let memoryCacheAlmacenes: MultiTenantAlmacen[] = [...MOCK_ALMACENES];
let memoryCacheUbicaciones: MultiTenantUbicacion[] = [...MOCK_UBICACIONES];
let memoryCacheOrdenes: MultiTenantOrden[] = [...MOCK_ORDENES];

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

// ---------------------------------------------------------------------------
// Helpers genéricos para localStorage
// ---------------------------------------------------------------------------
function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (!isBrowser()) {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T[];
  } catch (error) {
    console.warn(`[HybridStore] Error al leer ${key} de localStorage:`, error);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`[HybridStore] Error al persistir ${key} en localStorage:`, error);
  }
}

// ---------------------------------------------------------------------------
// PRODUCTOS
// ---------------------------------------------------------------------------
export function getStoredProductos(tenantId: string, isSuperAdmin = false): MultiTenantProducto[] {
  const all = isBrowser()
    ? loadFromStorage<MultiTenantProducto>(STORAGE_KEYS.PRODUCTOS, memoryCacheProductos)
    : memoryCacheProductos;

  if (isSuperAdmin && tenantId === "all") {
    return [...all];
  }
  return all.filter((p) => p.tenant_id === tenantId);
}

export function getAllStoredProductos(): MultiTenantProducto[] {
  return isBrowser()
    ? loadFromStorage<MultiTenantProducto>(STORAGE_KEYS.PRODUCTOS, memoryCacheProductos)
    : memoryCacheProductos;
}

export function saveStoredProducto(producto: MultiTenantProducto): MultiTenantProducto {
  const all = getAllStoredProductos();
  const index = all.findIndex((p) => p.id === producto.id);
  let updated: MultiTenantProducto[];

  if (index >= 0) {
    updated = [...all];
    updated[index] = producto;
  } else {
    updated = [producto, ...all];
  }

  memoryCacheProductos = updated;
  saveToStorage(STORAGE_KEYS.PRODUCTOS, updated);
  return producto;
}

export function updateStoredProducto(
  id: string,
  updates: Partial<MultiTenantProducto>
): MultiTenantProducto | null {
  const all = getAllStoredProductos();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = all[index];
  const updatedItem: MultiTenantProducto = {
    ...current,
    ...updates,
  };

  // Mantener invariante si cambian los stocks
  if (updates.stock_real !== undefined || updates.stock_comprometido !== undefined) {
    const stockReal = updates.stock_real !== undefined ? updates.stock_real : current.stock_real;
    const stockComprometido =
      updates.stock_comprometido !== undefined ? updates.stock_comprometido : current.stock_comprometido;
    updatedItem.stock_disponible = stockReal - stockComprometido;
  }

  const updated = [...all];
  updated[index] = updatedItem;
  memoryCacheProductos = updated;
  saveToStorage(STORAGE_KEYS.PRODUCTOS, updated);
  return updatedItem;
}

// ---------------------------------------------------------------------------
// ALMACENES
// ---------------------------------------------------------------------------
export function getStoredAlmacenes(tenantId: string, isSuperAdmin = false): MultiTenantAlmacen[] {
  const all = isBrowser()
    ? loadFromStorage<MultiTenantAlmacen>(STORAGE_KEYS.ALMACENES, memoryCacheAlmacenes)
    : memoryCacheAlmacenes;

  if (isSuperAdmin && tenantId === "all") {
    return [...all];
  }
  return all.filter((a) => a.tenant_id === tenantId);
}

export function getAllStoredAlmacenes(): MultiTenantAlmacen[] {
  return isBrowser()
    ? loadFromStorage<MultiTenantAlmacen>(STORAGE_KEYS.ALMACENES, memoryCacheAlmacenes)
    : memoryCacheAlmacenes;
}

export function saveStoredAlmacen(almacen: MultiTenantAlmacen): MultiTenantAlmacen {
  const all = getAllStoredAlmacenes();
  const index = all.findIndex((a) => a.id === almacen.id);
  let updated: MultiTenantAlmacen[];

  if (index >= 0) {
    updated = [...all];
    updated[index] = almacen;
  } else {
    updated = [almacen, ...all];
  }

  memoryCacheAlmacenes = updated;
  saveToStorage(STORAGE_KEYS.ALMACENES, updated);
  return almacen;
}

// ---------------------------------------------------------------------------
// UBICACIONES
// ---------------------------------------------------------------------------
export function getStoredUbicaciones(almacenId: string): MultiTenantUbicacion[] {
  const all = isBrowser()
    ? loadFromStorage<MultiTenantUbicacion>(STORAGE_KEYS.UBICACIONES, memoryCacheUbicaciones)
    : memoryCacheUbicaciones;

  return all.filter((u) => u.almacen_id === almacenId);
}

export function getAllStoredUbicaciones(): MultiTenantUbicacion[] {
  return isBrowser()
    ? loadFromStorage<MultiTenantUbicacion>(STORAGE_KEYS.UBICACIONES, memoryCacheUbicaciones)
    : memoryCacheUbicaciones;
}

export function saveStoredUbicacion(ubicacion: MultiTenantUbicacion): MultiTenantUbicacion {
  const all = getAllStoredUbicaciones();
  const index = all.findIndex((u) => u.id === ubicacion.id);
  let updated: MultiTenantUbicacion[];

  if (index >= 0) {
    updated = [...all];
    updated[index] = ubicacion;
  } else {
    updated = [ubicacion, ...all];
  }

  memoryCacheUbicaciones = updated;
  saveToStorage(STORAGE_KEYS.UBICACIONES, updated);
  return ubicacion;
}

export function updateStoredUbicacion(
  id: string,
  updates: Partial<MultiTenantUbicacion>
): MultiTenantUbicacion | null {
  const all = getAllStoredUbicaciones();
  const index = all.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const updatedItem: MultiTenantUbicacion = {
    ...all[index],
    ...updates,
  };

  const updated = [...all];
  updated[index] = updatedItem;
  memoryCacheUbicaciones = updated;
  saveToStorage(STORAGE_KEYS.UBICACIONES, updated);
  return updatedItem;
}

// ---------------------------------------------------------------------------
// ÓRDENES
// ---------------------------------------------------------------------------
export function getStoredOrdenes(tenantId: string, isSuperAdmin = false): MultiTenantOrden[] {
  const all = isBrowser()
    ? loadFromStorage<MultiTenantOrden>(STORAGE_KEYS.ORDENES, memoryCacheOrdenes)
    : memoryCacheOrdenes;

  if (isSuperAdmin && tenantId === "all") {
    return [...all];
  }
  return all.filter((o) => o.tenant_id === tenantId);
}

export function getAllStoredOrdenes(): MultiTenantOrden[] {
  return isBrowser()
    ? loadFromStorage<MultiTenantOrden>(STORAGE_KEYS.ORDENES, memoryCacheOrdenes)
    : memoryCacheOrdenes;
}

export function saveStoredOrden(orden: MultiTenantOrden): MultiTenantOrden {
  const all = getAllStoredOrdenes();
  const index = all.findIndex((o) => o.id === orden.id);
  let updated: MultiTenantOrden[];

  if (index >= 0) {
    updated = [...all];
    updated[index] = orden;
  } else {
    updated = [orden, ...all];
  }

  memoryCacheOrdenes = updated;
  saveToStorage(STORAGE_KEYS.ORDENES, updated);
  return orden;
}

export function updateStoredOrden(
  id: string,
  updates: Partial<MultiTenantOrden>
): MultiTenantOrden | null {
  const all = getAllStoredOrdenes();
  const index = all.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const updatedItem: MultiTenantOrden = {
    ...all[index],
    ...updates,
  };

  const updated = [...all];
  updated[index] = updatedItem;
  memoryCacheOrdenes = updated;
  saveToStorage(STORAGE_KEYS.ORDENES, updated);
  return updatedItem;
}
