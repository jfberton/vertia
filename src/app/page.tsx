import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ─── small UI helpers ─────────────────────────────────────── */

function NavItem({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium ${
        active
          ? "bg-indigo-600 text-white"
          : "text-slate-400 hover:text-white"
      }`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="hidden sm:block">{label}</span>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "asignado" | "cotizar" | "aceptado" | "incidencia" | "revision" | "nuevo";
}) {
  const map: Record<string, string> = {
    asignado: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    cotizar: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    aceptado: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    incidencia: "bg-red-500/15 text-red-400 border-red-500/30",
    revision: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    nuevo: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  };
  const label: Record<string, string> = {
    asignado: "Asignado",
    cotizar: "Por cotizar",
    aceptado: "Aceptado",
    incidencia: "Incidencia",
    revision: "En revisión",
    nuevo: "Nuevo",
  };
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}

function MockSidebar({ active }: { active: string }) {
  return (
    <div className="w-28 shrink-0 bg-slate-900 border-r border-slate-700/60 flex flex-col p-2 gap-0.5">
      <div className="flex items-center gap-1.5 px-2 py-2 mb-2">
        <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-[9px] font-bold text-white">
          V
        </div>
        <span className="text-[10px] font-bold text-white">VERTIA</span>
      </div>
      {[
        { icon: LayoutDashboard, label: "Operaciones" },
        { icon: Bell, label: "Alertas" },
        { icon: ClipboardList, label: "Solicitudes" },
        { icon: ShieldCheck, label: "Incidencias" },
        { icon: Users, label: "Proveedores" },
        { icon: BarChart3, label: "Reportes" },
        { icon: Settings, label: "Configuración" },
      ].map(({ icon, label }) => (
        <NavItem key={label} icon={icon} label={label} active={label === active} />
      ))}
    </div>
  );
}

/* ─── MOCKUP 1: Centro de Operaciones ──────────────────────── */
function MockCentroOperaciones() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/60 overflow-hidden text-[10px] shadow-xl">
      <div className="flex">
        <MockSidebar active="Operaciones" />
        <div className="flex-1 p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white text-[11px]">Centro de operaciones</span>
            <span className="text-slate-400">Últimos 7 días</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: "Solicitudes activas", value: "24", color: "text-white" },
              { label: "En ejecución", value: "12", color: "text-blue-400" },
              { label: "En validación", value: "5", color: "text-violet-400" },
              { label: "Cerradas (mes)", value: "67", color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="bg-slate-900/60 rounded-lg p-2 text-center">
                <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-slate-500 leading-tight mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="text-slate-400 font-semibold mb-1.5">Panel general de operaciones</div>
          <div className="space-y-1">
            {[
              { folio: "VT-1048", tipo: "Mantenimiento", lugar: "Torre Norte · Piso 3", status: "asignado" as const, avance: 60 },
              { folio: "VT-1049", tipo: "Material", lugar: "Bodega Central", status: "cotizar" as const, avance: 20 },
              { folio: "VT-1050", tipo: "Mantenimiento", lugar: "Torre Sur · Lobby", status: "incidencia" as const, avance: 30 },
            ].map((r) => (
              <div key={r.folio} className="flex items-center gap-2 bg-slate-900/50 rounded px-2 py-1.5">
                <span className="text-slate-300 font-medium w-14 shrink-0">{r.folio}</span>
                <span className="text-slate-400 w-20 shrink-0">{r.tipo}</span>
                <span className="text-slate-500 flex-1 truncate">{r.lugar}</span>
                <StatusBadge status={r.status} />
                <div className="w-14 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${r.avance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MOCKUP 2: Validación de evidencias ───────────────────── */
function MockValidacionEvidencias() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/60 overflow-hidden text-[10px] shadow-xl">
      <div className="flex">
        <MockSidebar active="Incidencias" />
        <div className="flex-1 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white text-[11px]">Validación de evidencias</span>
            <StatusBadge status="revision" />
          </div>
          <div className="text-slate-400 mb-2">Comparación VERTIA</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {["Evidencia del proveedor\n(después)", "Evidencia del cliente\n(después)"].map((label, i) => (
              <div key={i} className="bg-slate-900/70 rounded-lg p-2">
                <div className="text-slate-500 mb-1 whitespace-pre-line leading-tight">{label}</div>
                <div className="h-14 bg-slate-700 rounded-md flex items-center justify-center">
                  <Eye className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2 py-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-emerald-400 font-semibold">Evidencia consistente</span>
            <span className="text-slate-400 ml-auto">Coincidencia 95%</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-1.5 font-semibold text-[10px] transition-colors">
              Validar evidencia
            </button>
            <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg py-1.5 font-semibold text-[10px] transition-colors">
              Solicitar ajuste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MOCKUP 3: Solicitudes recibidas (Proveedor) ──────────── */
function MockSolicitudesRecibidas() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/60 overflow-hidden text-[10px] shadow-xl">
      <div className="flex">
        <MockSidebar active="Solicitudes" />
        <div className="flex-1 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white text-[11px]">Solicitudes recibidas</span>
            <div className="flex gap-1">
              {["Nuevas (4)", "En cotiz. (3)", "Aceptadas (8)"].map((t) => (
                <span key={t} className="bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[9px]">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            {[
              { folio: "VT-1048", tipo: "Mantenimiento", lugar: "Torre Norte · Piso 3", fecha: "26 ene 2025", status: "nuevo" as const },
              { folio: "VT-1111", tipo: "Mantenimiento", lugar: "Torre Sur · Acceso ppal.", fecha: "26 ene 2025", status: "cotizar" as const },
              { folio: "VT-1058", tipo: "Material", lugar: "Edificio E · Piso 5", fecha: "27 ene 2025", status: "aceptado" as const },
            ].map((r) => (
              <div key={r.folio} className="flex items-center gap-2 bg-slate-900/50 rounded px-2 py-1.5">
                <span className="text-slate-300 font-medium w-14 shrink-0">{r.folio}</span>
                <span className="text-slate-400 w-20 shrink-0">{r.tipo}</span>
                <span className="text-slate-500 flex-1 truncate">{r.lugar}</span>
                <span className="text-slate-500 shrink-0">{r.fecha}</span>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MOCKUP 4: Detalle + Cargar cotización ─────────────────── */
function MockDetalleTrabajo() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/60 overflow-hidden text-[10px] shadow-xl">
      <div className="flex">
        <MockSidebar active="Solicitudes" />
        <div className="flex-1 p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-white text-[11px]">Detalle de solicitud · VT-1112</span>
            <StatusBadge status="cotizar" />
          </div>
          <div className="bg-slate-900/60 rounded-lg p-2 space-y-1">
            <div className="flex justify-between"><span className="text-slate-400">Tipo</span><span className="text-slate-200">Mantenimiento</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Ubicación</span><span className="text-slate-200">Torre Sur · Acceso ppal.</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Descripción</span><span className="text-slate-200 text-right">Reparación de herraje</span></div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-700/50 rounded-lg px-2 py-1.5 flex items-center gap-1.5">
              <Upload className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400">Cargar cotización</span>
            </div>
            <button className="bg-indigo-600 text-white rounded-lg px-2 py-1.5 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Aceptar trabajo</span>
            </button>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-2">
            <div className="text-slate-400 mb-1 font-semibold">Subir evidencia final</div>
            <div className="h-10 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center gap-1.5 text-slate-500">
              <ImagePlus className="w-3.5 h-3.5" />
              <span>Fotos antes / después</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MOCKUP 5: Nueva solicitud (Cliente) ──────────────────── */
function MockNuevaSolicitud() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/60 overflow-hidden text-[10px] shadow-xl">
      <div className="flex">
        <MockSidebar active="Solicitudes" />
        <div className="flex-1 p-3 space-y-2">
          <span className="font-bold text-white text-[11px]">Nueva solicitud</span>
          <div className="text-slate-400">¿Qué necesitás?</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Wrench, label: "Mantenimiento", hint: "reparaciones, etc." },
              { icon: Package, label: "Materiales", hint: "insumos, suministros…" },
            ].map(({ icon: Icon, label, hint }) => (
              <div
                key={label}
                className="bg-indigo-600/20 border border-indigo-500/40 rounded-lg p-2 flex flex-col items-center gap-1 cursor-pointer"
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                <span className="text-white font-semibold">{label}</span>
                <span className="text-slate-400">{hint}</span>
              </div>
            ))}
          </div>
          <div className="bg-slate-900/60 rounded-lg p-2 space-y-1.5">
            <div className="text-slate-400">Descripción del problema</div>
            <div className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300">
              Puerta de acceso dañada, no cierra…
            </div>
            <div className="text-slate-400">Ubicación</div>
            <div className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300">
              Torre Norte · Estacionamiento (Nivel -1)
            </div>
          </div>
          <div className="h-8 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center gap-1.5 text-slate-500">
            <ImagePlus className="w-3 h-3" />
            <span>Foto del problema</span>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-1.5 font-semibold transition-colors">
            Crear solicitud
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MOCKUP 6: Seguimiento + Aprobación (Cliente) ─────────── */
function MockSeguimientoCliente() {
  const steps = [
    { label: "Solicitud creada", time: "Hoy, 09:10", done: true },
    { label: "Asignada por VERTIA", time: "Hoy, 10:02", done: true },
    { label: "En ejecución (Proveedor)", time: "Hoy, 11:30", done: true },
    { label: "Evidencia cargada", time: "Hoy, 16:18", done: true },
    { label: "En revisión (VERTIA)", time: "", done: false },
  ];
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700/60 overflow-hidden text-[10px] shadow-xl">
      <div className="flex">
        <MockSidebar active="Solicitudes" />
        <div className="flex-1 p-3 space-y-2">
          <span className="font-bold text-white text-[11px]">Seguimiento del avance</span>
          <div className="space-y-1">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${s.done ? "text-emerald-400" : "text-slate-600"}`}
                />
                <span className={s.done ? "text-slate-200" : "text-slate-500"}>{s.label}</span>
                {s.time && <span className="text-slate-500 ml-auto">{s.time}</span>}
              </div>
            ))}
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 mt-1">
            <div className="font-semibold text-emerald-400 mb-1">Aprobación de cierre</div>
            <div className="text-slate-400 mb-2">¿El trabajo o la entrega cumple con lo solicitado?</div>
            <div className="flex gap-2">
              <button className="flex-1 bg-emerald-600 text-white rounded py-1 font-semibold">
                ✓ Aprobar cierre
              </button>
              <button className="flex-1 bg-slate-700 text-slate-300 rounded py-1 font-semibold">
                ✕ Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Environment Card ──────────────────────────────────────── */
