// InvenTrack v2 - Seed Data Multi-Tenant & Aislamiento de Corralones

export interface MultiTenantUser {
  id: string;
  email: string;
  nombre_completo: string;
  cargo: string;
  rol: "super_admin" | "administrador" | "operario" | "receptor_mercaderia" | "responsable_inventario" | "cliente";
  is_super_admin: boolean;
  tenant_id: string | null;
  tenant_nombre?: string;
  avatar_url?: string;
  tipo_empresa?: "corralon" | "constructora" | "servicios";
}

export interface MultiTenantInfo {
  id: string;
  nombre: string;
  slug: string;
  cuit_rut_taxid: string;
  direccion: string;
  ciudad: string;
  pais: string;
  radio_cobertura_km: number;
  tipo_empresa: "corralon" | "servicios" | "constructora";
  plan: "free" | "pro" | "enterprise";
  activo: boolean;
  habilitado_inventrack: boolean;
  created_at: string;
}

export interface MultiTenantAlmacen {
  id: string;
  tenant_id: string;
  nombre: string;
  direccion: string;
  radio_cobertura_km: number;
  coordenadas_gps: string;
  capacidad_maxima: number;
  es_zona_recepcion: boolean;
  es_zona_embarque?: boolean;
  total_ubicaciones: number;
  ocupacion_porcentaje: number;
  descripcion?: string;
}

export interface MultiTenantUbicacion {
  id: string;
  tenant_id: string;
  almacen_id: string;
  codigo_visual: string;
  tipo: "rack" | "estanteria" | "recepcion" | "patio";
  fila: number;
  rack: number;
  estanteria: number;
  nivel: number;
  producto_actual?: string | null;
  cantidad?: number;
  lote?: string;
  estado: "vacio" | "ocupado" | "completo";
}

export interface MultiTenantProducto {
  id: string;
  tenant_id: string;
  codigo_barras: string;
  nombre: string;
  categoria: string;
  unidad_medida: string;
  precio: number;
  stock_real: number;          // Físico en galpón
  stock_comprometido: number;  // Reservado en órdenes
  stock_disponible: number;    // Libre para la red o mostrador (stock_real - stock_comprometido)
  cantidad_minima: number;
  cantidad_maxima: number;
  publicado_en_red: boolean;
  almacen_id: string;
  ubicacion_estanteria: string;
}

export interface MultiTenantDetalleOrden {
  id: string;
  material: string;
  codigo: string;
  cantidadSolicitada: number;
  cantidadDisponibleCorralon: number;
  stockRealFisico: number;
  cantidadAutorizadaExtension: number;
  unidad: string;
  estadoItem: "Completo" | "Extensión requerida" | "Extensión autorizada";
  pasillo?: string;
  rack?: number;
  estanteria?: number;
  nivel?: number;
  codigo_visual?: string;
  lote?: string;
  peso_kg_unitario?: number;
  peso_total_kg?: number;
}

export interface MultiTenantOrden {
  id: string;
  tenant_id: string;
  folio: string;
  tipo: "Material" | "Mantenimiento";
  proyectoUbicacion: string;
  cliente: string;
  corralonAsignado: string;
  fecha: string;
  estado: "Por cotizar" | "Asignada" | "En preparación" | "En camino" | "Entregada";
  distanciaKm: number;
  detalles: MultiTenantDetalleOrden[];
  remito_numero?: string;
  chofer_asignado?: string;
  dni_chofer?: string;
  vehiculo_asignado?: string;
  patente_asignada?: string;
  zona_embarque?: string;
}

// ==========================================
// TENANTS REGISTRADOS
// ==========================================
export const MOCK_TENANTS: MultiTenantInfo[] = [
  {
    id: "tenant-los-pinos",
    nombre: "Corralón Los Pinos S.R.L.",
    slug: "corralon-los-pinos",
    cuit_rut_taxid: "30-71458921-9",
    direccion: "Av. Circunvalación 4500, Rosario Oeste",
    ciudad: "Rosario Oeste",
    pais: "Argentina",
    radio_cobertura_km: 25,
    tipo_empresa: "corralon",
    plan: "pro",
    activo: true,
    habilitado_inventrack: true,
    created_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "tenant-materiales-centro",
    nombre: "Materiales del Centro S.A.",
    slug: "materiales-del-centro",
    cuit_rut_taxid: "30-68945123-3",
    direccion: "Bv. Oroño 1850, Rosario Centro",
    ciudad: "Rosario Centro",
    pais: "Argentina",
    radio_cobertura_km: 40,
    tipo_empresa: "corralon",
    plan: "enterprise",
    activo: true,
    habilitado_inventrack: true,
    created_at: "2024-02-10T10:30:00Z",
  },
];

