-- ==============================================================================
-- INVENTRACK v2 - Esquema Maestro de Base de Datos PostgreSQL para Supabase
-- Modelo Multi-Tenant con Row Level Security (RLS) y Red Colaborativa B2B
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLAS DE TENANTS Y CONTROL DE ACCESO
-- ==============================================================================

-- Perfiles de usuario (vinculados al auth.users nativo de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nombre_completo TEXT NOT NULL,
    avatar_url TEXT,
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organizaciones / Empresas (Tenants)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    cuit_rut_taxid TEXT,
    email_contacto TEXT,
    telefono_contacto TEXT,
    direccion TEXT,
    ciudad TEXT,
    pais TEXT DEFAULT 'Argentina',
    logo_url TEXT,
    plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'enterprise'
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Membresías de Usuarios en Empresas (Relación N:M con rol específico por empresa)
CREATE TYPE app_role AS ENUM (
    'administrador',
    'guardia',
    'receptor_mercaderia',
    'responsable_embarques',
    'responsable_inventario',
    'supervisor'
);

CREATE TABLE IF NOT EXISTS public.tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rol app_role NOT NULL DEFAULT 'responsable_inventario',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- ==============================================================================
-- 3. CATÁLOGOS BASE
-- ==============================================================================

-- Almacenes
CREATE TABLE IF NOT EXISTS public.almacenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    nombre_almacen TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    codigo_postal TEXT,
    pais TEXT,
    capacidad_maxima NUMERIC,
    es_zona_recepcion BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ubicaciones Físicas (Matriz de almacenamiento 3D)
CREATE TABLE IF NOT EXISTS public.ubicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    almacen_id UUID NOT NULL REFERENCES public.almacenes(id) ON DELETE CASCADE,
    fila INT NOT NULL DEFAULT 1,
    rack INT NOT NULL DEFAULT 1,
    estanteria INT NOT NULL DEFAULT 1,
    nivel INT NOT NULL DEFAULT 1,
    caja INT NOT NULL DEFAULT 1,
    interior INT NOT NULL DEFAULT 1,
    codigo_visual TEXT NOT NULL, -- ej. "P1-R02-E01-N3"
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, almacen_id, fila, rack, estanteria, nivel, caja, interior)
);

-- Productos
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    codigo_barras TEXT NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    unidad_medida TEXT NOT NULL DEFAULT 'UN',
    precio NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    precio_minimo NUMERIC(14, 2),
    precio_maximo NUMERIC(14, 2),
    cantidad_total INT NOT NULL DEFAULT 0,
    cantidad_minima INT DEFAULT 0,
    cantidad_maxima INT,
    imagen_url TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, codigo_barras)
);

-- Proveedores
CREATE TABLE IF NOT EXISTS public.proveedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    nombre_proveedor TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    ciudad TEXT,
    pais TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    ciudad TEXT,
    pais TEXT,
    cuit_rut_taxid TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. CONTROL DE STOCK E INVENTARIO
-- ==============================================================================

-- Stock Real en Ubicación y Lote
CREATE TABLE IF NOT EXISTS public.inventario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    almacen_id UUID NOT NULL REFERENCES public.almacenes(id) ON DELETE CASCADE,
    ubicacion_id UUID NOT NULL REFERENCES public.ubicaciones(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
    lote TEXT NOT NULL DEFAULT 'GENERAL',
    cantidad INT NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
    fecha_vencimiento DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, ubicacion_id, producto_id, lote)
);

-- Tipos de Movimientos
CREATE TYPE tipo_movimiento_stock AS ENUM (
    'entrada',
    'reubicacion',
    'salida',
    'ajuste_positivo',
    'ajuste_negativo',
    'surtido'
);

-- Registro Auditor de Movimientos (Kardex físico)
CREATE TABLE IF NOT EXISTS public.movimientos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
    tipo_movimiento tipo_movimiento_stock NOT NULL,
    motivo TEXT NOT NULL,
    ubicacion_origen_id UUID REFERENCES public.ubicaciones(id),
    ubicacion_destino_id UUID REFERENCES public.ubicaciones(id),
    lote TEXT NOT NULL DEFAULT 'GENERAL',
    cantidad INT NOT NULL CHECK (cantidad > 0),
    usuario_id UUID NOT NULL REFERENCES public.profiles(id),
    referencia_tipo TEXT, -- 'entrada', 'orden_suministro', 'remision', etc.
    referencia_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Entradas a Almacén
