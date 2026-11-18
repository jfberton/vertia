// InvenTrack v2 - Modelos y Datos para la Matriz Espacial 3D y Slotting

export type CellStatus = "vacio" | "parcial" | "lleno" | "critico";

export interface SpatialCell {
  id: string;
  tenant_id: string;
  almacen_id: string;
  codigo_visual: string; // ej. P1-R02-E3-N2
  pasillo_id: string;    // ej. "P1", "P2"
  pasillo_nombre: string;// ej. "Pasillo 1 - Obra Gruesa & Cementos"
  rack: number;          // 1, 2, 3
  estanteria: number;    // 1, 2, 3
  nivel: number;         // 1 (Piso/Pick), 2, 3, 4 (Superior)
  capacidad_maxima: number;   // ej. 100 bultos
  cantidad_actual: number;    // ej. 75
  porcentaje_ocupacion: number; // 0 - 120%
  peso_max_kg: number;
  peso_actual_kg: number;
  producto_actual: string | null;
  sku?: string;
  categoria?: string;
  lote: string | null;
  fecha_ingreso?: string;
  estado: CellStatus;
  temperatura_controlada?: boolean;
  observaciones?: string;
}

export interface RecepcionItem {
  id: string;
  almacen_id: string;
  tenant_id: string;
  remito_numero: string;
  proveedor: string;
  producto_nombre: string;
  sku: string;
  categoria: string;
  cantidad_total: number;
  cantidad_pendiente: number;
  unidad: string;
  lote: string;
  peso_total_kg: number;
  fecha_hora_arribo: string;
  muelle_descarga: string;
  estado: "pendiente" | "en_proceso" | "completado";
  prioridad: "normal" | "alta" | "critica";
  sugerencia_pasillo?: string;
}

export type EmbarqueEstado = "Listo para cargar" | "En carga" | "Despachado";

export interface EmbarqueItem {
  id: string;
  almacen_id: string;
  tenant_id: string;
  folio: string;               // Folio orden (ej: "ORD-2026-7890")
  cliente: string;             // Cliente
  destino_obra: string;        // Destino de obra
  chofer_asignado: string;     // Chofer asignado + vehículo
  bultos: number;              // Bultos / Pallets
  peso_kg: number;             // Peso total en kg
  hora_limite_salida: string;  // Hora límite (ej: "15:30 hs")
  estado: EmbarqueEstado;      // 'Listo para cargar' | 'En carga' | 'Despachado'
  items_resumen?: string;      // ej: "120 Bolsas Cemento Loma Negra 50kg"
  muelle_embarque?: string;    // ej: "Muelle Salida 1"
  prioridad?: "normal" | "alta" | "critica";
  remito_numero?: string;
  fecha_hora_preparado?: string;
}

// Generador de código estándar de ubicación WMS
export function formatLocationCode(pasillo: number | string, rack: number, estanteria: number, nivel: number): string {
  const p = typeof pasillo === "string" ? pasillo.replace(/\D/g, "") || "1" : pasillo;
  const r = rack.toString().padStart(2, "0");
  const e = estanteria.toString();
  const n = nivel.toString();
  return `P${p}-R${r}-E${e}-N${n}`;
}

// Calcular estado en función del porcentaje de ocupación
export function calculateCellStatus(porcentaje: number): CellStatus {
  if (porcentaje <= 0) return "vacio";
  if (porcentaje < 80) return "parcial";
  if (porcentaje <= 100) return "lleno";
  return "critico";
}