// ==========================================
// USUARIOS DEMO Y CREDENCIALES
// ==========================================
export const MOCK_USERS: MultiTenantUser[] = [
  {
    id: "usr-humberto",
    email: "humberto@vertia.com",
    nombre_completo: "Humberto Rivero Gonzalez",
    cargo: "Fundador & Super Administrador de Plataforma",
    rol: "super_admin",
    is_super_admin: true,
    tenant_id: null,
    tenant_nombre: "Vertia Core Platform",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    tipo_empresa: "servicios",
  },
  {
    id: "usr-federico",
    email: "federico@vertia.com",
    nombre_completo: "Federico Bertoncini",
    cargo: "CTO & Super Administrador de Plataforma",
    rol: "super_admin",
    is_super_admin: true,
    tenant_id: null,
    tenant_nombre: "Vertia Core Platform",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    tipo_empresa: "servicios",
  },
  {
    id: "usr-martin-rossi",
    email: "martin.rossi@lospinos.com.ar",
    nombre_completo: "Ing. Martín Rossi",
    cargo: "Administrador General",
    rol: "administrador",
    is_super_admin: false,
    tenant_id: "tenant-los-pinos",
    tenant_nombre: "Corralón Los Pinos S.R.L.",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    tipo_empresa: "corralon",
  },
  {
    id: "usr-juan-capataz",
    email: "juan.capataz@lospinos.com.ar",
    nombre_completo: "Juan Capataz",
    cargo: "Operario de Galpón & Recepción",
    rol: "receptor_mercaderia",
    is_super_admin: false,
    tenant_id: "tenant-los-pinos",
    tenant_nombre: "Corralón Los Pinos S.R.L.",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    tipo_empresa: "corralon",
  },
  {
    id: "usr-carlos-benitez",
    email: "carlos.benitez@materialescentro.com.ar",
    nombre_completo: "Lic. Carlos Benítez",
    cargo: "Administrador de Sucursal",
    rol: "administrador",
    is_super_admin: false,
    tenant_id: "tenant-materiales-centro",
    tenant_nombre: "Materiales del Centro S.A.",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    tipo_empresa: "corralon",
  },
  {
    id: "usr-lucas-deposito",
    email: "lucas.deposito@materialescentro.com.ar",
    nombre_completo: "Lucas Depósito",
    cargo: "Operario de Galpón & Heavy Racks",
    rol: "responsable_inventario",
    is_super_admin: false,
    tenant_id: "tenant-materiales-centro",
    tenant_nombre: "Materiales del Centro S.A.",
    avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    tipo_empresa: "corralon",
  },
  {
    id: "usr-sofia-valenzuela",
    email: "sofia.valenzuela@constructora.com",
    nombre_completo: "Arq. Sofia Valenzuela",
    cargo: "Directora de Obras",
    rol: "cliente",
    is_super_admin: false,
    tenant_id: null,
    tenant_nombre: "Constructora Arcos S.A.",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    tipo_empresa: "constructora",
  },
];

