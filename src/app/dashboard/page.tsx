import Link from "next/link";
import {
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Globe2,
  Warehouse,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Panel de Control Operativo
          </h1>
          <p className="text-sm text-zinc-400">
            Resumen en tiempo real del almacén, movimientos, órdenes de surtido y red inter-empresas.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/inventario/nueva-entrada">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <ArrowDownLeft className="w-4 h-4 mr-1" />
              Ingresar Mercadería
            </Button>
          </Link>
          <Link href="/ordenes/nueva">
            <Button size="sm" variant="default">
              <Plus className="w-4 h-4 mr-1" />
              Nueva Orden de Suministro
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock */}
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Artículos en Stock
            </CardTitle>
            <Boxes className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12,480 u.</div>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">+4.5%</span> respecto a la semana pasada
            </p>
          </CardContent>
        </Card>

        {/* Órdenes a Surtir */}
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Órdenes de Suministro
            </CardTitle>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8 pendientes</div>
            <p className="text-xs text-amber-400/90 mt-1">
              3 listas para iniciar picking
            </p>
          </CardContent>
        </Card>

        {/* BackOrders */}
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Faltantes (BackOrders)
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">14 ítems</div>
            <p className="text-xs text-zinc-400 mt-1">
              Pendientes de solicitud a proveedores
            </p>
          </CardContent>
        </Card>

        {/* Red B2B */}
        <Card className="bg-gradient-to-br from-indigo-950/60 to-zinc-900 border-indigo-800/50 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-indigo-300 uppercase tracking-wider">
              Red Colaborativa B2B
            </CardTitle>
            <Globe2 className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-200">32 ofertas</div>
            <p className="text-xs text-indigo-300/80 mt-1">
              Stock disponible en otras empresas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Órdenes recientes y flujo de surtido */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-white">Órdenes de Suministro en Curso</CardTitle>
                <CardDescription className="text-zinc-400">
                  Flujo de picking y preparación de pedidos antes de remisión
                </CardDescription>
              </div>
              <Link href="/ordenes">
                <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                  Ver todas <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-zinc-800">
                {[
                  { id: "OS-1042", solicitante: "Depósito Norte", items: 6, estado: "Pendiente", badge: "destructive" },
                  { id: "OS-1041", solicitante: "Fábrica Central", items: 12, estado: "Parcialmente Surtido", badge: "warning" },
                  { id: "OS-1040", solicitante: "Sucursal Córdoba", items: 4, estado: "Surtido", badge: "success" },
                ].map((orden) => (
                  <div key={orden.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{orden.id}</span>
                        <Badge
                          variant={
                            orden.estado === "Surtido"
                              ? "success"
                              : orden.estado === "Parcialmente Surtido"
                              ? "warning"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {orden.estado}
                        </Badge>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {orden.solicitante} • {orden.items} productos solicitados
                      </div>
                    </div>
                    <Link href={`/ordenes/surtir/${orden.id}`}>
                      <Button size="sm" variant="outline" className="text-xs h-8">
                        {orden.estado === "Surtido" ? "Generar Remisión" : "Surtir Picking"}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Oportunidades Red B2B */}
          <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-indigo-400" />
                  Red Colaborativa: Stock Disponible en otras Empresas
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Cubre faltantes consultando la red de almacenes interconectados
                </CardDescription>
              </div>
              <Link href="/red-b2b">
                <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                  Explorar Red <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-zinc-200">Rodamiento Skf 6204-2rsh</div>
                    <div className="text-xs text-zinc-400">Disponible: 250 unidades • Rosario, Santa Fe</div>
                  </div>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                    Contactar Empresa
                  </Button>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-zinc-200">Aceite Sintético Hidráulico ISO 68</div>
                    <div className="text-xs text-zinc-400">Disponible: 1,200 litros • Córdoba Capital</div>
                  </div>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                    Contactar Empresa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Almacenes y accesos rápidos */}
        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-zinc-400" />
                Almacenes Activos
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Ocupación y capacidad de tus depósitos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-zinc-300">Almacén Principal A1</span>
                  <span className="text-zinc-400">78% de capacidad</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-[78%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-zinc-300">Muelle de Recepción / Staging</span>
                  <span className="text-zinc-400">22% de capacidad</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[22%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-zinc-300">Depósito Secundario Norte</span>
                  <span className="text-zinc-400">91% de capacidad</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[91%]" />
                </div>
              </div>

              <div className="pt-2">
                <Link href="/almacenes">
                  <Button variant="outline" className="w-full text-xs" size="sm">
                    Ver Matriz de Ubicaciones 3D
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Estado de Arquitectura Cloudflare / Supabase */}
          <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle className="text-sm text-zinc-300">Estado de la Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Hosting</span>
                <span className="text-zinc-200 font-medium">Cloudflare Pages (Serverless)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Base de Datos</span>
                <span className="text-zinc-200 font-medium">PostgreSQL (Supabase)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Multi-Tenancy</span>
                <Badge variant="success" className="text-[10px]">RLS Activado</Badge>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-400">Costo Fijo Mensual</span>
                <span className="text-emerald-400 font-bold">$0.00 / mes</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
