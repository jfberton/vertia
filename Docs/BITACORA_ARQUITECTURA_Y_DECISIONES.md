# 📓 VERTIA / InvenTrack v2 - Bitácora de Arquitectura, Decisiones Técnicas y Control de Calidad

Esta bitácora es el documento vivo de referencia para el equipo de desarrollo y los agentes de IA que colaboran en el proyecto. Registra las decisiones arquitectónicas clave, directrices de diseño, estado de avance y control de calidad.

---

## 🏛️ 1. Principios Arquitectónicos y Reglas Innegociables

1. **Aislamiento Multi-Tenant Estricto (Zero Leakage):**
   - Toda consulta a la base de datos debe filtrar explícitamente por `tenant_id` y estar respaldada por políticas RLS en PostgreSQL.
   - Ningún corralón ni cliente puede acceder a datos, ubicaciones, clientes ni órdenes de otra organización ajena, excepto aquello explícitamente publicado en la Red B2B.
   - Super Administradores (`super_admin`: Humberto Rivero González y Federico Bertoncini) poseen visibilidad global y capacidad de alternar entre tenants dinámicamente.

2. **Invariante Matemático de Dual Stock:**
   $$\text{Stock Disponible} = \text{Stock Real Físico} - \text{Stock Comprometido}$$
   - Nunca debe comprometerse ni venderse mercadería por encima del Stock Disponible sin mediar una autorización formal de extensión sobre el Stock Real Físico.
   - El despacho físico descuenta simultáneamente el `Stock Real` y libera el `Stock Comprometido`.

3. **Arquitectura Serverless y Costo Cero Inicial:**
   - Frontend en Next.js (App Router) sobre Cloudflare Pages.
   - Backend as a Service en Supabase (PostgreSQL 15 + RLS + Supabase Auth + Supabase Storage).
   - Optimización estricta de cuotas en planes gratuitos (compresión de imágenes en el cliente a ~300 KB antes de subida).

4. **Compatibilidad Híbrida (Demo Offline & Producción Supabase):**
   - El sistema debe mantener siempre operativo el **Demo Switcher 1-Click** con datos mockeados para demostraciones comerciales instantáneas y pruebas locales sin conexión a internet.
   - Cuando las credenciales de Supabase estén activas y las tablas existan, el sistema consumirá los datos reales de la base de datos de manera transparente.

5. **Control de Calidad (QA) y Regresión Continua:**
   - Cada nueva funcionalidad debe estar cubierta por la suite de pruebas automatizadas (`npm test`), la cual debe finalizar siempre con 100% de éxito antes de cualquier commit.
   - La compilación `npm run build` debe mantenerse libre de advertencias críticas o errores de tipos TypeScript.

---

## 👥 2. Gobernanza de Agentes y Roles de Trabajo

- **Agente Orquestador (Lead Architect & QA Controller):**
  - Rol asignado al agente principal (Antigravity).
  - Responsabilidad: Supervisa el cumplimiento de la arquitectura, revisa el código de los subagentes, valida que no haya fuga de datos entre tenants, ejecuta la suite de tests (`npm test` y `npm run build`), mantiene actualizada esta bitácora y realiza los commits.
- **Subagentes de Dominio / Tareas Paralelas:**
  - Especialistas asignados a componentes o módulos delimitados (ej. Servicios Supabase, Matriz 3D de Galpón, Motor de Remitos PDF, Compresor de Evidencias).
  - Reportan directamente al Lead Architect para validación de código antes de su integración.

---

## 🗺️ 3. Hoja de Ruta Maestra (Roadmap de Implementación)

| Fase | Módulo / Tarea | Estado | Responsable |
| :--- | :--- | :--- | :--- |
| **0** | Configuración de entorno local, `.env.local` y pruebas base (32/32 tests) | ✅ Completado | Lead Architect |
| **1** | Capa de Servicios Híbrida Supabase (`src/lib/services/`) con fallback a Mocks | ✅ Completado | Subagente Backend / Supabase |
| **2** | Matriz Espacial 2D Industrial y Zona de Embarque (Staging) | ✅ Completado | Subagente Frontend UI |
| **2.1** | Monitor de Conectividad Heartbeat y Protocolo de Reconciliación de Stock Offline | ✅ Completado | Subagente Backend |
| **3** | Flujo de Picking, Transición de Dual Stock y Generador de Remitos PDF | ✅ Completado | Subagente Logística |
| **4** | Uploader de Evidencias Fotográficas con Compresión en Cliente a Supabase Storage | ✅ Completado | Subagente Media/Storage |
| **5** | Red B2B: Negociación de Excedentes y Chat de Extensión en Tiempo Real | ⚪ Pendiente | Subagente Realtime |