// ==========================================
// ALMACENES POR TENANT
// ==========================================
export const MOCK_ALMACENES: MultiTenantAlmacen[] = [
  // Corralón Los Pinos S.R.L. (Rosario Oeste, 25km radius)
  {
    id: "alm-pinos-central",
    tenant_id: "tenant-los-pinos",
    nombre: "Galpón Central Oeste",
    direccion: "Av. Circunvalación 4500, Rosario Oeste",
    radio_cobertura_km: 25,
    coordenadas_gps: "-32.9511, -60.6663",
    capacidad_maxima: 5000,
    es_zona_recepcion: false,
    es_zona_embarque: false,
    total_ubicaciones: 240,
    ocupacion_porcentaje: 68,
    descripcion: "Galpón principal con estanterías multinivel, racks para cemento y cal, y zona de carga lateral.",
  },
  {
    id: "alm-pinos-recepcion",
    tenant_id: "tenant-los-pinos",
    nombre: "Área de Recepción & Descarga Oeste",
    direccion: "Portón Norte 2, Av. Circunvalación 4500",
    radio_cobertura_km: 15,
    coordenadas_gps: "-32.9490, -60.6650",
    capacidad_maxima: 1000,
    es_zona_recepcion: true,
    es_zona_embarque: false,
    total_ubicaciones: 36,
    ocupacion_porcentaje: 30,
    descripcion: "Bahía de ingreso rápido para camiones tolva y control de albarán.",
  },
  {
    id: "alm-pinos-embarque",
    tenant_id: "tenant-los-pinos",
    nombre: "Muelle de Embarque y Expedición Oeste",
    direccion: "Portón Sur 4, Av. Circunvalación 4500",
    radio_cobertura_km: 25,
    coordenadas_gps: "-32.9520, -60.6670",
    capacidad_maxima: 800,
    es_zona_recepcion: false,
    es_zona_embarque: true,
    total_ubicaciones: 24,
    ocupacion_porcentaje: 45,
    descripcion: "Dársenas de expedición, consolidación de remitos y carga pesada a camiones.",
  },


  // Materiales del Centro S.A. (Rosario Centro, 40km radius)
  {
    id: "alm-centro-sucursal",
    tenant_id: "tenant-materiales-centro",
    nombre: "Sucursal Centro",
    direccion: "Bv. Oroño 1850, Rosario Centro",
    radio_cobertura_km: 40,
    coordenadas_gps: "-32.9602, -60.6558",
    capacidad_maxima: 6000,
    es_zona_recepcion: false,
    es_zona_embarque: false,
    total_ubicaciones: 320,
    ocupacion_porcentaje: 72,
    descripcion: "Base logística urbana equipada con racks pesados para perfiles de acero, vigas y ladrillos.",
  },
  {
    id: "alm-centro-recepcion",
    tenant_id: "tenant-materiales-centro",
    nombre: "Área de Recepción & Pesaje Pesado",
    direccion: "Bv. Oroño 1870, Acceso Rampa Camiones",
    radio_cobertura_km: 40,
    coordenadas_gps: "-32.9590, -60.6540",
    capacidad_maxima: 1200,
    es_zona_recepcion: true,
    es_zona_embarque: false,
    total_ubicaciones: 45,
    ocupacion_porcentaje: 35,
    descripcion: "Báscula y plataforma de descarga de mallas y perfiles pesados.",
  },
  {
    id: "alm-centro-embarque",
    tenant_id: "tenant-materiales-centro",
    nombre: "Muelle de Embarque Rosario Centro",
    direccion: "Bv. Oroño 1890, Dársena Salida Rápida",
    radio_cobertura_km: 40,
    coordenadas_gps: "-32.9610, -60.6565",
    capacidad_maxima: 1000,
    es_zona_recepcion: false,
    es_zona_embarque: true,
    total_ubicaciones: 28,
    ocupacion_porcentaje: 50,
    descripcion: "Bahías de carga de pedidos pickeados y despacho en obra.",
  },

];