function EnvCard({
  color,
  badge,
  badgeColor,
  icon: Icon,
  title,
  subtitle,
  description,
  features,
  mockup,
}: {
  color: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  features: { icon: React.ElementType; label: string }[];
  mockup: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border ${color} bg-slate-900/70 flex flex-col overflow-hidden`}
    >
      {/* header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl ${badgeColor} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badgeColor.replace("bg-", "bg-").replace("600", "500/15")} border-current`}
            style={{ color: "inherit" }}
          >
            {badge}
          </span>
        </div>
        <h3 className="text-base font-extrabold text-white leading-tight">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{description}</p>
      </div>

      {/* mockups */}
      <div className="px-4 pb-4 space-y-3 flex-1">{mockup}</div>

      {/* features footer */}
      <div className="border-t border-slate-800 px-4 py-3 grid grid-cols-2 gap-2">
        {features.map(({ icon: FIcon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <FIcon className="w-3 h-3 text-slate-500 shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Workflow Step ─────────────────────────────────────────── */
function FlowStep({
  num,
  actor,
  actorColor,
  desc,
  isLast,
}: {
  num: number;
  actor: string;
  actorColor: string;
  desc: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 flex-1 min-w-0">
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${actorColor}`}
        >
          {num}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-slate-700 mt-1 min-h-[12px]" />
        )}
      </div>
      <div className="pb-4 min-w-0">
        <div className={`text-[11px] font-bold ${actorColor.replace("bg-", "text-")}`}>
          {actor}
        </div>
        <div className="text-[10px] text-slate-400 leading-snug mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">

      {/* ── HEADER ── */}
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-extrabold text-white shadow-lg shadow-indigo-500/20 text-base">
            V
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">VERTIA</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="#entornos" className="hover:text-white transition-colors">Entornos</a>
          <a href="#flujo" className="hover:text-white transition-colors">Flujo</a>
          <a href="#acceso" className="hover:text-white transition-colors">Acceso</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white text-sm h-9">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-9 shadow-md shadow-indigo-600/30">
              Ir a la plataforma <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-medium text-indigo-300 mb-6">
          <Star className="w-3.5 h-3.5" />
          <span>Plataforma operativa para construcciones, proyectos e inmuebles</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Un solo sistema,{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
            tres entornos coordinados
          </span>
        </h1>
        <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Gestiona solicitudes, trabajos, evidencias y cierres con trazabilidad completa entre{" "}
          <strong className="text-slate-300">Operador</strong>,{" "}
          <strong className="text-slate-300">Contratista / Proveedor</strong> y{" "}
          <strong className="text-slate-300">Cliente</strong>.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-7 h-11 shadow-lg shadow-indigo-600/25"
            >
              Explorar la plataforma <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-sm h-11 px-6"
            >
              Registrar empresa
            </Button>
          </Link>
        </div>
      </section>

      {/* ── TRES ENTORNOS ── */}
      <section id="entornos" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <Badge className="bg-slate-800 text-slate-300 border-slate-700 mb-3">Tres entornos del sistema</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            VERTIA — Tres entornos del sistema
          </h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm">
            Plataforma integral que conecta clientes, contratistas y proveedores para gestionar
            solicitudes, ejecución, evidencias y cierre de trabajos o entregas, con control total de VERTIA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Entorno 1: VERTIA Operador ── */}
          <EnvCard
            color="border-indigo-500/30"
            badge="Control interno"
            badgeColor="bg-indigo-600"
            icon={ShieldCheck}
            title="Entorno VERTIA (Operador)"
            subtitle="Control y operación central del sistema"
            description="VERTIA monitorea todas las solicitudes y entregas, gestiona su asignación, envía notificaciones, valida evidencias y autoriza o cierra las operaciones."
            mockup={
              <div className="space-y-3">
                <MockCentroOperaciones />
                <MockValidacionEvidencias />
              </div>
            }
            features={[
              { icon: Eye, label: "Monitoreo total de trabajos y entregas" },
              { icon: Bell, label: "Envío de notificaciones" },
              { icon: FileCheck2, label: "Validación de evidencias" },
              { icon: ShieldCheck, label: "Autorizaciones y control de cierre" },
            ]}
          />

          {/* ── Entorno 2: Contratista / Proveedor ── */}
          <EnvCard
            color="border-emerald-500/30"
            badge="Ejecución"
            badgeColor="bg-emerald-600"
            icon={HardHat}
            title="Entorno Contratista / Proveedor"
            subtitle="Ejecución de trabajos o entrega de materiales"
            description="Recibe solicitudes de mantenimiento o de suministro de materiales (según el caso), cotiza, acepta, ejecuta, sube evidencias, actualiza el estado y gestiona su documentación."
            mockup={
              <div className="space-y-3">
                <MockSolicitudesRecibidas />
                <MockDetalleTrabajo />
              </div>
            }
            features={[
              { icon: ClipboardList, label: "Recibe solicitudes de mantenimiento o materiales" },
              { icon: Wrench, label: "Gestiona ejecución, estado y calendario" },
              { icon: Upload, label: "Sube evidencias y documentación" },
              { icon: Truck, label: "Seguimiento de entregas" },
            ]}
          />

          {/* ── Entorno 3: Cliente ── */}
          <EnvCard
            color="border-sky-500/30"
            badge="Solicitante"
            badgeColor="bg-sky-600"
            icon={Users}
            title="Entorno Cliente"
            subtitle="Solicita, da seguimiento y aprueba el cierre"
            description="Crea solicitudes (mantenimiento o materiales), sube fotos del problema inicial, da seguimiento al avance, compara evidencias (cliente vs. proveedor), aprueba o rechaza el cierre y consulta el historial."
            mockup={
              <div className="space-y-3">
                <MockNuevaSolicitud />
                <MockSeguimientoCliente />
              </div>
            }
            features={[
              { icon: ImagePlus, label: "Sube fotos del problema y del resultado final" },
              { icon: ArrowLeftRight, label: "Compara evidencias (cliente vs. proveedor)" },
              { icon: CheckCircle2, label: "Da seguimiento y aprueba" },
              { icon: Layers, label: "Historial con trazabilidad completa" },
            ]}
          />
        </div>
      </section>

      {/* ── FLUJO ── */}
      <section id="flujo" className="bg-slate-900/60 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <Badge className="bg-slate-800 text-slate-300 border-slate-700 mb-3">Proceso de punta a punta</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Flujo de una solicitud en el sistema
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              Así viaja una solicitud a través de los tres entornos, desde su creación hasta el cierre.
            </p>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-7 gap-4 items-start">
            {[
              {
                num: 1, actor: "Cliente", color: "bg-sky-600", desc: "Crea la solicitud y sube fotos del problema",
              },
              null, // arrow
              {
                num: 2, actor: "VERTIA", color: "bg-indigo-600", desc: "Valida, acepta, verifica la información y la asigna",
              },
              null,
              {
                num: 3, actor: "Contratista / Proveedor", color: "bg-emerald-600", desc: "Recibe, cotiza y ejecuta el trabajo o prepara la entrega",
              },
              null,
              {
                num: 4, actor: "Ambas partes", color: "bg-amber-600", desc: "Suben evidencias del resultado (proveedor y cliente)",
              },
            ].map((step, i) =>
              step === null ? (
                <div key={i} className="flex items-center justify-center pt-3.5">
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </div>
              ) : (
                <div key={i} className="text-center">
                  <div
                    className={`w-9 h-9 rounded-full ${step.color} text-white font-bold text-sm flex items-center justify-center mx-auto mb-2`}
                  >
                    {step.num}
                  </div>
                  <div className="text-xs font-bold text-white">{step.actor}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{step.desc}</div>
                </div>
              )
            )}
          </div>

          <div className="hidden md:grid grid-cols-7 gap-4 items-start mt-6">
            {[
              null,
              null,
              null,
              null,
              {
                num: 5, actor: "VERTIA", color: "bg-indigo-600", desc: "Verifica y valida la evidencia, autoriza el cierre",
              },
              null,
              {
                num: 6, actor: "Cliente", color: "bg-sky-600", desc: "Aprueba el cierre de la solicitud",
              },
            ].map((step, i) =>
              step === null ? (
                <div key={i} />
              ) : (
                <div key={i} className="text-center">
                  <div
                    className={`w-9 h-9 rounded-full ${step.color} text-white font-bold text-sm flex items-center justify-center mx-auto mb-2`}
                  >
                    {step.num}
                  </div>
                  <div className="text-xs font-bold text-white">{step.actor}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{step.desc}</div>
                </div>
              )
            )}
          </div>

          {/* Mobile stacked */}
          <div className="md:hidden space-y-0">
            {[
              { num: 1, actor: "Cliente", color: "bg-sky-600", desc: "Crea la solicitud y sube fotos del problema" },
              { num: 2, actor: "VERTIA", color: "bg-indigo-600", desc: "Valida, acepta, verifica la información y la asigna" },
              { num: 3, actor: "Contratista / Proveedor", color: "bg-emerald-600", desc: "Recibe, cotiza y ejecuta el trabajo o prepara la entrega" },
              { num: 4, actor: "Ambas partes", color: "bg-amber-600", desc: "Suben evidencias del resultado (proveedor y cliente)" },
              { num: 5, actor: "VERTIA", color: "bg-indigo-600", desc: "Verifica y valida la evidencia, autoriza el cierre" },
              { num: 6, actor: "Cliente", color: "bg-sky-600", desc: "Aprueba el cierre de la solicitud" },
            ].map((s, i, arr) => (
              <FlowStep
                key={i}
                num={s.num}
                actor={s.actor}
                actorColor={s.color}
                desc={s.desc}
                isLast={i === arr.length - 1}
              />
            ))}
          </div>

          {/* Resultado */}
          <div className="mt-10 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <CheckCircle2 className="w-8 h-8 text-indigo-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Resultado</div>
              <div className="text-slate-400 text-xs mt-0.5">
                Trabajo o entrega completada con trazabilidad, evidencias y registro en el historial.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACCESO RÁPIDO ── */}
      <section id="acceso" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Acceso por entorno</h2>
          <p className="text-slate-400 mt-2 text-sm">Iniciá sesión según tu rol en la plataforma.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: ShieldCheck,
              title: "VERTIA (Operador)",
              desc: "Centro de operaciones, validaciones, incidencias y cierre de trabajos.",
              color: "from-indigo-600 to-violet-600",
              border: "border-indigo-500/30",
              href: "/dashboard",
            },
            {
              icon: HardHat,
              title: "Contratista / Proveedor",
              desc: "Solicitudes recibidas, cotizaciones, ejecución y evidencias.",
              color: "from-emerald-600 to-teal-600",
              border: "border-emerald-500/30",
              href: "/dashboard",
            },
            {
              icon: UserCheck,
              title: "Cliente",
              desc: "Crear solicitudes, seguimiento, comparar evidencias y aprobar cierres.",
              color: "from-sky-600 to-blue-600",
              border: "border-sky-500/30",
              href: "/dashboard",
            },
          ].map(({ icon: Icon, title, desc, color, border, href }) => (
            <Link
              key={title}
              href={href}
              className={`group rounded-2xl border ${border} bg-slate-900/70 p-6 flex flex-col gap-4 hover:bg-slate-800/80 transition-colors`}
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${color} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">{title}</div>
                <div className="text-slate-400 text-xs mt-1 leading-relaxed">{desc}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-indigo-400 group-hover:gap-2 transition-all">
                <span>Ingresar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-[9px] font-bold text-white">
            V
          </div>
          <span className="font-bold text-slate-400">VERTIA</span>
        </div>
        <p>Plataforma operativa para construcciones, proyectos e inmuebles · 2026</p>
        <p className="mt-1 text-slate-600">Los nombres son provisionales y pueden ser refinados por branding/copywriting.</p>
      </footer>
    </div>
  );
}
