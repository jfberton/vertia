/**
 * Automated Verification Script for Hybrid Services Layer
 * Tests:
 * 1. ProductosService: Isolation, Dual Stock Invariant, Update, Toggle B2B Network
 * 2. AlmacenesService: Multi-tenant warehouses, Reception zones, Physical locations, Stock-to-cell assignment
 * 3. OrdenesService: Lifecycle state progression (Pendiente -> En preparación -> Despachada -> Entregada)
 * 4. Hybrid resilience & Zero Data Leakage
 */

import {
  getProductos,
  createProducto,
  updateStock,
  togglePublicacionRed,
  getAlmacenes,
  getUbicaciones,
  createAlmacen,
  asignarProductoAUbicacion,
  getOrdenes,
  createOrden,
  actualizarEstadoOrden,
} from "../src/lib/services";

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details = "") {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m - ${testName}`);
    passedTests++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m - ${testName} ${details ? `(${details})` : ""}`);
    failedTests++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log(" 🧪 INVENTRACK V2 - HYBRID SERVICES VERIFICATION SUITE");
  console.log("=======================================================\n");

  // -------------------------------------------------------------
  // SUITE 1: PRODUCTOS SERVICE & DUAL STOCK INVARIANT
  // -------------------------------------------------------------
  console.log("\x1b[1m[Suite 1] ProductosService & Dual Stock Invariant\x1b[0m");

  // 1.1 Tenant Isolation
  const pinosProds = await getProductos("tenant-los-pinos");
  const centroProds = await getProductos("tenant-materiales-centro");
  const allProds = await getProductos("all", true);

  assert(
    pinosProds.length > 0 && pinosProds.every((p) => p.tenant_id === "tenant-los-pinos"),
    "getProductos strictly isolates products for tenant-los-pinos",
    `Count: ${pinosProds.length}`
  );

  assert(
    centroProds.length > 0 && centroProds.every((p) => p.tenant_id === "tenant-materiales-centro"),
    "getProductos strictly isolates products for tenant-materiales-centro",
    `Count: ${centroProds.length}`
  );

  assert(
    allProds.length === pinosProds.length + centroProds.length,
    "getProductos('all', true) returns consolidated view for super admin",
    `All: ${allProds.length}, Pinos: ${pinosProds.length}, Centro: ${centroProds.length}`
  );

  // 1.2 Dual Stock Invariant on getProductos
  const invariantCheck = allProds.every((p) => p.stock_disponible === p.stock_real - p.stock_comprometido);
  assert(
    invariantCheck,
    "Mathematical invariant holds for all retrieved products: stock_disponible = stock_real - stock_comprometido"
  );

  // 1.3 Create Product with Invariant Enforcement
  const newProduct = await createProducto({
    tenant_id: "tenant-los-pinos",
    codigo_barras: "7799999000111",
    nombre: "Vigueta Pretensada T11 x 4.20m",
    categoria: "Estructuras",
    unidad_medida: "UN",
    precio: 18500,
    stock_real: 150,
    stock_comprometido: 30,
    stock_disponible: 99999, // Intentional wrong value to test enforcement
    cantidad_minima: 20,
    cantidad_maxima: 300,
    publicado_en_red: true,
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Galpón Central Oeste • Patio Vigas",
  });

  assert(
    newProduct.stock_disponible === 120, // 150 - 30 = 120
    "createProducto strictly enforces invariant (150 real - 30 comp = 120 disp)",
    `Got stock_disponible: ${newProduct.stock_disponible}`
  );

  // 1.4 updateStock with Invariant
  const updatedStockProd = await updateStock(newProduct.id, 200, 50);
  assert(
    updatedStockProd.stock_real === 200 &&
    updatedStockProd.stock_comprometido === 50 &&
    updatedStockProd.stock_disponible === 150,
    "updateStock successfully updates stock maintaining invariant (200 - 50 = 150)",
    `Real=${updatedStockProd.stock_real}, Comp=${updatedStockProd.stock_comprometido}, Disp=${updatedStockProd.stock_disponible}`
  );

  // 1.5 togglePublicacionRed
  const toggledOff = await togglePublicacionRed(newProduct.id, false);
  assert(
    toggledOff.publicado_en_red === false,
    "togglePublicacionRed deactivated B2B network publication"
  );
  const toggledOn = await togglePublicacionRed(newProduct.id, true);
  assert(
    toggledOn.publicado_en_red === true,
    "togglePublicacionRed activated B2B network publication"
  );

  // -------------------------------------------------------------
  // SUITE 2: ALMACENES SERVICE & PHYSICAL STORAGE MATRIX
  // -------------------------------------------------------------
  console.log("\n\x1b[1m[Suite 2] AlmacenesService & Physical Storage Matrix\x1b[0m");

  const pinosAlms = await getAlmacenes("tenant-los-pinos");
  assert(
    pinosAlms.length >= 2 && pinosAlms.every((a) => a.tenant_id === "tenant-los-pinos"),
    "getAlmacenes isolates warehouses for tenant-los-pinos",
    `Found ${pinosAlms.length} warehouses`
  );

  const centralAlm = pinosAlms.find((a) => a.id === "alm-pinos-central");
  assert(
    !!centralAlm && centralAlm.es_zona_recepcion === false,
    "Main warehouse is not a reception zone (es_zona_recepcion = false)"
  );

  const recepcionAlm = pinosAlms.find((a) => a.id === "alm-pinos-recepcion");
  assert(
    !!recepcionAlm && recepcionAlm.es_zona_recepcion === true,
    "Reception warehouse flag verified (es_zona_recepcion = true)"
  );

  // 2.1 getUbicaciones
  const ubicacionesPinos = await getUbicaciones("alm-pinos-central");
  assert(
    ubicacionesPinos.length > 0 && ubicacionesPinos.every((u) => u.almacen_id === "alm-pinos-central"),
    "getUbicaciones returns physical storage cells for alm-pinos-central",
    `Count: ${ubicacionesPinos.length}`
  );

  // 2.2 createAlmacen with Reception Zone Flag
  const nuevoAlmacen = await createAlmacen({
    tenant_id: "tenant-los-pinos",
    nombre: "Patio Exterior de Descarga Pesada",
    direccion: "Portón Sur 3, Circunvalación 4500",
    radio_cobertura_km: 25,
    coordenadas_gps: "-32.9520, -60.6670",
    capacidad_maxima: 8000,
    es_zona_recepcion: true,
    total_ubicaciones: 50,
    ocupacion_porcentaje: 10,
    descripcion: "Bahía para camiones con semirremolque y acoplados.",
  });

  assert(
    nuevoAlmacen.id.startsWith("alm-") && nuevoAlmacen.es_zona_recepcion === true,
    "createAlmacen correctly creates warehouse preserving es_zona_recepcion flag",
    `Created ID: ${nuevoAlmacen.id}`
  );

  // 2.3 asignarProductoAUbicacion
  const targetUbicacion = ubicacionesPinos[0];
  const asignada = await asignarProductoAUbicacion(
    targetUbicacion.id,
    newProduct.id,
    85,
    "LOTE-VIG-2024-TEST"
  );

  assert(
    asignada.cantidad === 85 &&
    asignada.producto_actual === newProduct.nombre &&
    asignada.lote === "LOTE-VIG-2024-TEST" &&
    asignada.estado === "ocupado",
    "asignarProductoAUbicacion associates material, lot and occupancy status to storage cell",
    `Estado=${asignada.estado}, Cant=${asignada.cantidad}, Lote=${asignada.lote}`
  );

  // -------------------------------------------------------------
  // SUITE 3: ORDENES SERVICE & WORKFLOW PROGRESSION
  // -------------------------------------------------------------
  console.log("\n\x1b[1m[Suite 3] OrdenesService & Lifecycle Progression\x1b[0m");

  const pinosOrdenes = await getOrdenes("tenant-los-pinos");
  assert(
    pinosOrdenes.length > 0 && pinosOrdenes.every((o) => o.tenant_id === "tenant-los-pinos"),
    "getOrdenes strictly isolates requests and orders for tenant-los-pinos",
    `Orders count: ${pinosOrdenes.length}`
  );

  // 3.1 createOrden
  const nuevaOrden = await createOrden({
    tenant_id: "tenant-los-pinos",
    folio: "VT-TEST-9901",
    tipo: "Material",
    proyectoUbicacion: "Torre Alvear - Cimentación Fase 1",
    cliente: "Constructora Delta S.A.",
    corralonAsignado: "Corralón Los Pinos S.R.L.",
    fecha: "Hoy, 15:30 hs",
    estado: "Asignada",
    distanciaKm: 6.2,
    detalles: [
      {
        id: "det-test-1",
        material: "Cemento Loma Negra 50kg (Bolsa)",
        codigo: "7791234567890",
        cantidadSolicitada: 80,
        cantidadDisponibleCorralon: 60,
        stockRealFisico: 120,
        cantidadAutorizadaExtension: 20,
        unidad: "BL",
        estadoItem: "Extensión requerida",
      },
    ],
  });

  assert(
    nuevaOrden.id.startsWith("ord-") && nuevaOrden.estado === "Asignada",
    "createOrden created order successfully with Asignada / Pendiente state",
    `Folio: ${nuevaOrden.folio}, ID: ${nuevaOrden.id}`
  );

  // 3.2 Workflow Progression: Pendiente -> En preparación -> Despachada -> Entregada
  const step1 = await actualizarEstadoOrden(nuevaOrden.id, "En preparación");
  assert(
    step1.estado === "En preparación",
    "actualizarEstadoOrden moved to 'En preparación'"
  );

  const step2 = await actualizarEstadoOrden(nuevaOrden.id, "Despachada");
  assert(
    step2.estado === "En camino",
    "actualizarEstadoOrden moved to 'Despachada' (normalized to 'En camino')"
  );

  const step3 = await actualizarEstadoOrden(nuevaOrden.id, "Entregada");
  assert(
    step3.estado === "Entregada",
    "actualizarEstadoOrden completed final delivery step 'Entregada'"
  );

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(` 📊 HYBRID SERVICES SUITE: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log("=======================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
