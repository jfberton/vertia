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
  ArrowLeft,
  Lock,
  Mail,
  Zap,
  CheckCircle2,
  AlertCircle,
  Warehouse,
  Wrench,
  X,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { VertiaLogo } from "@/components/brand/VertiaLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemoUser, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [filtroDemo, setFiltroDemo] = useState<"todos" | "vertia" | "cliente" | "bodega" | "profesional">("todos");

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

  const demoAccounts = [
    {
      id: "usr-humberto",
      email: "humberto@vertia.com",
      nombre: "Humberto Rivero Gonzalez",
      rolTitulo: "Super Administrador de Plataforma",
      empresa: "VERTIA Platform Core",
      tipo: "super_admin",
      categoria: "vertia",
      badgeText: "Operador Vertia",
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
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
      categoria: "vertia",
      badgeText: "Operador Vertia",
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
      icon: ShieldCheck,
      descripcion: "Consola de infraestructura, monitoreo de sucursales y licencias.",
    },
    {
      id: "usr-sofia-valenzuela",
      email: "sofia.valenzuela@constructora.com",
      nombre: "Arq. Sofia Valenzuela",
      rolTitulo: "Directora de Obra / Compras",
      empresa: "Constructora Arcos de México S.A. de C.V.",
      tipo: "cliente",
      categoria: "cliente",
      badgeText: "Contratista / Obra",
      badgeColor: "bg-sky-100 text-sky-700 border-sky-200",
      icon: HardHat,
      descripcion: "Requerimientos de obra, cotizaciones con precio congelado y validación de entregas con fotos.",
    },
    {
      id: "usr-martin-rossi",
      email: "martin.rossi@lospinos.com.mx",
      nombre: "Ing. Martín Rossi",
      rolTitulo: "Administrador General",
      empresa: "Casa de Materiales Los Pinos S.A. de C.V.",
      tipo: "corralon",
      categoria: "bodega",
      badgeText: "Admin Bodega",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: Building2,
      descripcion: "Control total de Bodega Poniente (25 km), inventario físico vs apartado y pedidos.",
    },
    {
      id: "usr-juan-capataz",
      email: "juan.capataz@lospinos.com.mx",
      nombre: "Juan Capataz",
      rolTitulo: "Operario de Bodega",
      empresa: "Casa de Materiales Los Pinos S.A. de C.V.",
      tipo: "corralon",
      categoria: "bodega",
      badgeText: "Operario Bodega",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: Warehouse,
      descripcion: "Recepción de camiones en muelle y ubicación en pasillos, estantes y niveles.",
    },
    {
      id: "usr-carlos-benitez",
      email: "carlos.benitez@materialescentro.com.mx",
      nombre: "Lic. Carlos Benítez",
      rolTitulo: "Administrador de Sucursal",
      empresa: "Materiales del Centro S.A. de C.V.",
      tipo: "corralon",
      categoria: "bodega",
      badgeText: "Admin Bodega",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: Building2,
      descripcion: "Gestión comercial y operativa de sucursal Centro (40 km cobertura).",
    },
    {
      id: "usr-lucas-deposito",
      email: "lucas.deposito@materialescentro.com.mx",
      nombre: "Lucas Depósito",
      rolTitulo: "Operario de Surtido",
      empresa: "Materiales del Centro S.A. de C.V.",
      tipo: "corralon",
      categoria: "bodega",
      badgeText: "Surtidor Bodega",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: Truck,
      descripcion: "Surtido guiado en estanterías y preparación de despachos con nota de remisión QR.",
    },
    {
      id: "usr-javier-morales",
      email: "javier.morales@profesionales.vertia.com",
      nombre: "Ing. Javier Morales",
      rolTitulo: "Técnico Especialista en Instalaciones",
      empresa: "Red de Profesionales Calificados",
      tipo: "profesional",
      categoria: "profesional",
      badgeText: "Red Profesionales",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      icon: Wrench,
      descripcion: "Perfil certificado STPS, portfolio fotográfico de obras y cobro con custodia escrow.",
    },
  ];

  const cuentasFiltradas = demoAccounts.filter((d) => {
    if (filtroDemo === "todos") return true;
    return d.categoria === filtroDemo;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        const loggedUser = demoAccounts.find((d) => d.email === email);
        if (loggedUser?.tipo === "corralon") {
          router.push(resolveDestination("/productos"));
        } else if (loggedUser?.tipo === "cliente") {
          router.push(resolveDestination("/cliente"));
        } else if (loggedUser?.tipo === "profesional") {
          router.push(resolveDestination("/cliente?tab=servicios"));
        } else {
          router.push(resolveDestination("/dashboard"));
        }
      } else {
        setError(res.error || "Credenciales inválidas. Verifica tu correo o contraseña.");
      }
    } catch {
      setError("Ocurrió un error inesperado al conectar con el servicio de autenticación.");
    } finally {
      setIsLoading(false);
    }
  };

  const handle1ClickLogin = (userId: string, tipo: string) => {
    setShowDemoModal(false);
    loginAsDemoUser(userId);
    if (tipo === "corralon") {
      router.push(resolveDestination("/productos"));
    } else if (tipo === "cliente") {
      router.push(resolveDestination("/cliente"));
    } else if (tipo === "profesional") {
      router.push(resolveDestination("/cliente?tab=servicios"));
    } else {
      router.push(resolveDestination("/dashboard"));
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8fd] text-[#112b59] flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* ── HEADER DE NAVEGACIÓN ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="VERTIA - Inicio">
            <VertiaLogo />
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs font-semibold h-9 px-3.5 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al Inicio</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── CUERPO PRINCIPAL DEL LOGIN ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Adornos visuales de fondo suaves */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-cyan-100/30 to-purple-200/40 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/5 relative z-10">
          {/* Logo y Encabezado del Formulario */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <VertiaLogo showTagline={false} className="scale-105" />
            </div>

            <h1 className="text-2xl font-black text-[#071b3f] tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              Ingresa tus credenciales para acceder a tu entorno de trabajo
            </p>
          </div>

          {/* Mensaje de redirección requerida */}
          {redirectTarget && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Autenticación requerida:</strong> Inicia sesión para acceder a{" "}
                <span className="font-mono text-amber-900 font-semibold">{redirectTarget}</span>
              </span>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulario Estándar */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@constructora.com"
                  className="w-full bg-slate-50/70 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Contraseña
                </label>
                <span className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/70 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 h-11 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:shadow-indigo-600/40 cursor-pointer"
            >
              {isLoading ? (
                <span>Verificando credenciales...</span>
              ) : (
                <>
                  <span>Entrar a la Plataforma</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Separador */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              o evaluación de prueba
            </span>
          </div>

          {/* Botón Discreto para Modo Demo / Testing (Popup) */}
          <button
            type="button"
            onClick={() => setShowDemoModal(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 transition-all group cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span>Conmutador de Perfiles Demo (1-Click)</span>
            <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-extrabold">
              8 Roles
            </span>
          </button>

          {/* Enlace de Registro al pie de la tarjeta */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              ¿Deseas dar de alta tu empresa o bodega?{" "}
              <Link
                href="/register"
                className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-2"
              >
                Registrar empresa
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* ── MODAL / POPUP DE PERFILES DEMO (TESTING) ── */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header del Modal */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#071b3f]">
                    Perfiles Demo de Prueba (1-Click Login)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selecciona una cuenta para ingresar de inmediato al rol correspondiente sin escribir contraseña.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filtros por Categoría */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-white text-xs">
              <button
                onClick={() => setFiltroDemo("todos")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  filtroDemo === "todos"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                Todos (8)
              </button>
              <button
                onClick={() => setFiltroDemo("vertia")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  filtroDemo === "vertia"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                Operadores Vertia (2)
              </button>
              <button
                onClick={() => setFiltroDemo("cliente")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  filtroDemo === "cliente"
                    ? "bg-sky-600 text-white"
                    : "text-slate-500 hover:text-sky-600 hover:bg-sky-50"
                }`}
              >
                Contratistas / Obra (1)
              </button>
              <button
                onClick={() => setFiltroDemo("bodega")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  filtroDemo === "bodega"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                Bodegas InvenTrack (4)
              </button>
              <button
                onClick={() => setFiltroDemo("profesional")}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  filtroDemo === "profesional"
                    ? "bg-purple-600 text-white"
                    : "text-slate-500 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                Profesionales (1)
              </button>
            </div>

            {/* Lista de Cuentas */}
            <div className="p-6 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
              {cuentasFiltradas.map((account) => {
                const IconComponent = account.icon;
                const isCurrent = user?.id === account.id;

                return (
                  <button
                    key={account.id}
                    onClick={() => handle1ClickLogin(account.id, account.tipo)}
                    className={`w-full text-left p-3.5 pt-3 rounded-2xl border transition-all flex items-start justify-between gap-3 group cursor-pointer ${
                      isCurrent
                        ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20"
                        : "bg-white border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-md hover:shadow-indigo-950/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-xs text-[#071b3f] group-hover:text-indigo-600 transition-colors">
                            {account.nombre}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${account.badgeColor}`}
                          >
                            {account.badgeText}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                          {account.rolTitulo} • <span className="text-slate-700">{account.empresa}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {account.descripcion}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-xs text-indigo-600 font-bold group-hover:translate-x-1 transition-transform self-center">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Activo</span>
                        </span>
                      ) : (
                        <>
                          <span className="hidden sm:inline text-xs">Entrar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer del Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Al hacer clic en cualquier perfil, se inicia sesión automáticamente.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDemoModal(false)}
                className="text-xs h-8"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER CORPORATIVO ── */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500">
        VERTIA Platform • InvenTrack v2 Multi-Tenant • Red Nacional de Construcción B2B
      </footer>
    </div>
  );
}