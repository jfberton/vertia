"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Warehouse,
  Boxes,
  ClipboardList,
  Camera,
  Globe2,
  Users2,
  ShieldCheck,
  CreditCard,
  Building2,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Entorno = "operador" | "corralon" | "cliente" | "meta_admin";

export function Sidebar() {
  const pathname = usePathname();
  const [entornoActivo, setEntornoActivo] = useState<Entorno>("operador");
  const [selectorAbierto, setSelectorAbierto] = useState(false);

  const entornosInfo = {
    operador: {
      nombre: "Entorno VERTIA",
      subtitulo: "Control & Operación Central",
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    corralon: {
      nombre: "Corralón / InvenTrack",
      subtitulo: "Gestión de Stock & Despacho",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    },
    cliente: {
      nombre: "Entorno Cliente / Obra",
      subtitulo: "Solicitudes & Cierres",
      badgeColor: "bg-teal-100 text-teal-700 border-teal-200",
    },
    meta_admin: {
      nombre: "Meta-Administrador",
      subtitulo: "Licencias, Pagos & Red",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
  };

  const menuItems = [
    { label: "Centro de Operaciones", href: "/dashboard", icon: LayoutDashboard },
    { label: "Solicitudes & Pedidos", href: "/ordenes", icon: ClipboardList, badge: "VT-1048" },
    { label: "Materiales & Stock", href: "/productos", icon: Boxes },
    { label: "Almacenes 3D & Muelle", href: "/almacenes", icon: Warehouse },
    { label: "Validación de Evidencias", href: "/evidencias", icon: Camera, badge: "Fotos" },
    { label: "Red Colaborativa B2B", href: "/red-b2b", icon: Globe2, badge: "Red" },
    { label: "Meta-Admin (Licencias)", href: "/meta-admin", icon: CreditCard, badge: "Humberto" },
    { label: "Usuarios & Permisos", href: "/usuarios", icon: Users2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen text-slate-700 select-none shadow-sm">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-sm text-sm">
          V
        </div>
        <div>
          <span className="font-extrabold text-slate-900 tracking-tight text-base">VERTIA</span>
          <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
            Plataforma
          </span>
        </div>
      </div>

      {/* Selector de Entorno (Los 3 Entornos del Banner de Humberto) */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
        <div className="relative">
          <button
            onClick={() => setSelectorAbierto(!selectorAbierto)}
            className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between"
          >
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Entorno Activo
              </div>
              <div className="text-xs font-bold text-slate-900">
                {entornosInfo[entornoActivo].nombre}
              </div>
              <div className="text-[10px] text-slate-500">
                {entornosInfo[entornoActivo].subtitulo}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {selectorAbierto && (
            <div className="absolute left-0 right-0 z-50 mt-1 py-1 bg-white border border-slate-200 rounded-lg shadow-lg">
              {(Object.keys(entornosInfo) as Entorno[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setEntornoActivo(key);
                    setSelectorAbierto(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-slate-50 ${
                    entornoActivo === key ? "bg-indigo-50/50 font-bold text-indigo-700" : "text-slate-700"
                  }`}
                >
                  <div>{entornosInfo[key].nombre}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{entornosInfo[key].subtitulo}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge
                  variant="outline"
                  className={`text-[10px] py-0 px-1.5 border ${
                    isActive
                      ? "bg-white/20 text-white border-transparent"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Status */}
      <div className="p-3.5 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-slate-600">Sistema Conectado</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">RLS Activo</span>
      </div>
    </aside>
  );
}
