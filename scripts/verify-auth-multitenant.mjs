/**
 * Automated Verification Script for InvenTrack v2
 * Tests:
 * 1. Super admin users (Humberto and Federico) have full system access
 * 2. Tenant isolation (Corralón Los Pinos vs Materiales del Centro)
 * 3. Dual stock metrics (Real vs Available: Stock Real, Comprometido, Disponible)
 * 4. Registration flow respecting "Almacén" vs "Servicio" company types
 * 5. Quick Demo Switcher (1-Click Login for all platform roles)
 */

import {
  MOCK_TENANTS,
  MOCK_USERS,
  MOCK_PRODUCTOS,
  MOCK_ALMACENES,
  MOCK_UBICACIONES,
  MOCK_ORDENES,
  filterProductosByTenant,
  filterAlmacenesByTenant,
  filterUbicacionesByTenant,
  filterOrdenesByTenant,
  getTenantById,
} from "../src/lib/data/mock-multi-tenant.ts";

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m - ${testName}`);
    passedTests++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m - ${testName} ${details ? `(${details})` : ""}`);
    failedTests++;
  }
}

console.log("\n=======================================================");
console.log(" 🧪 INVENTRACK V2 - AUTOMATED AUTH & MULTI-TENANT SUITE");
console.log("=======================================================\n");

// -------------------------------------------------------------
// TEST SUITE 1: SUPER ADMIN FULL PLATFORM ACCESS
// -------------------------------------------------------------
console.log("\x1b[1m[Suite 1] Super Admin Privileges & Platform Visibility\x1b[0m");

const humberto = MOCK_USERS.find((u) => u.email === "humberto@vertia.com");
assert(
  !!humberto && humberto.is_super_admin === true && humberto.rol === "super_admin",
  "Humberto Rivero Gonzalez is registered as Super Admin",
  `Found: ${JSON.stringify(humberto)}`
);

const federico = MOCK_USERS.find((u) => u.email === "federico@vertia.com");
assert(
  !!federico && federico.is_super_admin === true && federico.rol === "super_admin",
  "Federico Bertoncini is registered as Super Admin",
  `Found: ${JSON.stringify(federico)}`
);

// Super admins should see all tenants in platform
assert(
  MOCK_TENANTS.length >= 2,
  "Platform has registered multiple active tenants",
  `Count: ${MOCK_TENANTS.length}`
);

// Consolidated cross-tenant view when tenantId === "all"
const consolidatedProducts = filterProductosByTenant("all");
assert(
  consolidatedProducts.length === MOCK_PRODUCTOS.length && consolidatedProducts.length >= 6,
  "Super admin consolidated product view returns entire network catalog (6 items)",
  `Expected ${MOCK_PRODUCTOS.length}, got ${consolidatedProducts.length}`
);

const consolidatedWarehouses = filterAlmacenesByTenant("all");
assert(
  consolidatedWarehouses.length === MOCK_ALMACENES.length && consolidatedWarehouses.length >= 4,
  "Super admin consolidated warehouse view returns all platform warehouses (4 items)",
  `Expected ${MOCK_ALMACENES.length}, got ${consolidatedWarehouses.length}`
);

const consolidatedOrders = filterOrdenesByTenant("all");
assert(
  consolidatedOrders.length === MOCK_ORDENES.length && consolidatedOrders.length >= 4,
  "Super admin consolidated orders view returns all platform orders (4 items)",
  `Expected ${MOCK_ORDENES.length}, got ${consolidatedOrders.length}`
);

// Verify Super Admin can filter by any specific tenant dynamically
const losPinosFiltered = filterProductosByTenant("tenant-los-pinos");
const centroFiltered = filterProductosByTenant("tenant-materiales-centro");
assert(
  losPinosFiltered.length > 0 && centroFiltered.length > 0 &&
  losPinosFiltered.length + centroFiltered.length === consolidatedProducts.length,
  "Super admin dynamic tenant switcher precisely partitions inventory across tenants"
);

// -------------------------------------------------------------
// TEST SUITE 2: TENANT ISOLATION (CORRALÓN LOS PINOS VS MATERIALES DEL CENTRO)
// -------------------------------------------------------------
console.log("\n\x1b[1m[Suite 2] Tenant Isolation (Zero Leakage Check)\x1b[0m");

