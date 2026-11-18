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
import {
  EmbarqueItem,
  MOCK_EMBARQUE_ITEMS,
} from "../data/mock-spatial-warehouse";

const STORAGE_KEYS = {
  PRODUCTOS: "inventrack_hybrid_productos",
  ALMACENES: "inventrack_hybrid_almacenes",
  UBICACIONES: "inventrack_hybrid_ubicaciones",
  ORDENES: "inventrack_hybrid_ordenes",
  EVIDENCIAS: "inventrack_hybrid_evidencias",
  EMBARQUES: "inventrack_hybrid_embarques",
} as const;

export interface MultiTenantEvidencia {
  id: string;
  tenant_id: string;
  folio: string;
  tipo: string;
  titulo: string;
  ubicacion: string;
  responsable: string;
  fecha: string;
  estado: "En validación" | "Validada" | "Ajuste solicitado" | "Incidencia";
  coincidenciaPorcentaje: number;
  criterios: {
    mismoPuntoCaptura: boolean;
    mejoraVisible: boolean;
    conformeAlAlcance: boolean;
  };
  descripcionAlcance: string;
  fotoClienteAntes: string;
  fotoProveedorDespues: string;
  notasProveedor: string;
  documentoAdjunto?: string;
  storagePath?: string;
  storageProvider?: "supabase" | "local";
  tamanoOriginal?: number;
  tamanoComprimido?: number;
  ahorroPorcentaje?: number;
  created_at?: string;
}