// Semilla inicial de celdas espaciales para Galpón Central Oeste (Los Pinos)
export const MOCK_SPATIAL_CELLS_PINOS_CENTRAL: SpatialCell[] = [
  // PASILLO 1: Obra Gruesa & Cementos
  {
    id: "cell-p1-r01-e1-n1",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P1-R01-E1-N1",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Obra Gruesa & Cementos",
    rack: 1,
    estanteria: 1,
    nivel: 1,
    capacidad_maxima: 120,
    cantidad_actual: 120,
    porcentaje_ocupacion: 100,
    peso_max_kg: 6000,
    peso_actual_kg: 6000,
    producto_actual: "Cemento Loma Negra 50kg (Bolsa)",
    sku: "LMN-CEM-50",
    categoria: "Obra Gruesa",
    lote: "LOTE-LN-2024-X4",
    fecha_ingreso: "14/11/2026 09:15",
    estado: "lleno",
    observaciones: "Pallet reforzado en nivel suelo para carga directa de carretilla",
  },
  {
    id: "cell-p1-r01-e1-n2",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P1-R01-E1-N2",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Obra Gruesa & Cementos",
    rack: 1,
    estanteria: 1,
    nivel: 2,
    capacidad_maxima: 100,
    cantidad_actual: 65,
    porcentaje_ocupacion: 65,
    peso_max_kg: 5000,
    peso_actual_kg: 3250,
    producto_actual: "Cemento Loma Negra 50kg (Bolsa)",
    sku: "LMN-CEM-50",
    categoria: "Obra Gruesa",
    lote: "LOTE-LN-2024-X4",
    fecha_ingreso: "15/11/2026 11:20",
    estado: "parcial",
  },
  {
    id: "cell-p1-r01-e1-n3",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P1-R01-E1-N3",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Obra Gruesa & Cementos",
    rack: 1,
    estanteria: 1,
    nivel: 3,
    capacidad_maxima: 80,
    cantidad_actual: 0,
    porcentaje_ocupacion: 0,
    peso_max_kg: 4000,
    peso_actual_kg: 0,
    producto_actual: null,
    lote: null,
    estado: "vacio",
    observaciones: "Celda sanitizada y disponible para slotting",
  },
  {
    id: "cell-p1-r01-e2-n1",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P1-R01-E2-N1",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Obra Gruesa & Cementos",
    rack: 1,
    estanteria: 2,
    nivel: 1,
    capacidad_maxima: 100,
    cantidad_actual: 80,
    porcentaje_ocupacion: 80,
    peso_max_kg: 3000,
    peso_actual_kg: 2000,
    producto_actual: "Cal Santa Elena Hidratada (Bolsa 25kg)",
    sku: "CAL-STE-25",
    categoria: "Obra Gruesa",
    lote: "LOTE-SE-8891",
    fecha_ingreso: "12/11/2026 14:00",
    estado: "lleno",
  },
  {
    id: "cell-p1-r01-e2-n2",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P1-R01-E2-N2",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Obra Gruesa & Cementos",
    rack: 1,
    estanteria: 2,
    nivel: 2,
    capacidad_maxima: 100,
    cantidad_actual: 45,
    porcentaje_ocupacion: 45,
    peso_max_kg: 3000,
    peso_actual_kg: 1125,
    producto_actual: "Cal Santa Elena Hidratada (Bolsa 25kg)",
    sku: "CAL-STE-25",
    categoria: "Obra Gruesa",
    lote: "LOTE-SE-8891",
    fecha_ingreso: "13/11/2026 10:10",
    estado: "parcial",
  },
  {
    id: "cell-p1-r01-e2-n3",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P1-R01-E2-N3",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Obra Gruesa & Cementos",
    rack: 1,
    estanteria: 2,
    nivel: 3,
    capacidad_maxima: 80,
    cantidad_actual: 0,
    porcentaje_ocupacion: 0,
    peso_max_kg: 2500,
    peso_actual_kg: 0,
    producto_actual: null,
    lote: null,
    estado: "vacio",
  },

  // RACK 2 - PASILLO 1
  {
    id: "cell-p1-r02-e1-n1",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P1-R02-E1-N1",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Obra Gruesa & Cementos",
    rack: 2,
    estanteria: 1,
    nivel: 1,
    capacidad_maxima: 50,
    cantidad_actual: 54,
    porcentaje_ocupacion: 108,
    peso_max_kg: 2500,
    peso_actual_kg: 2700,
    producto_actual: "Cemento Holcim Fuerte 50kg",
    sku: "HLC-FRT-50",
    categoria: "Obra Gruesa",
    lote: "LOTE-HLC-9901",
    fecha_ingreso: "10/11/2026 08:30",
    estado: "critico",
    observaciones: "Alerta de estiba: Sobrecapacidad de 4 bultos sobre límite estructural",
  },
  {
    id: "cell-p1-r02-e1-n2",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P1-R02-E1-N2",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Obra Gruesa & Cementos",
    rack: 2,
    estanteria: 1,
    nivel: 2,
    capacidad_maxima: 50,
    cantidad_actual: 30,
    porcentaje_ocupacion: 60,
    peso_max_kg: 2500,
    peso_actual_kg: 1500,
    producto_actual: "Cemento Holcim Fuerte 50kg",
    sku: "HLC-FRT-50",
    categoria: "Obra Gruesa",
    lote: "LOTE-HLC-9901",
    fecha_ingreso: "10/11/2026 08:30",
    estado: "parcial",
  },
  {
    id: "cell-p1-r02-e1-n3",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P1-R02-E1-N3",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Obra Gruesa & Cementos",
    rack: 2,
    estanteria: 1,
    nivel: 3,
    capacidad_maxima: 40,
    cantidad_actual: 0,
    porcentaje_ocupacion: 0,
    peso_max_kg: 2000,
    peso_actual_kg: 0,
    producto_actual: null,
    lote: null,
    estado: "vacio",
  },

  // PASILLO 2: Áridos, Morteros & Adhesivos
  {
    id: "cell-p2-r01-e1-n1",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P2-R01-E1-N1",
    pasillo_id: "P2",
    pasillo_nombre: "Pasillo 2 - Áridos & Morteros",
    rack: 1,
    estanteria: 1,
    nivel: 1,
    capacidad_maxima: 20,
    cantidad_actual: 18,
    porcentaje_ocupacion: 90,
    peso_max_kg: 25000,
    peso_actual_kg: 23400,
    producto_actual: "Arena Fina de Río (Bolsón 1m³)",
    sku: "ARD-AR-1M3",
    categoria: "Áridos",
    lote: "LOTE-AR-2401",
    fecha_ingreso: "16/11/2026 07:45",
    estado: "lleno",
  },
  {
    id: "cell-p2-r01-e1-n2",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P2-R01-E1-N2",
    pasillo_id: "P2",
    pasillo_nombre: "Pasillo 2 - Áridos & Morteros",
    rack: 1,
    estanteria: 1,
    nivel: 2,
    capacidad_maxima: 60,
    cantidad_actual: 40,
    porcentaje_ocupacion: 67,
    peso_max_kg: 2000,
    peso_actual_kg: 1200,
    producto_actual: "Klaukol Impermeable Blanco 30kg",
    sku: "KLK-IMP-30",
    categoria: "Adhesivos",
    lote: "KLK-2024-B8",
    fecha_ingreso: "17/11/2026 15:20",
    estado: "parcial",
  },
  {
    id: "cell-p2-r01-e1-n3",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P2-R01-E1-N3",
    pasillo_id: "P2",
    pasillo_nombre: "Pasillo 2 - Áridos & Morteros",
    rack: 1,
    estanteria: 1,
    nivel: 3,
    capacidad_maxima: 50,
    cantidad_actual: 0,
    porcentaje_ocupacion: 0,
    peso_max_kg: 1800,
    peso_actual_kg: 0,
    producto_actual: null,
    lote: null,
    estado: "vacio",
  },
  {
    id: "cell-p2-r02-e1-n1",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P2-R02-E1-N1",
    pasillo_id: "P2",
    pasillo_nombre: "Pasillo 2 - Áridos & Morteros",
    rack: 2,
    estanteria: 1,
    nivel: 1,
    capacidad_maxima: 80,
    cantidad_actual: 76,
    porcentaje_ocupacion: 95,
    peso_max_kg: 2800,
    peso_actual_kg: 2660,
    producto_actual: "Weber Impermeable 30kg (Bolsa)",
    sku: "WEB-IMP-30",
    categoria: "Morteros",
    lote: "WEB-9912-L",
    fecha_ingreso: "16/11/2026 12:00",
    estado: "lleno",
  },
  {
    id: "cell-p2-r02-e1-n2",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P2-R02-E1-N2",
    pasillo_id: "P2",
    pasillo_nombre: "Pasillo 2 - Áridos & Morteros",
    rack: 2,
    estanteria: 1,
    nivel: 2,
    capacidad_maxima: 80,
    cantidad_actual: 20,
    porcentaje_ocupacion: 25,
    peso_max_kg: 2800,
    peso_actual_kg: 700,
    producto_actual: "Weber Impermeable 30kg (Bolsa)",
    sku: "WEB-IMP-30",
    categoria: "Morteros",
    lote: "WEB-9912-L",
    fecha_ingreso: "16/11/2026 12:00",
    estado: "parcial",
  },
  {
    id: "cell-p2-r02-e1-n3",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P2-R02-E1-N3",
    pasillo_id: "P2",
    pasillo_nombre: "Pasillo 2 - Áridos & Morteros",
    rack: 2,
    estanteria: 1,
    nivel: 3,
    capacidad_maxima: 60,
    cantidad_actual: 0,
    porcentaje_ocupacion: 0,
    peso_max_kg: 2000,
    peso_actual_kg: 0,
    producto_actual: null,
    lote: null,
    estado: "vacio",
  },

  // PASILLO 3: Aislaciones, Pinturas & Ferretería Industrial
  {
    id: "cell-p3-r01-e1-n1",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P3-R01-E1-N1",
    pasillo_id: "P3",
    pasillo_nombre: "Pasillo 3 - Aislaciones & Químicos",
    rack: 1,
    estanteria: 1,
    nivel: 1,
    capacidad_maxima: 40,
    cantidad_actual: 32,
    porcentaje_ocupacion: 80,
    peso_max_kg: 1200,
    peso_actual_kg: 960,
    producto_actual: "Membrana Asfáltica 4mm con Aluminio",
    sku: "MEM-ASF-4MM",
    categoria: "Aislaciones",
    lote: "MEM-2024-C2",
    fecha_ingreso: "11/11/2026 16:30",
    estado: "lleno",
  },
  {
    id: "cell-p3-r01-e1-n2",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P3-R01-E1-N2",
    pasillo_id: "P3",
    pasillo_nombre: "Pasillo 3 - Aislaciones & Químicos",
    rack: 1,
    estanteria: 1,
    nivel: 2,
    capacidad_maxima: 40,
    cantidad_actual: 15,
    porcentaje_ocupacion: 38,
    peso_max_kg: 1000,
    peso_actual_kg: 375,
    producto_actual: "Pintura Asfáltica Secado Rápido 18L",
    sku: "PNT-ASF-18L",
    categoria: "Químicos",
    lote: "PNT-8821",
    fecha_ingreso: "15/11/2026 14:10",
    estado: "parcial",
  },
  {
    id: "cell-p3-r01-e1-n3",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "P3-R01-E1-N3",
    pasillo_id: "P3",
    pasillo_nombre: "Pasillo 3 - Aislaciones & Químicos",
    rack: 1,
    estanteria: 1,
    nivel: 3,
    capacidad_maxima: 30,
    cantidad_actual: 0,
    porcentaje_ocupacion: 0,
    peso_max_kg: 800,
    peso_actual_kg: 0,
    producto_actual: null,
    lote: null,
    estado: "vacio",
  },
];