---

## 📝 4. Registro Cronológico de Decisiones y Cambios

### [2026-11-19] - Rediseño Integral de la Landing Page: Dolores de la Industria, 3 Entornos Interactivos y Stepper de Flujo
- **Autor / Agente:** Lead Architect (Antigravity).
- **Problema de UX Detectado:**
  - Las tarjetas de los tres entornos mostraban maquetas de UI dobles excesivamente compactas, apiñadas e ilegibles en columnas estrechas de 320px.
  - La propuesta de valor carecía de un bloque previo que expusiera claramente los dolores y el desorden analógico que la plataforma resuelve.
- **Solución y Mejoras Implementadas:**
  1. **Sección Superior de Dolores y Diagnóstico de la Industria (`#problema`):**
     - 4 tarjetas destacadas con alertas cromáticas:
       1. *Caos por WhatsApp & Audios Perdidos* (pedidos informales sin trazabilidad).
       2. *Stock Fantasma & Sobreventas* (corralones vendiendo mercadería ya comprometida).
       3. *Pagos a Ciegas & Riesgo de Cobro* (desconfianza financiera entre constructora y corralón).
       4. *Remitos de Papel Extraviados* (falta de evidencias de entrega en destino).
     - Banner de contraste: *"Del caos analógico a la sincronización digital con custodia de fondos"*.
  2. **Los 3 Entornos en Formato Showcase Espacioso con Animación (`#entornos`):**
     - Se reemplazaron las tarjetas apiñadas por un **Selector Interactivo de Entornos** (Tabs animadas: *App del Cliente*, *App del Corralón / InvenTrack* y *App de VERTIA*).
     - Exhibición con diseño estilo estudio (tipo Vercel/Linear), tipografía legible, badges de rol y paneles visuales amplios con métricas reales.
  3. **Stepper Dinámico del Flujo de una Solicitud (`#flujo`):**
     - 6 pasos interactivos conectados (desde la creación del requerimiento por el cliente, ruteo por Vertia, aprobación y custodia Escrow, picking en galpón WMS con remito oficial R-091 con QR, entrega con foto comprimida WebP, hasta la conformidad y liberación de fondos).
     - Al seleccionar cada paso, se actualiza en vivo el detalle explicativo, la evidencia requerida y el estado en el sistema.
  4. **Acceso Rápido y Simulador 1-Click (`#acceso`):**
     - 3 tarjetas de acceso directo por rol para probar en caliente cada entorno.
- **Control de Calidad:**
  - Suite automatizada: **103 / 103 pruebas superadas al 100% (0 fallos)**.
  - Compilación de producción con Turbopack: **14 / 14 rutas estáticas generadas limpiamente**.

### [2026-11-18] - Separación Arquitectónica: Vertia (Operador de Red) vs InvenTrack (Manejo Interno del Corralón)
- **Autor / Agente:** Lead Architect (Antigravity).
- **Directriz de Negocio:**
  - El administrador de Vertia no administra el manejo interno de los corralones (sus galpones, racks ni movimientos físicos son privativos del corralón a través de InvenTrack).
  - Los administradores de Vertia ven a los corralones como **clientes / proveedores de materiales de la red**.
  - Facultades del Administrador de Vertia sobre las empresas:
    1. **Habilitar o inhabilitar** a la empresa para que opere con el aplicativo InvenTrack (`habilitado_inventrack`).
    2. **Otorgar bonificaciones comerciales** (porcentajes de descuento y registro del motivo comercial: convenios con cámaras, bonificación de prueba, promociones por volumen).
    3. **Anular o reactivar suscripciones** a la red Vertia.
    4. **Control contable simple** (suma de tarifas base, resta de bonificaciones otorgadas y cálculo neto a cobrar MRR).