export const MOCK_EVIDENCIAS: MultiTenantEvidencia[] = [
  {
    id: "evi-001",
    tenant_id: "tenant-los-pinos",
    folio: "VT-1048",
    tipo: "Mantenimiento",
    titulo: "Reparación y ajuste de puerta de acceso peatonal",
    ubicacion: "Torre Norte - Piso 3 (Acceso principal)",
    responsable: "Herrería Soluciones S.A.",
    fecha: "Hoy, 16:18 hs",
    estado: "En validación",
    coincidenciaPorcentaje: 98,
    criterios: {
      mismoPuntoCaptura: true,
      mejoraVisible: true,
      conformeAlAlcance: true,
    },
    descripcionAlcance:
      "Corrección de bisagras vencidas, aplicación de soldadura en marco y pintura anticorrosiva negro mate.",
    fotoClienteAntes:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=700&q=80",
    fotoProveedorDespues:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80",
    notasProveedor:
      "Se reemplazaron 3 pernos de bisagra de alta resistencia y se calibró la cerradura con doble cerrojo. Pintura seca.",
    documentoAdjunto: "Reporte_Herreria_VT1048.pdf",
    storagePath: "tenant-los-pinos/VT-1048_evidencia.webp",
    storageProvider: "supabase",
    tamanoOriginal: 5242880,
    tamanoComprimido: 284120,
    ahorroPorcentaje: 94.6,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "evi-002",
    tenant_id: "tenant-los-pinos",
    folio: "VT-1049",
    tipo: "Descarga de material en obra",
    titulo: "Descarga y estiba de Cemento Loma Negra (100 bolsas)",
    ubicacion: "Bodega Central - Sector Obra Torre Sur",
    responsable: "Corralón Los Pinos S.R.L.",
    fecha: "Hoy, 14:30 hs",
    estado: "En validación",
    coincidenciaPorcentaje: 95,
    criterios: {
      mismoPuntoCaptura: true,
      mejoraVisible: true,
      conformeAlAlcance: true,
    },
    descripcionAlcance:
      "Entrega acordada mediante extensión de stock físico autorizada. Palletizado protegido de humedad y remito firmado.",
    fotoClienteAntes:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
    fotoProveedorDespues:
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=700&q=80",
    notasProveedor:
      "Descargado con autoelevador en zona techada. Remito nro 0004-9812 firmado por el capataz Ing. Rossi.",
    documentoAdjunto: "Remito_Firmado_VT1049.pdf",
    storagePath: "tenant-los-pinos/VT-1049_remito.webp",
    storageProvider: "supabase",
    tamanoOriginal: 4890000,
    tamanoComprimido: 265000,
    ahorroPorcentaje: 94.5,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "evi-003",
    tenant_id: "tenant-materiales-centro",
    folio: "VT-0112",
    tipo: "Estado previo/posterior",
    titulo: "Reparación de grieta y resane en muro de estacionamiento",
    ubicacion: "Torre Norte - Estacionamiento (Nivel -1)",
    responsable: "Albañilería Alfa",
    fecha: "Ayer, 17:20 hs",
    estado: "Incidencia",
    coincidenciaPorcentaje: 62,
    criterios: {
      mismoPuntoCaptura: true,
      mejoraVisible: false,
      conformeAlAlcance: false,
    },
    descripcionAlcance:
      "Apertura de fisura en 'V', sellado con masilla elastomérica y dos manos de pintura epoxi gris.",
    fotoClienteAntes:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=700&q=80",
    fotoProveedorDespues:
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=700&q=80",
    notasProveedor:
      "Se aplicó resane rápido, pendiente lijado final por humedad ambiente.",
    documentoAdjunto: "Detalle_Fisura_Alfa.pdf",
    storagePath: "tenant-materiales-centro/VT-0112_inspeccion.webp",
    storageProvider: "local",
    tamanoOriginal: 6100000,
    tamanoComprimido: 290000,
    ahorroPorcentaje: 95.2,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Cache en memoria para SSR o entornos sin window
let memoryCacheProductos: MultiTenantProducto[] = [...MOCK_PRODUCTOS];
let memoryCacheAlmacenes: MultiTenantAlmacen[] = [...MOCK_ALMACENES];
let memoryCacheUbicaciones: MultiTenantUbicacion[] = [...MOCK_UBICACIONES];
let memoryCacheOrdenes: MultiTenantOrden[] = [...MOCK_ORDENES];
let memoryCacheEvidencias: MultiTenantEvidencia[] = [...MOCK_EVIDENCIAS];
let memoryCacheEmbarques: EmbarqueItem[] = [...MOCK_EMBARQUE_ITEMS];

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

// ---------------------------------------------------------------------------
// EVIDENCIAS
// ---------------------------------------------------------------------------
export function getStoredEvidencias(
  tenantId: string,
  isSuperAdmin = false
): MultiTenantEvidencia[] {
  const all = isBrowser()
    ? loadFromStorage<MultiTenantEvidencia>(
        STORAGE_KEYS.EVIDENCIAS,
        memoryCacheEvidencias
      )
    : memoryCacheEvidencias;

  if (isSuperAdmin && tenantId === "all") {
    return [...all];
  }
  return all.filter((e) => e.tenant_id === tenantId);
}

export function getAllStoredEvidencias(): MultiTenantEvidencia[] {
  return isBrowser()
    ? loadFromStorage<MultiTenantEvidencia>(
        STORAGE_KEYS.EVIDENCIAS,
        memoryCacheEvidencias
      )
    : memoryCacheEvidencias;
}

export function saveStoredEvidencia(
  evidencia: MultiTenantEvidencia
): MultiTenantEvidencia {
  const all = getAllStoredEvidencias();
  const index = all.findIndex((e) => e.id === evidencia.id || e.folio === evidencia.folio);
  let updated: MultiTenantEvidencia[];

  if (index >= 0) {
    updated = [...all];
    updated[index] = evidencia;
  } else {
    updated = [evidencia, ...all];
  }

  memoryCacheEvidencias = updated;
  saveToStorage(STORAGE_KEYS.EVIDENCIAS, updated);
  return evidencia;
}

export function updateStoredEvidencia(
  idOrFolio: string,
  updates: Partial<MultiTenantEvidencia>
): MultiTenantEvidencia | null {
  const all = getAllStoredEvidencias();
  const index = all.findIndex((e) => e.id === idOrFolio || e.folio === idOrFolio);
  if (index === -1) return null;

  const updatedItem: MultiTenantEvidencia = {
    ...all[index],
    ...updates,
  };

  const updated = [...all];
  updated[index] = updatedItem;
  memoryCacheEvidencias = updated;
  saveToStorage(STORAGE_KEYS.EVIDENCIAS, updated);
  return updatedItem;
}

// ---------------------------------------------------------------------------
// EMBARQUES (PULMÓN DE SALIDA / ZONA DE EXPEDICIÓN)
// ---------------------------------------------------------------------------
export function getStoredEmbarques(
  tenantId?: string,
  isSuperAdmin = false
): EmbarqueItem[] {
  const all = isBrowser()
    ? loadFromStorage<EmbarqueItem>(STORAGE_KEYS.EMBARQUES, memoryCacheEmbarques)
    : memoryCacheEmbarques;

  if (isSuperAdmin && (!tenantId || tenantId === "all")) {
    return [...all];
  }
  if (!tenantId || tenantId === "all") {
    return [...all];
  }
  return all.filter((e) => e.tenant_id === tenantId);
}

export function getAllStoredEmbarques(): EmbarqueItem[] {
  return isBrowser()
    ? loadFromStorage<EmbarqueItem>(STORAGE_KEYS.EMBARQUES, memoryCacheEmbarques)
    : memoryCacheEmbarques;
}

export function saveStoredEmbarque(embarque: EmbarqueItem): EmbarqueItem {
  const all = getAllStoredEmbarques();
  const index = all.findIndex(
    (e) => e.id === embarque.id || (e.folio && e.folio === embarque.folio)
  );
  let updated: EmbarqueItem[];

  if (index >= 0) {
    updated = [...all];
    updated[index] = { ...updated[index], ...embarque };
  } else {
    updated = [embarque, ...all];
  }

  memoryCacheEmbarques = updated;
  saveToStorage(STORAGE_KEYS.EMBARQUES, updated);
  return embarque;
}

export function updateStoredEmbarque(
  idOrFolio: string,
  updates: Partial<EmbarqueItem>
): EmbarqueItem | null {
  const all = getAllStoredEmbarques();
  const index = all.findIndex(
    (e) => e.id === idOrFolio || e.folio === idOrFolio
  );
  if (index === -1) return null;

  const updatedItem: EmbarqueItem = {
    ...all[index],
    ...updates,
  };

  const updated = [...all];
  updated[index] = updatedItem;
  memoryCacheEmbarques = updated;
  saveToStorage(STORAGE_KEYS.EMBARQUES, updated);
  return updatedItem;
}


