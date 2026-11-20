"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  HardHat,
  ImagePlus,
  Layers,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  Truck,
  Upload,
  UserCheck,
  Users,
  Wrench,
  BarChart3,
  Eye,
  ArrowLeftRight,
  Star,
  AlertTriangle,
  Clock,
  MessageSquareWarning,
  FileQuestion,
  Ban,
  Zap,
  TrendingUp,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ═══════════════════════════════════════════════════════════════
   SCROLL-REVEAL HOOK
   ═══════════════════════════════════════════════════════════════ */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal-item ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MINI-PREVIEW COMPONENTS  (clean, no repeated sidebars)
   ═══════════════════════════════════════════════════════════════ */

function MetricCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-xl p-3 text-center border border-slate-700/40">
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{label}</div>
    </div>
  );
}

function PreviewOperador() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700/40 p-4 space-y-3 backdrop-blur">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-[8px] font-bold text-white">V</div>
        <span className="text-xs font-bold text-white">Centro de operaciones</span>
        <span className="ml-auto text-[10px] text-slate-500">Últimos 7 días</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <MetricCard value="24" label="Activas" color="text-white" />
        <MetricCard value="12" label="En ejecución" color="text-blue-400" />
        <MetricCard value="5" label="Validación" color="text-violet-400" />
        <MetricCard value="67" label="Cerradas" color="text-emerald-400" />
      </div>
      <div className="space-y-1">
        {[
          { f: "VT-1048", t: "Mant.", l: "Torre Norte", s: "Asignado", sc: "bg-blue-500/20 text-blue-400 border-blue-500/30", p: 60 },
          { f: "VT-1049", t: "Material", l: "Bodega Central", s: "Por cotizar", sc: "bg-amber-500/20 text-amber-400 border-amber-500/30", p: 20 },
          { f: "VT-1050", t: "Mant.", l: "Torre Sur", s: "Incidencia", sc: "bg-red-500/20 text-red-400 border-red-500/30", p: 30 },
        ].map((r) => (
          <div key={r.f} className="flex items-center gap-2 bg-slate-900/60 rounded-lg px-3 py-2 text-[11px]">
            <span className="text-slate-300 font-mono font-semibold">{r.f}</span>
            <span className="text-slate-500 hidden sm:block">{r.t}</span>
            <span className="text-slate-500 flex-1 truncate">{r.l}</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${r.sc}`}>{r.s}</span>
            <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden hidden sm:block">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${r.p}%` }} />
            </div>
          </div>
        ))}
      </div>
      {/* Validación row */}
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 text-[11px]">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="text-emerald-400 font-semibold">Evidencia consistente</span>
        <span className="text-slate-500 ml-auto">95% coincidencia</span>
      </div>
    </div>
  );
}