// ==========================================
// UBICACIONES POR ALMACEN
// ==========================================
export const MOCK_UBICACIONES: MultiTenantUbicacion[] = [
  // Corralón Los Pinos - Galpón Central Oeste
  {
    id: "ub-pinos-1",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "GCO-R01-E01-N1",
    tipo: "rack",
    fila: 1,
    rack: 1,
    estanteria: 1,
    nivel: 1,
    producto_actual: "Cemento Loma Negra 50kg (Bolsa)",
    cantidad: 120,
    lote: "LOTE-LN-2024-X4",
    estado: "completo",
  },
  {
    id: "ub-pinos-2",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "GCO-R02-E01-N1",
    tipo: "rack",
    fila: 1,
    rack: 2,
    estanteria: 1,
    nivel: 1,
    producto_actual: "Cal Santa Elena Hidratada (Bolsa 25kg)",
    cantidad: 80,
    lote: "LOTE-SE-8891",
    estado: "ocupado",
  },
  {
    id: "ub-pinos-3",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-central",
    codigo_visual: "GCO-SILO-03",
    tipo: "patio",
    fila: 2,
    rack: 1,
    estanteria: 1,
    nivel: 1,
    producto_actual: "Arena Fina de Río (Bolsón 1m³)",
    cantidad: 18,
    lote: "LOTE-AR-2401",
    estado: "ocupado",
  },
  {
    id: "ub-pinos-rec-1",
    tenant_id: "tenant-los-pinos",
    almacen_id: "alm-pinos-recepcion",
    codigo_visual: "REC-OESTE-BAHIA-01",
    tipo: "recepcion",
    fila: 1,
    rack: 0,
    estanteria: 0,
    nivel: 0,
    producto_actual: null,
    cantidad: 0,
    estado: "vacio",
  },

  // Materiales del Centro - Sucursal Centro
  {
    id: "ub-centro-1",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "SC-HEAVY-R01-N1",
    tipo: "rack",
    fila: 1,
    rack: 1,
    estanteria: 1,
    nivel: 1,
    producto_actual: "Hierro Nervado Ø 10mm (Barra 12m)",
    cantidad: 250,
    lote: "ACINDAR-2024-HN10",
    estado: "completo",
  },
  {
    id: "ub-centro-2",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "SC-PATIO-F02-P01",
    tipo: "patio",
    fila: 2,
    rack: 1,
    estanteria: 1,
    nivel: 1,
    producto_actual: "Ladrillo Hueco 12x18x33 (Pallet x 144u)",
    cantidad: 40,
    lote: "PAL-LH-1218",
    estado: "ocupado",
  },
  {
    id: "ub-centro-3",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-sucursal",
    codigo_visual: "SC-HEAVY-R03-N1",
    tipo: "rack",
    fila: 1,
    rack: 3,
    estanteria: 1,
    nivel: 1,
    producto_actual: "Malla Electrosoldada Q188 15x15 (Paño 2.40x6m)",
    cantidad: 35,
    lote: "MALLA-Q188-B",
    estado: "ocupado",
  },
  {
    id: "ub-centro-rec-1",
    tenant_id: "tenant-materiales-centro",
    almacen_id: "alm-centro-recepcion",
    codigo_visual: "REC-CENTRO-BASCULA-01",
    tipo: "recepcion",
    fila: 1,
    rack: 0,
    estanteria: 0,
    nivel: 0,
    producto_actual: null,
    cantidad: 0,
    estado: "vacio",
  },
];

