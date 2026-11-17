import Link from "next/link";
import {
  Boxes,
  Warehouse,
  Globe2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  ServerOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="h-20 border-b border-zinc-800/80 px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 text-lg">
            V
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white">Vertia</span>
            <Badge variant="secondary" className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-[11px]">
              SaaS
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-300 hover:text-white">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-600/30">
              Ir al Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>SaaS Moderno de Almacenes & Red Colaborativa B2B</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          Gestión de inventarios inteligente,{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
            serverless y colaborativa
          </span>
        </h1>

        <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Control completo de stock con matriz de ubicaciones 3D, flujos de surtido/picking atómicos, remisiones de despacho y una red colaborativa inter-empresas para cubrir faltantes en tiempo real.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/dashboard">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base px-8 h-12 shadow-lg shadow-indigo-600/25">
              Explorar Plataforma <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 text-base h-12 px-6">
              Registrar Empresa
            </Button>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4">
              <Warehouse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Ubicaciones Espaciales 3D</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Modelado físico real por Pasillo, Rack, Estantería, Nivel y Caja con trazabilidad por Lote y zonas de recepción configurables.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-violet-950 border border-violet-800/60 flex items-center justify-center text-violet-400 mb-4">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Red Colaborativa B2B</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Publica excedentes o consulta el stock disponible entre empresas de la red para abastecer faltantes sin intermediarios.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4">
              <ServerOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Costo Cero de VPS</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Despliegue serverless sobre Cloudflare Pages y Supabase Postgres con Row Level Security (RLS) para máxima seguridad multi-tenant.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-400">
        <p>Vertia • Plataforma Inteligente de Gestión de Almacenes & Red Colaborativa B2B • 2026</p>
      </footer>
    </div>
  );
}
