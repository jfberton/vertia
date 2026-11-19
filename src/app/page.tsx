"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquareOff,
  Warehouse,
  Truck,
  HardHat,
  Users,
  ShieldCheck,
  FileText,
  Camera,
  Check,
  DollarSign,
  Layers,
  Boxes,
  FileCheck2,
  Star,
  Sparkles,
  Clock,
  ArrowLeftRight,
  ChevronRight,
  Lock,
  QrCode,
  PackageCheck,
  Building2,
  Gift,
  ShieldAlert,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [entornoActivo, setEntornoActivo] = useState<"cliente" | "proveedor" | "vertia">("cliente");
  const [pasoFlujoActivo, setPasoFlujoActivo] = useState<number>(1);

  // 6 Pasos del Flujo de una Solicitud
  const pasosFlujo = [
    {
      paso: 1,
      actor: "Cliente / Obra",
      color: "from-sky-500 to-blue-600",
      border: "border-sky-500/40",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
      titulo: "1. Crea la solicitud para su obra",
      descripcion: "Selecciona una de sus obras registradas, define materiales de corralón u oficios matriculados (electricidad, plomería) y adjunta fotos del requerimiento.",
      evidencia: "Requerimiento registrado con geolocalización y obra asociada",
      estadoPill: "Solicitud Ingresada",
    },
    {
      paso: 2,
      actor: "VERTIA (Operador)",
      color: "from-indigo-500 to-violet-600",
      border: "border-indigo-500/40",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      titulo: "2. Ruteo inteligente y cotización",
      descripcion: "La plataforma evalúa la disponibilidad de stock en corralones cercanos o profesionales matriculados disponibles, calculando flete exacto y tiempos.",
      evidencia: "Cotización formal consolidada: materiales + logística cerrada",
      estadoPill: "En Cotización / Ruteo",
    },
    {
      paso: 3,
      actor: "Cliente & Escrow",
      color: "from-amber-500 to-orange-600",
      border: "border-amber-500/40",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      titulo: "3. Presupuesto confirmado y garantía Escrow",
      descripcion: "El cliente aprueba el presupuesto de precio cerrado. Los fondos se retienen en una cuenta escrow protegida, garantizando el cobro al proveedor.",
      evidencia: "Fondos en custodia garantizados. Sin riesgos de impago",
      estadoPill: "Presupuesto Aprobado · Custodia Activa",
    },
    {
      paso: 4,
      actor: "Corralón (InvenTrack)",
      color: "from-emerald-500 to-teal-600",
      border: "border-emerald-500/40",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      titulo: "4. Picking WMS y Remito Oficial R-091",
      descripcion: "El corralón prepara la carga con recolección guiada por coordenadas (Pasillo/Rack/Nivel), emite el remito legal con QR y lo traslada a la Zona de Embarque.",
      evidencia: "Formulario oficial argentino R-091 con QR y patente de camión",
      estadoPill: "Carga Pickeada · Remito Emitido",
    },
    {
      paso: 5,
      actor: "Proveedor / Chofer",
      color: "from-purple-500 to-indigo-600",
      border: "border-purple-500/40",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      titulo: "5. Despacho y entrega en pie de obra",
      descripcion: "El flete entrega en el destino. El receptor firma el remito y el chofer sube la foto de la constancia directamente desde su celular comprimida a WebP.",
      evidencia: "Fotografía del remito firmado con compresión del 90% (<300 KB)",
      estadoPill: "Entregado · Evidencia Cargada",
    },
    {
      paso: 6,
      actor: "Cliente & VERTIA",
      color: "from-emerald-500 to-cyan-600",
      border: "border-emerald-500/40",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      titulo: "6. Conformidad y liberación de fondos",
      descripcion: "El cliente valida el estado de la entrega en su panel. Al confirmar su conformidad, el sistema libera automáticamente la liquidación al proveedor.",
      evidencia: "Ciclo cerrado con trazabilidad forense, fotos y balance contable",
      estadoPill: "Finalizado con Conformidad · Pago Liberado",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Glows y Luces de Fondo (Animación ambiental) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-sky-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[1800px] left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-3xl pointer-events-none -z-10" />

      {/* ── HEADER DE NAVEGACIÓN ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center font-extrabold text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              V
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                VERTIA
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-medium uppercase -mt-1">
                Ecosistema B2B
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800 text-xs font-semibold text-slate-400">
            <a href="#problema" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-slate-800/60 transition-colors">
              Los Dolores
            </a>
            <a href="#entornos" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-slate-800/60 transition-colors">
              Los 3 Entornos
            </a>
            <a href="#flujo" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-slate-800/60 transition-colors">
              Flujo de Solicitud
            </a>
            <a href="#acceso" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-slate-800/60 transition-colors">
              Simulador 1-Click
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-900 text-xs h-9 px-4">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-9 px-4 shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50">
                Entrar a la Plataforma <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-20 text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Evolución SaaS de InvenTrack para la Cadena de la Construcción</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-slate-400 font-normal">v2.0 Multi-Tenant</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
          Menos fricción en la obra,{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
            control total en el corralón
          </span>{" "}
          y pagos asegurados.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Plataforma B2B que sincroniza en tiempo real a <strong className="text-white">Constructoras</strong>,{" "}
          <strong className="text-white">Corralones de Materiales</strong> y la{" "}
          <strong className="text-white">Mesa de Operaciones de Vertia</strong>. Sin cuadrillas paradas esperando camiones que no llegan, sin sobreventas de stock y con custodia de pagos.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="#entornos">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-8 h-12 rounded-xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Conocer los 3 Entornos <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm h-12 px-7 rounded-xl transition-all hover:border-slate-700"
            >
              Demo Rápida (7 Perfiles) <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Métricas destacadas en vivo */}
        <div className="mt-14 pt-8 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl font-black text-rose-400">0 hs</div>
            <div className="text-xs text-slate-400 mt-0.5">Cuadrillas paradas: despachos en ventana horaria</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl font-black text-indigo-400">R-091</div>
            <div className="text-xs text-slate-400 mt-0.5">Remitos legales con QR y firma digital</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl font-black text-emerald-400">&gt;90%</div>
            <div className="text-xs text-slate-400 mt-0.5">Ahorro de datos: fotos comprimidas a WebP</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl font-black text-purple-400">Escrow</div>
            <div className="text-xs text-slate-400 mt-0.5">Retención de fondos hasta la conformidad</div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 1: EL PROBLEMA / LOS DOLORES QUE RESUELVE ── */}
      <section id="problema" className="py-20 bg-slate-900/40 border-t border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-xs font-semibold mb-3">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Diagnóstico de la Industria
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Los 4 dolores críticos que frenan y encarecen las obras
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
              La falta de herramientas coordinadas entre la obra y el depósito provoca pérdidas millonarias en fletes vacíos, disputas por remitos borrosos y demoras que paralizan frentes de trabajo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dolor 1 - DESTACADO: Cuadrillas Paradas por Entregas Incumplidas */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-rose-500/40 hover:border-rose-500/70 shadow-lg shadow-rose-950/20 transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider">
                Costo Crítico
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Entregas Incumplidas & Obreros Parados</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  El corralón promete el material para las 8:00 AM y no llega. Tener a <strong className="text-slate-200">10 o 15 obreros parados sin poder trabajar</strong> representa una sangría de dinero directo en jornales que el contratista debe pagar igual.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-rose-400 font-semibold">
                <XCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>Impacto: Pérdida económica de horas/hombre no productivas</span>
              </div>
            </div>

            {/* Dolor 2 - Stock Fantasma */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-950/60 hover:border-amber-500/30 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Boxes className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Stock Fantasma & Sobreventas</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  El corralón confirma el pedido mirando el stock total de estantería, sin descontar lo que ya comprometió para otros clientes. Cuando el flete llega a cargar, el material ya no está.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-amber-400/90 font-medium">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Impacto: Camiones vacíos y reprogramaciones de obra</span>
              </div>
            </div>

            {/* Dolor 3 - Caos por WhatsApp */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-950/60 hover:border-indigo-500/30 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <MessageSquareOff className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Descoordinación por WhatsApp</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Requerimientos pasados por audios de chat, mensajes que se pierden entre fotos personales y falta de un documento formal de cotización antes del despacho a obra.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-indigo-400/90 font-medium">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Impacto: Errores en pedidos y discusiones de precios</span>
              </div>
            </div>

            {/* Dolor 4 - Pagos a Ciegas & Remitos Perdidos */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-950/60 hover:border-purple-500/30 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Pagos a Ciegas & Remitos Rotos</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Constructoras que pagan por adelantado sin certeza de entrega, corralones con riesgo de impago y remitos de papel manchados que nadie puede auditar contablemente.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-purple-400/90 font-medium">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Impacto: Disputas comerciales y falta de respaldo legal</span>
              </div>
            </div>
          </div>

          {/* Banner de Contraste Solución */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">La Solución: Una plataforma única, tres entornos conectados</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  VERTIA digitaliza cada interacción: desde el pedido del arquitecto hasta el picking en el rack, el flete con remito digital y la liberación del pago tras la conformidad.
                </p>
              </div>
            </div>
            <a href="#entornos" className="shrink-0">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 h-10 rounded-xl shadow-lg shadow-indigo-600/30">
                Ver los 3 Entornos <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 2: LAS SOLUCIONES — LOS 3 ENTORNOS COORDINADOS ── */}
      <section id="entornos" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5 mr-1" /> Arquitectura del Sistema
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tres aplicaciones diseñadas a medida para cada actor
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
            Cada usuario ingresa a un entorno optimizado para su trabajo diario, con permisos estrictos de acceso (RBAC) y sin interferencia en la gestión interna de los demás.
          </p>
        </div>

        {/* Selector Interactivo de Entornos (Tabs Espaciosas) */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl mx-auto mb-12">
          <button
            onClick={() => setEntornoActivo("cliente")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              entornoActivo === "cliente"
                ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. App del Cliente</span>
          </button>

          <button
            onClick={() => setEntornoActivo("proveedor")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              entornoActivo === "proveedor"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>2. App del Corralón</span>
          </button>

          <button
            onClick={() => setEntornoActivo("vertia")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              entornoActivo === "vertia"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. App de VERTIA</span>
          </button>
        </div>

        {/* Tarjeta de Exhibición Espaciosa (Showcase Studio) */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* TAB 1: CLIENTE */}
          {entornoActivo === "cliente" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-semibold">
                  <HardHat className="w-3.5 h-3.5" /> Constructora, Estudio o Desarrollador
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Portal del Cliente: Obras, Cotizaciones Firmes y Red de Oficios
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Permite a arquitectos y directores de obra solicitar materiales con precios congelados y flete incluido, contratar oficios matriculados y verificar entregas antes de autorizar pagos.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Gestión de Obras en Paralelo</span>
                      <span className="text-slate-400 text-xs">Asigna cada pedido a una obra concreta con dirección, responsable y teléfono de recepción.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Cero Horas Perdidas: Ventanas Horarias de Entrega</span>
                      <span className="text-slate-400 text-xs">El material llega en el horario comprometido. Tu cuadrilla no pierde jornadas laborales parada esperando camiones.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Presupuesto Confirmado con Flete Cerrado</span>
                      <span className="text-slate-400 text-xs">Sin costos sorpresa. El valor cotizado por VERTIA se respeta al 100%.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Garantía Escrow en Oficios y Gremios</span>
                      <span className="text-slate-400 text-xs">El pago de mano de obra queda en custodia hasta que el cliente firma la conformidad del trabajo.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Link href="/cliente">
                    <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-sky-600/30">
                      Explorar Portal del Cliente <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                  <span className="text-[11px] text-slate-500">Módulo autónomo para obras</span>
                </div>
              </div>

              {/* Preview Visual Espacioso */}
              <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    <span className="text-xs font-mono text-slate-400 ml-2">vertia.com/cliente</span>
                  </div>
                  <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30 text-[10px]">
                    Perfil: Constructora Arcos S.A.
                  </Badge>
                </div>

                {/* Tarjetas simuladas espaciosas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-slate-400 text-[11px] font-semibold">Obra Activa</div>
                    <div className="text-base font-bold text-white">Torre Norte · Piso 3</div>
                    <div className="text-slate-400 text-[11px]">Bv. Oroño 1420 · Rosario</div>
                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-semibold">Pedido VT-1048 en camino</span>
                      <span className="text-slate-500">Chofer: C. Méndez</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-slate-400 text-[11px] font-semibold">Oficio con Custodia Escrow</div>
                    <div className="text-base font-bold text-white">Electricista Matriculado</div>
                    <div className="text-slate-400 text-[11px]">Roberto Varela (MAT-9842)</div>
                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-semibold">$150.000 en Custodia</span>
                      <span className="text-slate-500">Pend. Conformidad</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Solicitud #VT-1049 · Presupuesto Confirmado</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                      Precio Congelado
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400 grid grid-cols-3 gap-2">
                    <div>120x Cemento Loma Negra</div>
                    <div>30x Hierro Nervado 12mm</div>
                    <div className="text-right text-slate-300 font-bold">Total: $285.000 USD</div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Flete bonificado por volumen</span>
                    <button className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-lg">
                      Aprobar y Despachar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROVEEDOR / CORRALÓN */}
          {entornoActivo === "proveedor" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  <Warehouse className="w-3.5 h-3.5" /> Corralón de Materiales & Centro de Distribución
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  InvenTrack v2: WMS de Depósito, Matriz 2D y Dual Stock
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  El sistema operativo interno y privado del corralón. El personal organiza su galpón físico por pasillos, controla el stock real vs disponible, pickea pedidos y emite remitos oficiales R-091 con QR.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Invariante de Dual Stock</span>
                      <span className="text-slate-400 text-xs font-mono">Stock Disponible = Stock Real - Stock Comprometido. Nunca sobrevende material reservado.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Matriz 2D & Zona de Embarque (Staging)</span>
                      <span className="text-slate-400 text-xs">Ubicaciones exactas (P1-R02-E3-N2) y pulmón de salida donde la mercadería pickeada espera al camión.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Cupo Comercial & Privacidad Absoluta</span>
                      <span className="text-slate-400 text-xs">El corralón decide qué publica en la Red B2B. Los operadores de Vertia no pueden alterar su stock interno.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Link href="/productos">
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-emerald-600/30">
                      Entrar a InvenTrack <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                  <span className="text-[11px] text-slate-500">Módulo exclusivo para corralones</span>
                </div>
              </div>

              {/* Preview Visual WMS Espacioso */}
              <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    <span className="text-xs font-mono text-slate-400 ml-2">inventrack.vertia.com/almacenes</span>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                    Tenant: Corralón Los Pinos
                  </Badge>
                </div>

                {/* Matriz 2D simulada y métricas */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-semibold">Stock Físico Real</div>
                    <div className="text-xl font-extrabold text-white mt-1">120 un</div>
                    <div className="text-[10px] text-slate-500">En estanterías</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-semibold">Stock Comprometido</div>
                    <div className="text-xl font-extrabold text-amber-400 mt-1">60 un</div>
                    <div className="text-[10px] text-amber-500/80">Reservado en órdenes</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-semibold">Stock Disponible</div>
                    <div className="text-xl font-extrabold text-emerald-400 mt-1">60 un</div>
                    <div className="text-[10px] text-emerald-500/80">Libre para venta</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                      Remito Oficial R-091 · Folio VT-1048
                    </span>
                    <span className="text-emerald-400 text-[11px] font-semibold">En Muelle de Expedición</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Chofer: Carlos Méndez • Camión: Mercedes Benz 710 • Patente: AF 892 XQ
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500 font-mono">P1-R02-E3-N2</span>
                    <button className="bg-indigo-600 text-white font-bold px-3 py-1 rounded-lg">
                      Imprimir Remito PDF A4
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OPERADOR VERTIA */}
          {entornoActivo === "vertia" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Equipo Operativo & Dirección de VERTIA
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Mesa de Operaciones Central: Red B2B, Licencias y Custodia
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  La consola para los operadores de Vertia (Humberto y Federico). Monitorea el balance de stock de la red, habilita corralones, asigna órdenes por cercanía y audita evidencias fotográficas.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Gobierno Comercial de la Red</span>
                      <span className="text-slate-400 text-xs">Habilita o inhabilita el acceso a InvenTrack para corralones clientes, otorga bonificaciones y gestiona planes.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Auditoría sin Injerencia Física</span>
                      <span className="text-slate-400 text-xs">Visibilidad 360° en solo lectura del stock publicado, sin poder alterar estanterías ni stock de los corralones.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Contabilidad Simple (MRR)</span>
                      <span className="text-slate-400 text-xs">Sumas de planes plenos, restas de bonificaciones por convenio y cobro neto recurrente.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Link href="/meta-admin">
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-indigo-600/30">
                      Entrar a Consola Vertia <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                  <span className="text-[11px] text-slate-500">Exclusivo para la dirección</span>
                </div>
              </div>

              {/* Preview Visual Operador Espacioso */}
              <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    <span className="text-xs font-mono text-slate-400 ml-2">vertia.com/meta-admin</span>
                  </div>
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-[10px]">
                    Operadores: Humberto & Federico
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[11px] font-semibold">Empresas en la Red</div>
                    <div className="text-2xl font-black text-white mt-1">4 Registradas</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">3 Corralones • 1 Constructora</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[11px] font-semibold">Cobranza Recurrente (MRR)</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">$406.20 USD</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Base $517 - Bonificaciones $110.80</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Corralón Los Pinos S.R.L.</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                      InvenTrack Habilitado
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Plan Mono-Almacén • Al día</span>
                    <span className="text-amber-400 font-semibold">Sin Bonificación (Tarifa Plena $49 USD)</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button className="bg-slate-800 text-slate-300 text-[11px] px-3 py-1 rounded-lg">
                      Otorgar Bonificación
                    </button>
                    <button className="bg-rose-500/20 text-rose-400 text-[11px] px-3 py-1 rounded-lg">
                      Inhabilitar WMS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECCIÓN 3: FLUJO COMPLETO DE UNA SOLICITUD EN EL SISTEMA ── */}
      <section id="flujo" className="py-24 bg-slate-900/40 border-t border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-semibold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> De Punta a Punta
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Flujo de una solicitud a través de los 3 entornos
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
              Descubrí cómo viaja un requerimiento desde que la obra detecta la necesidad hasta que el chofer descarga el material y se libera el pago protegido.
            </p>
          </div>

          {/* Stepper Interactivo: Barra de 6 Pasos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {pasosFlujo.map((p) => {
              const esActivo = pasoFlujoActivo === p.paso;
              return (
                <button
                  key={p.paso}
                  onClick={() => setPasoFlujoActivo(p.paso)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    esActivo
                      ? "border-indigo-500 bg-slate-900 ring-2 ring-indigo-500/30 shadow-xl"
                      : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        esActivo ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {p.paso}
                    </span>
                    <Badge className={`text-[9px] font-bold px-1.5 py-0.2 ${p.badgeColor}`}>
                      {p.actor}
                    </Badge>
                  </div>
                  <div>
                    <div className={`text-xs font-bold leading-tight ${esActivo ? "text-white" : "text-slate-300"}`}>
                      Paso {p.paso}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {p.titulo.split(". ")[1]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detalle Ampliado del Paso Seleccionado */}
          {(() => {
            const actual = pasosFlujo.find((p) => p.paso === pasoFlujoActivo) || pasosFlujo[0];
            return (
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800/90 shadow-2xl relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
                        {actual.paso}
                      </span>
                      <div>
                        <Badge className={`text-xs font-bold ${actual.badgeColor}`}>
                          Responsable: {actual.actor}
                        </Badge>
                        <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                          {actual.titulo}
                        </h3>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                      {actual.descripcion}
                    </p>

                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-white block">Trazabilidad en este paso:</span>
                        <span className="text-slate-400">{actual.evidencia}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-3">
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Estado en la Plataforma
                      </span>
                      <div className="py-2 px-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
                        {actual.estadoPill}
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>Paso {actual.paso} de 6</span>
                        <button
                          onClick={() => setPasoFlujoActivo(actual.paso < 6 ? actual.paso + 1 : 1)}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                        >
                          <span>{actual.paso < 6 ? "Siguiente paso" : "Reiniciar flujo"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── SECCIÓN 4: ACCESO RÁPIDO & SIMULADOR 1-CLICK ── */}
      <section id="acceso" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs font-semibold mb-3">
            Demo Interactiva
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Probalo ahora según tu rol
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
            Hacé click en cualquiera de los tres accesos directos para ingresar a la plataforma y explorar la experiencia con datos cargados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Cliente */}
          <Link
            href="/cliente"
            className="group rounded-3xl border border-sky-500/20 bg-slate-900/60 p-8 flex flex-col justify-between hover:bg-slate-900 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/30 mb-6 group-hover:scale-105 transition-transform">
                <HardHat className="w-6 h-6" />
              </div>
              <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/30 text-[10px] mb-2">
                Rol: Constructora / Obra
              </Badge>
              <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                Entorno Cliente
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Creá solicitudes de materiales para tus obras, revisá presupuestos firmes y contratá electricistas o plomeros con retención escrow.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-sky-400">
              <span>Ingresar como Cliente</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Corralón */}
          <Link
            href="/productos"
            className="group rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-8 flex flex-col justify-between hover:bg-slate-900 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 mb-6 group-hover:scale-105 transition-transform">
                <Warehouse className="w-6 h-6" />
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] mb-2">
                Rol: Corralón de Materiales
              </Badge>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Entorno InvenTrack
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Controlá tu galpón por pasillos y racks 2D, gestioná el stock disponible vs comprometido, pickeá pedidos y generá remitos oficiales con QR.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Ingresar a InvenTrack</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Vertia */}
          <Link
            href="/meta-admin"
            className="group rounded-3xl border border-indigo-500/20 bg-slate-900/60 p-8 flex flex-col justify-between hover:bg-slate-900 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px] mb-2">
                Rol: Operador de Plataforma
              </Badge>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                Entorno VERTIA
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Consola del Meta-Administrador. Asigná pedidos entre empresas de la red, habilitá módulos WMS, gestioná bonificaciones comerciales y cobros.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400">
              <span>Ingresar a Consola Vertia</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── FOOTER CORPORATIVO ── */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
              V
            </div>
            <div>
              <span className="font-bold text-slate-300 block">VERTIA / InvenTrack v2</span>
              <span className="text-[11px] text-slate-500">Plataforma B2B para Construcciones, Corralones y Oficios</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <a href="#problema" className="hover:text-white transition-colors">Dolores</a>
            <a href="#entornos" className="hover:text-white transition-colors">3 Entornos</a>
            <a href="#flujo" className="hover:text-white transition-colors">Flujo de Solicitud</a>
            <Link href="/login" className="hover:text-white transition-colors">Iniciar Sesión</Link>
          </div>

          <div className="text-[11px] text-slate-600">
            © 2026 VERTIA Network. Arquitectura Serverless Multi-Tenant.
          </div>
        </div>
      </footer>
    </div>
  );
}
