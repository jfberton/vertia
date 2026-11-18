# 📋 Plan Integral de Modificaciones WMS, Resiliencia de Datos y Próximas Fases
## Plataforma VERTIA / InvenTrack v2

**Elaborado por:** Lead Architect (Antigravity) & Federico Bertoncini  
**Fecha:** Noviembre 2026  
**Documento Vivo de Arquitectura y Planificación**

---

## 1. Explicación y Propósito de `togglePublicacionRed`

### ¿Para qué sirve?
En el modelo SaaS colaborativo de **VERTIA**, cada corralón gestiona un catálogo privado de productos dentro de su software **InvenTrack**. Sin embargo, no todos los productos tienen el mismo destino comercial:
- **Productos Privados (`publicado_en_red = false`):** Mercadería estándar o con stock limitado que el corralón destina exclusivamente a sus clientes habituales de mostrador y obras directas. No es visible para ningún otro corralón ni empresa de la red.
- **Productos Publicados en la Red B2B (`publicado_en_red = true`):** Mercadería en la que el corralón cuenta con excedentes, precios de cantera ventajosos o acuerdos con fábricas (ej. camiones completos de cemento, hierro o ladrillos). Al activar esta casilla:
  1. El producto se publica en la cartelera de la **Red Colaborativa B2B** (`/red-b2b`).
  2. Otras constructoras y corralones asociados dentro de su radio logístico (ej. 30 km) pueden ver el **Stock Disponible** y el **Stock Real Físico** negociable.
  3. Permite monetizar stock inmovilizado y atender pedidos triangulados o pedidos con *Split Order*.

---

## 2. Incorporación de la Zona de Embarque / Muelle de Expedición (Staging Zone)

En la operación logística real de un corralón o almacén existen dos pulmones físicos esenciales que delimitan el inicio y el fin del proceso de almacenamiento:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO FÍSICO Y VIRTUAL DEL GALPÓN                         │
│                                                                                        │
│  ┌───────────────────────┐       ┌───────────────────────┐     ┌────────────────────┐  │
│  │ 1. PULMÓN DE INGRESO  │       │ 2. CELDAS DE ALMACÉN  │     │ 3. PULMÓN DE SALIDA│  │
│  │ (Zona de Recepción)   │ ────► │ (Racks, Estanterías,  │ ───►│ (Zona de Embarque  │  │
│  │ Muelle de descarga    │       │  Niveles y Suelo)     │     │  / Expedición)     │  │
│  │ Espera de slotting    │       │ Almacenamiento activo │     │ Mercadería pickeada│  │
│  └───────────────────────┘       └───────────────────────┘     │ Lista para camión  │  │
│                                                                └──────────┬─────────┘  │
│                                                                           │ Despacho   │
│                                                                           ▼ Remito PDF │
│                                                                ┌────────────────────┐  │
│                                                                │ 4. CAMIÓN DE OBRA  │  │
│                                                                └────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Modificaciones en el Modelo y en la Interfaz:
1. **Atributo en Almacenes / Zonas:**
   - Cada almacén o sector cuenta con su tipificación:
     - `es_zona_recepcion: boolean` (Pulmón de Ingreso).
     - `es_zona_embarque: boolean` (Pulmón de Salida / Muelle de Expedición).
2. **Operativa de la Zona de Embarque:**
   - Cuando una orden pasa a estado `En preparación` y los operarios completan el *picking* de los estantes, la mercadería se traslada temporalmente a la **Zona de Embarque**.
   - Allí se controla físicamente contra el remito, se agrupa por destino/obra y aguarda la llegada del camión y del chofer antes de la salida definitiva.

---

## 3. Estrategia de Conexión a Supabase, Modo Offline y Protocolo de Resolución de Conflictos

### 3.1. Premisa Estructural
- **La base de datos siempre existe en Supabase:** El esquema maestro (`supabase/schema_master.sql`) es la única fuente de la verdad para tablas, relaciones y políticas RLS.
- La aplicación **no reemplaza a Supabase por mocks de forma silenciosa**. El sistema debe conectarse a Supabase como canal principal.

### 3.2. Detección de Estado y Reintento Automático
1. **Monitor de Conectividad (`useNetworkSync`):**
   - Un servicio en segundo plano ejecuta un ping cada **15 segundos** a Supabase (`select 1` o `health-check`).
   - Escucha los eventos nativos del navegador (`window.ononline` y `window.onoffline`).