// ==========================================
// PRODUCTOS CON MÉTRICA DUAL POR TENANT
// ==========================================
export const MOCK_PRODUCTOS: MultiTenantProducto[] = [
  // Corralón Los Pinos S.R.L.
  {
    id: "prod-pinos-cemento",
    tenant_id: "tenant-los-pinos",
    codigo_barras: "7791234567890",
    nombre: "Cemento Loma Negra 50kg (Bolsa)",
    categoria: "Obra Gruesa",
    unidad_medida: "BL",
    precio: 9800.0,
    stock_real: 120,          // Stock Real Físico
    stock_comprometido: 60,   // Comprometido
    stock_disponible: 60,     // Disponible (120 - 60 = 60)
    cantidad_minima: 40,
    cantidad_maxima: 500,
    publicado_en_red: true,
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Galpón Central Oeste • Rack 01 • Nivel 1",
  },
  {
    id: "prod-pinos-arena",
    tenant_id: "tenant-los-pinos",
    codigo_barras: "7795556667771",
    nombre: "Arena Fina de Río (Bolsón 1m³)",
    categoria: "Áridos",
    unidad_medida: "M3",
    precio: 22000.0,
    stock_real: 18,           // Real: 18
    stock_comprometido: 12,   // Comprometido: 12
    stock_disponible: 6,      // Disponible: 6
    cantidad_minima: 10,
    cantidad_maxima: 50,
    publicado_en_red: true,
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Galpón Central Oeste • Tolva Silo 3",
  },
  {
    id: "prod-pinos-cal",
    tenant_id: "tenant-los-pinos",
    codigo_barras: "7793332221115",
    nombre: "Cal Santa Elena Hidratada (Bolsa 25kg)",
    categoria: "Obra Gruesa",
    unidad_medida: "BL",
    precio: 4500.0,
    stock_real: 80,           // Real: 80
    stock_comprometido: 30,   // Comprometido: 30
    stock_disponible: 50,     // Disponible: 50
    cantidad_minima: 25,
    cantidad_maxima: 300,
    publicado_en_red: true,
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Galpón Central Oeste • Rack 02 • Nivel 1",
  },

  // Materiales del Centro S.A.
  {
    id: "prod-centro-hierro-10",
    tenant_id: "tenant-materiales-centro",
    codigo_barras: "7798765432109",
    nombre: "Hierro Nervado Ø 10mm (Barra 12m)",
    categoria: "Hierros & Acero",
    unidad_medida: "UN",
    precio: 14500.0,
    stock_real: 250,          // Real: 250
    stock_comprometido: 100,  // Comprometido: 100
    stock_disponible: 150,    // Disponible: 150
    cantidad_minima: 50,
    cantidad_maxima: 600,
    publicado_en_red: true,
    almacen_id: "alm-centro-sucursal",
    ubicacion_estanteria: "Sucursal Centro • Heavy Rack 01 • Nivel 1",
  },
  {
    id: "prod-centro-ladrillo",
    tenant_id: "tenant-materiales-centro",
    codigo_barras: "7794443332220",
    nombre: "Ladrillo Hueco 12x18x33 (Pallet x 144u)",
    categoria: "Mampostería",
    unidad_medida: "PAL",
    precio: 95000.0,
    stock_real: 40,           // Real: 40
    stock_comprometido: 15,   // Comprometido: 15
    stock_disponible: 25,     // Disponible: 25
    cantidad_minima: 15,
    cantidad_maxima: 120,
    publicado_en_red: true,
    almacen_id: "alm-centro-sucursal",
    ubicacion_estanteria: "Sucursal Centro • Patio Materiales • Fila 02",
  },
  {
    id: "prod-centro-malla",
    tenant_id: "tenant-materiales-centro",
    codigo_barras: "7799988776655",
    nombre: "Malla Electrosoldada Q188 15x15 (Paño 2.40x6m)",
    categoria: "Hierros & Acero",
    unidad_medida: "UN",
    precio: 48000.0,
    stock_real: 35,           // Real: 35
    stock_comprometido: 15,   // Comprometido: 15
    stock_disponible: 20,     // Disponible: 20
    cantidad_minima: 10,
    cantidad_maxima: 100,
    publicado_en_red: true,
    almacen_id: "alm-centro-sucursal",
    ubicacion_estanteria: "Sucursal Centro • Heavy Rack 03 • Nivel 1",
  },
];