- **Implementación Arquitectónica:**
  1. **Navegación (`Sidebar.tsx`):**
     - Se eliminó completamente la ruta de galpones internos (`/almacenes`) del menú del Super Administrador.
     - Se jerarquizó el acceso a **"Empresas & Clientes de Red"** (`/meta-admin`) en la consola del operador de Vertia.
     - Se etiquetó el catálogo como **"Catálogo Red B2B (Auditoría)"** (`/productos`).
  2. **Portal de Meta-Administrador (`src/app/(dashboard)/meta-admin/page.tsx`):**
     - Tabla organizada con identificación clara: Proveedor de Materiales (Corralón) vs Cliente Comprador (Obras).
     - Estado de operatividad InvenTrack con switch directo para inhabilitar o habilitar el aplicativo WMS.
     - Modal para otorgar bonificaciones comerciales con cálculo de impacto contable en vivo y registro de motivo comercial.
     - Botón de anulación definitiva de suscripción a la red.
     - Panel de economía con desglose contable simple (Suma facturación plena - Resta bonificaciones = Facturación neta a cobrar).
  3. **Guardián RBAC (`DashboardAuthGuard.tsx`):**
     - Si un Super Admin intenta navegar manualmente a `/almacenes`, es redirigido a `/meta-admin` con aviso informativo.
     - Si un corralón es inhabilitado por Vertia (`habilitado_inventrack === false`), el guardián bloquea de inmediato su acceso a `/productos` y `/almacenes`.
- **Control de Calidad:**
  - Pruebas automatizadas: **90 / 90 tests pasando al 100% (0 fallos)**.
  - Compilación `npm run build` con Turbopack exitosa en las 13 rutas estáticas.

### [2026-11-18] - Modo Solo Lectura / Auditoría para Administradores de Vertia en Módulos de Corralón (InvenTrack)
- **Autor / Agente:** Lead Architect (Antigravity).
- **Requerimiento del Negocio (Humberto / Vertia):**
  - Los administradores de Vertia (`super_admin` / Operadores del Meta-Admin) poseen visibilidad de stock global (Stock Real y Stock Disponible), pero **tienen terminantemente prohibido alterar el inventario físico, crear productos o modificar la visibilidad de los corralones**.
  - La administración del inventario, la creación de materiales, la estiba/slotting físico en celdas de galpón y el toggle de visibilidad para compartir en la Red B2B son **facultades exclusivas del Administrador y personal del Corralón** a través de InvenTrack.
- **Implementación Arquitectónica y UI/UX:**
  1. **Catálogo de Materiales (`src/app/(dashboard)/productos/page.tsx`):**
     - Ocultación del botón "Registrar Material" para Super Admin, reemplazado por un indicador visual claro: `Modo Auditoría · Solo Lectura`.
     - Deshabilitación del toggle B2B ("Publicar en Red") para el Super Admin con tooltip explicativo ("Solo la empresa propietaria puede publicar en la Red B2B").
     - Ocultación de la columna de acciones operativas (editar/ajustar) cuando el usuario es Super Admin.
     - Bloqueo en el handler de mutación para rechazar programmaticamente cualquier intento de edición o alta no autorizada.
  2. **Galpones y Matriz WMS (`src/app/(dashboard)/almacenes/page.tsx`):**
     - Reemplazo del botón "Nuevo Almacén / Galpón" por una insignia informativa de `Auditoría WMS · Solo Lectura`.
     - Inyección de la propiedad `readOnly={isSuperAdmin}` en el inspector lateral de celdas.
  3. **Inspector de Celdas (`src/components/warehouses/WarehouseCellInspector.tsx`):**
     - Al estar en `readOnly`, se suprimen los botones de acción física ("Ubicar Mercadería", "Mover Lote", "Ajustar Stock") y se despliega una placa de estado "Modo Auditoría · Permisos de solo lectura".
- **Control de Calidad:**
  - Suite automatizada `npm test`: **90 / 90 tests pasando al 100% (0 fallos)**.
  - Compilación de producción con Turbopack `npm run build`: Exitosa en todas las 13 rutas estáticas.