2. **Indicador Visual Obligatorio en la Barra Superior:**
   - 🟢 **En línea:** *"Conectado a Supabase - Datos en tiempo real"*.
   - 🔴 **Sin conexión:** *"Modo Sin Conexión - Reintentando enlace en {X}s..."*.

### 3.3. Protocolo de Manejo de Operaciones Fuera de Línea y Prevención de Colisiones de Stock

El mayor riesgo en un corralón multi-usuario al operar desconectado es la **sobreventa o reubicación conflictiva**:
> *Ejemplo crítico:* El Operario A pierde conexión en el galpón y carga una venta o reubicación de 50 bolsas de cemento (de 100 que había). Mientras tanto, el Operario B en el mostrador (conectado) vende 80 bolsas. Si A se reconecta y descuenta sus 50, el stock final daría -30 (quiebre de inventario físico).

Para resolver esto con rigor profesional, se establecen las siguientes reglas:

#### A. Operaciones Seguras Permitidas Offline:
- **Consultas de sólo lectura:** Búsqueda de productos, verificación de precios, consulta de ubicaciones de racks, fichas técnicas y lectura de órdenes ya descargadas.
- **Validación de picking local:** Marcar casillas de verificación de bultos preparados.

#### B. Operaciones de Modificación de Stock (Mutaciones):
Las mutaciones offline se encolan en una lista local persistente (`offline_mutation_queue`) con:
`{ id, tenant_id, operario_id, producto_id, tipo_movimiento, cantidad, timestamp, version_producto }`.

#### C. Algoritmo de Reconciliación al Recuperar la Conexión:
Al reconectarse, la cola se procesa secuencialmente contra Supabase evaluando la versión y el stock real remanente:
1. **Caso 1 (Sin Conflicto):** Si $\text{Stock Remoto Disponible} \ge \text{Cantidad Movida}$, el movimiento se aplica atómicamente, se actualiza el stock en Supabase y se emite la auditoría.
2. **Caso 2 (Conflicto / Quiebre de Stock):** Si el stock remoto cambió y ya no alcanza para cubrir la operación realizada offline:
   - El sistema **NUNCA aplica el cambio de forma automática** para no falsear el inventario físico.
   - La operación se desvía a la **Bandeja de Conflictos de Sincronización** (`/meta-admin` y panel del Administrador del Corralón).
   - El Administrador recibe una alerta con el detalle:
     - *Cantidad solicitada offline vs. Cantidad física real disponible en ese instante.*
     - *Opciones para resolver:*
       1. **Autorizar excepción:** Ajustar stock físico o solicitar extensión a la Red B2B.
       2. **Ajuste parcial:** Despachar lo disponible y generar un BackOrder por la diferencia.
       3. **Rechazar / Revertir:** Cancelar la orden offline notificando al operario para evitar mercadería fantasma.
3. **Modo Estricto Configurable:** Si el corralón prefiere riesgo cero absoluto de sobreventa, puede activar la política *"Bloquear confirmación de ventas fuera de línea"* en la configuración de su empresa.

---

## 4. Simplificación de la Matriz de Almacén: Sustitución de Perspectiva 3D por Matriz 2D Pragmática

### Decisión de Diseño:
Se retira la simulación visual 3D isométrica pesada (racks con vigas 3D, sombras volumétricas y rotación orbital). En su lugar, se implementa una **Matriz Espacial 2D Industrial**, ágil, de alta legibilidad en pantallas industriales, tablets y celulares de operarios de galpón:

1. **Selector de Zonas:**
   - 📥 **Pulmón de Ingreso (Zona de Recepción):** Remitos de entrada y bultos por ubicar.
   - 🏢 **Almacenamiento Activo (Matriz de Pasillos y Celdas):** Vista clara y rápida.
   - 📤 **Pulmón de Salida (Zona de Embarque / Expedición):** Pedidos preparados listos para flete.
