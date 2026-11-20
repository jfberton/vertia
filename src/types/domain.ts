// InvenTrack v2 - Modelos y Tipos de Dominio

export type AppRole =
  | "administrador"
  | "guardia"
  | "receptor_mercaderia"
  | "responsable_embarques"
  | "responsable_inventario"
  | "supervisor";

export type GlobalRole = "user" | "super_admin";

export interface Tenant {
  id: string;
  nombre: string;
  slug: string;
  cuit_rut_taxid?: string | null;
  email_contacto?: string | null;
  telefono_contacto?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  logo_url?: string | null;
  plan: "free" | "pro" | "enterprise";
  activo: boolean;
  created_at: string;
}

export interface TenantMembership {
  id: string;
  tenant_id: string;
  user_id: string;
  rol: AppRole;
  activo: boolean;
  created_at: string;
  tenant?: Tenant;
}

export interface UserProfile {
  id: string;
  email: string;
  nombre_completo: string;
  avatar_url?: string | null;
  is_super_admin: boolean;
  created_at: string;
}

export interface Almacen {
  id: string;
  tenant_id: string;
  nombre_almacen: string;
  direccion?: string | null;
  telefono?: string | null;
  codigo_postal?: string | null;
  pais?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  radio_cobertura_km?: number | null;
  capacidad_maxima?: number | null;
  es_zona_recepcion: boolean;
  activo: boolean;
  created_at: string;
}

export interface Ubicacion {
  id: string;
  tenant_id: string;
  almacen_id: string;
  fila: number;
  rack: number;
  estanteria: number;
  nivel: number;
  caja: number;
  interior: number;
  codigo_visual: string; // Ej: "A1-R02-E03-N1"
  almacen?: Almacen;
}

export interface Producto {
  id: string;
  tenant_id: string;
  codigo_barras: string;
  nombre: string;
  descripcion?: string | null;
  unidad_medida: string; // 'UN', 'KG', 'LT', 'MTS', 'CJ'
  precio: number;
  precio_minimo?: number | null;
  precio_maximo?: number | null;
  cantidad_total: number; // Stock Físico Real
  cantidad_real: number;
  cantidad_reservada: number; // Comprometido en órdenes
  cantidad_disponible: number; // Real - Reservado
  modo_disponible?: "automatico" | "cupo_manual";
  cupo_manual_red?: number;
  publicado_en_red?: boolean;
  cantidad_minima?: number | null;
  cantidad_maxima?: number | null;
  imagen_url?: string | null;
  activo: boolean;
  created_at: string;
}

export interface Cliente {
  id: string;
  tenant_id: string;
  nombre: string;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  cuit_rut_taxid?: string | null;
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
  fecha_inicio?: string;
}

export interface Proveedor {
  id: string;
  tenant_id: string;
  nombre_proveedor: string;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  pais?: string | null;
}

export interface InventarioItem {
  id: string;
  tenant_id: string;
  almacen_id: string;
  ubicacion_id: string;
  producto_id: string;
  lote: string;
  cantidad: number;
  fecha_vencimiento?: string | null;
  producto?: Producto;
  ubicacion?: Ubicacion;
  almacen?: Almacen;
}

export type TipoMovimientoStock =
  | "entrada"
  | "reubicacion"
  | "salida"
  | "ajuste_positivo"
  | "ajuste_negativo"
  | "surtido";

export interface MovimientoStock {
  id: string;
  tenant_id: string;
  producto_id: string;
  tipo_movimiento: TipoMovimientoStock;
  motivo: string;
  ubicacion_origen_id?: string | null;
  ubicacion_destino_id?: string | null;
  cantidad: number;
  lote?: string | null;
  usuario_id: string;
  referencia_tipo?: "entrada" | "orden_suministro" | "remision" | "ajuste" | null;
  referencia_id?: string | null;
  created_at: string;
  producto?: Producto;
}

export type EstadoOrdenSuministro = "Pendiente" | "Parcialmente Surtido" | "Surtido" | "Remisionado" | "Cancelado";

export interface OrdenSuministro {
  id: string;
  tenant_id: string;
  numero_orden: string;
  usuario_solicitante: string;
  estado: EstadoOrdenSuministro;
  fecha_solicitud: string;
  detalles?: DetalleOrdenSuministro[];
}

export interface DetalleOrdenSuministro {
  id: string;
  orden_suministro_id: string;
  producto_id: string;
  cantidad_solicitada: number;
  cantidad_surtida: number;
  precio_unitario: number;
  estado: "Pendiente" | "Parcial" | "Surtido" | "En BackOrder" | "Remisionado";
  producto?: Producto;
}

export interface SurtidoItem {
  id: string;
  detalle_orden_id: string;
  ubicacion_origen_id: string;
  lote: string;
  cantidad_surtida: number;
  usuario_id: string;
  created_at: string;
}

export interface Remision {
  id: string;
  tenant_id: string;
  numero_remision: string;
  orden_suministro_id: string;
  cliente_id: string;
  almacen_id: string;
  usuario_id: string;
  fecha_emision: string;
  cliente?: Cliente;
  orden?: OrdenSuministro;
}

export interface BackOrderItem {
  id: string;
  tenant_id: string;
  detalle_orden_id: string;
  producto_id: string;
  cantidad_pendiente: number;
  proveedor_sugerido_id?: string | null;
  estado: "Pendiente" | "SolicitadoProveedor" | "Recibido";
  producto?: Producto;
  proveedor?: Proveedor;
}

// Red Vertia
export interface PublicacionRedStock {
  id: string;
  tenant_id_ofertante: string;
  producto_id: string;
  cantidad_publicada: number;
  precio_unitario_red?: number | null;
  notas_condiciones?: string | null;
  mostrar_nombre_empresa: boolean;
  activo: boolean;
  created_at: string;
  empresa_ofertante?: {
    nombre: string;
    ciudad?: string | null;
    pais?: string | null;
  };
  producto?: {
    nombre: string;
    codigo_barras: string;
    unidad_medida: string;
  };
}

export interface SolicitudRedStock {
  id: string;
  publicacion_id: string;
  tenant_id_solicitante: string;
  cantidad_solicitada: number;
  mensaje_contacto: string;
  estado: "Pendiente" | "Aceptada" | "Rechazada" | "Completada";
  created_at: string;
  empresa_solicitante?: {
    nombre: string;
    email_contacto?: string | null;
  };
}

// ---------------------------------------------------------------------------
// PROFESIONALES Y SERVICIOS DE LA RED VERTIA
// ---------------------------------------------------------------------------

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
  calificacion: number; // 1-5 estrellas
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
  folio: string; // ej. "SRV-2026-001"
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
  evidencias_fotos?: string[];
  estado: EstadoSolicitudServicio;
  created_at: string;
}
