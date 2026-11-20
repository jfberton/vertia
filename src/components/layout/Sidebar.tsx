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
  CreditCard,
  Building2,
  ChevronDown,
  ShieldCheck,
  Package,
  HardHat,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { user, tenant } = useAuth();

  const isSuperAdmin = user?.is_super_admin ?? false;
  const isCorralon =
    !isSuperAdmin &&
    (user?.tipo_empresa === "corralon" ||
      user?.rol === "administrador" ||
      user?.rol === "operario");
  const isCliente = user?.rol === "cliente";

  // Menú exclusivo para Bodega de Materiales / InvenTrack
  const menuCorralon = [
    {
      label: "Materiales & Stock",
      href: "/productos",
      icon: Boxes,
      badge: "InvenTrack",
    },
    {
      label: "Mi Bodega & Pasillos",
      href: "/almacenes",
      icon: Warehouse,
    },
    {
      label: "Pedidos & Despachos",
      href: "/ordenes",
      icon: ClipboardList,
      badge: "Órdenes",
    },
    {
      label: "Mi Exposición en Red",
      href: "/red-b2b",
      icon: Globe2,
      badge: "Precios",
    },
  ];

  // Menú exclusivo para Cliente / Obra (Constructora)
  const menuCliente = [
    {
      label: "Mi Portal de Obras",
      href: "/cliente",
      icon: HardHat,
      badge: "Obras",
    },
    {
      label: "Catálogo Red Vertia",
      href: "/red-b2b",
      icon: Globe2,
      badge: "Precios",
    },
    {
      label: "Evidencias & Recepción",
      href: "/evidencias",
      icon: Camera,
      badge: "Fotos",
    },
  ];

  // Menú para Super Administrador de Plataforma (Humberto & Federico)
  const menuSuperAdmin = [
    {
      label: "Centro de Operaciones",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Empresas & Clientes de Red",
      href: "/meta-admin",
      icon: Building2,
      badge: "Core",
    },
    {
      label: "Red Vertia",
      href: "/red-b2b",
      icon: Globe2,
      badge: "Red",
    },
    {
      label: "Solicitudes & Pedidos",
      href: "/ordenes",
      icon: ClipboardList,
      badge: "VT-1048",
    },
    {
      label: "Catálogo Red Vertia (Auditoría)",
      href: "/productos",
      icon: Boxes,
    },
    {
      label: "Validación de Evidencias",
      href: "/evidencias",
      icon: Camera,
      badge: "Fotos",
    },
    {
      label: "Usuarios & Permisos",
      href: "/usuarios",
      icon: Users2,
    },
  ];

  const menuItems = isCorralon
    ? menuCorralon
    : isCliente
    ? menuCliente
    : menuSuperAdmin;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen text-slate-700 select-none shadow-sm">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-2.5">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm text-sm ${
            isCorralon
              ? "bg-gradient-to-tr from-purple-600 to-indigo-600"
              : "bg-gradient-to-tr from-indigo-600 to-violet-600"
          }`}
        >
          {isCorralon ? "IT" : "V"}
        </div>
        <div>
          <span className="font-extrabold text-slate-900 tracking-tight text-base">
            {isCorralon ? "InvenTrack" : "VERTIA"}
          </span>
          <span
            className={`ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
              isCorralon
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : isCliente
                ? "bg-teal-50 text-teal-700 border-teal-200"
                : "bg-indigo-50 text-indigo-700 border-indigo-100"
            }`}
          >
            {isCorralon ? "Corralón" : isCliente ? "Constructora" : "Plataforma"}
          </span>
        </div>
      </div>

      {/* Identificación de Empresa / Entorno Activo */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {isCorralon
              ? "Corralón Asociado"
              : isCliente
              ? "Cliente / Solicitante"
              : "Entorno VERTIA Core"}
          </div>
          <div className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
            {isCorralon
              ? user?.tenant_nombre || "Corralón InvenTrack"
              : isCliente
              ? "Constructora / Obra"
              : "Torre de Control & Red"}
          </div>
          <div className="text-[10px] text-slate-500 line-clamp-1">
            {isCorralon
              ? "Módulo de Stock, Galpón & Fletes"
              : isCliente
              ? "Proyectos, Evidencias & Cierres"
              : "Supervisión Global de la Red"}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");

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
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                />
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
          <span className="text-[11px] font-medium text-slate-600">
            {isCorralon ? "Galpón Conectado" : "Sistema Conectado"}
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">
          {isCorralon ? "InvenTrack v2" : "RLS Activo"}
        </span>
      </div>
    </aside>
  );
}
