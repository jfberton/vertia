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

export type TipoListaPrecio = "mostrador" | "contratista" | "red_vertia";

export interface MultiTenantProducto {
  id: string;
  tenant_id: string;
  codigo_barras: string;
  sku?: string;
  nombre: string;
  categoria: string;
  unidad_medida: string;
  precio: number;                   // Precio base mostrador ($ MXN)
  precio_mostrador?: number;         // Precio regular de mostrador
  lista_precio_activa?: TipoListaPrecio; // Lista asignada para cotización
  bonificacion_porcentaje?: number;  // % de bonificación o descuento (ej: 5%)
  precio_red_vertia?: number;        // Precio neto cotizado a la Red VERTIA ($ MXN)
  stock_real: number;               // Físico contado en bodega
  stock_comprometido: number;       // Reservado en órdenes y despachos
  stock_disponible: number;         // Libre (stock_real - stock_comprometido)
  stock_apartado_red?: number;      // Unidades asignadas a la Red VERTIA
  modo_disponible?: "automatico" | "cupo_manual";
  cupo_manual_red?: number;
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
  cliente_id?: string;
  obra_id?: string;
  corralonAsignado: string;
  fecha: string;
  estado: "Por cotizar" | "Presupuesto listo" | "Asignada" | "En preparación" | "En camino" | "Entregada";
  distanciaKm: number;
  detalles: MultiTenantDetalleOrden[];
  remito_numero?: string;
  chofer_asignado?: string;
  dni_chofer?: string;
  vehiculo_asignado?: string;
  patente_asignada?: string;
  zona_embarque?: string;
  monto_total_cotizado?: number;
  costo_flete?: number;
  presupuesto_emitido?: boolean;
  presupuesto_aprobado?: boolean;
  fecha_presupuesto?: string;
}

export interface ObraCliente {
  id: string;
  cliente_id: string;
  cliente_nombre: string;
  nombre_obra: string;
  direccion: string;
  ciudad: string;
  responsable_contacto: string;
  telefono_contacto: string;
  coordenadas_gps?: string;
  activa: boolean;
  fecha_inicio: string;
}

export const MOCK_OBRAS_CLIENTE: ObraCliente[] = [
  {
    id: "obra-torre-sur",
    cliente_id: "usr-sofia-valenzuela",
    cliente_nombre: "Constructora Arcos S.A.",
    nombre_obra: "Torre Bellini Sur (Obra Torre Sur)",
    direccion: "Av. Pellegrini 2800",
    ciudad: "Rosario",
    responsable_contacto: "Arq. Sofia Valenzuela / Capataz Romero",
    telefono_contacto: "+54 9 341 555-1234",
    coordenadas_gps: "-32.9550, -60.6580",
    activa: true,
    fecha_inicio: "10/01/2026",
  },
  {
    id: "obra-complejo-las-heras",
    cliente_id: "usr-sofia-valenzuela",
    cliente_nombre: "Constructora Arcos S.A.",
    nombre_obra: "Complejo Residencial Las Heras",
    direccion: "Av. Belgrano 1420",
    ciudad: "Rosario Centro",
    responsable_contacto: "Ing. Gonzalo Peña",
    telefono_contacto: "+54 9 341 555-8899",
    coordenadas_gps: "-32.9620, -60.6420",
    activa: true,
    fecha_inicio: "01/02/2026",
  },
  {
    id: "obra-nave-industrial-alberdi",
    cliente_id: "usr-sofia-valenzuela",
    cliente_nombre: "Constructora Arcos S.A.",
    nombre_obra: "Nave Industrial Alberdi",
    direccion: "Bv. Rondeau 3400",
    ciudad: "Rosario Norte",
    responsable_contacto: "Maestro Mayor Marcos Díaz",
    telefono_contacto: "+54 9 341 555-4321",
    coordenadas_gps: "-32.9100, -60.6800",
    activa: true,
    fecha_inicio: "15/03/2026",
  },
];

// ==========================================
// RED VERTIA: PROFESIONALES DE SERVICIOS
// ==========================================
export type RubroProfesional =
  | "Gasista Matriculado"
  | "Plomero / Sanitarista"
  | "Electricista"
  | "Albañil / Constructor"
  | "Carpintero"
  | "Techista"
  | "Pintor / Terminaciones"
  | "Herrero / Cerrajero";

