"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  MOCK_USERS,
  MOCK_TENANTS,
  MultiTenantUser,
  MultiTenantInfo,
} from "@/lib/data/mock-multi-tenant";

export interface RegisterCompanyData {
  tipoEmpresa: "corralon" | "servicios";
  nombreEmpresa: string;
  cuitRfc: string;
  direccion: string;
  ciudad?: string;
  pais?: string;
  radioCoberturaKm: number;
  nombreAdmin: string;
  emailAdmin: string;
  password?: string;
}

export interface AuthContextType {
  user: MultiTenantUser | null;
  tenant: MultiTenantInfo | null;
  allTenants: MultiTenantInfo[];
  demoUsers: MultiTenantUser[];
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAsDemoUser: (userIdOrEmail: string) => void;
  switchTenant: (tenantId: string) => void;
  registerCompany: (data: RegisterCompanyData) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = "inventrack_auth_user";
const STORAGE_KEY_TENANT = "inventrack_auth_tenant";
const STORAGE_KEY_CUSTOM_TENANTS = "inventrack_custom_tenants";
const STORAGE_KEY_CUSTOM_USERS = "inventrack_custom_users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<MultiTenantInfo[]>(MOCK_TENANTS);
  const [usersList, setUsersList] = useState<MultiTenantUser[]>(MOCK_USERS);
  const [user, setUser] = useState<MultiTenantUser | null>(null);
  const [tenant, setTenant] = useState<MultiTenantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Load custom tenants and users if any registered
        const savedCustomTenants = localStorage.getItem(STORAGE_KEY_CUSTOM_TENANTS);
        let currentTenants = MOCK_TENANTS;
        if (savedCustomTenants) {
          const parsedCustom = JSON.parse(savedCustomTenants);
          currentTenants = [...MOCK_TENANTS, ...parsedCustom];
          setTenants(currentTenants);
        }

        const savedCustomUsers = localStorage.getItem(STORAGE_KEY_CUSTOM_USERS);
        let currentUsers = MOCK_USERS;
        if (savedCustomUsers) {
          const parsedUsers = JSON.parse(savedCustomUsers);
          currentUsers = [...MOCK_USERS, ...parsedUsers];
          setUsersList(currentUsers);
        }