CREATE TABLE IF NOT EXISTS public.entradas_almacen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    numero_entrada TEXT NOT NULL,
    almacen_id UUID NOT NULL REFERENCES public.almacenes(id),
    proveedor_id UUID REFERENCES public.proveedores(id),
    usuario_id UUID NOT NULL REFERENCES public.profiles(id),
    fecha_entrada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.entradas_almacen_detalles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entrada_id UUID NOT NULL REFERENCES public.entradas_almacen(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES public.productos(id),
    ubicacion_destino_id UUID NOT NULL REFERENCES public.ubicaciones(id),
    lote TEXT NOT NULL DEFAULT 'GENERAL',
    cantidad INT NOT NULL CHECK (cantidad > 0),
    costo_unitario NUMERIC(14, 2) DEFAULT 0.00
);

-- ==============================================================================
-- 5. SURTIDO, ÓRDENES, REMISIONES Y BACKORDERS (LIMPIO Y DESACOPLADO)
-- ==============================================================================

CREATE TYPE estado_orden_suministro AS ENUM (
    'Pendiente',
    'Parcialmente Surtido',
    'Surtido',
    'Remisionado',
    'Cancelado'
);

-- Órdenes de Suministro
CREATE TABLE IF NOT EXISTS public.ordenes_suministro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    numero_orden TEXT NOT NULL,
    usuario_solicitante TEXT NOT NULL,
    estado estado_orden_suministro NOT NULL DEFAULT 'Pendiente',
    fecha_solicitud TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ordenes_suministro_detalles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_suministro_id UUID NOT NULL REFERENCES public.ordenes_suministro(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES public.productos(id),
    cantidad_solicitada INT NOT NULL CHECK (cantidad_solicitada > 0),
    cantidad_surtida INT NOT NULL DEFAULT 0 CHECK (cantidad_surtida >= 0),
    precio_unitario NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    estado TEXT NOT NULL DEFAULT 'Pendiente' -- 'Pendiente', 'Parcial', 'Surtido', 'En BackOrder', 'Remisionado'
);

-- Registro Formal de Surtidos (Picking) - ¡Desacoplado de la Fila=-1!
CREATE TABLE IF NOT EXISTS public.ordenes_suministro_surtidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    detalle_id UUID NOT NULL REFERENCES public.ordenes_suministro_detalles(id) ON DELETE CASCADE,
    ubicacion_origen_id UUID NOT NULL REFERENCES public.ubicaciones(id),
    lote TEXT NOT NULL,
    cantidad_surtida INT NOT NULL CHECK (cantidad_surtida > 0),
    usuario_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Remisiones de Despacho
CREATE TABLE IF NOT EXISTS public.remisiones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    numero_remision TEXT NOT NULL,
    orden_suministro_id UUID NOT NULL REFERENCES public.ordenes_suministro(id),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id),
    almacen_id UUID NOT NULL REFERENCES public.almacenes(id),
    usuario_id UUID NOT NULL REFERENCES public.profiles(id),
    fecha_emision TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.remisiones_detalles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remision_id UUID NOT NULL REFERENCES public.remisiones(id) ON DELETE CASCADE,
    detalle_orden_id UUID NOT NULL REFERENCES public.ordenes_suministro_detalles(id),
    producto_id UUID NOT NULL REFERENCES public.productos(id),
    cantidad_despachada INT NOT NULL CHECK (cantidad_despachada > 0)
);

