"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  Boxes,
  Truck,
  Eye,
  Check,
  X,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function CentroDeOperacionesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const isSuperAdmin = user?.is_super_admin ?? false;
  const isCorralon =
    !isSuperAdmin &&
    (user?.tipo_empresa === "corralon" ||
      user?.rol === "administrador" ||
      user?.rol === "operario");
  const isCliente = user?.rol === "cliente";

  useEffect(() => {
    if (!isLoading) {
      if (isCorralon) {
        // Redirige al corralón directo a su módulo operativo de InvenTrack
        router.replace("/productos");
      } else if (isCliente) {
        router.replace("/ordenes");
      }
    }
  }, [isCorralon, isCliente, isLoading, router]);

  if (isCorralon) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
          <Boxes className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Redirigiendo a tu Módulo InvenTrack...
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Como miembro de <strong>{user?.tenant_nombre}</strong>, tu acceso operativo principal es la gestión de materiales y galpón.
          </p>
        </div>
        <Link href="/productos">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
            Ir a Materiales & Stock (InvenTrack)
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-800">
      {/* Header Banner - Centro de Operaciones */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Entorno VERTIA (Operador) • Control y Operación Central</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Centro de Operaciones
          </h1>
          <p className="text-xs text-slate-500">
            VERTIA monitorea todas las solicitudes y entregas, gestiona asignaciones, valida evidencias y autoriza el cierre.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/evidencias">
            <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium">
              Validar Evidencias (5)
            </Button>
          </Link>
          <Link href="/ordenes">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs">
              Nueva Solicitud
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Tarjetas de Métricas (Fiel al Banner de VERTIA) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solicitudes Activas */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Solicitudes activas
          </div>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">24</div>
          <div className="text-[11px] text-slate-400 mt-1">En curso en toda la red</div>
        </div>

        {/* En ejecución */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            En ejecución
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">12</div>
          <div className="text-[11px] text-slate-400 mt-1">Proveedores y corralones en obra</div>
        </div>

        {/* En validación */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            En validación
          </div>
          <div className="text-3xl font-extrabold text-amber-500 mt-1">5</div>
          <div className="text-[11px] text-slate-400 mt-1">Fotos y remisiones pendientes</div>
        </div>

        {/* Cerradas (mes) */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Cerradas (mes)
          </div>
          <div className="text-3xl font-extrabold text-indigo-700 mt-1">67</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% con trazabilidad</div>
        </div>
      </div>

      {/* Panel General de Operaciones (Tabla Fiel al Banner) */}
      <Card className="bg-white border-slate-200 shadow-2xs overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-200 py-3.5 px-5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800">
              Panel General de Operaciones
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Seguimiento en tiempo real de solicitudes de materiales y trabajos
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs bg-white text-slate-700 border-slate-300">
            24 activas
          </Badge>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Folio</th>
                <th className="py-2.5 px-4">Tipo</th>
                <th className="py-2.5 px-4">Proyecto / Ubicación</th>
                <th className="py-2.5 px-4">Estado</th>
                <th className="py-2.5 px-4">Avance</th>
                <th className="py-2.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Fila 1 */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-indigo-700">VT-1048</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Mantenimiento
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-800 font-medium">Torre Norte - Piso 3</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    En ejecución
                  </span>
                </td>
                <td className="py-3 px-4 w-40">
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[60%]" />
                    </div>
                    <span className="font-semibold text-[11px] text-slate-600">60%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link href="/evidencias">
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                      Ver detalle
                    </Button>
                  </Link>
                </td>
              </tr>

              {/* Fila 2 (Materiales) */}
              <tr className="hover:bg-slate-50/80 transition-colors bg-slate-50/30">
                <td className="py-3 px-4 font-bold text-indigo-700">VT-1049</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 font-medium text-purple-700">
                    <Boxes className="w-3.5 h-3.5 text-purple-600" />
                    Material (Cemento 50 bolsas)
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-800 font-medium">Bodega Central / Corralón X</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    Por validar
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">-</td>
                <td className="py-3 px-4 text-right">
                  <Link href="/ordenes">
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                      Gestionar
                    </Button>
                  </Link>
                </td>
              </tr>

              {/* Fila 3 (Incidencia) */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-indigo-700">VT-1050</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Mantenimiento
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-800 font-medium">Torre Sur - Lobby</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 border border-red-200">
                    Incidencia
                  </span>
                </td>
                <td className="py-3 px-4 w-40">
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full w-[30%]" />
                    </div>
                    <span className="font-semibold text-[11px] text-slate-600">30%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600 hover:text-red-800 hover:bg-red-50">
                    Revisar
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Grid: Validación de Evidencias & Alertas (Fiel al Banner) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validación de Evidencias (Fotos Antes vs Después) */}
        <Card className="bg-white border-slate-200 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                Validación de Evidencias Fotográficas
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Folio VT-1048 • Reparación de puerta y entrega de materiales
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[11px]">
              En validación
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Foto 1: Antes / Cliente */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Evidencia del Cliente (Inicial)
                </div>
                <div className="aspect-4/3 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center text-slate-400">
                  <div className="text-center p-3">
                    <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                    <span className="text-[10px] text-slate-500 block">Foto inicial de la necesidad</span>
                  </div>
                </div>
              </div>

              {/* Foto 2: Después / Proveedor */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Evidencia del Proveedor (Final)
                </div>
                <div className="aspect-4/3 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center text-slate-400">
                  <div className="text-center p-3">
                    <Truck className="w-8 h-8 mx-auto text-emerald-400 mb-1" />
                    <span className="text-[10px] text-slate-500 block">Foto de material entregado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparación VERTIA */}
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Evidencia Consistente • Coincidencia 98%
                </div>
                <div className="text-[11px] text-emerald-800">
                  ✓ Mismo punto de captura • ✓ Remito conforme al pedido
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs bg-white text-slate-700 border-slate-300">
                  Solicitar ajuste
                </Button>
                <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                  Validar y Cerrar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas y Notificaciones */}
        <Card className="bg-white border-slate-200 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">
              Alertas & Notificaciones Operativas
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Incidencias, autorizaciones y avisos de la red en tiempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-blue-600 text-white shrink-0 mt-0.5">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-900">Nueva solicitud recibida VT-1051</div>
                <div className="text-[11px] text-blue-800 mt-0.5">
                  Obra Torre Norte solicita 100 bolsas de cemento. Se requiere asignación a corralón.
                </div>
                <div className="text-[10px] text-blue-600 mt-1">Hoy, 10:24 hs</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-amber-500 text-white shrink-0 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900">Incidencia reportada en VT-1048</div>
                <div className="text-[11px] text-amber-800 mt-0.5">
                  El contratista reportó demora por lluvia en acceso a Torre Sur.
                </div>
                <div className="text-[10px] text-amber-700 mt-1">Ayer, 17:20 hs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flujo de una Solicitud (Línea del Banner de Humberto) */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Flujo Integral de una Solicitud en VERTIA
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900">1. Cliente</div>
            <div className="text-[11px] text-slate-500 mt-1">Crea solicitud y fotos iniciales</div>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
            <div className="font-bold text-indigo-900">2. VERTIA</div>
            <div className="text-[11px] text-indigo-700 mt-1">Valida y asigna corralón</div>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
            <div className="font-bold text-purple-900">3. Corralón</div>
            <div className="text-[11px] text-purple-700 mt-1">Prepara stock y remisión</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900">4. Entrega</div>
            <div className="text-[11px] text-slate-500 mt-1">Sube foto de remito y descarga</div>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
            <div className="font-bold text-indigo-900">5. VERTIA</div>
            <div className="text-[11px] text-indigo-700 mt-1">Verifica evidencias</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="font-bold text-emerald-900">6. Cierre</div>
            <div className="text-[11px] text-emerald-700 mt-1">Cliente aprueba conformidad</div>
          </div>
        </div>
      </div>
    </div>
  );
}