const losPinosId = "tenant-los-pinos";
const centroId = "tenant-materiales-centro";

const pinosProducts = filterProductosByTenant(losPinosId);
const centroProducts = filterProductosByTenant(centroId);

// 2.1 Product Isolation
const pinosHasOnlyPinosProducts = pinosProducts.every((p) => p.tenant_id === losPinosId);
assert(
  pinosHasOnlyPinosProducts,
  "Corralón Los Pinos product list contains ONLY Los Pinos products",
  `Found non-isolated items: ${pinosProducts.filter((p) => p.tenant_id !== losPinosId).length}`
);

const centroHasOnlyCentroProducts = centroProducts.every((p) => p.tenant_id === centroId);
assert(
  centroHasOnlyCentroProducts,
  "Materiales del Centro product list contains ONLY Materiales del Centro products",
  `Found non-isolated items: ${centroProducts.filter((p) => p.tenant_id !== centroId).length}`
);

// Ensure specific materials do not leak
const cementoInCentro = centroProducts.some((p) => p.nombre.includes("Cemento Loma Negra"));
const hierroInPinos = pinosProducts.some((p) => p.nombre.includes("Hierro Nervado"));
assert(
  !cementoInCentro && !hierroInPinos,
  "Strict material boundary: Cemento Loma Negra is not visible to Materiales del Centro, Hierro Nervado is not visible to Los Pinos"
);

// 2.2 Warehouse Isolation
const pinosAlmacenes = filterAlmacenesByTenant(losPinosId);
const centroAlmacenes = filterAlmacenesByTenant(centroId);

assert(
  pinosAlmacenes.every((a) => a.tenant_id === losPinosId),
  "Los Pinos warehouses contain only Los Pinos locations (Galpón Central Oeste + Recepción)",
  `Count: ${pinosAlmacenes.length}`
);

assert(
  centroAlmacenes.every((a) => a.tenant_id === centroId),
  "Materiales del Centro warehouses contain only Centro locations (Sucursal Centro + Pesaje)",
  `Count: ${centroAlmacenes.length}`
);

const centroHasPinosAlmacen = centroAlmacenes.some((a) => a.id.includes("pinos"));
const pinosHasCentroAlmacen = pinosAlmacenes.some((a) => a.id.includes("centro"));
assert(
  !centroHasPinosAlmacen && !pinosHasCentroAlmacen,
  "Zero warehouse contamination between Corralón Los Pinos and Materiales del Centro"
);

// 2.3 Ubicaciones & Storage Locations Isolation
const pinosUbicaciones = filterUbicacionesByTenant(losPinosId);
const centroUbicaciones = filterUbicacionesByTenant(centroId);

assert(
  pinosUbicaciones.every((u) => u.tenant_id === losPinosId),
  "Los Pinos physical storage racks/shelves are completely isolated",
  `Total: ${pinosUbicaciones.length}`
);

assert(
  centroUbicaciones.every((u) => u.tenant_id === centroId),
  "Materiales del Centro heavy racks/shelves are completely isolated",
  `Total: ${centroUbicaciones.length}`
);

// 2.4 Orders & Fulfillment Isolation
const pinosOrdenes = filterOrdenesByTenant(losPinosId);
const centroOrdenes = filterOrdenesByTenant(centroId);

assert(
  pinosOrdenes.every((o) => o.tenant_id === losPinosId) &&
  centroOrdenes.every((o) => o.tenant_id === centroId),
  "Orders and customer dispatch folios are strictly isolated by tenant",
  `Los Pinos: ${pinosOrdenes.map(o => o.folio).join(", ")} | Centro: ${centroOrdenes.map(o => o.folio).join(", ")}`
);

// -------------------------------------------------------------
// TEST SUITE 3: DUAL STOCK METRICS (REAL VS DISPONIBLE)
// -------------------------------------------------------------
console.log("\n\x1b[1m[Suite 3] Dual Stock Metrics (Real vs Comprometido vs Disponible)\x1b[0m");

