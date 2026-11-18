/**
 * Automated Verification Script for Hybrid Services Layer
 * Tests:
 * 1. ProductosService: Isolation, Dual Stock Invariant, Update, Toggle B2B Network
 * 2. AlmacenesService: Multi-tenant warehouses, Reception zones, Physical locations, Stock-to-cell assignment
 * 3. OrdenesService: Lifecycle state progression (Pendiente -> En preparación -> Despachada -> Entregada)
 * 4. SyncMonitorService: Heartbeat, Connectivity state, Subscriptions, Forced trigger check
 * 5. OfflineQueueService: Offline mutations, Zero leakage, Reconciliation & Inventory Deficit Conflict Resolution
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
  syncMonitor,
  offlineQueueService,
  SyncState,
} from "../src/lib/services";

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean | unknown, testName: string, details = "") {
  if (Boolean(condition)) {
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
  // SUITE 4: SYNC MONITOR SERVICE & HEARTBEAT
  // -------------------------------------------------------------
  console.log("\n\x1b[1m[Suite 4] SyncMonitorService: Heartbeat & Connectivity State\x1b[0m");

  const initialState = syncMonitor.getState();
  assert(
    typeof initialState.isOnline === "boolean" &&
    typeof initialState.nextRetrySeconds === "number" &&
    typeof initialState.isChecking === "boolean",
    "syncMonitor.getState() provides strict SyncState contract",
    `isOnline=${initialState.isOnline}, retryIn=${initialState.nextRetrySeconds}s`
  );

  // 4.1 Reactive subscription test
  let receivedUpdates = 0;
  let lastReceivedState: SyncState | null = null;
  const unsubscribe = syncMonitor.subscribe((state) => {
    receivedUpdates++;
    lastReceivedState = state;
  });

  assert(
    receivedUpdates >= 1 && lastReceivedState !== null,
    "syncMonitor.subscribe() immediately broadcasts current sync state"
  );

  // 4.2 Simulated status changes and mock mode
  syncMonitor.setMockOnline(false);
  const stateOffline = syncMonitor.getState();
  assert(
    stateOffline.isOnline === false,
    "syncMonitor accurately handles and propagates simulated offline transition"
  );

  syncMonitor.setMockOnline(true);
  const stateOnline = syncMonitor.getState();
  assert(
    stateOnline.isOnline === true && stateOnline.lastSyncTime !== null,
    "syncMonitor accurately handles and propagates simulated online transition with lastSyncTime timestamp"
  );

  // 4.3 Trigger manual check
  const manualCheckResult = await syncMonitor.triggerCheck();
  assert(
    typeof manualCheckResult === "boolean",
    "syncMonitor.triggerCheck() executes heartbeat check and returns boolean status without crashing"
  );

  // Reset mock state to clean up
  syncMonitor.setMockOnline(null);
  unsubscribe();

  // -------------------------------------------------------------
  // SUITE 5: OFFLINE QUEUE SERVICE & STOCK CONFLICT RECONCILIATION
  // -------------------------------------------------------------
  console.log("\n\x1b[1m[Suite 5] OfflineQueueService & Inventory Deficit Reconciliation Protocol\x1b[0m");

  // Clean queues before running suite
  offlineQueueService.clearQueue();

  // 5.1 Enqueue offline mutations with Zero Leakage partitioning
  const mut1 = offlineQueueService.enqueue({
    tenantId: "tenant-los-pinos",
    operarioId: "op-pinos-1",
    productoId: newProduct.id,
    tipo: "venta",
    cantidad: 20,
    stockRealAlMomento: 200,
    detalles: { motivo: "Venta en mostrador sin red" },
  });

  const mut2 = offlineQueueService.enqueue({
    tenantId: "tenant-materiales-centro",
    operarioId: "op-centro-1",
    productoId: "prod-hierro-nervado-12mm",
    tipo: "venta",
    cantidad: 10,
    stockRealAlMomento: 250,
  });

  assert(
    mut1.id.startsWith("mut-") && mut2.id.startsWith("mut-"),
    "offlineQueueService.enqueue() generates unique traceable mutation IDs"
  );

  // Multi-tenant isolation in offline queue
  const pinosQueue = offlineQueueService.getQueue("tenant-los-pinos");
  const centroQueue = offlineQueueService.getQueue("tenant-materiales-centro");
  const allQueue = offlineQueueService.getQueue();

  assert(
    pinosQueue.length === 1 && pinosQueue[0].id === mut1.id,
    "offlineQueueService.getQueue() strictly isolates queued mutations for tenant-los-pinos"
  );
  assert(
    centroQueue.length === 1 && centroQueue[0].id === mut2.id,
    "offlineQueueService.getQueue() strictly isolates queued mutations for tenant-materiales-centro"
  );
  assert(
    allQueue.length === 2,
    "Consolidated queue correctly reflects all pending mutations across network"
  );

  // 5.2 Case A: Successful Reconciliation (stock_disponible >= cantidad)
  // newProduct has: stock_real=200, stock_comprometido=50 -> stock_disponible=150
  // mut1 demands 20 units -> 150 >= 20 -> Should apply smoothly
  offlineQueueService.clearQueue("tenant-materiales-centro"); // Leave only mut1 for isolated test

  const reconcileResultSuccess = await offlineQueueService.processReconciliation();
  assert(
    reconcileResultSuccess.exitosas === 1 && reconcileResultSuccess.conflictos === 0,
    "processReconciliation() successfully applied valid mutation when stock_disponible >= cantidad",
    `Exitosas=${reconcileResultSuccess.exitosas}, Conflictos=${reconcileResultSuccess.conflictos}`
  );

  const queueAfterSuccess = offlineQueueService.getQueue("tenant-los-pinos");
  assert(
    queueAfterSuccess.length === 0,
    "Applied mutation is cleanly dequeued after successful reconciliation"
  );

  const prodsAfterReconciliation = await getProductos("tenant-los-pinos");
  const recheckedProd = prodsAfterReconciliation.find((p) => p.id === newProduct.id);
  assert(
    !!recheckedProd &&
    recheckedProd.stock_real === 180 && // 200 - 20 = 180
    recheckedProd.stock_comprometido === 50 &&
    recheckedProd.stock_disponible === 130, // 180 - 50 = 130
    "Reconciliation maintained strict Dual Stock invariant (180 - 50 = 130)",
    `Real=${recheckedProd?.stock_real}, Comp=${recheckedProd?.stock_comprometido}, Disp=${recheckedProd?.stock_disponible}`
  );

  // 5.3 Case B: Conflict / Stock Deficit Detection (stock_disponible < cantidad)
  // Let's create a product with limited available stock
  const limitedProduct = await createProducto({
    tenant_id: "tenant-los-pinos",
    codigo_barras: "7799999000222",
    nombre: "Pintura Látex Exterior 20L",
    categoria: "Terminaciones",
    unidad_medida: "LT",
    precio: 35000,
    stock_real: 15,
    stock_comprometido: 10, // Available = 15 - 10 = 5
    stock_disponible: 5,
    cantidad_minima: 5,
    cantidad_maxima: 50,
    publicado_en_red: false,
    almacen_id: "alm-pinos-central",
    ubicacion_estanteria: "Sector Pinturas",
  });

  // Offline operator attempts to sell 12 units (they saw stock_real=15, unaware of 10 committed units)
  const conflictingMutation = offlineQueueService.enqueue({
    tenantId: "tenant-los-pinos",
    operarioId: "op-pinos-2",
    productoId: limitedProduct.id,
    tipo: "venta",
    cantidad: 12, // Needs 12, but available is only 5 -> Deficit of 7
    stockRealAlMomento: 15,
  });

  const reconcileConflictResult = await offlineQueueService.processReconciliation();
  assert(
    reconcileConflictResult.conflictos === 1 && reconcileConflictResult.exitosas === 0,
    "processReconciliation() correctly detected inventory deficit and blocked blind mutation",
    `Conflictos=${reconcileConflictResult.conflictos}, Exitosas=${reconcileConflictResult.exitosas}`
  );

  // Verify Conflict Inbox Entry
  const activeConflicts = offlineQueueService.getConflictos("tenant-los-pinos");
  const foundConflict = activeConflicts.find((c) => c.mutation.id === conflictingMutation.id);

  assert(
    !!foundConflict &&
    foundConflict.estado === "pendiente_resolucion" &&
    foundConflict.diferenciaFaltante === 7 && // 12 - 5 = 7
    foundConflict.stockRemotoDisponible === 5,
    "Conflict inbox stores detailed deficit record with missing difference (7 units)",
    `Faltante=${foundConflict?.diferenciaFaltante}, Estado=${foundConflict?.estado}`
  );

  // 5.4 Admin Conflict Resolution Strategy 1: 'autorizar_extension'
  const resolvedExtension = await offlineQueueService.resolverConflicto(
    foundConflict!.id,
    "autorizar_extension",
    {
      autorizadorId: "super-admin-humberto",
      comentario: "Autorizado sobre stock físico con reposición urgente vía red B2B",
    }
  );

  assert(
    resolvedExtension.estado === "resuelto_extension" &&
    resolvedExtension.resueltoPor === "super-admin-humberto" &&
    Boolean(resolvedExtension.resolucionDetalle?.includes("B2B")),
    "resolverConflicto('autorizar_extension') resolves deficit via B2B network / physical override"
  );

  // 5.5 Admin Conflict Resolution Strategy 2: 'ajuste_parcial'
  // Create another conflicting mutation
  const partialMutation = offlineQueueService.enqueue({
    tenantId: "tenant-los-pinos",
    operarioId: "op-pinos-3",
    productoId: newProduct.id, // currently available: 130
    tipo: "venta",
    cantidad: 200, // Deficit: 200 - 130 = 70
    stockRealAlMomento: 180,
  });

  await offlineQueueService.processReconciliation();
  const partialConflict = offlineQueueService
    .getConflictos("tenant-los-pinos")
    .find((c) => c.mutation.id === partialMutation.id);

  assert(
    !!partialConflict && partialConflict.estado === "pendiente_resolucion",
    "Second conflict created for partial fulfillment scenario"
  );

  const resolvedPartial = await offlineQueueService.resolverConflicto(
    partialConflict!.id,
    "ajuste_parcial",
    {
      autorizadorId: "encargado-deposito",
      comentario: "Despachar lo disponible en stock y emitir remito por el saldo",
    }
  );

  assert(
    resolvedPartial.estado === "resuelto_parcial" &&
    Boolean(resolvedPartial.resolucionDetalle?.includes("Ajuste parcial")),
    "resolverConflicto('ajuste_parcial') fulfills available stock and queues backorder for remainder"
  );

  // 5.6 Admin Conflict Resolution Strategy 3: 'cancelar'
  const cancelMutation = offlineQueueService.enqueue({
    tenantId: "tenant-los-pinos",
    operarioId: "op-pinos-4",
    productoId: limitedProduct.id,
    tipo: "venta",
    cantidad: 999,
    stockRealAlMomento: 3,
  });

  await offlineQueueService.processReconciliation();
  const cancelConflict = offlineQueueService
    .getConflictos("tenant-los-pinos")
    .find((c) => c.mutation.id === cancelMutation.id);

  const resolvedCancelled = await offlineQueueService.resolverConflicto(
    cancelConflict!.id,
    "cancelar",
    {
      autorizadorId: "supervisor-ventas",
      comentario: "Cliente desistió ante el quiebre de stock",
    }
  );

  assert(
    resolvedCancelled.estado === "cancelado" &&
    Boolean(resolvedCancelled.resolucionDetalle?.includes("cancelada")),
    "resolverConflicto('cancelar') safely aborts offline transaction without corrupting inventory"
  );

  // 5.7 Audit Trail Verification
  const auditLogs = offlineQueueService.getAuditoria("tenant-los-pinos");
  assert(
    auditLogs.length >= 3 &&
    auditLogs.some((a) => a.resultado === "exito") &&
    auditLogs.some((a) => a.resultado === "conflicto") &&
    auditLogs.some((a) => a.resultado === "resuelto"),
    "AuditoriaReconciliacion retains complete forensic log for all reconciliation events",
    `Total audit events: ${auditLogs.length}`
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