### [2026-11-18] - Implementación de Guardián de Rutas RBAC y Protección contra Accesos No Autenticados
- **Autor / Agente:** Lead Architect (Antigravity).
- **Problema Detectado:** Al acceder directamente a rutas internas (como `/evidencias`, `/almacenes`, etc.) sin sesión iniciada, el contexto `AuthContext` asignaba automáticamente al usuario Super Admin por defecto (`MOCK_USERS[0]`), permitiendo la navegación anónima sin pasar por el login.
- **Solución Arquitectónica:**
  1. **Guardián Central (`DashboardAuthGuard.tsx`):**
     - Envuelve a todo el layout del dashboard.
     - Si el usuario no está autenticado (`user === null`), bloquea de inmediato la carga de vistas internas y redirige a `/login?redirect=${pathname}`.
     - Si el usuario está autenticado pero su rol no tiene permiso para la ruta (ej. Corralón intentando entrar a `/meta-admin`, o Constructora/Cliente intentando entrar a `/almacenes` o `/productos`), deniega el acceso y lo redirige a su módulo autorizado (`/productos` o `/ordenes`).
  2. **Corrección de Inicialización en `AuthContext.tsx`:**
     - El estado inicial de `user` es estrictamente `null`.
     - Si no existe sesión previa en `localStorage`, no se auto-inicia sesión con Humberto ni con ningún usuario demo.
  3. **Preservación de Destino en `LoginPage.tsx`:**
     - Detecta el parámetro `redirect` y muestra un aviso visual de sesión requerida.
     - Al autenticarse (por credenciales o 1-Click demo), redirige al usuario directamente al módulo que intentaba consultar si su perfil lo permite.

### [2026-11-18] - Entrega de Fase 3 (Picking y Remitos PDF) y Fase 4 (Evidencias con Compresión WebP en Cliente)
- **Autor / Agente:** Lead Architect (Antigravity), Subagente Logística y Subagente Media/Storage.
- **Decisiones Técnicas y Entregables:**
  1. **Flujo de Picking, Zona de Embarque y Remitos Oficiales PDF (`ordenes/page.tsx`):**
     - Se creó `PickingModal.tsx`: recolección guiada por coordenadas WMS (`Pasillo` -> `Rack` -> `Nivel`), lotes, bultos y peso kg acumulado. Al completar la recolección, traslada automáticamente la mercadería al Pulmón de Salida (**Zona de Embarque**).
     - Se creó `RemitoPdfModal.tsx`: documento oficial de entrega con formato legal argentino (Formulario R - Código 091: "DOCUMENTO NO VÁLIDO COMO FACTURA"), datos del corralón, cliente, chofer, patente, código QR de verificación, casillas reglamentarias de firma y estilos `@media print` optimizados para salida en hoja A4 limpia.
     - Acción "Confirmar Despacho / Salida de Camión": avanza la orden a `En camino` / `Despachada`, descuenta el `Stock Real` y libera el `Stock Comprometido` garantizando la invariante de Dual Stock.
  2. **Compresión Client-Side y Supabase Storage (`evidencias/page.tsx` y `image-compressor.ts`):**
     - Motor de compresión en Canvas HTML5 (`image-compressor.ts`) que procesa fotos de celular de 4 a 10 MB, redimensiona a 1600x1200 px y exporta a WebP/JPEG al 82% de calidad, reduciendo el peso a **~250-280 KB (>90% de ahorro de cuota)** antes de la transferencia.
     - Servicio `evidencias.service.ts`: subida directa al bucket seguro `evidencias` en Supabase Storage con fallback local tolerante a desconexión y aislamiento multi-tenant estricto.
     - Modal "Subir Nueva Evidencia / Remito Firmado" con input de cámara móvil, comparación de peso en tiempo real y visor interactivo.
  3. **Control de Calidad:**
     - Suite automatizada ampliada a **90 verificaciones pasando al 100% (0 fallos)** (32 de autenticación/multi-tenant + 58 de servicios híbridos, sync, cola offline y compresión).
     - `next build` limpio con Turbopack en las 13 rutas estáticas.

### [2026-11-18] - Entrega de Paso 1 (Matriz 2D y Zona de Embarque) y Paso 2 (Monitor de Red y Reconciliación Offline)

