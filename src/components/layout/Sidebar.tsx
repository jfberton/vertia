"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Warehouse,
  Boxes,
  ArrowLeftRight,
  ClipboardList,
  FileCheck2,
  AlertTriangle,
  Globe2,
  Users2,
  Settings,
} from "lucide-react";
import { TenantSwitcher } from "./TenantSwitcher";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Almacenes y Ubicaciones", href: "/almacenes", icon: Warehouse },
  { label: "Catálogo de Productos", href: "/productos", icon: Boxes },
  { label: "Movimientos y Stock", href: "/inventario", icon: ArrowLeftRight },
  { label: "Órdenes de Suministro", href: "/ordenes", icon: ClipboardList },
  { label: "Remisiones de Salida", href: "/remisiones", icon: FileCheck2 },
  { label: "BackOrders (Faltantes)", href: "/backorders", icon: AlertTriangle },
  {
    label: "Red Colaborativa B2B",
    href: "/red-b2b",
    icon: Globe2,
    badge: "Marketplace",
  },
  { label: "Usuarios y Permisos", href: "/usuarios", icon: Users2 },
  { label: "Configuración", href: "/configuracion", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen text-zinc-300 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-zinc-800 gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-md">
          IT
        </div>
        <div>
          <span className="font-bold text-zinc-100 tracking-tight text-base">InvenTrack</span>
          <span className="ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
            v2 SaaS
          </span>
        </div>
      </div>

      {/* Tenant Switcher */}
      <div className="p-4 border-b border-zinc-800/80">
        <TenantSwitcher />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5 bg-zinc-800 text-indigo-300 border border-indigo-900/50">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cloudflare Edge</span>
        </div>
        <span className="font-mono text-[10px]">RLS Activo</span>
      </div>
    </aside>
  );
}