// Semilla para Materiales del Centro (Sucursal Centro)
export const MOCK_SPATIAL_CELLS_CENTRO_SUCURSAL: SpatialCell[] = [
  // Pasillo 1: Acero & Perfiles Pesados
  {
    id: "cell-sc-p1-r01-e1-n1",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "P1-R01-E1-N1",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Perfiles de Acero Pesado",
    rack: 1,
    estanteria: 1,
    nivel: 1,
    capacidad_maxima: 300,
    cantidad_actual: 250,
    porcentaje_ocupacion: 83,
    peso_max_kg: 8000,
    peso_actual_kg: 6640,
    producto_actual: "Hierro Nervado Ø 10mm (Barra 12m)",
    sku: "ACN-HN10-12M",
    categoria: "Acero",
    lote: "ACINDAR-2024-HN10",
    fecha_ingreso: "10/11/2026 10:00",
    estado: "lleno",
  },
  {
    id: "cell-sc-p1-r01-e1-n2",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "P1-R01-E1-N2",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Perfiles de Acero Pesado",
    rack: 1,
    estanteria: 1,
    nivel: 2,
    capacidad_maxima: 200,
    cantidad_actual: 110,
    porcentaje_ocupacion: 55,
    peso_max_kg: 6000,
    peso_actual_kg: 3300,
    producto_actual: "Hierro Nervado Ø 8mm (Barra 12m)",
    sku: "ACN-HN08-12M",
    categoria: "Acero",
    lote: "ACINDAR-2024-HN08",
    fecha_ingreso: "12/11/2026 11:30",
    estado: "parcial",
  },
  {
    id: "cell-sc-p1-r01-e1-n3",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "P1-R01-E1-N3",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Perfiles de Acero Pesado",
    rack: 1,
    estanteria: 1,
    nivel: 3,
    capacidad_maxima: 150,
    cantidad_actual: 0,
    porcentaje_ocupacion: 0,
    peso_max_kg: 4000,
    peso_actual_kg: 0,
    producto_actual: null,
    lote: null,
    estado: "vacio",
  },
  {
    id: "cell-sc-p1-r02-e1-n1",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "P1-R02-E1-N1",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Perfiles de Acero Pesado",
    rack: 2,
    estanteria: 1,
    nivel: 1,
    capacidad_maxima: 40,
    cantidad_actual: 35,
    porcentaje_ocupacion: 88,
    peso_max_kg: 5000,
    peso_actual_kg: 4375,
    producto_actual: "Malla Electrosoldada Q188 15x15 (Paño 2.40x6m)",
    sku: "MAL-Q188-B",
    categoria: "Acero",
    lote: "MALLA-Q188-B",
    fecha_ingreso: "14/11/2026 16:00",
    estado: "lleno",
  },
  {
    id: "cell-sc-p1-r02-e1-n2",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "P1-R02-E1-N2",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Perfiles de Acero Pesado",
    rack: 2,
    estanteria: 1,
    nivel: 2,
    capacidad_maxima: 40,
    cantidad_actual: 10,
    porcentaje_ocupacion: 25,
    peso_max_kg: 5000,
    peso_actual_kg: 1250,
    producto_actual: "Malla Electrosoldada Q188 15x15 (Paño 2.40x6m)",
    sku: "MAL-Q188-B",
    categoria: "Acero",
    lote: "MALLA-Q188-B",
    fecha_ingreso: "15/11/2026 09:30",
    estado: "parcial",
  },
  {
    id: "cell-sc-p1-r02-e1-n3",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "P1-R02-E1-N3",
    pasillo_id: "P1",
    pasillo_nombre: "Pasillo 1 - Perfiles de Acero Pesado",
    rack: 2,
    estanteria: 1,
    nivel: 3,
    capacidad_maxima: 30,
    cantidad_actual: 0,
    porcentaje_ocupacion: 0,
    peso_max_kg: 3500,
    peso_actual_kg: 0,
    producto_actual: null,
    lote: null,
    estado: "vacio",
  },

  // Pasillo 2: Ladrillería & Bloques
  {
    id: "cell-sc-p2-r01-e1-n1",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "P2-R01-E1-N1",
    pasillo_id: "P2",
    pasillo_nombre: "Pasillo 2 - Ladrillería & Bloques",
    rack: 1,
    estanteria: 1,
    nivel: 1,
    capacidad_maxima: 45,
    cantidad_actual: 40,
    porcentaje_ocupacion: 89,
    peso_max_kg: 36000,
    peso_actual_kg: 32000,
    producto_actual: "Ladrillo Hueco 12x18x33 (Pallet x 144u)",
    sku: "LAD-HUE-1218",
    categoria: "Ladrillos",
    lote: "PAL-LH-1218",
    fecha_ingreso: "16/11/2026 08:00",
    estado: "lleno",
  },
  {
    id: "cell-sc-p2-r01-e1-n2",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "P2-R01-E1-N2",
    pasillo_id: "P2",
    pasillo_nombre: "Pasillo 2 - Ladrillería & Bloques",
    rack: 1,
    estanteria: 1,
    nivel: 2,
    capacidad_maxima: 30,
    cantidad_actual: 32,
    porcentaje_ocupacion: 107,
    peso_max_kg: 24000,
    peso_actual_kg: 25600,
    producto_actual: "Bloque Portante Cerámico 18x19x33",
    sku: "LAD-POR-1819",
    categoria: "Ladrillos",
    lote: "PAL-POR-881",
    fecha_ingreso: "16/11/2026 10:45",
    estado: "critico",
    observaciones: "Exceso de peso sobre nivel medio: programar reestiba a nivel suelo",
  },
  {
    id: "cell-sc-p2-r01-e1-n3",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "P2-R01-E1-N3",
    pasillo_id: "P2",
    pasillo_nombre: "Pasillo 2 - Ladrillería & Bloques",
    rack: 1,
    estanteria: 1,
    nivel: 3,
    capacidad_maxima: 20,
    cantidad_actual: 0,
    porcentaje_ocupacion: 0,
    peso_max_kg: 16000,
    peso_actual_kg: 0,
    producto_actual: null,
    lote: null,
    estado: "vacio",
  },
];

