"use client";

import React from "react";
import { Bell, Search, User, ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur px-6 flex items-center justify-between text-slate-800 shadow-2xs">
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
      <div className="flex items-center gap-4">
        {/* Role Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Control Central VERTIA</span>
        </div>

        {/* Notifications */}
        <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            H
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800">Humberto</div>
            <div className="text-[10px] text-slate-500">Super Administrador</div>
          </div>
        </div>
      </div>
    </header>
  );
}