2. **Visualizador de Celdas 2D:**
   - Filtro directo por **Pasillo** (`Pasillo 1 - Cemento y Áridos`, `Pasillo 2 - Hierros y Mallas`).
   - Cuadrícula compacta de Racks y Niveles:
     - `Nivel 3 (Elevación / Pallets completos)`
     - `Nivel 2 (Media carga)`
     - `Nivel 1 (Suelo / Picking diario)`
   - Código de colores sobrio:
     - Blanco / Gris: *Vacío*.
     - Azul suave / Índigo: *Parcial*.
     - Esmeralda: *Lleno óptimo*.
     - Ámbar / Rojo: *Alerta de capacidad o peso*.
3. **Búsqueda y Filtros Rápidos:**
   - Buscador universal en vivo por SKU, nombre del producto o lote.
   - Clic en cualquier celda para abrir el drawer lateral de inspección y asignación rápida de stock.

---

## 5. Fase 3: Flujo de Picking, Zona de Embarque, Despacho y Remitos PDF

### 5.1. Flujo Operativo Paso a Paso:
1. **Generación de Hoja de Picking:**
   - La orden en `/ordenes` genera la ruta óptima de picking en el galpón ordenada por `Pasillo` $\rightarrow$ `Rack` $\rightarrow$ `Nivel`.
2. **Traslado al Pulmón de Salida (Zona de Embarque):**
   - El operario marca los ítems recolectados. El stock comprometido se reserva físicamente en el muelle de embarque.
3. **Generación de Remito Oficial en PDF:**
   - Plantilla descargable e imprimible con:
     - Datos del Corralón emisor (Razón social, CUIT, Dirección, Teléfono).
     - Datos del Cliente / Obra de destino.
     - Detalle de bultos, unidades, descripción, lote y peso total.
     - Datos del Chofer y Patente del vehículo.
     - Casillas reglamentarias de firma de entrega y recepción.
4. **Despacho del Camión:**
   - Al pulsar *"Confirmar Despacho / Salida de Camión"*, el sistema ejecuta el descuento simultáneo:
     $$\text{Stock Real} \leftarrow \text{Stock Real} - \text{Cantidad}$$
     $$\text{Stock Comprometido} \leftarrow \text{Stock Comprometido} - \text{Cantidad}$$
     $$\text{Stock Disponible} \text{ se mantiene consistente y protegido.}$$

---

## 6. Fase 4: Supabase Storage para Evidencias Fotográficas con Compresión en Cliente

### 6.1. Problemática y Solución:
- En obras y entregas, los celulares de choferes y encargados toman fotos de 4 a 10 MB cada una.
- Subir estas fotos sin procesar saturaría la cuota de 1 GB del plan gratuito de Supabase en pocos cientos de entregas.
- **Compresión en el Cliente (Navegador):**
  - Antes de iniciar la subida, un script en Canvas/Web Worker comprime y reescala la imagen a un tamaño máximo de 1600x1200 px en formato **WebP / JPEG al 80% de calidad**.
  - Tamaño resultante: **200 KB a 350 KB por foto** (reducción del 95% del peso sin pérdida de nitidez en remitos y comprobantes).
  - Subida directa al bucket seguro `evidencias` en Supabase Storage mediante URLs autenticadas.
- **Asociación en Base de Datos:**
  - Registro en la tabla `public.evidencias` con `folio_orden`, `tipo` (Antes / Después / Remito firmado), `url_storage`, `geo_latitud`, `geo_longitud` y `timestamp`.

---

## 7. Cronograma de Ejecución Aprobado

| Tarea | Descripción | Responsable |
| :--- | :--- | :--- |
| **Paso 1** | Simplificación de [`almacenes/page.tsx`](file:///d:/ATP/Berton/Documentos/Desarrollo/Trabajos/Vertia/src/app/(dashboard)/almacenes/page.tsx): sustituir 3D por matriz 2D industrial + incorporar **Zona de Embarque**. | Lead Architect & Subagente Frontend |
| **Paso 2** | Implementación del Monitor de Conexión, Heartbeat a Supabase y protocolo de cola offline con detección de conflictos. | Lead Architect & Subagente Backend |
| **Paso 3 (Fase 3)** | Módulo de Picking, traslado a Zona de Embarque y generador de **Remitos en PDF**. | Subagente Logística |
| **Paso 4 (Fase 4)** | Uploader de Evidencias a Supabase Storage con compresión WebP en cliente. | Subagente Media/Storage |
| **Control QA** | Validación cruzada con `npm test` y compilación `next build` en cada entrega. | Lead Architect |