// ==========================================
// ÓRDENES Y SOLICITUDES POR TENANT
// ==========================================
export const MOCK_ORDENES: MultiTenantOrden[] = [
  // Órdenes de Corralón Los Pinos
  {
    id: "ord-pinos-1049",
    tenant_id: "tenant-los-pinos",
    folio: "VT-1049",
    tipo: "Material",
    proyectoUbicacion: "Torre Sur - Bodega Central (Obra Torre Sur)",
    cliente: "Constructora Arcos S.A.",
    corralonAsignado: "Corralón Los Pinos S.R.L.",
    fecha: "Hoy, 10:15 hs",
    estado: "Asignada",
    distanciaKm: 4.8,
    detalles: [
      {
        id: "det-pinos-1",
        material: "Cemento Loma Negra 50kg (Bolsa)",
        codigo: "7791234567890",
        cantidadSolicitada: 100,
        cantidadDisponibleCorralon: 60,
        stockRealFisico: 120,
        cantidadAutorizadaExtension: 40,
        unidad: "BL",
        estadoItem: "Extensión requerida",
      },
    ],
  },
  {
    id: "ord-pinos-1052",
    tenant_id: "tenant-los-pinos",
    folio: "VT-1052",
    tipo: "Material",
    proyectoUbicacion: "Residencial Las Heras - Etapa 2",
    cliente: "Constructora Obras Pellegrini SRL",
    corralonAsignado: "Corralón Los Pinos S.R.L.",
    fecha: "Hoy, 08:30 hs",
    estado: "En preparación",
    distanciaKm: 7.2,
    detalles: [
      {
        id: "det-pinos-2",
        material: "Cal Santa Elena Hidratada (Bolsa 25kg)",
        codigo: "7793332221115",
        cantidadSolicitada: 30,
        cantidadDisponibleCorralon: 50,
        stockRealFisico: 80,
        cantidadAutorizadaExtension: 0,
        unidad: "BL",
        estadoItem: "Completo",
      },
      {
        id: "det-pinos-3",
        material: "Arena Fina de Río (Bolsón 1m³)",
        codigo: "7795556667771",
        cantidadSolicitada: 12,
        cantidadDisponibleCorralon: 6,
        stockRealFisico: 18,
        cantidadAutorizadaExtension: 6,
        unidad: "M3",
        estadoItem: "Extensión requerida",
      },
    ],
  },

  // Órdenes de Materiales del Centro
  {
    id: "ord-centro-201",
    tenant_id: "tenant-materiales-centro",
    folio: "MC-201",
    tipo: "Material",
    proyectoUbicacion: "Torre Boulevard - Subsuelo Cimentación",
    cliente: "Desarrollos Urbanos Rosario",
    corralonAsignado: "Materiales del Centro S.A.",
    fecha: "Hoy, 09:40 hs",
    estado: "En preparación",
    distanciaKm: 3.5,
    detalles: [
      {
        id: "det-centro-1",
        material: "Hierro Nervado Ø 10mm (Barra 12m)",
        codigo: "7798765432109",
        cantidadSolicitada: 100,
        cantidadDisponibleCorralon: 150,
        stockRealFisico: 250,
        cantidadAutorizadaExtension: 0,
        unidad: "UN",
        estadoItem: "Completo",
      },
    ],
  },
  {
    id: "ord-centro-202",
    tenant_id: "tenant-materiales-centro",
    folio: "MC-202",
    tipo: "Material",
    proyectoUbicacion: "Complejo Pichincha Loft - Torre B",
    cliente: "Ing. Silveira Constructora",
    corralonAsignado: "Materiales del Centro S.A.",
    fecha: "Ayer, 16:20 hs",
    estado: "Asignada",
    distanciaKm: 6.1,
    detalles: [
      {
        id: "det-centro-2",
        material: "Ladrillo Hueco 12x18x33 (Pallet x 144u)",
        codigo: "7794443332220",
        cantidadSolicitada: 15,
        cantidadDisponibleCorralon: 25,
        stockRealFisico: 40,
        cantidadAutorizadaExtension: 0,
        unidad: "PAL",
        estadoItem: "Completo",
      },
      {
        id: "det-centro-3",
        material: "Malla Electrosoldada Q188 15x15 (Paño 2.40x6m)",
        codigo: "7799988776655",
        cantidadSolicitada: 15,
        cantidadDisponibleCorralon: 20,
        stockRealFisico: 35,
        cantidadAutorizadaExtension: 0,
        unidad: "UN",
        estadoItem: "Completo",
      },
    ],
  },
];

// ==========================================
// FUNCIONES AUXILIARES DE FILTRADO MULTI-TENANT
// ==========================================

export function getTenantById(tenantId: string | null): MultiTenantInfo | undefined {
  if (!tenantId) return undefined;
  return MOCK_TENANTS.find((t) => t.id === tenantId);
}

export function filterProductosByTenant(tenantId: string | null): MultiTenantProducto[] {
  if (!tenantId || tenantId === "all") {
    return MOCK_PRODUCTOS;
  }
  return MOCK_PRODUCTOS.filter((p) => p.tenant_id === tenantId);
}

export function filterAlmacenesByTenant(tenantId: string | null): MultiTenantAlmacen[] {
  if (!tenantId || tenantId === "all") {
    return MOCK_ALMACENES;
  }
  return MOCK_ALMACENES.filter((a) => a.tenant_id === tenantId);
}

export function filterUbicacionesByTenant(tenantId: string | null): MultiTenantUbicacion[] {
  if (!tenantId || tenantId === "all") {
    return MOCK_UBICACIONES;
  }
  return MOCK_UBICACIONES.filter((u) => u.tenant_id === tenantId);
}

export function filterOrdenesByTenant(tenantId: string | null): MultiTenantOrden[] {
  if (!tenantId || tenantId === "all") {
    return MOCK_ORDENES;
  }
  return MOCK_ORDENES.filter((o) => o.tenant_id === tenantId);
}