// Semilla para Áreas de Recepción
export const MOCK_SPATIAL_CELLS_PINOS_RECEPCION: SpatialCell[] = [
  {
    id: "cell-rec-o-b1",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-recepcion",
    codigo_visual: "P1-R01-E1-N1",
    pasillo_id: "P1",
    pasillo_nombre: "Plataforma Norte - Bahías de Arribo",
    rack: 1,
    estanteria: 1,
    nivel: 1,
    capacidad_maxima: 100,
    cantidad_actual: 45,
    porcentaje_ocupacion: 45,
    peso_max_kg: 10000,
    peso_actual_kg: 4500,
    producto_actual: "Loma Negra Cemento (Pallet temporal)",
    lote: "LOTE-TEMP-01",
    estado: "parcial",
  },
  {
    id: "cell-rec-o-b2",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-recepcion",
    codigo_visual: "P1-R01-E2-N1",
    pasillo_id: "P1",
    pasillo_nombre: "Plataforma Norte - Bahías de Arribo",
    rack: 1,
    estanteria: 2,
    nivel: 1,
    capacidad_maxima: 100,
    cantidad_actual: 0,
    porcentaje_ocupacion: 0,
    peso_max_kg: 10000,
    peso_actual_kg: 0,
    producto_actual: null,
    lote: null,
    estado: "vacio",
  },
];

