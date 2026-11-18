"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldAlert, Lock, Loader2, AlertCircle } from "lucide-react";

interface DashboardAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Guardián Central de Autenticación y Autorización por Roles (RBAC)
 *
 * Reglas:
 * 1. Usuario No Autenticado (user === null):
 *    - Bloqueo total de cualquier ruta interna del dashboard.
 *    - Redirección inmediata a /login?redirect=${pathname}.
 *
 * 2. Super Administrador (user.is_super_admin === true):
 *    - Acceso irrestricto a todas las rutas (/dashboard, /meta-admin, /productos, /almacenes, /ordenes, /evidencias, /red-b2b).
 *
 * 3. Administrador de Empresa / Operario de Corralón (tipo_empresa === 'corralon'):
 *    - Permitido: /productos, /almacenes, /ordenes, /evidencias, /red-b2b.
 *    - Bloqueado: /meta-admin (exclusivo Super Admin) y /dashboard global (redirige a /productos).
 *
 * 4. Cliente / Constructora / Empresa de Servicios (rol === 'cliente' o tipo_empresa === 'servicios'):
 *    - Permitido: /ordenes (requerimientos), /evidencias (fotos y comprobantes de obra).
 *    - Bloqueado: /almacenes, /productos (no gestionan stock de galpón propio), /meta-admin y /dashboard.
 */
export function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  const { user, tenant, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [deniedReason, setDeniedReason] = useState<string | null>(null);

  // Evaluación de permisos RBAC
  const accessCheck = useMemo(() => {
    if (isLoading) return { status: "loading" as const };
    if (!user) return { status: "unauthenticated" as const };

    const isSuperAdmin = user.is_super_admin === true;
    const isCliente = user.rol === "cliente" || user.tipo_empresa === "servicios";
    const isCorralon = !isSuperAdmin && (user.tipo_empresa === "corralon" || tenant?.habilitado_inventrack === true);

    // 1. Meta-Admin: Exclusivo Super Administrador
    if (pathname.startsWith("/meta-admin") && !isSuperAdmin) {
      return {
        status: "forbidden" as const,
        reason: "El módulo de Administración de Plataforma es exclusivo para la Dirección y Super Administradores.",
        redirectTo: isCorralon ? "/productos" : "/ordenes",
      };
    }

    // 2. Dashboard Global: Exclusivo Super Administrador
    if (pathname === "/dashboard" && !isSuperAdmin) {
      return {
        status: "forbidden" as const,
        reason: "El Centro de Operaciones Global está reservado para Super Administradores.",
        redirectTo: isCorralon ? "/productos" : "/ordenes",
      };
    }

    // 3. InvenTrack (Almacenes y Productos): Bloqueado para Clientes de Obra
    if ((pathname.startsWith("/almacenes") || pathname.startsWith("/productos")) && isCliente) {
      return {
        status: "forbidden" as const,
        reason: "Tu cuenta de Contratista / Obra no cuenta con módulos de gestión de galpón ni catálogo de venta.",
        redirectTo: "/ordenes",
      };
    }

    return { status: "authorized" as const };
  }, [user, isLoading, pathname]);

  // Manejo de redirecciones automáticas
  useEffect(() => {
    if (accessCheck.status === "unauthenticated") {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    } else if (accessCheck.status === "forbidden") {
      setDeniedReason(accessCheck.reason);
      const timer = setTimeout(() => {
        router.replace(accessCheck.redirectTo);
      }, 1400);
      return () => clearTimeout(timer);
    } else if (accessCheck.status === "authorized") {
      setDeniedReason(null);
    }
  }, [accessCheck, pathname, router]);

  // 1. Estado de carga inicial
  if (accessCheck.status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center font-extrabold text-2xl text-white shadow-xl shadow-indigo-500/30 animate-pulse">
            V
          </div>
          <div className="flex items-center gap-2 text-indigo-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-semibold tracking-wide text-slate-200">
              Validando credenciales y permisos de acceso...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Estado no autenticado (bloqueo y redirección)
  if (accessCheck.status === "unauthenticated") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Acceso Protegido</h2>
            <p className="text-sm text-slate-400 mt-1">
              Debes iniciar sesión con tu cuenta para acceder a este módulo.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirigiendo a la pantalla de inicio de sesión...</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Estado de acceso denegado por rol
  if (accessCheck.status === "forbidden") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-6 bg-slate-800/80 p-8 rounded-2xl border border-red-500/30 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Acceso Restringido para tu Perfil</h2>
            <p className="text-sm text-slate-300 mt-2">
              {deniedReason || "No cuentas con los permisos requeridos para ingresar a esta sección."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium pt-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirigiendo a tu sección autorizada...</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Acceso autorizado
  return <>{children}</>;
}
