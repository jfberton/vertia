"use client";

import React, { useState } from "react";
import { Building2, ChevronDown, Check, Plus } from "lucide-react";
import { Tenant } from "@/types/domain";

interface TenantSwitcherProps {
  currentTenant?: Tenant | null;
  tenants?: Tenant[];
  onSelectTenant?: (tenant: Tenant) => void;
  onNewTenant?: () => void;
}

export function TenantSwitcher({
  currentTenant = { id: "1", nombre: "Almacenes Centrales S.A.", slug: "central", plan: "pro", activo: true, created_at: "" },
  tenants = [
    { id: "1", nombre: "Almacenes Centrales S.A.", slug: "central", plan: "pro", activo: true, created_at: "" },
    { id: "2", nombre: "Logística del Sur SRL", slug: "logistica-sur", plan: "free", activo: true, created_at: "" },
  ],
  onSelectTenant,
  onNewTenant,
}: TenantSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-zinc-100 transition-colors"
      >
        <div className="flex items-center gap-2 truncate">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-indigo-600 text-white shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="truncate">{currentTenant?.nombre || "Seleccionar Empresa"}</span>
        </div>
        <ChevronDown className="w-4 h-4 ml-2 text-zinc-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 py-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl">
          <div className="px-3 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Tus Empresas
          </div>
          {tenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => {
                onSelectTenant?.(tenant);
                setIsOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
            >
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-4 h-4 text-zinc-400" />
                <span className="truncate">{tenant.nombre}</span>
              </div>
              {currentTenant?.id === tenant.id && (
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
              )}
            </button>
          ))}
          <div className="border-t border-zinc-800 mt-1 pt-1">
            <button
              onClick={() => {
                onNewTenant?.();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-indigo-400 hover:bg-zinc-800 transition-colors text-left font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nueva Empresa</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