// Artículos pendientes en el Pulmón Operativo / Zona de Recepción
export const MOCK_RECEPCION_ITEMS: RecepcionItem[] = [
  // Corralón Los Pinos
  {
    id: "rec-item-1",
    almacen_id: "alm-pinos-central",
    tenant_id: "tenant-los-pinos",
    remito_numero: "REM-2026-9042",
    proveedor: "Loma Negra C.I.A.S.A.",
    producto_nombre: "Cemento Loma Negra 50kg (Bolsa)",
    sku: "LMN-CEM-50",
    categoria: "Obra Gruesa",
    cantidad_total: 50,
    cantidad_pendiente: 50,
    unidad: "Bolsas",
    lote: "LOTE-LN-2026-NOV2",
    peso_total_kg: 2500,
    fecha_hora_arribo: "Hoy, hace 18 min",
    muelle_descarga: "Muelle 1 - Descarga Pesada",
    estado: "pendiente",
    prioridad: "alta",
    sugerencia_pasillo: "Pasillo 1 - Obra Gruesa & Cementos",
  },
  {
    id: "rec-item-2",
    almacen_id: "alm-pinos-central",
    tenant_id: "tenant-los-pinos",
    remito_numero: "REM-2026-9043",
    proveedor: "Klaukol S.A.",
    producto_nombre: "Pegamento Klaukol Impermeable 30kg",
    sku: "KLK-IMP-30",
    categoria: "Adhesivos",
    cantidad_total: 35,
    cantidad_pendiente: 35,
    unidad: "Bolsas",
    lote: "KLK-2026-X8",
    peso_total_kg: 1050,
    fecha_hora_arribo: "Hoy, hace 42 min",
    muelle_descarga: "Muelle 2 - Furgón Ligero",
    estado: "pendiente",
    prioridad: "normal",
    sugerencia_pasillo: "Pasillo 2 - Áridos & Morteros",
  },
  {
    id: "rec-item-3",
    almacen_id: "alm-pinos-central",
    tenant_id: "tenant-los-pinos",
    remito_numero: "REM-2026-9044",
    proveedor: "Megaflex Aluminios",
    producto_nombre: "Membrana Asfáltica 4mm con Aluminio",
    sku: "MEM-ASF-4MM",
    categoria: "Aislaciones",
    cantidad_total: 20,
    cantidad_pendiente: 20,
    unidad: "Rollos",
    lote: "MGF-2026-L4",
    peso_total_kg: 800,
    fecha_hora_arribo: "Hoy, hace 1h 10m",
    muelle_descarga: "Muelle 2 - Furgón Ligero",
    estado: "pendiente",
    prioridad: "normal",
    sugerencia_pasillo: "Pasillo 3 - Aislaciones & Químicos",
  },

  // Materiales del Centro
  {
    id: "rec-item-4",
    almacen_id: "alm-centro-sucursal",
    tenant_id: "tenant-materiales-centro",
    remito_numero: "REM-2026-8101",
    proveedor: "Acindar Rosario Planta Heredia",
    producto_nombre: "Hierro Nervado Ø 12mm (Barra 12m)",
    sku: "ACN-HN12-12M",
    categoria: "Acero",
    cantidad_total: 40,
    cantidad_pendiente: 40,
    unidad: "Barras",
    lote: "ACN-2026-HN12-Z1",
    peso_total_kg: 4260,
    fecha_hora_arribo: "Hoy, hace 25 min",
    muelle_descarga: "Rampa Grúa Puente Norte",
    estado: "pendiente",
    prioridad: "critica",
    sugerencia_pasillo: "Pasillo 1 - Perfiles de Acero Pesado",
  },
  {
    id: "rec-item-5",
    almacen_id: "alm-centro-sucursal",
    tenant_id: "tenant-materiales-centro",
    remito_numero: "REM-2026-8102",
    proveedor: "Cerámica Palmar Rosario",
    producto_nombre: "Ladrillo Hueco 12x18x33 (Pallet x 144u)",
    sku: "LAD-HUE-1218",
    categoria: "Ladrillos",
    cantidad_total: 10,
    cantidad_pendiente: 10,
    unidad: "Pallets",
    lote: "PAL-2026-N1",
    peso_total_kg: 8000,
    fecha_hora_arribo: "Hoy, hace 55 min",
    muelle_descarga: "Plataforma Camiones Chasis",
    estado: "pendiente",
    prioridad: "normal",
    sugerencia_pasillo: "Pasillo 2 - Ladrillería & Bloques",
  },
];