### [2026-11-18] - Entrega de Paso 1 (Matriz 2D y Zona de Embarque) y Paso 2 (Monitor de Red y Reconciliación Offline)
- **Autor / Agente:** Lead Architect (Antigravity), Subagente Frontend y Subagente Backend.
- **Decisiones Técnicas y Entregables:**
  1. **Matriz Espacial 2D Industrial y Pulmón de Salida (`almacenes/page.tsx`):**
     - Se reemplazó la perspectiva 3D volumétrica por una cuadrícula 2D ágil (`WarehouseMatrix2D.tsx`) filtrable por Pasillos y Niveles N1, N2, N3 con código cromático de ocupación.
     - Se creó el componente `WarehouseEmbarqueCard.tsx` para la **Zona de Embarque / Muelle de Expedición (Staging)**, con control de órdenes pickeadas en espera de flete y visualizador de remito.
     - Se estructuró el galpón en sus 3 zonas operativas: Pulmón de Entrada (Recepción), Almacenamiento Activo (Racks 2D) y Pulmón de Salida (Embarque).
  2. **Monitor de Red y Resiliencia Offline (`sync-monitor.service.ts` y `offline-queue.service.ts`):**
     - Heartbeat periódico cada 15 segundos a Supabase y componente visual [`NetworkStatusBanner.tsx`](file:///d:/ATP/Berton/Documentos/Desarrollo/Trabajos/Vertia/src/components/layout/NetworkStatusBanner.tsx) integrado en la Navbar (🟢 Badge online y 🔴 Barra offline con cuenta regresiva).
     - Cola de mutaciones fuera de línea con algoritmo de reconciliación: ante un quiebre de stock producido por operaciones simultáneas, bloquea la mutación a ciegas y la envía a la Bandeja de Conflictos para resolución por el Administrador (`autorizar_extension`, `ajuste_parcial` o `cancelar`).
  3. **Control de Calidad:**
     - Suite automatizada ampliada a **70 pruebas pasando al 100% (0 fallos)**.
     - `next build` limpio con Turbopack.

### [2026-11-18] - Entrega de Fase 1 (Servicios Híbridos) y Fase 2 (Matriz Espacial 3D)
- **Autor / Agente:** Lead Architect (Antigravity), Subagente Backend (`backend-engineer`) y Subagente Frontend (`frontend-engineer`).
- **Decisiones Técnicas y Entregables:**
  1. **Capa de Servicios Híbrida (`src/lib/services/`):**
     - Se crearon los servicios `productos.service.ts`, `almacenes.service.ts`, `ordenes.service.ts`, `mock-store.ts` y `supabase-helper.ts`.
     - Implementación de resiliencia con timeout de 1200ms (`withSupabaseTimeout`): si Supabase está desconectado o sin tablas creadas, conmuta transparentemente al almacenamiento local sin bloquear la UI ni emitir errores visibles.
     - Cumplimiento innegociable de la invariante: `stock_disponible = stock_real - stock_comprometido`.
  2. **Matriz Espacial 3D y Zona de Recepción WMS (`src/app/(dashboard)/almacenes/` y componentes):**
     - Nuevo motor de topología física WMS (`mock-spatial-warehouse.ts`) con estándar industrial (`P1-R02-E3-N2`).
     - Vista isométrica 3D con transformaciones CSS (`preserve-3d`, rotación, zoom e inclinación) y vistas alternativas en Elevación y Plano 2D.
     - Componente de Pulmón Operativo (`WarehouseReceptionCard.tsx`) con métricas en tiempo real de remitos en espera y bultos por acomodar.
     - Inspector lateral de celdas (`WarehouseCellInspector.tsx`) y Modal de Slotting (`WarehouseSlottingModal.tsx`) para estiba guiada desde recepción hacia racks.
  3. **Consolidación de Calidad y Pruebas:**
     - Se integró la nueva suite automatizada en `npm test`: **51 pruebas automatizadas pasadas al 100% (0 fallos)** (32 de multi-tenant/RBAC + 19 de servicios híbridos).
     - Compilación limpia de producción (`next build`) en las 13 rutas de la aplicación.

### [2026-11-18] - Inicialización en Notebook y Establecimiento de Gobernanza
- **Autor / Agente:** Lead Architect (Antigravity) & Federico Bertoncini.
- **Acciones Realizadas:**
  1. Clonado del repositorio `https://github.com/jfberton/vertia.git` en rama `main`.
  2. Preservación y versionado de documentación técnica estratégica en [`Docs/`](file:///d:/ATP/Berton/Documentos/Desarrollo/Trabajos/Vertia/Docs).
  3. Configuración del archivo de entorno [`.env.local`](file:///d:/ATP/Berton/Documentos/Desarrollo/Trabajos/Vertia/.env.local) con credenciales de Supabase.
  4. Instalación de dependencias limpias con `npm install`.
  5. Ejecución y validación de la suite de pruebas [`scripts/verify-auth-multitenant.mjs`](file:///d:/ATP/Berton/Documentos/Desarrollo/Trabajos/Vertia/scripts/verify-auth-multitenant.mjs): **32 pasadas, 0 falladas**.
  6. Validación de compilación de producción con `next build` en 13 rutas estáticas.
  7. Puesta en marcha del servidor de desarrollo local en el puerto 3000.
  8. Creación de esta Bitácora de Arquitectura para guiar el trabajo coordinado de subagentes.
