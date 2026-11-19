"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  HardHat,
  Truck,
  ArrowRight,
  Lock,
  Mail,
  Zap,
  CheckCircle2,
  AlertCircle,
  Users,
  Warehouse,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemoUser, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get("redirect");
      if (redir && redir.startsWith("/")) {
        setRedirectTarget(redir);
      }
    }
  }, []);

  const resolveDestination = (defaultRoute: string) => {
    return redirectTarget || defaultRoute;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        // Redirige según el tipo de empresa / rol del usuario autenticado
        const loggedUser = demoAccounts.find((d) => d.email === email);
        if (loggedUser?.tipo === "corralon") {
          router.push(resolveDestination("/productos"));
        } else if (loggedUser?.tipo === "cliente") {
          router.push(resolveDestination("/cliente"));
        } else {
          router.push(resolveDestination("/dashboard"));
        }
      } else {
        setError(res.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al conectar con el servicio");
    } finally {
      setIsLoading(false);
    }
  };

  const handle1ClickLogin = (userId: string, tipo: string) => {
    loginAsDemoUser(userId);
    // Usuarios de corralón van directo a InvenTrack (Materiales & Stock)
    if (tipo === "corralon") {
      router.push(resolveDestination("/productos"));
    } else if (tipo === "cliente") {
      router.push(resolveDestination("/cliente"));
    } else {
      router.push(resolveDestination("/dashboard"));
    }
  };

  const demoAccounts = [
    {
      id: "usr-humberto",
      email: "humberto@vertia.com",
      nombre: "Humberto Rivero Gonzalez",
      rolTitulo: "Super Administrador de Plataforma",
      empresa: "VERTIA Platform Core",
      tipo: "super_admin",
      badgeText: "Super Admin",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      icon: ShieldCheck,
      descripcion: "Gobierno multi-tenant, métricas consolidadas, finanzas y control RLS.",
    },
    {
      id: "usr-federico",
      email: "federico@vertia.com",
      nombre: "Federico Bertoncini",
      rolTitulo: "Super Administrador de Plataforma",
      empresa: "VERTIA Platform Core",
      tipo: "super_admin",
      badgeText: "Super Admin",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      icon: ShieldCheck,
      descripcion: "Consola de infraestructura, monitoreo de sucursales y licencias.",
    },
    {
      id: "usr-martin-rossi",
      email: "martin.rossi@lospinos.com.ar",
      nombre: "Ing. Martín Rossi",
      rolTitulo: "Administrador General",
      empresa: "Corralón Los Pinos S.R.L.",
      tipo: "corralon",
      badgeText: "Admin Corralón",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      icon: Building2,
      descripcion: "Control total de Galpón Oeste (25 km), inventario real vs disponible y pedidos.",
    },
    {
      id: "usr-juan-capataz",
      email: "juan.capataz@lospinos.com.ar",
      nombre: "Juan Capataz",
      rolTitulo: "Operario de Galpón",
      empresa: "Corralón Los Pinos S.R.L.",
      tipo: "corralon",
      badgeText: "Operario Galpón",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
      icon: Warehouse,
      descripcion: "Recepción de camiones, muelle de entrada y ubicación en estanterías.",
    },
    {
      id: "usr-carlos-benitez",
      email: "carlos.benitez@materialescentro.com.ar",
      nombre: "Lic. Carlos Benítez",
      rolTitulo: "Administrador de Sucursal",
      empresa: "Materiales del Centro S.A.",
      tipo: "corralon",
      badgeText: "Admin Corralón",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      icon: Building2,
      descripcion: "Gestión comercial y operativa de sucursal Centro (40 km cobertura).",
    },
    {
      id: "usr-lucas-deposito",
      email: "lucas.deposito@materialescentro.com.ar",
      nombre: "Lucas Depósito",
      rolTitulo: "Operario de Galpón",
      empresa: "Materiales del Centro S.A.",
      tipo: "corralon",
      badgeText: "Operario Galpón",
      badgeColor: "bg-violet-100 text-violet-800 border-violet-300",
      icon: Truck,
      descripcion: "Surtido en Racks Pesados y preparación de despachos con remito.",
    },
    {
      id: "usr-sofia-valenzuela",
      email: "sofia.valenzuela@constructora.com",
      nombre: "Arq. Sofia Valenzuela",
      rolTitulo: "Cliente / Obra Solicitante",
      empresa: "Constructora Arcos / Obras Modernas",
      tipo: "cliente",
      badgeText: "Cliente / Obra",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
      icon: HardHat,
      descripcion: "Emisión de solicitudes de suministro, seguimiento en vivo y validación con fotos.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-md text-base">
              V
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">VERTIA</span>
              <span className="ml-2 text-xs text-indigo-400 font-medium">InvenTrack Platform</span>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 hidden sm:inline">¿Aún no diste de alta tu empresa?</span>
            <Link
              href="/register"
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium transition-colors"
            >
              Registrar Empresa
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Formulario Estándar */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur">
            <div className="mb-6">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block mb-3">
                Acceso al Sistema
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Iniciar Sesión
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Ingresa con tu correo corporativo o utiliza el conmutador de roles demo.
              </p>
            </div>

            {redirectTarget && (
              <div className="mb-5 p-3 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-200 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Autenticación requerida:</strong> Inicia sesión para acceder a{" "}
                  <span className="font-mono text-amber-300 font-semibold">{redirectTarget}</span>
                </span>
              </div>
            )}

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ej: martin.rossi@lospinos.com.ar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Contraseña
                  </label>
                  <span className="text-[11px] text-slate-500 hover:text-slate-400 cursor-pointer">
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  En entorno de prueba la contraseña es simulada (o ingresa cualquier clave).
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span>Verificando credenciales...</span>
                ) : (
                  <>
                    <span>Entrar a la Plataforma</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                ¿Deseas dar de alta tu almacén o corralón?{" "}
                <Link
                  href="/register"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
                >
                  Registrar nueva empresa
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column: Quick Demo Switcher ("1-Click Login") */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Quick Demo Switcher (1-Click Login)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Evalúa la plataforma al instante navegando con cualquiera de los 7 perfiles reales:
                  </p>
                </div>
              </div>
            </div>

            {/* List of 1-Click Cards */}
            <div className="space-y-2.5">
              {demoAccounts.map((account) => {
                const IconComponent = account.icon;
                const isCurrent = user?.id === account.id;

                return (
                  <button
                    key={account.id}
                    onClick={() => handle1ClickLogin(account.id, account.tipo)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 group cursor-pointer ${
                      isCurrent
                        ? "bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/50"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform text-slate-300 group-hover:text-white">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                            {account.nombre}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${account.badgeColor}`}
                          >
                            {account.badgeText}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                          {account.rolTitulo} • <span className="text-slate-300 font-semibold">{account.empresa}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                          {account.descripcion}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform self-center pt-1">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Activo</span>
                        </span>
                      ) : (
                        <>
                          <span className="hidden sm:inline text-[11px]">Ingresar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        VERTIA Platform • InvenTrack v2 Multi-Tenant • Rosario & Red Nacional B2B
      </footer>
    </div>
  );
}
