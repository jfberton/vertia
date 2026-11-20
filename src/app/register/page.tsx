"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Warehouse,
  HardHat,
  Wrench,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  MapPin,
  FileText,
  User,
  Mail,
  Lock,
  DollarSign,
  Award,
  Sparkles,
  Phone,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { VertiaLogo } from "@/components/brand/VertiaLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveStoredProfesional } from "@/lib/services/mock-store";
import { RubroProfesional, ProfesionalServicio } from "@/types/domain";

type TipoPerfilRegistro = "cliente" | "materiales" | "servicios";

const LISTA_RUBROS: RubroProfesional[] = [
  "Electricista",
  "Plomero / Sanitarista",
  "Gasista Matriculado",
  "Albañil / Constructor",
  "Carpintero",
  "Herrero / Cerrajero",
  "Pintor / Terminaciones",
  "Techista",
];

export default function RegisterPage() {
  const router = useRouter();
  const { registerCompany } = useAuth();

  // Selector de Rol: Cliente vs Proveedor (Materiales InvenTrack vs Servicios)
  const [tipoPerfil, setTipoPerfil] = useState<TipoPerfilRegistro>("cliente");

  // Campos Comunes
  const [nombreTitular, setNombreTitular] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [cuitRfc, setCuitRfc] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("Ciudad de México");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Campos Específicos: Proveedor de Materiales (InvenTrack)
  const [radioCoberturaKm, setRadioCoberturaKm] = useState(25);

  // Campos Específicos: Profesional de Oficios / Servicios
  const [rubro, setRubro] = useState<RubroProfesional>("Electricista");
  const [cedulaRegistro, setCedulaRegistro] = useState("");
  const [zonaCobertura, setZonaCobertura] = useState("CDMX y Área Metropolitana");
  const [costoVisita, setCostoVisita] = useState(850);
  const [tarifaHora, setTarifaHora] = useState(650);
  const [descripcionExperiencia, setDescripcionExperiencia] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombreTitular.trim() || !email.trim() || !password.trim()) {
      setError("Por favor completa los campos obligatorios del registro.");
      return;
    }

    if (tipoPerfil !== "servicios" && !nombreEmpresa.trim()) {
      setError("Por favor indica el nombre o razón social de tu empresa u organización.");
      return;
    }

    setIsLoading(true);

    try {
      if (tipoPerfil === "cliente") {
        // Registro de Constructora / Contratista
        const result = await registerCompany({
          tipoEmpresa: "constructora",
          nombreEmpresa: nombreEmpresa.trim(),
          cuitRfc: cuitRfc.trim() || "RFC-PENDIENTE",
          direccion: direccion.trim() || "Ciudad de México",
          ciudad: ciudad.trim(),
          pais: "México",
          radioCoberturaKm: 50,
          nombreAdmin: nombreTitular.trim(),
          emailAdmin: email.trim(),
          password: password,
        });

        if (result.success) {
          router.push("/cliente");
        } else {
          setError(result.error || "Ocurrió un error al registrar la cuenta.");
        }
      } else if (tipoPerfil === "materiales") {
        // Registro de Proveedor de Materiales (InvenTrack WMS)
        const result = await registerCompany({
          tipoEmpresa: "corralon",
          nombreEmpresa: nombreEmpresa.trim(),
          cuitRfc: cuitRfc.trim() || "RFC-PENDIENTE",
          direccion: direccion.trim() || "Bodega Central",
          ciudad: ciudad.trim(),
          pais: "México",
          radioCoberturaKm: Number(radioCoberturaKm) || 25,
          nombreAdmin: nombreTitular.trim(),
          emailAdmin: email.trim(),
          password: password,
        });

        if (result.success) {
          router.push("/productos");
        } else {
          setError(result.error || "Ocurrió un error al dar de alta la bodega.");
        }
      } else {
        // Registro de Profesional de Oficios / Servicios
        const result = await registerCompany({
          tipoEmpresa: "servicios",
          nombreEmpresa: `Servicios Técnicos ${nombreTitular.trim()}`,
          cuitRfc: cuitRfc.trim() || "RFC-PENDIENTE",
          direccion: zonaCobertura.trim() || ciudad.trim(),
          ciudad: ciudad.trim(),
          pais: "México",
          radioCoberturaKm: 30,
          nombreAdmin: nombreTitular.trim(),
          emailAdmin: email.trim(),
          password: password,
        });

        if (result.success) {
          // Guardar el perfil en el directorio local de profesionales
          const nuevoProfesional: ProfesionalServicio = {
            id: `prof-${Date.now()}`,
            nombre: nombreTitular.trim(),
            rubro: rubro,
            matricula: cedulaRegistro.trim() || "STPS-REGISTRO-ACTIVO",
            cuit_rut: cuitRfc.trim() || "XAXX010101000",
            telefono: telefono.trim() || "+52 55 0000 0000",
            email: email.trim(),
            ciudad: ciudad.trim(),
            zona_cobertura: zonaCobertura.trim() || "Área Metropolitana",
            calificacion: 5.0,
            trabajos_completados: 1,
            activo: true,
            tarifa_hora_estimada: Number(tarifaHora) || 650,
            costo_visita: Number(costoVisita) || 850,
            descripcion_experiencia: descripcionExperiencia.trim() || `Especialista en ${rubro} con amplia experiencia en obras residenciales y comerciales.`,
            portfolio_fotos: [
              {
                titulo: `Instalación y mantenimiento especializado`,
                descripcion: `Trabajos certificados bajo normativas técnicas y estándares de seguridad.`,
              },
            ],
            created_at: new Date().toISOString(),
          };

          saveStoredProfesional(nuevoProfesional);
          router.push("/cliente?tab=servicios");
        } else {
          setError(result.error || "Ocurrió un error al registrar el perfil profesional.");
        }
      }
    } catch {
      setError("Error de conexión al procesar el registro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8fd] text-[#112b59] flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* ── HEADER CORPORATIVO ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="VERTIA - Inicio">
            <VertiaLogo />
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              ¿Ya tienes una cuenta registrada?
            </span>
            <Link href="/login">
              <Button
                variant="outline"
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200 text-xs font-semibold h-9 px-4 rounded-xl"
              >
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Halos decorativos de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-cyan-100/30 to-purple-200/40 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-950/5 relative z-10">
          {/* Encabezado */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge className="bg-indigo-500/10 text-indigo-700 border-indigo-500/20 text-xs font-bold mb-3 px-3 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              Alta en la Red B2B de la Construcción
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-[#071b3f] tracking-tight">
              Crea tu Cuenta en VERTIA
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              Selecciona tu tipo de perfil para habilitar las herramientas operativas exactas para tu rol.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* PASO 1: SELECTOR DE PERFIL (CLIENTE VS PROVEEDOR MATERIALES VS PROFESIONAL) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black uppercase tracking-wider text-[#071b3f] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold">
                    1
                  </span>
                  Selecciona tu Perfil de Operación *
                </label>
                <span className="text-[11px] text-slate-400">
                  Define el portal y los permisos de acceso
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Opción 1: Cliente / Constructora / Obra */}
                <div
                  onClick={() => setTipoPerfil("cliente")}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    tipoPerfil === "cliente"
                      ? "border-sky-500 bg-sky-50/50 shadow-md shadow-sky-500/10 ring-2 ring-sky-500/20"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-600/10 border border-sky-500/20 flex items-center justify-center text-sky-600">
                        <HardHat className="w-5 h-5" />
                      </div>
                      {tipoPerfil === "cliente" && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-sky-700 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Seleccionado
                        </span>
                      )}
                    </div>
                    <Badge className="bg-sky-100 text-sky-700 border-sky-200 text-[10px] font-bold mb-1.5">
                      Portal del Cliente
                    </Badge>
                    <h3 className="text-sm font-extrabold text-[#071b3f]">
                      Contratistas & Obras
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Constructoras, arquitectos y residentes. Gestiona frentes de obra, cotiza pedidos con precio cerrado y flete incluido, y contrata oficios técnicos.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] font-bold text-sky-600">
                    Ingreso a: Portal de Obra (/cliente)
                  </div>
                </div>

                {/* Opción 2.A: Proveedor de Materiales (InvenTrack WMS) */}
                <div
                  onClick={() => setTipoPerfil("materiales")}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    tipoPerfil === "materiales"
                      ? "border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                        <Warehouse className="w-5 h-5" />
                      </div>
                      {tipoPerfil === "materiales" && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Seleccionado
                        </span>
                      )}
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] font-bold mb-1.5">
                      Proveedor de Materiales
                    </Badge>
                    <h3 className="text-sm font-extrabold text-[#071b3f]">
                      Bodegas (InvenTrack WMS)
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Bodegas, depósitos y casas de materiales. Habilita InvenTrack WMS para control por pasillos, estantes y niveles, stock dual y remisiones con QR.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] font-bold text-emerald-600">
                    Habilita: InvenTrack WMS (/productos)
                  </div>
                </div>

                {/* Opción 2.B: Profesional de Servicios y Oficios */}
                <div
                  onClick={() => setTipoPerfil("servicios")}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    tipoPerfil === "servicios"
                      ? "border-purple-500 bg-purple-50/50 shadow-md shadow-purple-500/10 ring-2 ring-purple-500/20"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                        <Wrench className="w-5 h-5" />
                      </div>
                      {tipoPerfil === "servicios" && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-purple-700 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Seleccionado
                        </span>
                      )}
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px] font-bold mb-1.5">
                      Proveedor de Servicios
                    </Badge>
                    <h3 className="text-sm font-extrabold text-[#071b3f]">
                      Red de Profesionales
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Técnicos electricistas, plomeros, especialistas en gas, tablaroqueros y gremios. Publica portfolio, costo de visita y cobra asegurado con custodia escrow.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] font-bold text-purple-600">
                    Publicación: Directorio de Oficios
                  </div>
                </div>
              </div>
            </div>

            {/* PASO 2: DATOS DEL PERFIL / EMPRESA */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black uppercase tracking-wider text-[#071b3f] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold">
                    2
                  </span>
                  {tipoPerfil === "servicios"
                    ? "Datos de tu Perfil Profesional y Cobertura"
                    : "Datos de la Empresa y Ubicación Operativa"}
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre de Empresa (solo para cliente y bodega de materiales) */}
                {tipoPerfil !== "servicios" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {tipoPerfil === "cliente"
                        ? "Razón Social / Constructora / Despacho *"
                        : "Nombre de la Casa de Materiales / Bodega *"}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={nombreEmpresa}
                        onChange={(e) => setNombreEmpresa(e.target.value)}
                        placeholder={
                          tipoPerfil === "cliente"
                            ? "ej: Constructora Arcos de México S.A. de C.V."
                            : "ej: Materiales y Acero del Valle S.A. de C.V."
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* Especialidad / Rubro (solo para servicios) */}
                {tipoPerfil === "servicios" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Especialidad / Oficio Principal *
                    </label>
                    <div className="relative">
                      <Wrench className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={rubro}
                        onChange={(e) => setRubro(e.target.value as RubroProfesional)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                      >
                        {LISTA_RUBROS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Cédula Técnica / Matrícula (para servicios) o RFC (para empresas) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {tipoPerfil === "servicios"
                      ? "Cédula Técnica / Certificación STPS / Registro *"
                      : "RFC (Registro Federal de Contribuyentes) *"}
                  </label>
                  <div className="relative">
                    {tipoPerfil === "servicios" ? (
                      <Award className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    ) : (
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    )}
                    <input
                      type="text"
                      required
                      value={tipoPerfil === "servicios" ? cedulaRegistro : cuitRfc}
                      onChange={(e) =>
                        tipoPerfil === "servicios"
                          ? setCedulaRegistro(e.target.value)
                          : setCuitRfc(e.target.value)
                      }
                      placeholder={
                        tipoPerfil === "servicios"
                          ? "ej: STPS-84912 / Cédula Técnica 4892"
                          : "ej: CAM-210415-XYZ"
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Dirección / Ubicación */}
                <div className={tipoPerfil === "servicios" ? "sm:col-span-1" : "sm:col-span-2"}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {tipoPerfil === "cliente"
                      ? "Dirección de Oficina Central o Frente de Obra *"
                      : tipoPerfil === "materiales"
                      ? "Dirección de la Bodega Central o Patio de Materiales *"
                      : "Zona o Alcaldía Base *"}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder={
                        tipoPerfil === "materiales"
                          ? "ej: Av. Industrial 450, Col. San Juan, Iztapalapa"
                          : "ej: Paseo de la Reforma 483, Cuauhtémoc"
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Ciudad / Estado */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ciudad / Estado *
                  </label>
                  <input
                    type="text"
                    required
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Ciudad de México"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Campos Específicos para Bodegas de Materiales: Radio de Cobertura */}
                {tipoPerfil === "materiales" && (
                  <div className="sm:col-span-2 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">
                        Radio de Cobertura de Entrega para Obras
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Distancia máxima a la redonda para surtir pedidos con camiones propios o fletes
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min={5}
                        max={150}
                        required
                        value={radioCoberturaKm}
                        onChange={(e) => setRadioCoberturaKm(Number(e.target.value))}
                        className="w-20 bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-emerald-900 text-center focus:outline-none focus:border-emerald-600"
                      />
                      <span className="text-xs font-bold text-emerald-800">km</span>
                    </div>
                  </div>
                )}

                {/* Campos Específicos para Profesionales: Costo Visita & Tarifa */}
                {tipoPerfil === "servicios" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Costo de Visita Técnica / Diagnóstico ($ MXN) *
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          min={0}
                          step={50}
                          required
                          value={costoVisita}
                          onChange={(e) => setCostoVisita(Number(e.target.value))}
                          placeholder="850"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tarifa Base por Jornada u Hora ($ MXN) *
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          min={0}
                          step={50}
                          required
                          value={tarifaHora}
                          onChange={(e) => setTarifaHora(Number(e.target.value))}
                          placeholder="650"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Área de Cobertura Geográfica *
                      </label>
                      <input
                        type="text"
                        required
                        value={zonaCobertura}
                        onChange={(e) => setZonaCobertura(e.target.value)}
                        placeholder="ej: CDMX (Cuauhtémoc, Benito Juárez, Miguel Hidalgo), Naucalpan, Huixquilucan"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Resumen de Experiencia & Trabajos Realizados
                      </label>
                      <textarea
                        rows={2}
                        value={descripcionExperiencia}
                        onChange={(e) => setDescripcionExperiencia(e.target.value)}
                        placeholder="ej: Especialista en instalaciones de gas y sistemas hidroneumáticos en torres habitacionales. Más de 12 años en obras de mediana y gran escala."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* PASO 3: DATOS DEL RESPONSABLE Y ACCESO */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black uppercase tracking-wider text-[#071b3f] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold">
                    3
                  </span>
                  Datos del Titular y Credenciales de Acceso
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo del Titular *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={nombreTitular}
                      onChange={(e) => setNombreTitular(e.target.value)}
                      placeholder="ej: Ing. Carlos Morales"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono / WhatsApp de Contacto *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+52 55 1234 5678"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico de Acceso *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="carlos.morales@empresa.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contraseña de Acceso *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÓN DE CONFIRMACIÓN */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/login"
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Volver a Iniciar Sesión
              </Link>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto h-12 px-7 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                {isLoading ? (
                  <span>Creando cuenta e inicializando módulos...</span>
                ) : (
                  <>
                    <span>
                      {tipoPerfil === "cliente"
                        ? "Registrar Constructora e Ingresar"
                        : tipoPerfil === "materiales"
                        ? "Habilitar InvenTrack WMS e Ingresar"
                        : "Publicar Perfil Profesional e Ingresar"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* ── FOOTER CORPORATIVO ── */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500">
        VERTIA Platform • InvenTrack v2 Multi-Tenant • Red Nacional de Construcción B2B
      </footer>
    </div>
  );
}