-- BackOrders (Faltantes de Órdenes)
CREATE TABLE IF NOT EXISTS public.backorders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    detalle_orden_id UUID NOT NULL REFERENCES public.ordenes_suministro_detalles(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES public.productos(id),
    cantidad_pendiente INT NOT NULL CHECK (cantidad_pendiente > 0),
    proveedor_sugerido_id UUID REFERENCES public.proveedores(id),
    estado TEXT NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'SolicitadoProveedor', 'Resuelto'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. RED COLABORATIVA B2B DE STOCK ENTRE EMPRESAS
-- ==============================================================================

-- Publicaciones de stock disponible en la red
CREATE TABLE IF NOT EXISTS public.red_stock_publicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id_ofertante UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
    cantidad_publicada INT NOT NULL CHECK (cantidad_publicada > 0),
    precio_unitario_red NUMERIC(14, 2),
    notas_condiciones TEXT,
    mostrar_nombre_empresa BOOLEAN NOT NULL DEFAULT TRUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Solicitudes de contacto / compra de stock inter-empresas
CREATE TABLE IF NOT EXISTS public.red_solicitudes_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publicacion_id UUID NOT NULL REFERENCES public.red_stock_publicaciones(id) ON DELETE CASCADE,
    tenant_id_solicitante UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    cantidad_solicitada INT NOT NULL CHECK (cantidad_solicitada > 0),
    mensaje_contacto TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'Aceptada', 'Rechazada', 'Completada'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. TRIGGERS Y FUNCIONES AUTOMÁTICAS
-- ==============================================================================

-- Trigger para crear perfil en public.profiles al registrarse en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nombre_completo, avatar_url, is_super_admin)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'nombre_completo', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url',
        FALSE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 8. POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.almacenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ubicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entradas_almacen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entradas_almacen_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_suministro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_suministro_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_suministro_surtidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remisiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remisiones_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.red_stock_publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.red_solicitudes_stock ENABLE ROW LEVEL SECURITY;

-- Función auxiliar para verificar membresía de tenant
CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(t_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.tenant_users
        WHERE tenant_id = t_id
        AND user_id = auth.uid()
        AND activo = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Función auxiliar para verificar si el usuario es Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND is_super_admin = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Políticas de Perfil
CREATE POLICY "Usuarios pueden ver su propio perfil o SuperAdmin"
    ON public.profiles FOR SELECT
    USING (id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid());

-- Políticas de Tenants
CREATE POLICY "Miembros pueden ver su empresa"
    ON public.tenants FOR SELECT
    USING (public.user_belongs_to_tenant(id) OR public.is_super_admin());

CREATE POLICY "Cualquier usuario autenticado puede crear una empresa"
    ON public.tenants FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas de Tenant Users
CREATE POLICY "Ver miembros de mi empresa"
    ON public.tenant_users FOR SELECT
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

-- Políticas estándar por Tenant para catálogos y operaciones
CREATE POLICY "Aislamiento Almacenes" ON public.almacenes FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

CREATE POLICY "Aislamiento Ubicaciones" ON public.ubicaciones FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

CREATE POLICY "Aislamiento Productos" ON public.productos FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

CREATE POLICY "Aislamiento Proveedores" ON public.proveedores FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

CREATE POLICY "Aislamiento Clientes" ON public.clientes FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

CREATE POLICY "Aislamiento Inventario" ON public.inventario FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

CREATE POLICY "Aislamiento Movimientos" ON public.movimientos FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

CREATE POLICY "Aislamiento Entradas" ON public.entradas_almacen FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

CREATE POLICY "Aislamiento Ordenes Suministro" ON public.ordenes_suministro FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

CREATE POLICY "Aislamiento Remisiones" ON public.remisiones FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

CREATE POLICY "Aislamiento BackOrders" ON public.backorders FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id) OR public.is_super_admin());

-- Políticas de la Red Colaborativa B2B
-- Todas las empresas autenticadas pueden ver las publicaciones activas de la red
CREATE POLICY "Lectura pública de la Red para usuarios autenticados"
    ON public.red_stock_publicaciones FOR SELECT
    USING (auth.uid() IS NOT NULL AND activo = TRUE);

CREATE POLICY "Gestionar mis propias publicaciones de la red"
    ON public.red_stock_publicaciones FOR ALL
    USING (public.user_belongs_to_tenant(tenant_id_ofertante) OR public.is_super_admin());

CREATE POLICY "Ver solicitudes de mi empresa (ofertante o solicitante)"
    ON public.red_solicitudes_stock FOR SELECT
    USING (
        public.user_belongs_to_tenant(tenant_id_solicitante) OR
        EXISTS (
            SELECT 1 FROM public.red_stock_publicaciones p
            WHERE p.id = publicacion_id
            AND public.user_belongs_to_tenant(p.tenant_id_ofertante)
        ) OR
        public.is_super_admin()
    );

CREATE POLICY "Crear solicitud en la red"
    ON public.red_solicitudes_stock FOR INSERT
    WITH CHECK (public.user_belongs_to_tenant(tenant_id_solicitante));