export interface ProfesionalServicio {
  id: string;
  nombre: string;
  cuit_rut?: string;
  rubro: RubroProfesional;
  matricula?: string;
  telefono: string;
  email?: string;
  ciudad: string;
  zona_cobertura: string;
  costo_visita?: number;
  descripcion_experiencia?: string;
  portfolio_fotos?: { titulo: string; descripcion: string; foto_url?: string }[];
  calificacion: number;
  trabajos_completados: number;
  activo: boolean;
  tarifa_hora_estimada?: number;
  created_at: string;
}

export type EstadoSolicitudServicio =
  | "Solicitado"
  | "Asignado"
  | "En ejecución"
  | "Finalizado con Conformidad"
  | "Liquidado y Pagado";

export interface SolicitudServicio {
  id: string;
  folio: string;
  cliente_id: string;
  cliente_nombre: string;
  obra_id?: string;
  obra_nombre: string;
  rubro: RubroProfesional;
  descripcion_tarea: string;
  fecha_requerida: string;
  profesional_id?: string;
  profesional_nombre?: string;
  costo_estimado: number;
  costo_mano_obra: number;
  comision_vertia: number;
  cobrado_cliente: boolean;
  fecha_cobro?: string;
  pagado_profesional: boolean;
  fecha_pago?: string;
  conformidad_cliente: boolean;
  estado: EstadoSolicitudServicio;
  created_at: string;
}

export const MOCK_PROFESIONALES: ProfesionalServicio[] = [
  {
    id: "prof-001",
    nombre: "Roberto Gómez",
    cuit_rut: "20-28495123-4",
    rubro: "Gasista Matriculado",
    matricula: "MAT-GAS-4491",
    telefono: "+54 9 341 511-2233",
    email: "roberto.gasista@gmail.com",
    ciudad: "Rosario",
    zona_cobertura: "Rosario y Gran Rosario (Radio 30km)",
    costo_visita: 12000,
    descripcion_experiencia: "Especialista en redes de gas en media y baja presión, montantes para edificios y pruebas de hermeticidad con certificación ENARGAS.",
    portfolio_fotos: [
      {
        titulo: "Montante de gas en edificio Torre Sur",
        descripcion: "Instalación de cañería de 2 pulgadas en polietileno termofusionado y batería de 18 medidores.",
      },
      {
        titulo: "Instalación de calderas centrales",
        descripcion: "Montaje y calibración de sistema bitérmico con ventilación forzada en complejo residencial.",
      },
    ],
    calificacion: 4.9,
    trabajos_completados: 42,
    activo: true,
    tarifa_hora_estimada: 12000,
    created_at: "2025-06-10",
  },
  {
    id: "prof-002",
    nombre: "Claudio Benítez",
    cuit_rut: "20-25894120-7",
    rubro: "Plomero / Sanitarista",
    matricula: "SAN-ROS-1082",
    telefono: "+54 9 341 533-4455",
    email: "claudio.sanitarista@hotmail.com",
    ciudad: "Rosario",
    zona_cobertura: "Rosario Centro y Sur",
    costo_visita: 10000,
    descripcion_experiencia: "Instalaciones sanitarias integrales de agua fría y caliente, desagües pluviales y cloacales con materiales de última generación.",
    portfolio_fotos: [
      {
        titulo: "Batería de tanques y presurizadoras",
        descripcion: "Colector de distribución con termofusión de 63mm y bombas dobles inteligentes.",
      },
    ],
    calificacion: 4.8,
    trabajos_completados: 67,
    activo: true,
    tarifa_hora_estimada: 10500,
    created_at: "2025-05-18",
  },
  {
    id: "prof-003",
    nombre: "Esteban Quiroga",
    cuit_rut: "20-31489752-1",
    rubro: "Electricista",
    matricula: "ELE-CAT-309",
    telefono: "+54 9 341 577-8899",
    email: "esteban.electrico@gmail.com",
    ciudad: "Rosario",
    zona_cobertura: "Rosario y Funes",
    costo_visita: 14000,
    descripcion_experiencia: "Tableros seccionales y principales para edificios, cálculo de cargas, puesta a tierra certificada y cableado estructurado.",
    portfolio_fotos: [
      {
        titulo: "Tablero principal trifásico 120A",
        descripcion: "Armado de tablero con protecciones Schneider, descargadores de sobretensión y peines de conexión.",
      },
    ],
    calificacion: 5.0,
    trabajos_completados: 55,
    activo: true,
    tarifa_hora_estimada: 13500,
    created_at: "2025-07-22",
  },
  {
    id: "prof-004",
    nombre: "Cuadrilla Maestro Raúl",
    cuit_rut: "23-22194852-9",
    rubro: "Albañil / Constructor",
    matricula: "UOCRA-8911",
    telefono: "+54 9 341 599-0011",
    email: "cuadrilla.raul@gmail.com",
    ciudad: "Rosario",
    zona_cobertura: "Gran Rosario y alrededores",
    costo_visita: 15000,
    descripcion_experiencia: "Albañilería de obra gruesa y fina, revoques proyectados, mampostería encadenada y colocación de porcelanatos de gran formato.",
    portfolio_fotos: [
      {
        titulo: "Tabiquería de hormigón a la vista",
        descripcion: "Encofrado fenólico y colado de 45 m2 de tabique arquitectónico con acabado pulido.",
      },
    ],
    calificacion: 4.9,
    trabajos_completados: 38,
    activo: true,
    tarifa_hora_estimada: 11000,
    created_at: "2025-08-01",
  },
  {
    id: "prof-005",
    nombre: "Taller & Carpintería Los Robles",
    cuit_rut: "30-71894523-2",
    rubro: "Carpintero",
    matricula: "CARP-REG-049",
    telefono: "+54 9 341 544-7788",
    email: "robles.carpinteria@gmail.com",
    ciudad: "Rosario",
    zona_cobertura: "Rosario, Roldán y San Lorenzo",
    calificacion: 4.9,
    trabajos_completados: 31,
    activo: true,
    tarifa_hora_estimada: 14000,
    created_at: "2025-08-14",
  },
];