// Generador dinámico para almacenes nuevos o que no tengan seed explícito
export function generateDefaultWarehouseCells(almacenId: string, tenantId: string, warehouseName: string): SpatialCell[] {
  const cells: SpatialCell[] = [];
  const pasillos = [
    { id: "P1", nombre: "Pasillo 1 - Entrada & Despacho Rápido" },
    { id: "P2", nombre: "Pasillo 2 - Estiba Pesada & Racks Altos" },
    { id: "P3", nombre: "Pasillo 3 - Accesorios & Químicos" },
  ];

  pasillos.forEach((pasillo) => {
    for (let rack = 1; rack <= 2; rack++) {
      for (let est = 1; est <= 2; est++) {
        for (let nivel = 1; nivel <= 3; nivel++) {
          const code = formatLocationCode(pasillo.id, rack, est, nivel);
          const cellId = `cell-${almacenId}-${pasillo.id.toLowerCase()}-r0${rack}-e0${est}-n${nivel}`;
          
          // Generate a varied occupancy pattern
          const isFull = (rack === 1 && nivel === 1 && est === 1);
          const isPartial = (rack === 1 && nivel === 2) || (rack === 2 && nivel === 1);
          const isCritical = (rack === 2 && nivel === 2 && est === 2);
          
          let pct = 0;
          let cantidad = 0;
          let prod: string | null = null;
          let status: CellStatus = "vacio";
          let lote: string | null = null;

          if (isCritical) {
            pct = 105;
            cantidad = 52;
            prod = "Material en Alerta de Peso";
            status = "critico";
            lote = "LOTE-ALERTA-01";
          } else if (isFull) {
            pct = 100;
            cantidad = 50;
            prod = "Cemento Portland Normal 50kg";
            status = "lleno";
            lote = "LOTE-STD-2026";
          } else if (isPartial) {
            pct = 60;
            cantidad = 30;
            prod = "Mortero Adhesivo Multi-Uso";
            status = "parcial";
            lote = "LOTE-STD-PARCIAL";
          }

          cells.push({
            id: cellId,
            tenant_id: tenantId,
            almacen_id: almacenId,
            codigo_visual: code,
            pasillo_id: pasillo.id,
            pasillo_nombre: pasillo.nombre,
            rack,
            estanteria: est,
            nivel,
            capacidad_maxima: 50,
            cantidad_actual: cantidad,
            porcentaje_ocupacion: pct,
            peso_max_kg: 3000,
            peso_actual_kg: Math.round(cantidad * 45),
            producto_actual: prod,
            lote,
            estado: status,
          });
        }
      }
    }
  });

  return cells;
}

