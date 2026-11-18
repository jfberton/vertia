"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  ShieldCheck,
  Building2,
  Warehouse,
  Truck,
  HardHat,
  LogOut,
  ChevronDown,
  UserCheck,
  RefreshCw,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NetworkStatusBanner } from "./NetworkStatusBanner";

export function Navbar() {
  const router = useRouter();
  const { user, tenant, demoUsers, loginAsDemoUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/login");
  };

  const handleSwitchUser = (userId: string) => {
    loginAsDemoUser(userId);
    setDropdownOpen(false);
  };

  // User presentation helpers
  const userName = user?.nombre_completo || "Usuario Demo";
  const userRole = user?.is_super_admin
    ? "Super Administrador"
    : user?.cargo || user?.rol || "Operador";
  const userCompany =
    tenant?.nombre || user?.tenant_nombre || "VERTIA Plataforma Central";

  const getRoleBadge = () => {
    if (user?.is_super_admin) {
      return {
        text: "Control Central VERTIA",
        style: "bg-amber-50 text-amber-800 border-amber-200",
        icon: ShieldCheck,
      };
    }
    if (user?.tipo_empresa === "corralon") {
      return {
        text: "Corralón / InvenTrack",
        style: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: Warehouse,
      };
    }
    if (user?.tipo_empresa === "constructora" || user?.rol === "cliente") {
      return {
        text: "Cliente / Obra Solicitante",
        style: "bg-teal-50 text-teal-700 border-teal-200",
        icon: HardHat,
      };
    }
    return {
      text: "Operador Autorizado",
      style: "bg-slate-100 text-slate-700 border-slate-200",
      icon: Building2,
    };
  };

  const roleBadge = getRoleBadge();
  const BadgeIcon = roleBadge.icon;
  const initial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Banner de alerta offline cuando Supabase está desconectado */}
      <NetworkStatusBanner variant="banner-only" />

      <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur px-6 flex items-center justify-between text-slate-800 shadow-2xs relative z-30">
        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar folio VT, material, obra o corralón..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3.5">
          {/* Supabase Connectivity Badge */}
          <NetworkStatusBanner variant="badge-only" />

          {/* Dynamic Role Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${roleBadge.style}`}
          >
            <BadgeIcon className="w-3.5 h-3.5" />
            <span>{roleBadge.text}</span>
          </div>

          {/* Notifications */}
          <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5" />
          </button>

          {/* Active User / Switcher Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer text-left"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {initial}
                </div>
              )}
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                  <span>{userName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                  {userCompany}
                </div>
              </div>
            </button>

            {/* User & Switcher Menu Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 text-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Header profile info */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sesión Activa
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {userName}
                  </div>
                  <div className="text-xs text-slate-600">{user?.email}</div>
                  <div className="text-[11px] font-medium text-indigo-700 mt-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{userCompany}</span>
                  </div>
                </div>

                {/* Demo Switcher Submenu */}
                <div className="p-2">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Conmutar Rol (1-Click)</span>
                    <RefreshCw className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1 mt-1 pr-1">
                    {demoUsers.map((dUser) => {
                      const isSelected = user?.id === dUser.id;
                      return (
                        <button
                          key={dUser.id}
                          onClick={() => handleSwitchUser(dUser.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-indigo-50 font-bold text-indigo-700"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <div className="truncate">
                            <div className="truncate text-xs">{dUser.nombre_completo}</div>
                            <div className="text-[10px] text-slate-400 font-normal truncate">
                              {dUser.tenant_nombre || "VERTIA Core"} • {dUser.rol}
                            </div>
                          </div>
                          {isSelected && (
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-slate-100 pt-1.5 px-2 space-y-1">
                  <Link
                    href="/register"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Registrar Nueva Empresa</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