export const MOCK_SOLICITUDES_SERVICIOS: SolicitudServicio[] = [
  {
    id: "srv-001",
    folio: "SRV-2026-081",
    cliente_id: "usr-sofia-valenzuela",
    cliente_nombre: "Constructora Arcos S.A.",
    obra_id: "obra-torre-sur",
    obra_nombre: "Torre Bellini Sur (Pellegrini 2800)",
    rubro: "Gasista Matriculado",
    descripcion_tarea: "Inspección de prueba de hermeticidad y conexión de montante principal en ducto de ventilación.",
    fecha_requerida: "22/11/2026",
    profesional_id: "prof-001",
    profesional_nombre: "Roberto Gómez",
    costo_estimado: 85000,
    costo_mano_obra: 72000,
    comision_vertia: 13000,
    cobrado_cliente: true,
    fecha_cobro: "18/11/2026",
    pagado_profesional: false,
    conformidad_cliente: true,
    estado: "Finalizado con Conformidad",
    created_at: "18/11/2026",
  },
  {
    id: "srv-002",
    folio: "SRV-2026-082",
    cliente_id: "usr-sofia-valenzuela",
    cliente_nombre: "Constructora Arcos S.A.",
    obra_id: "obra-complejo-las-heras",
    obra_nombre: "Complejo Residencial Las Heras",
    rubro: "Electricista",
    descripcion_tarea: "Tendido de bandejas portacables y cableado trifásico para bomba de elevación y subsuelo.",
    fecha_requerida: "25/11/2026",
    profesional_id: "prof-003",
    profesional_nombre: "Esteban Quiroga",
    costo_estimado: 120000,
    costo_mano_obra: 102000,
    comision_vertia: 18000,
    cobrado_cliente: true,
    fecha_cobro: "19/11/2026",
    pagado_profesional: false,
    conformidad_cliente: false,
    estado: "En ejecución",
    created_at: "19/11/2026",
  },
];

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
    producto_actual: "Cemento Cruz Azul Gris 50kg (Bolsa)",
    cantidad: 120,
    lote: "LOTE-CAZ-2026-X1",
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
    producto_actual: "Cal Hidratada de Alta Pureza 25kg",
    cantidad: 90,
    lote: "LOTE-CAL-8891",
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
    producto_actual: "Arena Lavada de Río (M3)",
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
  // Corralón Los Pinos S.R.L. (Inventario Local México)
  {
    id: "prod-pinos-cemento",
    tenant_id: "tenant-los-pinos",
    codigo_barras: "750123450001",
    sku: "CEM-CAZ-50",
    nombre: "Cemento Cruz Azul Gris 50kg (Bolsa)",
    categoria: "Cementos y Adhesivos",
    unidad_medida: "BL",
    precio: 245.0,
    precio_mostrador: 245.0,
    lista_precio_activa: "red_vertia",
    bonificacion_porcentaje: 4.08,
    precio_red_vertia: 235.0,
    stock_real: 120,          // Stock Real Físico
    stock_comprometido: 40,   // Comprometido
    stock_disponible: 80,     // Disponible mostrador (120 - 40 = 80)
    stock_apartado_red: 60,   // Apartado para Red VERTIA
    modo_disponible: "cupo_manual",
    cupo_manual_red: 60,
    cantidad_minima: 30,
    cantidad_maxima: 500,
    publicado_en_red: true,
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Pasillo A • Rack 01",
  },
  {
    id: "prod-pinos-varilla",
    tenant_id: "tenant-los-pinos",
    codigo_barras: "750123450002",
    sku: "VAR-COR-12",
    nombre: "Varilla Corrugada Grado 42 - 1/2 pulgada (Tramo 12m)",
    categoria: "Aceros y Perfiles",
    unidad_medida: "PZA",
    precio: 285.0,
    precio_mostrador: 285.0,
    lista_precio_activa: "red_vertia",
    bonificacion_porcentaje: 5.26,
    precio_red_vertia: 270.0,
    stock_real: 180,
    stock_comprometido: 60,
    stock_disponible: 120,
    stock_apartado_red: 80,
    modo_disponible: "cupo_manual",
    cupo_manual_red: 80,
    cantidad_minima: 40,
    cantidad_maxima: 600,
    publicado_en_red: true,
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Pasillo B • Patio Metal",
  },
  {
    id: "prod-pinos-cal",
    tenant_id: "tenant-los-pinos",
    codigo_barras: "750123450003",
    sku: "CAL-HID-25",
    nombre: "Cal Hidratada de Alta Pureza 25kg",
    categoria: "Cementos y Adhesivos",
    unidad_medida: "BL",
    precio: 95.0,
    precio_mostrador: 95.0,
    lista_precio_activa: "red_vertia",
    bonificacion_porcentaje: 6.31,
    precio_red_vertia: 89.0,
    stock_real: 90,
    stock_comprometido: 25,
    stock_disponible: 65,
    stock_apartado_red: 45,
    modo_disponible: "cupo_manual",
    cupo_manual_red: 45,
    cantidad_minima: 20,
    cantidad_maxima: 300,
    publicado_en_red: true,
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Pasillo A • Rack 02",
  },
  {
    id: "prod-pinos-arena",
    tenant_id: "tenant-los-pinos",
    codigo_barras: "750123450004",
    sku: "ARE-LAV-M3",
    nombre: "Arena Lavada de Río (M3)",
    categoria: "Áridos y Graneles",
    unidad_medida: "M3",
    precio: 480.0,
    precio_mostrador: 480.0,
    lista_precio_activa: "red_vertia",
    bonificacion_porcentaje: 6.25,
    precio_red_vertia: 450.0,
    stock_real: 45,
    stock_comprometido: 15,
    stock_disponible: 30,
    stock_apartado_red: 20,
    modo_disponible: "cupo_manual",
    cupo_manual_red: 20,
    cantidad_minima: 10,
    cantidad_maxima: 100,
    publicado_en_red: true,
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Patio Abierto • Bahía 1",
  },
  {
    id: "prod-pinos-grava",
    tenant_id: "tenant-los-pinos",
    codigo_barras: "750123450005",
    sku: "GRA-TRIT-M3",
    nombre: "Grava Triturada 3/4 pulgada (M3)",
    categoria: "Áridos y Graneles",
    unidad_medida: "M3",
    precio: 520.0,
    precio_mostrador: 520.0,
    lista_precio_activa: "mostrador",
    bonificacion_porcentaje: 4.8,
    precio_red_vertia: 495.0,
    stock_real: 35,
    stock_comprometido: 10,
    stock_disponible: 25,
    stock_apartado_red: 0,
    modo_disponible: "automatico",
    cupo_manual_red: 0,
    cantidad_minima: 10,
    cantidad_maxima: 80,
    publicado_en_red: false, // Solo Mostrador
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Patio Abierto • Bahía 2",
  },
  {
    id: "prod-pinos-tabique",
    tenant_id: "tenant-los-pinos",
    codigo_barras: "750123450006",
    sku: "TAB-ROJ-MIL",
    nombre: "Tabique Rojo Recocido (Millar)",
    categoria: "Mampostería y Tabiques",
    unidad_medida: "MIL",
    precio: 3600.0,
    precio_mostrador: 3600.0,
    lista_precio_activa: "red_vertia",
    bonificacion_porcentaje: 4.16,
    precio_red_vertia: 3450.0,
    stock_real: 12,
    stock_comprometido: 4,
    stock_disponible: 8,
    stock_apartado_red: 6,
    modo_disponible: "cupo_manual",
    cupo_manual_red: 6,
    cantidad_minima: 3,
    cantidad_maxima: 30,
    publicado_en_red: true,
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Patio Materiales • Fila 03",
  },

  // Materiales del Centro S.A.
  {
    id: "prod-centro-alambre",
    tenant_id: "tenant-materiales-centro",
    codigo_barras: "750999000101",
    sku: "ALA-REC-50",
    nombre: "Alambre Recocido Calibre 16 (Rollo 50kg)",
    categoria: "Aceros y Perfiles",
    unidad_medida: "ROL",
    precio: 1850.0,
    precio_mostrador: 1850.0,
    lista_precio_activa: "red_vertia",
    bonificacion_porcentaje: 5.4,
    precio_red_vertia: 1750.0,
    stock_real: 25,
    stock_comprometido: 5,
    stock_disponible: 20,
    stock_apartado_red: 15,
    modo_disponible: "automatico",
    cantidad_minima: 5,
    cantidad_maxima: 60,
    publicado_en_red: true,
    almacen_id: "alm-centro-sucursal",
    ubicacion_estanteria: "Heavy Rack 01 • Nivel 1",
  },
  {
    id: "prod-centro-cemento-moctezuma",
    tenant_id: "tenant-materiales-centro",
    codigo_barras: "750999000102",
    sku: "CEM-MOC-50",
    nombre: "Cemento CPC 30R Moctezuma 50kg (Bolsa)",
    categoria: "Cementos y Adhesivos",
    unidad_medida: "BL",
    precio: 240.0,
    precio_mostrador: 240.0,
    lista_precio_activa: "red_vertia",
    bonificacion_porcentaje: 4.58,
    precio_red_vertia: 229.0,
    stock_real: 200,
    stock_comprometido: 50,
    stock_disponible: 150,
    stock_apartado_red: 100,
    modo_disponible: "automatico",
    cantidad_minima: 40,
    cantidad_maxima: 500,
    publicado_en_red: true,
    almacen_id: "alm-centro-sucursal",
    ubicacion_estanteria: "Bahía 02",
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
        material: "Cemento Cruz Azul Gris 50kg (Bolsa)",
        codigo: "750123450001",
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
        material: "Cal Hidratada de Alta Pureza 25kg",
        codigo: "750123450003",
        cantidadSolicitada: 30,
        cantidadDisponibleCorralon: 45,
        stockRealFisico: 90,
        cantidadAutorizadaExtension: 0,
        unidad: "BL",
        estadoItem: "Completo",
      },
      {
        id: "det-pinos-3",
        material: "Arena Lavada de Río (M3)",
        codigo: "750123450004",
        cantidadSolicitada: 12,
        cantidadDisponibleCorralon: 20,
        stockRealFisico: 45,
        cantidadAutorizadaExtension: 0,
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