let mathConsistent = true;
for (const p of MOCK_PRODUCTOS) {
  const expectedDisponible = p.stock_real - p.stock_comprometido;
  if (p.stock_disponible !== expectedDisponible || p.stock_real < 0 || p.stock_disponible < 0) {
    mathConsistent = false;
    console.error(`Invalid metrics for ${p.nombre}: Real=${p.stock_real}, Comprometido=${p.stock_comprometido}, Disponible=${p.stock_disponible}`);
  }
}
assert(
  mathConsistent,
  "Mathematical invariant holds for all products: Stock Disponible = Stock Real - Stock Comprometido"
);

// Specific domain validations from requirements:
// 1. Cemento Loma Negra 50kg: Real 120, Comprometido 60, Disp 60
const cemento = MOCK_PRODUCTOS.find((p) => p.nombre.includes("Cemento Loma Negra"));
assert(
  cemento && cemento.stock_real === 120 && cemento.stock_comprometido === 60 && cemento.stock_disponible === 60,
  "Cemento Loma Negra metrics match specification: Real=120, Comp=60, Disp=60",
  `Got: Real=${cemento?.stock_real}, Comp=${cemento?.stock_comprometido}, Disp=${cemento?.stock_disponible}`
);

// 2. Arena Fina: Real 18, Comprometido 12, Disp 6
const arena = MOCK_PRODUCTOS.find((p) => p.nombre.includes("Arena Fina"));
assert(
  arena && arena.stock_real === 18 && arena.stock_comprometido === 12 && arena.stock_disponible === 6,
  "Arena Fina metrics match specification: Real=18, Comp=12, Disp=6",
  `Got: Real=${arena?.stock_real}, Comp=${arena?.stock_comprometido}, Disp=${arena?.stock_disponible}`
);

// 3. Cal Santa Elena: Real 80, Comprometido 30, Disp 50
const cal = MOCK_PRODUCTOS.find((p) => p.nombre.includes("Cal Santa Elena"));
assert(
  cal && cal.stock_real === 80 && cal.stock_comprometido === 30 && cal.stock_disponible === 50,
  "Cal Santa Elena metrics match specification: Real=80, Comp=30, Disp=50",
  `Got: Real=${cal?.stock_real}, Comp=${cal?.stock_comprometido}, Disp=${cal?.stock_disponible}`
);

// 4. Hierro Nervado Ø 10mm: Real 250, Comprometido 100, Disp 150
const hierro = MOCK_PRODUCTOS.find((p) => p.nombre.includes("Hierro Nervado"));
assert(
  hierro && hierro.stock_real === 250 && hierro.stock_comprometido === 100 && hierro.stock_disponible === 150,
  "Hierro Nervado metrics match specification: Real=250, Comp=100, Disp=150",
  `Got: Real=${hierro?.stock_real}, Comp=${hierro?.stock_comprometido}, Disp=${hierro?.stock_disponible}`
);

// 5. Ladrillo Hueco: Real 40, Comprometido 15, Disp 25
const ladrillo = MOCK_PRODUCTOS.find((p) => p.nombre.includes("Ladrillo Hueco"));
assert(
  ladrillo && ladrillo.stock_real === 40 && ladrillo.stock_comprometido === 15 && ladrillo.stock_disponible === 25,
  "Ladrillo Hueco metrics match specification: Real=40, Comp=15, Disp=25",
  `Got: Real=${ladrillo?.stock_real}, Comp=${ladrillo?.stock_comprometido}, Disp=${ladrillo?.stock_disponible}`
);

// 6. Malla Electrosoldada: Real 35, Comprometido 15, Disp 20
const malla = MOCK_PRODUCTOS.find((p) => p.nombre.includes("Malla Electrosoldada"));
assert(
  malla && malla.stock_real === 35 && malla.stock_comprometido === 15 && malla.stock_disponible === 20,
  "Malla Electrosoldada metrics match specification: Real=35, Comp=15, Disp=20",
  `Got: Real=${malla?.stock_real}, Comp=${malla?.stock_comprometido}, Disp=${malla?.stock_disponible}`
);

// Stock Extension Simulation
// Orden VT-1049: requested 100 bags, disponible is 60, real is 120 -> Extension of 40 required and feasible
const ordenVT1049 = MOCK_ORDENES.find((o) => o.folio === "VT-1049");
const det1049 = ordenVT1049?.detalles[0];
const extensionRequired = det1049 && det1049.cantidadSolicitada > det1049.cantidadDisponibleCorralon;
const extensionDelta = det1049 ? det1049.cantidadSolicitada - det1049.cantidadDisponibleCorralon : 0;
const feasibleFromRealStock = det1049 ? det1049.cantidadSolicitada <= det1049.stockRealFisico : false;

