"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Warehouse,
  HardHat,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MapPin,
  FileText,
  User,
  Mail,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { registerCompany } = useAuth();

  // Tipo de empresa upfront: 'corralon' (habilita InvenTrack) vs 'servicios' (contratista/servicios)
  const [tipoEmpresa, setTipoEmpresa] = useState<"corralon" | "servicios">("corralon");

  // Form fields
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [cuitRfc, setCuitRfc] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("Rosario");
  const [radioCoberturaKm, setRadioCoberturaKm] = useState(25);
  const [nombreAdmin, setNombreAdmin] = useState("");
  const [emailAdmin, setEmailAdmin] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombreEmpresa.trim() || !cuitRfc.trim() || !direccion.trim() || !nombreAdmin.trim() || !emailAdmin.trim()) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerCompany({
        tipoEmpresa,
        nombreEmpresa: nombreEmpresa.trim(),
        cuitRfc: cuitRfc.trim(),
        direccion: direccion.trim(),
        ciudad: ciudad.trim(),
        pais: "Argentina",
        radioCoberturaKm: Number(radioCoberturaKm) || 25,
        nombreAdmin: nombreAdmin.trim(),
        emailAdmin: emailAdmin.trim(),
        password: password || "123456",
      });

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Ocurrió un error al registrar la empresa.");
      }
    } catch (err) {
      setError("Error de conexión al procesar el registro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-md text-base">
              V
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">VERTIA</span>
              <span className="ml-2 text-xs text-indigo-400 font-medium">InvenTrack Platform</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">¿Ya tienes cuenta?</span>
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur">
          {/* Top Headline */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Alta de Empresa & Activación de Módulos
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Registra tu Organización en VERTIA
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Configura tu espacio multi-tenant, define tu radio operativo y habilita las herramientas operativas especializadas.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1: Upfront Question: Tipo de Empresa */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                1. Selecciona el Tipo de Empresa *
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opción A: Almacén / Corralón de Materiales */}
                <div
                  onClick={() => setTipoEmpresa("corralon")}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    tipoEmpresa === "corralon"
                      ? "border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-950/50"
                      : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                      <Warehouse className="w-5 h-5" />
                    </div>
                    {tipoEmpresa === "corralon" && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Seleccionado
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    Almacén / Corralón de Materiales
                  </h3>
                  <div className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Habilitará módulo InvenTrack
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    Control de stock físico real vs disponible, matriz 3D de ubicaciones, muelles de recepción, emisión de remisiones y publicación en la Red B2B.
                  </p>
                </div>

                {/* Opción B: Prestador de Servicios / Contratista */}
                <div
                  onClick={() => setTipoEmpresa("servicios")}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    tipoEmpresa === "servicios"
                      ? "border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-950/50"
                      : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
                      <HardHat className="w-5 h-5" />
                    </div>
                    {tipoEmpresa === "servicios" && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Seleccionado
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    Prestador de Servicios / Contratista
                  </h3>
                  <div className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-950 text-teal-300 border border-teal-800">
                    Módulo de Obras & Solicitudes
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    Solicitud de materiales a corralones de la red, asignación de cuadrillas a obras y carga de evidencias fotográficas para certificación.
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 2: Datos de la Empresa */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                2. Datos de la Empresa y Ubicación Operativa
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre o Razón Social *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={nombreEmpresa}
                      onChange={(e) => setNombreEmpresa(e.target.value)}
                      placeholder="ej: Corralón Don Bosco S.A."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CUIT / RFC / Tax ID *
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={cuitRfc}
                      onChange={(e) => setCuitRfc(e.target.value)}
                      placeholder="ej: 30-71889922-4"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Dirección del Galpón Principal u Oficina *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="ej: Av. San Martín 3200, Rosario"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ciudad / Región
                  </label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Rosario"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Radio de Cobertura Operativa (km) *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={200}
                      required
                      value={radioCoberturaKm}
                      onChange={(e) => setRadioCoberturaKm(Number(e.target.value))}
                      className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <span className="text-xs text-slate-400">
                      km a la redonda para despacho y abastecimiento en la Red B2B
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Administrador de la Cuenta */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                3. Datos del Administrador Principal
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre Completo del Admin *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={nombreAdmin}
                      onChange={(e) => setNombreAdmin(e.target.value)}
                      placeholder="ej: Lic. Roberto García"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Correo Electrónico de Acceso *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={emailAdmin}
                      onChange={(e) => setEmailAdmin(e.target.value)}
                      placeholder="admin@corralondonbosco.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contraseña de Acceso *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Cifrado en reposo con Row Level Security (RLS) en Postgres.
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/login"
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Volver al inicio de sesión
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span>Registrando e inicializando entorno...</span>
                ) : (
                  <>
                    <span>Confirmar y Crear Empresa</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        VERTIA Platform • InvenTrack v2 Multi-Tenant • Aislamiento RLS Garantizado
      </footer>
    </div>
  );
}