function PreviewProveedor() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700/40 p-4 space-y-3 backdrop-blur">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-[8px] font-bold text-white">V</div>
        <span className="text-xs font-bold text-white">Solicitudes recibidas</span>
        <div className="ml-auto flex gap-1">
          {["Nuevas (4)", "Cotiz. (3)", "Aceptadas (8)"].map((t) => (
            <span key={t} className="bg-slate-700/60 text-slate-400 px-1.5 py-0.5 rounded text-[8px]">{t}</span>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        {[
          { f: "VT-1112", t: "Mant.", l: "Torre Sur · Acceso", s: "Por cotizar", sc: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
          { f: "VT-1048", t: "Mant.", l: "Torre Norte · P.3", s: "Nuevo", sc: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
          { f: "VT-1058", t: "Material", l: "Edificio E", s: "Aceptado", sc: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
        ].map((r) => (
          <div key={r.f} className="flex items-center gap-2 bg-slate-900/60 rounded-lg px-3 py-2 text-[11px]">
            <span className="text-slate-300 font-mono font-semibold">{r.f}</span>
            <span className="text-slate-500 hidden sm:block">{r.t}</span>
            <span className="text-slate-500 flex-1 truncate">{r.l}</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${r.sc}`}>{r.s}</span>
          </div>
        ))}
      </div>
      {/* Detalle inline */}
      <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">Detalle · VT-1112</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold border bg-amber-500/20 text-amber-400 border-amber-500/30">Por cotizar</span>
        </div>
        <div className="flex gap-4 text-slate-400">
          <span>Reparación de herraje</span>
          <span className="text-slate-600">Torre Sur</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-800 border border-slate-700/60 rounded-lg px-2 py-1.5 flex items-center gap-1.5 text-slate-400">
            <Upload className="w-3 h-3" /> Cargar cotización
          </div>
          <button className="bg-emerald-600 text-white rounded-lg px-3 py-1.5 font-semibold text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewCliente() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700/40 p-4 space-y-3 backdrop-blur">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded bg-sky-600 flex items-center justify-center text-[8px] font-bold text-white">V</div>
        <span className="text-xs font-bold text-white">Nueva solicitud</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Wrench, label: "Mantenimiento", hint: "reparaciones, etc." },
          { icon: Package, label: "Materiales", hint: "insumos, suministros…" },
        ].map(({ icon: Icon, label, hint }) => (
          <div key={label} className="bg-indigo-600/15 border border-indigo-500/30 rounded-xl p-3 flex flex-col items-center gap-1 text-center">
            <Icon className="w-5 h-5 text-indigo-400" />
            <span className="text-white font-semibold text-[11px]">{label}</span>
            <span className="text-slate-500 text-[9px]">{hint}</span>
          </div>
        ))}
      </div>
      <div className="bg-slate-900/60 rounded-lg p-2 text-[11px] space-y-1">
        <div className="text-slate-400">Descripción</div>
        <div className="bg-slate-800 border border-slate-700/40 rounded px-2 py-1 text-slate-300">
          Puerta de acceso dañada, no cierra…
        </div>
      </div>
      <div className="h-7 border-2 border-dashed border-slate-700/60 rounded-lg flex items-center justify-center gap-1 text-slate-500 text-[10px]">
        <ImagePlus className="w-3 h-3" /> Foto del problema
      </div>
      {/* Timeline */}
      <div className="bg-slate-900/60 rounded-lg p-3 space-y-1.5 text-[11px]">
        <div className="font-semibold text-white text-xs mb-1">Seguimiento</div>
        {[
          { label: "Solicitud creada", done: true },
          { label: "Asignada por VERTIA", done: true },
          { label: "En ejecución (Proveedor)", done: true },
          { label: "Evidencia cargada", done: true },
          { label: "En revisión (VERTIA)", done: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <CircleDot className={`w-3 h-3 shrink-0 ${s.done ? "text-emerald-400" : "text-slate-600"}`} />
            <span className={s.done ? "text-slate-300" : "text-slate-500"}>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-emerald-600 text-white rounded-lg py-2 font-bold text-[11px]">✓ Aprobar cierre</button>
        <button className="flex-1 bg-slate-700 text-slate-300 rounded-lg py-2 font-bold text-[11px]">✕ Rechazar</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <>
      {/* Global reveal animation styles */}
      <style>{`
        .reveal-item {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-item.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .float-anim { animation: float 6s ease-in-out infinite; }
        .float-anim-delayed { animation: float 6s ease-in-out 2s infinite; }
        .glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
        .gradient-text {
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }
        .env-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .env-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px -15px rgba(0,0,0,0.5);
        }
        .flow-step {
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        .flow-step:hover {
          transform: scale(1.04);
        }
        .pain-card {
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .pain-card:hover {
          transform: translateY(-3px);
        }
      `}</style>

      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white overflow-x-hidden">

        {/* ═══════ HEADER ═══════ */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
          <div className="h-14 px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-extrabold text-white shadow-lg shadow-indigo-500/25 text-sm">
                V
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">VERTIA</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
              <a href="#problema" className="hover:text-white transition-colors">Problema</a>
              <a href="#solucion" className="hover:text-white transition-colors">Solución</a>
              <a href="#flujo" className="hover:text-white transition-colors">Flujo</a>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-400 hover:text-white text-sm h-8 px-3">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm h-8 px-4 shadow-md shadow-indigo-600/30">
                  Ir a la plataforma <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* ═══════ HERO ═══════ */}
        <section className="relative pt-32 pb-20 px-6">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px] glow-pulse" />
            <div className="absolute top-40 left-1/4 w-[400px] h-[300px] bg-violet-600/6 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-xs font-medium text-red-300 mb-8">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>El problema que enfrenta la industria de la construcción</span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Solicitudes perdidas,
                <br />
                <span className="bg-gradient-to-r from-red-400 via-orange-300 to-amber-400 bg-clip-text text-transparent gradient-text">
                  trabajos sin trazabilidad
                </span>
                <br />
                y cierres sin evidencia.
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Coordinar clientes, contratistas y operadores por WhatsApp, correo y planillas genera
                pérdida de control, re-trabajos y conflictos sin respaldo documental.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
                <Link href="#solucion">
                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-8 h-12 shadow-xl shadow-indigo-600/25 transition-all hover:shadow-indigo-500/40"
                  >
                    Ver cómo VERTIA lo resuelve <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 text-sm h-12 px-6"
                  >
                    Explorar la plataforma
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════ PAIN POINTS ═══════ */}
        <section id="problema" className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-14">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">¿Te suena familiar?</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
                  Los dolores que nadie quiere enfrentar
                </h2>
                <p className="text-slate-400 mt-3 max-w-xl mx-auto">
                  Estos problemas cuestan dinero, tiempo y relaciones profesionales todos los días.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: MessageSquareWarning,
                  title: "Comunicación fragmentada",
                  desc: "WhatsApp, llamadas, correos… la información se pierde entre canales y no queda registro formal.",
                  color: "text-red-400",
                  border: "hover:border-red-500/40",
                },
                {
                  icon: FileQuestion,
                  title: "Sin evidencia documental",
                  desc: "Fotos en el celular, cotizaciones en PDF sueltos. Cuando hay un reclamo, no hay respaldo.",
                  color: "text-orange-400",
                  border: "hover:border-orange-500/40",
                },
                {
                  icon: Clock,
                  title: "Re-trabajos y demoras",
                  desc: "Falta de seguimiento genera trabajos mal hechos que se descubren tarde y cuestan el doble.",
                  color: "text-amber-400",
                  border: "hover:border-amber-500/40",
                },
                {
                  icon: Ban,
                  title: "Cierres sin aprobación",
                  desc: "El proveedor dice que terminó, el cliente no validó, el operador no sabe. ¿Quién tiene razón?",
                  color: "text-rose-400",
                  border: "hover:border-rose-500/40",
                },
                {
                  icon: Eye,
                  title: "Cero visibilidad operativa",
                  desc: "No sabés cuántas solicitudes hay activas, cuántas están atrasadas ni quién las tiene asignadas.",
                  color: "text-pink-400",
                  border: "hover:border-pink-500/40",
                },
                {
                  icon: AlertTriangle,
                  title: "Incidencias no rastreadas",
                  desc: "Un problema grave se reporta por teléfono, nadie lo documenta, se vuelve a repetir.",
                  color: "text-yellow-400",
                  border: "hover:border-yellow-500/40",
                },
              ].map(({ icon: Icon, title, desc, color, border }, i) => (
                <Reveal key={title} delay={i * 80}>
                  <div className={`pain-card bg-slate-900/60 border border-slate-800 ${border} rounded-2xl p-6 h-full`}>
                    <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${color} mb-4`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ TRANSITION: La solución ═══════ */}
        <section className="relative py-16 px-6">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px]" />
          </div>
          <div className="relative max-w-3xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-medium text-emerald-300 mb-6">
                <Zap className="w-3.5 h-3.5" />
                <span>La solución</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Un solo sistema,{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
                  tres entornos coordinados
                </span>
              </h2>
              <p className="mt-4 text-slate-400 max-w-xl mx-auto leading-relaxed">
                VERTIA conecta clientes, contratistas y operadores en una plataforma con trazabilidad completa:
                desde la solicitud inicial hasta la aprobación del cierre con evidencias.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ═══════ THREE ENVIRONMENTS ═══════ */}
        <section id="solucion" className="relative py-10 px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Operador ── */}
              <Reveal delay={0}>
                <div className="env-card rounded-3xl border border-indigo-500/25 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden h-full flex flex-col">
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 float-anim">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-3 py-1 rounded-full">
                        Control interno
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white">Entorno VERTIA</h3>
                    <p className="text-xs text-indigo-300/80 font-medium mt-0.5">Operador</p>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Monitorea todas las solicitudes, gestiona asignaciones, valida evidencias, controla incidencias y autoriza cierres.
                    </p>
                  </div>
                  <div className="px-5 pb-5 flex-1">
                    <PreviewOperador />
                  </div>
                  <div className="border-t border-slate-800/60 px-5 py-4 grid grid-cols-2 gap-y-2 gap-x-4">
                    {[
                      { icon: Eye, label: "Monitoreo total" },
                      { icon: Bell, label: "Notificaciones" },
                      { icon: FileCheck2, label: "Validar evidencias" },
                      { icon: ShieldCheck, label: "Control de cierre" },
                    ].map(({ icon: I, label }) => (
                      <div key={label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <I className="w-3 h-3 text-indigo-400/60 shrink-0" /> {label}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* ── Contratista / Proveedor ── */}
              <Reveal delay={150}>
                <div className="env-card rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden h-full flex flex-col">
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-600/30 float-anim-delayed">
                        <HardHat className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                        Ejecución
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white">Contratista / Proveedor</h3>
                    <p className="text-xs text-emerald-300/80 font-medium mt-0.5">Ejecución de trabajos o entrega de materiales</p>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Recibe solicitudes, cotiza, acepta y ejecuta el trabajo, sube evidencias y actualiza el estado con documentación.
                    </p>
                  </div>
                  <div className="px-5 pb-5 flex-1">
                    <PreviewProveedor />
                  </div>
                  <div className="border-t border-slate-800/60 px-5 py-4 grid grid-cols-2 gap-y-2 gap-x-4">
                    {[
                      { icon: ClipboardList, label: "Recibe solicitudes" },
                      { icon: Wrench, label: "Gestiona ejecución" },
                      { icon: Upload, label: "Sube evidencias" },
                      { icon: Truck, label: "Seguimiento entregas" },
                    ].map(({ icon: I, label }) => (
                      <div key={label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <I className="w-3 h-3 text-emerald-400/60 shrink-0" /> {label}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* ── Cliente ── */}
              <Reveal delay={300}>
                <div className="env-card rounded-3xl border border-sky-500/25 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden h-full flex flex-col">
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-600/30 float-anim">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/25 px-3 py-1 rounded-full">
                        Solicitante
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white">Entorno Cliente</h3>
                    <p className="text-xs text-sky-300/80 font-medium mt-0.5">Solicita, da seguimiento y aprueba</p>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Crea solicitudes, sube fotos del problema, da seguimiento, compara evidencias y aprueba o rechaza el cierre.
                    </p>
                  </div>
                  <div className="px-5 pb-5 flex-1">
                    <PreviewCliente />
                  </div>
                  <div className="border-t border-slate-800/60 px-5 py-4 grid grid-cols-2 gap-y-2 gap-x-4">
                    {[
                      { icon: ImagePlus, label: "Fotos problema / resultado" },
                      { icon: ArrowLeftRight, label: "Compara evidencias" },
                      { icon: CheckCircle2, label: "Aprueba cierre" },
                      { icon: Layers, label: "Historial trazable" },
                    ].map(({ icon: I, label }) => (
                      <div key={label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <I className="w-3 h-3 text-sky-400/60 shrink-0" /> {label}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════ FLOW ═══════ */}
        <section id="flujo" className="relative py-20 px-6 bg-gradient-to-b from-slate-900/40 to-slate-950">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/5 rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-14">
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Proceso de punta a punta</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
                  Flujo de una solicitud en el sistema
                </h2>
                <p className="text-slate-400 mt-3 max-w-lg mx-auto">
                  Así viaja una solicitud a través de los tres entornos, desde su creación hasta el cierre.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  num: 1, actor: "Cliente", color: "from-sky-600 to-blue-600", text: "text-sky-400", border: "border-sky-500/25",
                  desc: "Crea la solicitud y sube fotos del problema (o necesidad).",
                  icon: ImagePlus,
                },
                {
                  num: 2, actor: "VERTIA", color: "from-indigo-600 to-violet-600", text: "text-indigo-400", border: "border-indigo-500/25",
                  desc: "Valida la solicitud, verifica la información y la asigna a un contratista o proveedor.",
                  icon: ShieldCheck,
                },
                {
                  num: 3, actor: "Contratista / Proveedor", color: "from-emerald-600 to-teal-600", text: "text-emerald-400", border: "border-emerald-500/25",
                  desc: "Recibe la solicitud, cotiza y ejecuta el trabajo o prepara la entrega.",
                  icon: HardHat,
                },
                {
                  num: 4, actor: "Ambas partes", color: "from-amber-600 to-orange-600", text: "text-amber-400", border: "border-amber-500/25",
                  desc: "Suben evidencias del resultado: el proveedor su trabajo y el cliente su conformidad.",
                  icon: Upload,
                },
                {
                  num: 5, actor: "VERTIA", color: "from-indigo-600 to-violet-600", text: "text-indigo-400", border: "border-indigo-500/25",
                  desc: "Verifica y valida las evidencias de ambas partes. Autoriza el cierre.",
                  icon: FileCheck2,
                },
                {
                  num: 6, actor: "Cliente", color: "from-sky-600 to-blue-600", text: "text-sky-400", border: "border-sky-500/25",
                  desc: "Aprueba el cierre de la solicitud. Queda registrada con trazabilidad completa.",
                  icon: CheckCircle2,
                },
              ].map(({ num, actor, color, text, border, desc, icon: Icon }, i) => (
                <Reveal key={num} delay={i * 100}>
                  <div className={`flow-step bg-slate-900/70 border ${border} rounded-2xl p-5 h-full`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${color} flex items-center justify-center text-white font-extrabold text-sm shadow-lg shrink-0`}>
                        {num}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${text}`}>{actor}</div>
                      </div>
                      <Icon className={`w-4 h-4 ${text} ml-auto opacity-50`} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Resultado */}
            <Reveal delay={650}>
              <div className="mt-8 bg-gradient-to-r from-indigo-600/15 via-violet-600/15 to-indigo-600/15 border border-indigo-500/25 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-600/30 shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-lg">Resultado</div>
                  <div className="text-slate-400 text-sm mt-1">
                    Trabajo o entrega completada con <strong className="text-slate-300">trazabilidad, evidencias y registro</strong> en el historial.
                    Sin llamadas, sin WhatsApp, sin dudas.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════ CTA ═══════ */}
        <section className="py-20 px-6">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Listo para ordenar tus operaciones
              </h2>
              <p className="text-slate-400 mt-4 max-w-lg mx-auto">
                Ingresá a la plataforma según tu rol y empezá a gestionar solicitudes con trazabilidad completa.
              </p>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: ShieldCheck, title: "VERTIA (Operador)", desc: "Centro de operaciones", color: "from-indigo-600 to-violet-600", border: "border-indigo-500/25", href: "/dashboard" },
                  { icon: HardHat, title: "Contratista / Proveedor", desc: "Solicitudes y ejecución", color: "from-emerald-600 to-teal-600", border: "border-emerald-500/25", href: "/dashboard" },
                  { icon: UserCheck, title: "Cliente", desc: "Solicitar y aprobar", color: "from-sky-600 to-blue-600", border: "border-sky-500/25", href: "/dashboard" },
                ].map(({ icon: Icon, title, desc, color, border, href }) => (
                  <Link
                    key={title}
                    href={href}
                    className={`group rounded-2xl border ${border} bg-slate-900/60 p-6 flex flex-col items-center gap-3 hover:bg-slate-800/60 transition-all hover:-translate-y-1`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-bold text-white text-sm">{title}</div>
                    <div className="text-slate-500 text-xs">{desc}</div>
                    <div className="flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Ingresar <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="border-t border-slate-800/60 py-8 text-center text-xs text-slate-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-[8px] font-bold text-white">
              V
            </div>
            <span className="font-bold text-slate-500">VERTIA</span>
          </div>
          <p className="text-slate-500">Plataforma operativa para construcciones, proyectos e inmuebles · 2026</p>
        </footer>
      </div>
    </>
  );
}
