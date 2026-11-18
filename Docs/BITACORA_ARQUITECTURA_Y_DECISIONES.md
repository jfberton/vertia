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
| **3** | Flujo de Picking, Transición de Dual Stock y Generador de Remitos PDF | 🟡 En Ejecución | Subagente Logística |
| **4** | Uploader de Evidencias Fotográficas con Compresión en Cliente a Supabase Storage | ⚪ Pendiente | Subagente Media/Storage |
| **5** | Red B2B: Negociación de Excedentes y Chat de Extensión en Tiempo Real | ⚪ Pendiente | Subagente Realtime |

---

## 📝 4. Registro Cronológico de Decisiones y Cambios

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