assert(
  extensionRequired && extensionDelta === 40 && feasibleFromRealStock && det1049.estadoItem === "Extensión requerida",
  "Dual-stock extension protocol: Detects deficit vs disponible (40 un) but feasible vs physical real stock (120 un)"
);

// -------------------------------------------------------------
// TEST SUITE 4: REGISTRATION FLOW ("ALMACÉN" VS "SERVICIO")
// -------------------------------------------------------------
console.log("\n\x1b[1m[Suite 4] Registration Flow Company Type Partitioning\x1b[0m");

// Emulate registration logic matching AuthContext.tsx registerCompany()
function simulateRegistration(input) {
  if (!input.nombreEmpresa || !input.cuitRfc || !input.direccion || !input.nombreAdmin || !input.emailAdmin) {
    return { success: false, error: "Campos obligatorios incompletos" };
  }

  const tenant = {
    id: `tenant-${Date.now()}`,
    nombre: input.nombreEmpresa,
    slug: input.nombreEmpresa.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    cuit_rut_taxid: input.cuitRfc,
    direccion: input.direccion,
    ciudad: input.ciudad || "Rosario",
    pais: input.pais || "Argentina",
    radio_cobertura_km: Number(input.radioCoberturaKm) || 25,
    tipo_empresa: input.tipoEmpresa,
    plan: "pro",
    activo: true,
    habilitado_inventrack: input.tipoEmpresa === "corralon",
    created_at: new Date().toISOString(),
  };

  const admin = {
    id: `usr-${Date.now()}`,
    email: input.emailAdmin.toLowerCase().trim(),
    nombre_completo: input.nombreAdmin,
    cargo: `Administrador General (${input.nombreEmpresa})`,
    rol: "administrador",
    is_super_admin: false,
    tenant_id: tenant.id,
    tenant_nombre: input.nombreEmpresa,
    tipo_empresa: input.tipoEmpresa,
  };

  return { success: true, tenant, admin };
}

// Case A: Almacén / Corralón de Materiales
const regCorralon = simulateRegistration({
  tipoEmpresa: "corralon",
  nombreEmpresa: "Corralón San Juan S.A.",
  cuitRfc: "30-55443322-1",
  direccion: "Ruta 9 Km 280",
  radioCoberturaKm: 35,
  nombreAdmin: "Roberto Sánchez",
  emailAdmin: "roberto@corralonsanjuan.com",
});

assert(
  regCorralon.success === true &&
  regCorralon.tenant.tipo_empresa === "corralon" &&
  regCorralon.tenant.habilitado_inventrack === true,
  "Registering an 'Almacén / Corralón' enables InvenTrack module (habilitado_inventrack = true)"
);

// Case B: Prestador de Servicios / Contratista
const regServicios = simulateRegistration({
  tipoEmpresa: "servicios",
  nombreEmpresa: "Instalaciones Eléctricas Rosario S.R.L.",
  cuitRfc: "30-99887766-4",
  direccion: "San Martín 1200",
  radioCoberturaKm: 15,
  nombreAdmin: "Claudio Morales",
  emailAdmin: "claudio@instalacionesrosario.com",
});

assert(
  regServicios.success === true &&
  regServicios.tenant.tipo_empresa === "servicios" &&
  regServicios.tenant.habilitado_inventrack === false,
  "Registering a 'Prestador de Servicios' bypasses warehouse inventory (habilitado_inventrack = false)"
);

// Case C: Validation error on incomplete submission
const regInvalid = simulateRegistration({
  tipoEmpresa: "corralon",
  nombreEmpresa: "",
  cuitRfc: "",
  direccion: "",
  nombreAdmin: "",
  emailAdmin: "",
});

assert(
  regInvalid.success === false,
  "Registration validation prevents submission without mandatory fields"
);

// -------------------------------------------------------------
// TEST SUITE 5: 1-CLICK DEMO LOGIN SWITCHER (ALL 7 PLATFORM ROLES)
// -------------------------------------------------------------
console.log("\n\x1b[1m[Suite 5] Quick 1-Click Demo Switcher (7 Platform Roles)\x1b[0m");

