"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VertiaLogo } from "@/components/brand/VertiaLogo";

export default function LandingPage() {
  const [entornoActivo, setEntornoActivo] = useState<"cliente" | "proveedor" | "vertia">("cliente");
  const [tipoProveedorActivo, setTipoProveedorActivo] = useState<"materiales" | "servicios">("materiales");
  const [pasoFlujoActivo, setPasoFlujoActivo] = useState<number>(1);

  // 6 Pasos del Flujo de una Solicitud
  const pasosFlujo = [
    {
      paso: 1,
      actor: "Contratista / Obra",
      color: "from-sky-500 to-blue-600",
      border: "border-sky-500/40",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
      titulo: "1. Solicitud de Obra",
      descripcion: "El contratista o arquitecto selecciona su frente de obra geolocalizado, solicita materiales a proveedores o contrata oficios calificados (plomería, electricidad, albañilería) y adjunta fotos del requerimiento.",
      evidencia: "Requerimiento registrado con geolocalización y obra asociada",
      estadoPill: "Solicitud Ingresada",
    },
    {
      paso: 2,
      actor: "VERTIA (Operador)",
      color: "from-indigo-500 to-violet-600",
      border: "border-indigo-500/40",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      titulo: "2. Ruteo & Cotización",
      descripcion: "El operador de VERTIA evalúa el inventario físico real en bodegas y proveedores cercanos, calculando flete exacto y consolidando la cotización oficial de precio cerrado.",
      evidencia: "Cotización formal consolidada: materiales + logística cerrada",
      estadoPill: "En Cotización / Ruteo",
    },
    {
      paso: 3,
      actor: "Contratista & Escrow",
      color: "from-amber-500 to-orange-600",
      border: "border-amber-500/40",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      titulo: "3. Presupuesto & Custodia",
      descripcion: "El contratista aprueba el presupuesto de precio cerrado. Los fondos se retienen en una cuenta escrow protegida por Vertia, garantizando el cobro seguro al proveedor o profesional.",
      evidencia: "Fondos en custodia garantizados. Sin riesgos de impago",
      estadoPill: "Presupuesto Aprobado · Custodia Activa",
    },
    {
      paso: 4,
      actor: "Proveedor de Materiales",
      color: "from-emerald-500 to-teal-600",
      border: "border-emerald-500/40",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      titulo: "4. Surtido & Remisión Digital",
      descripcion: "La bodega de materiales surte la carga con recolección rápida guiada por pasillo, estante y nivel, emite la nota de remisión digital con código QR y la traslada al área de embarque.",
      evidencia: "Nota de remisión digital con código QR y placas del camión",
      estadoPill: "Carga Surtiéndose · Remisión Emitida",
    },
    {
      paso: 5,
      actor: "Proveedor / Chofer",
      color: "from-purple-500 to-indigo-600",
      border: "border-purple-500/40",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      titulo: "5. Entrega & Evidencia",
      descripcion: "El transporte entrega en el pie de obra o el profesional ejecuta el servicio. El residente de obra firma la remisión y se suben las fotos de evidencia comprimidas a WebP.",
      evidencia: "Fotografía de la remisión firmada con compresión del 90% (<300 KB)",
      estadoPill: "Entregado · Evidencia Cargada",
    },
    {
      paso: 6,
      actor: "Contratista & VERTIA",
      color: "from-emerald-500 to-cyan-600",
      border: "border-emerald-500/40",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      titulo: "6. Conformidad & Pago",
      descripcion: "El contratista valida la entrega en su panel. Al confirmar su conformidad, el sistema libera automáticamente la liquidación al proveedor descontando la comisión pactada.",
      evidencia: "Ciclo cerrado con trazabilidad forense, fotos y balance contable",
      estadoPill: "Finalizado con Conformidad · Pago Liberado",
    },
  ];

  return (
    <div className="vertia-landing min-h-screen bg-[#f4f8fd] text-[#112b59] flex flex-col selection:bg-indigo-600 selection:text-white overflow-x-hidden">

      {/* ── HEADER DE NAVEGACIÓN ── */}
      <header className="landing-header sticky top-0 z-50 border-b border-slate-200/90 bg-white/90 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="VERTIA - Inicio">
            <VertiaLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <a href="#problema" className="px-3 py-1.5 rounded-full hover:text-indigo-700 hover:bg-indigo-50 transition-colors">
              Los Dolores
            </a>
            <a href="#entornos" className="px-3 py-1.5 rounded-full hover:text-indigo-700 hover:bg-indigo-50 transition-colors">
              Los 3 Entornos
            </a>
            <a href="#flujo" className="px-3 py-1.5 rounded-full hover:text-indigo-700 hover:bg-indigo-50 transition-colors">
              Flujo de Solicitud
            </a>
            <a href="#modulos" className="px-3 py-1.5 rounded-full hover:text-indigo-700 hover:bg-indigo-50 transition-colors">
              Módulos del Sistema
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 text-xs h-9 px-4">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-9 px-4 shadow-lg shadow-indigo-600/25 transition-all hover:shadow-indigo-600/40">
                Entrar a la Plataforma <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="landing-hero relative overflow-hidden">
        <Image
          src="/images/vertia-construction-site.jpg"
          alt="Obra en construcción con grúas y trabajadores"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
        <div className="landing-hero-overlay absolute inset-0" />
        <div className="landing-hero-accent absolute -right-16 -top-20 h-[140%] w-[36%]" />
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-violet-600/90 text-xs font-semibold text-white mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Evolución SaaS de InvenTrack para la Cadena de la Construcción</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-indigo-100 font-normal">v2.0 Multi-Tenant</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-3xl leading-[1.08]">
          Menos fricción en la obra,{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
            control total en la bodega de materiales
          </span>{" "}
          y pagos asegurados.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-100 max-w-2xl leading-relaxed">
          Plataforma que sincroniza en tiempo real a <strong className="text-white">Constructoras y Contratistas</strong>,{" "}
          <strong className="text-white">Proveedores de Materiales</strong> y{" "}
          <strong className="text-white">Oficios Especializados</strong>. Sin cuadrillas paradas esperando camiones que no llegan, sin sobreventas de inventario y con custodia de pagos.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row gap-4 items-start">
          <Link href="#entornos">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm px-8 h-12 rounded-full shadow-xl shadow-indigo-900/30 transition-all hover:scale-[1.03]"
            >
              Conocer los 3 Entornos <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-white/35 bg-white/10 hover:bg-white/20 text-white text-sm h-12 px-7 rounded-full transition-all hover:border-white/60"
            >
              Iniciar Sesión <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Métricas destacadas en vivo */}
        <div className="mt-14 pt-8 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl text-left">
          <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="text-2xl font-black text-rose-400">0 hrs</div>
            <div className="text-xs text-slate-100 mt-0.5">Cuadrillas paradas: despachos en ventana de entrega</div>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="text-2xl font-black text-indigo-400">Digital</div>
            <div className="text-xs text-slate-100 mt-0.5">Remisiones digitales con código QR y firma</div>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="text-2xl font-black text-emerald-400">&gt;90%</div>
            <div className="text-xs text-slate-100 mt-0.5">Ahorro de datos: fotos de obra comprimidas a WebP</div>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="text-2xl font-black text-purple-400">Escrow</div>
            <div className="text-xs text-slate-100 mt-0.5">Retención de fondos hasta la conformidad de obra</div>
          </div>
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
              La falta de herramientas coordinadas entre la obra y las bodegas de materiales provoca pérdidas millonarias en fletes en falso, disputas por notas de remisión ilegibles y demoras que paralizan frentes de trabajo.
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
                  El proveedor promete el material para las 8:00 AM y no llega. Tener a <strong className="text-slate-200">10 o 15 trabajadores parados sin material</strong> representa una sangría de dinero directo en raya y jornales que el contratista debe absorber igual.
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
                <h3 className="font-bold text-white text-base">Inventario Fantasma & Sobreventas</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  La casa de materiales confirma el pedido mirando el inventario total en patio, sin descontar lo ya apartado para otras obras. Cuando el camión llega a cargar, el material ya no está.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-amber-400/90 font-medium">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Impacto: Camiones vacíos y reprogramaciones de colados</span>
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
                  Requerimientos pasados por notas de voz, mensajes que se pierden entre chats informales y falta de una cotización formal con precio congelado antes del despacho a obra.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-indigo-400/90 font-medium">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Impacto: Errores en pedidos y discusiones de precios</span>
              </div>
            </div>

            {/* Dolor 4 - Pagos a Ciegas & Remisiones Perdidas */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-950/60 hover:border-purple-500/30 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Pagos a Ciegas & Remisiones Perdidas</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Contratistas que pagan por adelantado sin certeza de entrega, proveedores con riesgo de cobranza y remisiones en papel manchadas que nadie puede auditar contablemente.
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
                <h4 className="font-bold text-white text-base">La Solución: Una plataforma única, tres entornos coordinados</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  VERTIA digitaliza cada interacción: desde el pedido del residente de obra hasta el surtido en bodega, el flete con nota de remisión digital y la liberación del pago en custodia tras la conformidad.
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
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl mx-auto mb-12">
          <button
            onClick={() => setEntornoActivo("cliente")}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              entornoActivo === "cliente"
                ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. Contratistas y Obras</span>
          </button>

          <button
            onClick={() => setEntornoActivo("proveedor")}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              entornoActivo === "proveedor"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>2. Proveedores (Materiales y Oficios)</span>
          </button>

          <button
            onClick={() => setEntornoActivo("vertia")}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              entornoActivo === "vertia"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. VERTIA Operador (Gestión y Custodia)</span>
          </button>
        </div>

        {/* Tarjeta de Exhibición Espaciosa (Showcase Studio) */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* TAB 1: CONTRATISTAS Y DIRECTORES DE OBRA */}
          {entornoActivo === "cliente" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-semibold">
                  <HardHat className="w-3.5 h-3.5" /> Contratistas, Arquitectos y Directores de Obra
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Portal de Obra: Pedidos de Materiales, Presupuestos Firmes y Red de Oficios
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Permite a directores de obra, arquitectos y residentes solicitar materiales a bodegas con precios congelados y flete cerrado, contratar técnicos calificados y verificar entregas antes de autorizar pagos.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Gestión de Frentes de Obra en Paralelo</span>
                      <span className="text-slate-400 text-xs">Asigna cada pedido a una obra específica con dirección geolocalizada, residente responsable y teléfono de recepción.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Cero Horas Perdidas: Ventanas Horarias de Entrega</span>
                      <span className="text-slate-400 text-xs">El material llega en el horario comprometido. Tu cuadrilla de trabajadores no pierde jornadas parada esperando camiones.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Presupuesto Confirmado con Flete Cerrado</span>
                      <span className="text-slate-400 text-xs">Sin costos sorpresa. El valor cotizado por VERTIA se respeta al 100% hasta la entrega en pie de obra.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Garantía Escrow en Oficios y Técnicos</span>
                      <span className="text-slate-400 text-xs">El pago de mano de obra queda en custodia hasta que el director de obra firma la conformidad con fotografías del trabajo.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 text-xs text-slate-400 font-medium">
                  Portal diseñado para contratistas generales, residentes y directores de obra.
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
                    Perfil: Constructora Arcos de México S.A. de C.V.
                  </Badge>
                </div>

                {/* Tarjetas simuladas espaciosas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-slate-400 text-[11px] font-semibold">Obra Activa</div>
                    <div className="text-base font-bold text-white">Torre Reforma · Nivel 14</div>
                    <div className="text-slate-400 text-[11px]">Paseo de la Reforma 483 · Cuauhtémoc, CDMX</div>
                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-semibold">Pedido VT-1048 en camino</span>
                      <span className="text-slate-500">Chofer: C. Méndez</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-slate-400 text-[11px] font-semibold">Oficio con Custodia Escrow</div>
                    <div className="text-base font-bold text-white">Técnico Electricista Certificado</div>
                    <div className="text-slate-400 text-[11px]">Ing. Roberto Varela (Cédula STPS-9842)</div>
                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-semibold">$15,000 MXN en Custodia</span>
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
                    <div>120x Cemento Cruz Azul Gris</div>
                    <div>30x Varilla Corrugada 1/2&quot;</div>
                    <div className="text-right text-slate-300 font-bold">Total: $38,500 MXN</div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Flete bonificado por volumen</span>
                    <span className="bg-emerald-600/90 text-white font-bold px-3 py-1 rounded-lg text-xs">
                      Aprobado para Entrega
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROVEEDORES (BODEGAS INVENTRACK VS RED DE PROFESIONALES) */}
          {entornoActivo === "proveedor" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Sub-toggle de Proveedores: Bodegas de Materiales vs Profesionales */}
              <div className="flex items-center justify-center gap-2 p-1 bg-slate-950/80 border border-slate-800 rounded-xl max-w-md mx-auto">
                <button
                  onClick={() => setTipoProveedorActivo("materiales")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    tipoProveedorActivo === "materiales"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Warehouse className="w-3.5 h-3.5" />
                  <span>A. Bodegas de Materiales (InvenTrack)</span>
                </button>
                <button
                  onClick={() => setTipoProveedorActivo("servicios")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    tipoProveedorActivo === "servicios"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>B. Red de Profesionales (Oficios)</span>
                </button>
              </div>

              {/* Sub-vista A: BODEGAS Y CASAS DE MATERIALES (INVENTRACK WMS) */}
              {tipoProveedorActivo === "materiales" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                      <Warehouse className="w-3.5 h-3.5" /> Bodegas, Casas de Materiales y Patios de Distribución
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      InvenTrack WMS: Control logístico de bodegas y abasto para obras
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      El sistema logístico que te permite administrar tus almacenes y bodegas de materiales, despachar tus ventas habituales y abrir un canal digital directo para surtir pedidos a contratistas dentro de la red.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">Ventas de Mostrador + Pedidos de la Red Vertia</span>
                          <span className="text-slate-400 text-xs">Maneja tus clientes locales y surte pedidos de obras cercanas con pago resguardado y sin intermediarios especulativos.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">Control de Inventario Dual (Físico Real vs. Apartado)</span>
                          <span className="text-slate-400 text-xs">Conoce con exactitud qué volumen tienes disponible para venta libre sin comprometer lo ya apartado para una obra.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">Ubicaciones en Bodega y Surtido Guiado</span>
                          <span className="text-slate-400 text-xs">Organiza tu almacén o patio por Pasillo, Estante y Nivel. El operario surte el material siguiendo la ruta más eficiente.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">Área de Embarque & Nota de Remisión Digital con QR</span>
                          <span className="text-slate-400 text-xs">Emisión automática de la nota de remisión digital con QR. Cuando llega el camión, el material ya está en muelle listo para cargar.</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 text-xs text-slate-400 font-medium">
                      Módulo WMS operado por personal de bodega, surtido, inventarios y embarque.
                    </div>
                  </div>

                  {/* Preview Visual Depósito Espacioso */}
                  <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                        <span className="text-xs font-mono text-slate-400 ml-2">inventrack.vertia.com/almacenes</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                        Casa de Materiales El Fresno · Bodega Central
                      </Badge>
                    </div>

                    {/* Métricas de Stock Dual */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[10px] font-semibold">Inventario Físico Real</div>
                        <div className="text-xl font-extrabold text-white mt-1">120 bultos</div>
                        <div className="text-[10px] text-slate-500">En estantes y patio</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[10px] font-semibold">Inventario Apartado</div>
                        <div className="text-xl font-extrabold text-amber-400 mt-1">60 bultos</div>
                        <div className="text-[10px] text-amber-500/80">Vendido para obras</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[10px] font-semibold">Libre Mostrador / Red</div>
                        <div className="text-xl font-extrabold text-emerald-400 mt-1">60 bultos</div>
                        <div className="text-[10px] text-emerald-500/80">Disponible para vender</div>
                      </div>
                    </div>

                    {/* Pulmón de Egreso & Ubicaciones */}
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <PackageCheck className="w-4 h-4 text-emerald-400" />
                          Área de Embarque · Carga Lista para Transporte
                        </span>
                        <span className="text-emerald-400 text-[11px] font-semibold">Salida 08:30 hrs</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Ubicación en almacén: <span className="font-mono text-indigo-300">Pasillo A · Estante 3 · Nivel 2</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Chofer: Carlos Méndez • Camión Rabón Freightliner • Nota de remisión digital con QR
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-500">Destino: Torre Reforma (Paseo de la Reforma 483, CDMX)</span>
                        <span className="text-indigo-400 font-semibold">Listo para carga al transporte</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-vista B: RED DE PROFESIONALES (PORTFOLIO & OFICIOS) */}
              {tipoProveedorActivo === "servicios" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                      <Wrench className="w-3.5 h-3.5" /> Red de Profesionales y Técnicos Calificados
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      Portal del Profesional: Perfil público, portfolio y cobro 100% asegurado
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      El sistema diseñado para plomeros, electricistas, técnicos en gas, albañiles, herreros y carpinteros. Crea tu perfil profesional con credenciales oficiales, área de cobertura geográfica, costo de visita técnica y portfolio fotográfico de trabajos terminados.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">Perfil y Cédula / Certificación Oficial</span>
                          <span className="text-slate-400 text-xs">Publica tus acreditaciones y experiencia técnica para que arquitectos y constructoras te contraten con total respaldo.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">Portfolio Fotográfico de Obras Previas</span>
                          <span className="text-slate-400 text-xs">Sube fotografías de tus trabajos concluidos. La calidad de tu mano de obra es tu mejor carta de presentación.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">Zona de Cobertura y Costo de Visita Claro</span>
                          <span className="text-slate-400 text-xs">Define las zonas o municipios donde operas y tu tarifa base de diagnóstico o mano de obra por jornada.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">Cobro Garantizado (Custodia Escrow)</span>
                          <span className="text-slate-400 text-xs">Cero incertidumbre de cobro. El contratista deposita los fondos en custodia en VERTIA antes de que comiences la labor.</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 text-xs text-slate-400 font-medium">
                      Aplicativo para electricistas, plomeros, herreros y especialistas de obra.
                    </div>
                  </div>

                  {/* Preview Visual Perfil y Portfolio del Profesional */}
                  <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                        <span className="text-xs font-mono text-slate-400 ml-2">vertia.com/profesionales/perfil</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                        Perfil Verificado · 5.0 ★ (48 obras)
                      </Badge>
                    </div>

                    {/* Ficha del Profesional */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-base font-bold text-white">Ing. Javier Morales</div>
                          <div className="text-xs text-emerald-400 font-semibold">Técnico en Instalaciones Hidráulicas & Gas · Cédula STPS-84912</div>
                          <div className="text-[11px] text-slate-400 mt-1">Cobertura: CDMX, Naucalpan, Huixquilucan</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Costo visita técnica:</div>
                          <div className="text-sm font-bold text-white">$850 MXN</div>
                          <div className="text-[10px] text-slate-500">Tarifa jornada: $1,400 MXN</div>
                        </div>
                      </div>

                      {/* Mini Portfolio de Fotos */}
                      <div className="pt-2 border-t border-slate-800">
                        <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-indigo-400" />
                          Portfolio de Trabajos Realizados:
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                            <div className="font-semibold text-white">Instalación equipo hidroneumático</div>
                            <div className="text-slate-400">Torre Polanco · Piso 8 · Prueba de presión OK</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                            <div className="font-semibold text-white">Tendido de cobre y termofusión</div>
                            <div className="text-slate-400">Residencial Insurgentes · 16 departamentos</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Solicitud Asignada en Curso */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">Servicio Asignado: #SRV-1049 (Torre Reforma)</span>
                        <span className="text-slate-400 text-[11px]">Revisión de colector general · $18,500 MXN</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[11px]">
                        Pago en Custodia Escrow
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VERTIA OPERADOR (CENTRO DE MANDO, RUTEO Y CUSTODIA) */}
          {entornoActivo === "vertia" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Centro de Operaciones & Gestor Activo
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  VERTIA Operador: El centro de mando que rutea pedidos, audita evidencias y custodia pagos
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  VERTIA actúa como el gestor y garante central de cada transacción. Su centro de mando monitorea la operación en tiempo real, rutea pedidos hacia los proveedores con inventario físico verificado, audita pericialmente fotos de remisiones y trabajos concluidos, y desbloquea pagos contra conformidad comprobada.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Centro de Operaciones en Tiempo Real</span>
                      <span className="text-slate-400 text-xs">Monitoreo activo de solicitudes, semáforo de despachos en curso, tiempos de viaje de camiones y estado de obras.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Ruteo Logístico Inteligente y Cotización Firme</span>
                      <span className="text-slate-400 text-xs">Analiza qué bodega cercana tiene inventario físico real en sus estantes, calcula flete cerrado y emite la cotización oficial para el contratista.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Auditoría Pericial de Evidencias (Antes / Después)</span>
                      <span className="text-slate-400 text-xs">Compara fotografías del requerimiento contra el resultado entregado, notas de remisión firmadas con código QR y constancias de descarga en obra.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Garantía Escrow y Mediación de Controversias</span>
                      <span className="text-slate-400 text-xs">Retiene fondos en custodia. Si hay faltantes o irregularidades en la obra, frena la liquidación y solicita ajustes; si hay conformidad, libera el pago al proveedor.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 text-xs text-slate-400 font-medium">
                  Consola interna de monitoreo, ruteo y peritaje exclusiva para operadores de VERTIA.
                </div>
              </div>

              {/* Preview Visual Centro de Mando Vertia Operador */}
              <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    <span className="text-xs font-mono text-slate-400 ml-2">interno.vertia.com (Red Operativa Segura)</span>
                  </div>
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-[10px]">
                    Consola Interna de Operaciones
                  </Badge>
                </div>

                {/* Métricas del Operador en Vivo */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Activas</div>
                    <div className="text-lg font-bold text-white">24</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">En viaje</div>
                    <div className="text-lg font-bold text-sky-400">12</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Validación</div>
                    <div className="text-lg font-bold text-amber-400">5</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Cerradas</div>
                    <div className="text-lg font-bold text-emerald-400">67</div>
                  </div>
                </div>

                {/* Panel de Ruteo Inteligente a Bodega */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Mesa de Ruteo · Solicitud #VT-1049</span>
                    <span className="text-emerald-400 font-semibold text-[11px]">Ruteado a 4.2 km</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Proveedor asignado: <strong className="text-white">Casa de Materiales El Fresno</strong> (Inventario verificado 120 bultos)
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Transporte: Rabón Freightliner (Chofer R. González)</span>
                    <span className="text-indigo-400 font-semibold">Presupuesto confirmado $38,500 MXN</span>
                  </div>
                </div>

                {/* Panel Pericial de Evidencias */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-indigo-400" />
                      Validación Pericial de Evidencias (VT-1048)
                    </span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                      98% Coincidencia
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Foto Contratista (Antes):</span>
                      <span className="text-slate-200">Puerta acceso norte desencajada</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Foto Profesional (Después):</span>
                      <span className="text-emerald-300">Herraje nuevo + nivelación + pintura</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                    <span className="text-amber-400 font-semibold">$15,000 MXN en Custodia Escrow</span>
                    <span className="bg-indigo-600/90 text-white font-bold px-3 py-1 rounded-lg text-xs">
                      Liquidación Aprobada
                    </span>
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
              Descubre cómo viaja un requerimiento desde que la obra detecta la necesidad hasta que el chofer entrega el material en pie de obra y se libera el pago protegido.
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
                    <div className="text-[11px] text-slate-400 font-medium leading-snug mt-1">
                      {p.titulo.replace(/^\d+\.\s*/, "")}
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
              <div
                className="p-8 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: "#071b3f", borderColor: "#173867" }}
              >
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

                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl">
                      {actual.descripcion}
                    </p>

                    <div
                      className="p-4 rounded-xl border flex items-center gap-3"
                      style={{ backgroundColor: "#0d2854", borderColor: "#1c457d" }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-white block">Trazabilidad en este paso:</span>
                        <span className="text-slate-200 font-medium">{actual.evidencia}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-3">
                    <div
                      className="p-5 rounded-2xl border text-center space-y-3"
                      style={{ backgroundColor: "#0d2854", borderColor: "#1c457d" }}
                    >
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                        Estado en la Plataforma
                      </span>
                      <div className="py-2.5 px-3 rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 font-bold text-xs">
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

      {/* ── SECCIÓN 4: MÓDULOS DEL SISTEMA ── */}
      <section id="modulos" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs font-semibold mb-3">
            Ecosistema de la Plataforma
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Los 4 Módulos Especializados de VERTIA
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
            Arquitectura integral diseñada para cada participante de la industria de la construcción. El ingreso a cada entorno se realiza de manera segura mediante la ventana oficial de inicio de sesión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Módulo 1: Contratistas, Arquitectos y Directores de Obra */}
          <div className="rounded-3xl border border-sky-500/20 bg-slate-900/60 p-7 flex flex-col justify-between hover:bg-slate-900 hover:border-sky-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/30 mb-5">
                <HardHat className="w-6 h-6" />
              </div>
              <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/30 text-[10px] mb-2.5 font-bold">
                Módulo 1 · Obra & Contratistas
              </Badge>
              <h3 className="text-lg font-bold text-white mb-2">
                Contratistas y Directores de Obra
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Diseñado para directores de obra, arquitectos y constructoras. Permite gestionar frentes de obra geolocalizados, emitir requerimientos de insumos con cotización cerrada, contratar oficios técnicos y validar entregas antes de autorizar liquidaciones.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-medium">
              ✓ Cotizaciones de precio cerrado con flete incluido
            </div>
          </div>

          {/* Módulo 2.A: Bodegas y Proveedores de Materiales (InvenTrack WMS) */}
          <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-7 flex flex-col justify-between hover:bg-slate-900 hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 mb-5">
                <Warehouse className="w-6 h-6" />
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] mb-2.5 font-bold">
                Módulo 2.A · WMS de Bodega
              </Badge>
              <h3 className="text-lg font-bold text-white mb-2">
                Bodegas de Materiales (InvenTrack WMS)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sistema WMS especializado para depósitos, bodegas y casas de materiales. Administra almacenes organizados por pasillos, estantes y niveles, separa inventario físico de lo ya apartado para obras, optimiza el surtido y emite notas de remisión digitales con código QR.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-medium">
              ✓ Control de inventario físico vs. apartado en obra
            </div>
          </div>

          {/* Módulo 2.B: Red de Profesionales y Técnicos Especializados */}
          <div className="rounded-3xl border border-purple-500/20 bg-slate-900/60 p-7 flex flex-col justify-between hover:bg-slate-900 hover:border-purple-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 mb-5">
                <Wrench className="w-6 h-6" />
              </div>
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-[10px] mb-2.5 font-bold">
                Módulo 2.B · Red de Profesionales
              </Badge>
              <h3 className="text-lg font-bold text-white mb-2">
                Red de Profesionales y Técnicos
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aplicación para técnicos electricistas, plomeros, instaladores de gas, tablaroqueros y cuadrillas especializadas. Permite publicar perfil con certificaciones, exhibir portfolio fotográfico, definir costo de visita técnica y cobrar con garantía escrow.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-medium">
              ✓ Portfolio fotográfico y cobro 100% asegurado
            </div>
          </div>

          {/* Módulo 3: Centro de Operaciones VERTIA */}
          <div className="rounded-3xl border border-indigo-500/20 bg-slate-900/60 p-7 flex flex-col justify-between hover:bg-slate-900 hover:border-indigo-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px] mb-2.5 font-bold">
                Módulo 3 · Centro de Mando
              </Badge>
              <h3 className="text-lg font-bold text-white mb-2">
                Centro de Operaciones VERTIA
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consola privada y protegida para operadores y gestores del sistema. Supervisa la red en tiempo real, rutea pedidos hacia bodegas con stock verificado, audita pericialmente evidencias fotográficas (antes vs. después) y custodia los fondos de cada transacción.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-medium">
              🔒 Consola interna · Ruteo, peritaje y custodia escrow
            </div>
          </div>
        </div>

        {/* Acceso Unificado mediante Pantalla de Login */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Acceso Unificado y Restringido por Rol</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Cada usuario ingresa a su respectivo entorno con sus credenciales autorizadas desde la pantalla oficial de inicio de sesión.
              </p>
            </div>
          </div>
          <Link href="/login" className="shrink-0">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]">
              Ir al Inicio de Sesión <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER CORPORATIVO ── */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <VertiaLogo dark className="scale-90 origin-left" />

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