        // Load active user
        const savedUserStr = localStorage.getItem(STORAGE_KEY_USER);
        if (savedUserStr) {
          const parsedUser: MultiTenantUser = JSON.parse(savedUserStr);
          setUser(parsedUser);

          // Find tenant
          if (parsedUser.tenant_id) {
            const foundTenant = currentTenants.find((t) => t.id === parsedUser.tenant_id) || null;
            setTenant(foundTenant);
          } else {
            setTenant(null);
          }
        } else {
          // Default initial user: Humberto
          const defaultUser = null;
          setUser(defaultUser);
          setTenant(null);
          // No persistir usuario no autenticado
        }
      }
    } catch (e) {
      console.error("Error loading auth session from localStorage:", e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistSession = (newUser: MultiTenantUser | null, newTenant: MultiTenantInfo | null) => {
    setUser(newUser);
    setTenant(newTenant);
    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
        document.cookie = `inventrack_session=${encodeURIComponent(newUser.id)}; path=/; max-age=86400; SameSite=Lax`;
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
        document.cookie = "inventrack_session=; path=/; max-age=0";
      }

      if (newTenant) {
        localStorage.setItem(STORAGE_KEY_TENANT, JSON.stringify(newTenant));
      } else {
        localStorage.removeItem(STORAGE_KEY_TENANT);
      }
    }
  };

  const loginAsDemoUser = (userIdOrEmail: string) => {
    const target = usersList.find(
      (u) =>
        u.id.toLowerCase() === userIdOrEmail.toLowerCase() ||
        u.email.toLowerCase() === userIdOrEmail.toLowerCase() ||
        u.email.toLowerCase().includes(userIdOrEmail.toLowerCase())
    );

    if (target) {
      let matchingTenant: MultiTenantInfo | null = null;
      if (target.tenant_id) {
        matchingTenant = tenants.find((t) => t.id === target.tenant_id) || null;
      }
      persistSession(target, matchingTenant);
    } else {
      console.warn("Demo user not found for query:", userIdOrEmail);
    }
  };

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Check against usersList
    const matched = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (matched) {
      let matchingTenant: MultiTenantInfo | null = null;
      if (matched.tenant_id) {
        matchingTenant = tenants.find((t) => t.id === matched.tenant_id) || null;
      }
      persistSession(matched, matchingTenant);
      return { success: true };
    }

    // Friendly demo fallback for common prefixes
    if (cleanEmail.includes("humberto")) {
      loginAsDemoUser("usr-humberto");
      return { success: true };
    }
    if (cleanEmail.includes("federico")) {
      loginAsDemoUser("usr-federico");
      return { success: true };
    }
    if (cleanEmail.includes("martin") || cleanEmail.includes("rossi")) {
      loginAsDemoUser("usr-martin-rossi");
      return { success: true };
    }
    if (cleanEmail.includes("capataz") || cleanEmail.includes("juan")) {
      loginAsDemoUser("usr-juan-capataz");
      return { success: true };
    }
    if (cleanEmail.includes("carlos") || cleanEmail.includes("benitez")) {
      loginAsDemoUser("usr-carlos-benitez");
      return { success: true };
    }
    if (cleanEmail.includes("deposito") || cleanEmail.includes("lucas")) {
      loginAsDemoUser("usr-lucas-deposito");
      return { success: true };
    }
    if (cleanEmail.includes("sofia") || cleanEmail.includes("valenzuela")) {
      loginAsDemoUser("usr-sofia-valenzuela");
      return { success: true };
    }

    // Generic fallback for custom registered or generic demo login
    if (email && (!password || password.length >= 4)) {
      const genericUser: MultiTenantUser = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        nombre_completo: cleanEmail.split("@")[0].toUpperCase(),
        cargo: "Usuario Registrado",
        rol: "administrador",
        is_super_admin: false,
        tenant_id: "tenant-los-pinos",
        tenant_nombre: "Corralón Los Pinos S.R.L.",
        tipo_empresa: "corralon",
      };
      persistSession(genericUser, tenants[0]);
      return { success: true };
    }

    return { success: false, error: "Credenciales no válidas. Puedes usar los accesos 1-Click de demo." };
  };

  const logout = () => {
    persistSession(null, null);
  };

  const switchTenant = (tenantId: string) => {
    const targetTenant = tenants.find((t) => t.id === tenantId) || null;
    if (targetTenant) {
      setTenant(targetTenant);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_TENANT, JSON.stringify(targetTenant));
      }
    }
  };

  const registerCompany = async (
    data: RegisterCompanyData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const newTenantId = `tenant-${Date.now()}`;
      const newTenant: MultiTenantInfo = {
        id: newTenantId,
        nombre: data.nombreEmpresa,
        slug: data.nombreEmpresa.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        cuit_rut_taxid: data.cuitRfc,
        direccion: data.direccion,
        ciudad: data.ciudad || "Rosario",
        pais: data.pais || "Argentina",
        radio_cobertura_km: Number(data.radioCoberturaKm) || 25,
        tipo_empresa: data.tipoEmpresa,
        plan: "pro",
        activo: true,
        habilitado_inventrack: data.tipoEmpresa === "corralon",
        created_at: new Date().toISOString(),
      };

      const newAdminUser: MultiTenantUser = {
        id: `usr-${Date.now()}`,
        email: data.emailAdmin.toLowerCase().trim(),
        nombre_completo: data.nombreAdmin,
        cargo: `Administrador General (${data.nombreEmpresa})`,
        rol: "administrador",
        is_super_admin: false,
        tenant_id: newTenantId,
        tenant_nombre: data.nombreEmpresa,
        tipo_empresa: data.tipoEmpresa,
      };

      // Save custom tenants & users to localStorage
      const updatedTenants = [...tenants, newTenant];
      const updatedUsers = [...usersList, newAdminUser];

      setTenants(updatedTenants);
      setUsersList(updatedUsers);

      if (typeof window !== "undefined") {
        const customTenants = updatedTenants.filter(
          (t) => !MOCK_TENANTS.some((mt) => mt.id === t.id)
        );
        localStorage.setItem(STORAGE_KEY_CUSTOM_TENANTS, JSON.stringify(customTenants));

        const customUsers = updatedUsers.filter(
          (u) => !MOCK_USERS.some((mu) => mu.id === u.id)
        );
        localStorage.setItem(STORAGE_KEY_CUSTOM_USERS, JSON.stringify(customUsers));
      }

      // Log in immediately as the new admin
      persistSession(newAdminUser, newTenant);

      return { success: true };
    } catch (err) {
      console.error("Error registering company:", err);
      return { success: false, error: "Error al registrar la empresa. Intente nuevamente." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        allTenants: tenants,
        demoUsers: MOCK_USERS,
        isLoading,
        login,
        logout,
        loginAsDemoUser,
        switchTenant,
        registerCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
}