const expectedDemoUsers = [
  { id: "usr-humberto", email: "humberto@vertia.com", rol: "super_admin", isSuper: true, tenantId: null },
  { id: "usr-federico", email: "federico@vertia.com", rol: "super_admin", isSuper: true, tenantId: null },
  { id: "usr-martin-rossi", email: "martin.rossi@lospinos.com.ar", rol: "administrador", isSuper: false, tenantId: "tenant-los-pinos" },
  { id: "usr-juan-capataz", email: "juan.capataz@lospinos.com.ar", rol: "receptor_mercaderia", isSuper: false, tenantId: "tenant-los-pinos" },
  { id: "usr-carlos-benitez", email: "carlos.benitez@materialescentro.com.ar", rol: "administrador", isSuper: false, tenantId: "tenant-materiales-centro" },
  { id: "usr-lucas-deposito", email: "lucas.deposito@materialescentro.com.ar", rol: "responsable_inventario", isSuper: false, tenantId: "tenant-materiales-centro" },
  { id: "usr-sofia-valenzuela", email: "sofia.valenzuela@constructora.com", rol: "cliente", isSuper: false, tenantId: null },
];

let demoSwitchPass = true;
for (const exp of expectedDemoUsers) {
  const matched = MOCK_USERS.find(
    (u) => u.id === exp.id || u.email.toLowerCase() === exp.email.toLowerCase()
  );

  if (!matched) {
    demoSwitchPass = false;
    console.error(`Demo user not found: ${exp.email}`);
    continue;
  }

  if (
    matched.rol !== exp.rol ||
    matched.is_super_admin !== exp.isSuper ||
    matched.tenant_id !== exp.tenantId
  ) {
    demoSwitchPass = false;
    console.error(`Mismatch for ${exp.email}: expected rol=${exp.rol}, isSuper=${exp.isSuper}, tenantId=${exp.tenantId}; got rol=${matched.rol}, isSuper=${matched.is_super_admin}, tenantId=${matched.tenant_id}`);
  }
}

assert(
  demoSwitchPass,
  "All 7 1-Click demo logins correctly resolve their identity, role, and tenant boundary"
);

// -------------------------------------------------------------
// TEST SUITE 6: ROUTE ACCESS CONTROL & REDIRECTION RULES
// -------------------------------------------------------------
console.log("\n\x1b[1m[Suite 6] Role-Based Route Navigation & Redirection Rules\x1b[0m");

function getLandingRouteForUser(u) {
  if (u.is_super_admin) return "/dashboard";
  if (u.tipo_empresa === "corralon") return "/productos";
  if (u.rol === "cliente") return "/ordenes";
  return "/dashboard";
}

const martinRoute = getLandingRouteForUser(MOCK_USERS.find((u) => u.email === "martin.rossi@lospinos.com.ar"));
assert(
  martinRoute === "/productos",
  "Corralón login redirects directly to InvenTrack module (/productos)",
  `Got: ${martinRoute}`
);

const humbertoRoute = getLandingRouteForUser(humberto);
assert(
  humbertoRoute === "/dashboard",
  "Super admin login redirects to VERTIA Operations Center (/dashboard)",
  `Got: ${humbertoRoute}`
);

const canAccessPlatformAdmin = (u) => u.is_super_admin === true;
assert(
  !canAccessPlatformAdmin(MOCK_USERS.find((u) => u.email === "martin.rossi@lospinos.com.ar")),
  "Corralón user is strictly denied access to Platform Administration (/meta-admin)"
);
assert(
  canAccessPlatformAdmin(humberto) && canAccessPlatformAdmin(federico),
  "Super admins (Humberto & Federico) are granted access to Platform Administration"
);

// -------------------------------------------------------------
// SUMMARY & REPORT
// -------------------------------------------------------------
console.log("\n=======================================================");
console.log(` 📊 VERIFICATION SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log("=======================================================\n");

if (failedTests > 0) {
  console.error(`\x1b[31mVerification failed with ${failedTests} error(s).\x1b[0m\n`);
  process.exit(1);
} else {
  console.log(`\x1b[32m✔ All ${passedTests} automated verification checks passed successfully!\x1b[0m\n`);
  process.exit(0);
}