// Obtener celdas para un almacén dado
export function getSpatialCellsForWarehouse(almacenId: string, tenantId: string, warehouseName: string): SpatialCell[] {
  if (almacenId === "alm-pinos-central") {
    return MOCK_SPATIAL_CELLS_PINOS_CENTRAL;
  }
  if (almacenId === "alm-centro-sucursal") {
    return MOCK_SPATIAL_CELLS_CENTRO_SUCURSAL;
  }
  if (almacenId === "alm-pinos-recepcion") {
    return MOCK_SPATIAL_CELLS_PINOS_RECEPCION;
  }
  return generateDefaultWarehouseCells(almacenId, tenantId, warehouseName);
}

// ==========================================
// DESPACHOS PREPARADOS EN ZONA DE EMBARQUE / MUELLE DE EXPEDICIÓN
// ==========================================
export const MOCK_EMBARQUE_ITEMS: EmbarqueItem[] = [
  // Corralón Los Pinos S.R.L.
  {
    id: "emb-item-1",
    almacen_id: "alm-pinos-central",
    tenant_id: "tenant-los-pinos",
    folio: "ORD-2026-7890",
    cliente: "Constructora del Litoral S.A.",
    destino_obra: "Torres del Río - Dique 2, Puerto Norte",
    chofer_asignado: "Ramón González (Mercedes 1634 - Dominio AB-492-CD)",
    bultos: 120,
    peso_kg: 6000,
    hora_limite_salida: "14:30 hs",
    estado: "Listo para cargar",
    items_resumen: "120 Bolsas Cemento Loma Negra 50kg (2 Pallets completos)",
    muelle_embarque: "Muelle Salida 1 - Grúa Autopropulsada",
    prioridad: "alta",
    remito_numero: "REM-EXP-2026-0041",
    fecha_hora_preparado: "Hoy, hace 35 min",
  },
  {
    id: "emb-item-2",
    almacen_id: "alm-pinos-central",
    tenant_id: "tenant-los-pinos",
    folio: "ORD-2026-7894",
    cliente: "Ingeniería & Obras Civiles Rossi",
    destino_obra: "Bv. Oroño 4500 (Edificio Plaza)",
    chofer_asignado: "Esteban Quiroga (Iveco Tector - Dominio AF-104-ZZ)",
    bultos: 45,
    peso_kg: 1125,
    hora_limite_salida: "16:00 hs",
    estado: "En carga",
    items_resumen: "45 Bolsas Cal Santa Elena 25kg + Aditivos",
    muelle_embarque: "Muelle Salida 2 - Furgón Ligero",
    prioridad: "normal",
    remito_numero: "REM-EXP-2026-0042",
    fecha_hora_preparado: "Hoy, hace 1h 10m",
  },
  {
    id: "emb-item-3",
    almacen_id: "alm-pinos-central",
    tenant_id: "tenant-los-pinos",
    folio: "ORD-2026-7898",
    cliente: "Desarrollos Urbanos Rosario",
    destino_obra: "Av. Pellegrini 2800 (Complejo Residencial)",
    chofer_asignado: "Mariano Pereyra (Ford Cargo - Dominio AE-883-PK)",
    bultos: 50,
    peso_kg: 2500,
    hora_limite_salida: "17:15 hs",
    estado: "Listo para cargar",
    items_resumen: "50 Bolsas Cemento Holcim Fuerte 50kg",
    muelle_embarque: "Muelle Salida 1 - Grúa Autopropulsada",
    prioridad: "normal",
    remito_numero: "REM-EXP-2026-0043",
    fecha_hora_preparado: "Hoy, hace 50 min",
  },
  {
    id: "emb-item-4",
    almacen_id: "alm-pinos-embarque",
    tenant_id: "tenant-los-pinos",
    folio: "ORD-2026-7901",
    cliente: "Arquitectura & Estructuras SRL",
    destino_obra: "Parque Industrial Oeste - Lote 14",
    chofer_asignado: "Nahuel Vega (Scania G360 - Dominio AC-950-XY)",
    bultos: 80,
    peso_kg: 4000,
    hora_limite_salida: "18:00 hs",
    estado: "Despachado",
    items_resumen: "80 Bolsas Cemento Loma Negra + Malla Sima",
    muelle_embarque: "Dársena 3 - Salida Ruta",
    prioridad: "normal",
    remito_numero: "REM-EXP-2026-0044",
    fecha_hora_preparado: "Hoy, 11:20 hs",
  },

  // Materiales del Centro S.A.
  {
    id: "emb-item-5",
    almacen_id: "alm-centro-sucursal",
    tenant_id: "tenant-materiales-centro",
    folio: "ORD-2026-8105",
    cliente: "Obras Viales Santa Fe",
    destino_obra: "Autopista Rosario-Córdoba Km 312",
    chofer_asignado: "Héctor Valenzuela (Scania R450 - Dominio AG-319-PL)",
    bultos: 40,
    peso_kg: 4260,
    hora_limite_salida: "15:00 hs",
    estado: "Listo para cargar",
    items_resumen: "40 Barras Hierro Nervado Ø 12mm (12m c/u)",
    muelle_embarque: "Plataforma Salida Pesada Grúa Puente",
    prioridad: "critica",
    remito_numero: "REM-EXP-2026-0089",
    fecha_hora_preparado: "Hoy, hace 15 min",
  },
  {
    id: "emb-item-6",
    almacen_id: "alm-centro-sucursal",
    tenant_id: "tenant-materiales-centro",
    folio: "ORD-2026-8108",
    cliente: "Edificadora del Paraná",
    destino_obra: "San Lorenzo 1420, Rosario Centro",
    chofer_asignado: "Claudio Morales (Mercedes Atego - Dominio AD-772-TY)",
    bultos: 10,
    peso_kg: 8000,
    hora_limite_salida: "16:45 hs",
    estado: "En carga",
    items_resumen: "10 Pallets Ladrillo Hueco 12x18x33 (1440 un)",
    muelle_embarque: "Dársena Salida 2",
    prioridad: "normal",
    remito_numero: "REM-EXP-2026-0090",
    fecha_hora_preparado: "Hoy, hace 40 min",
  },
  {
    id: "emb-item-7",
    almacen_id: "alm-centro-embarque",
    tenant_id: "tenant-materiales-centro",
    folio: "ORD-2026-8112",
    cliente: "Viviendas Rosario Norte",
    destino_obra: "Av. Alberdi 600",
    chofer_asignado: "Fernando Dávila (Iveco Daily - Dominio AE-123-BC)",
    bultos: 25,
    peso_kg: 1250,
    hora_limite_salida: "17:30 hs",
    estado: "Listo para cargar",
    items_resumen: "25 Cajas Cerámicos Esmaltados 45x45",
    muelle_embarque: "Dársena Salida Rápida 1",
    prioridad: "normal",
    remito_numero: "REM-EXP-2026-0091",
    fecha_hora_preparado: "Hoy, hace 20 min",
  },
];
