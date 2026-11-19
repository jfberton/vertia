# 🚀 Walkthrough: App del Cliente, Red Vertia, Servicios de Oficios y Mesa de Operaciones Vertia

Se completó exitosamente la implementación acordada y las mejoras solicitadas:

1. **📱 App del Cliente (Constructora / Obras) en `/cliente`:**
   - Panel de control exclusivo para empresas constructoras y directores de obra (ej. Arq. Sofía Valenzuela, Constructora Arcos S.A.).
   - Módulo **"Mis Obras y Frentes"** con modal para **Registrar Nuevo Frente de Obra** (`NuevaObraModal.tsx`), con dirección, coordenadas y capataz de contacto en obra.
   - Módulo **"Nueva Solicitud de Materiales"** (`NuevaSolicitudModal.tsx`):
     - La constructora no busca corralón por corralón; solicita materiales a la **Bandeja Central de Vertia**.
     - Visualiza **Precios de Referencia Red Vertia** y un subtotal orientativo preliminar.
     - Vertia coordina con los corralones y emite un **Presupuesto Confirmado** con flete.
   - **Timeline de Seguimiento en Vivo** (`DetallePedidoClienteModal.tsx`):
     - Estados: *Solicitud Enviada* $\rightarrow$ *Presupuesto Listo (Aprobación Cliente)* $\rightarrow$ *Asignada a Corralón* $\rightarrow$ *En Preparación* $\rightarrow$ *En Camino* $\rightarrow$ *Entregada*.
     - Tarjeta destacada de **Presupuesto Confirmado** con desglose (materiales + flete consolidado + total) y botón **"Aceptar Presupuesto y Autorizar Envío"**.
     - Visor integrado de **Remito Oficial PDF** y botón de **Dar Conformidad de Recepción**.
   - Pestaña **"Servicios & Oficios"**:
     - Contratación de gasistas matriculados, plomeros, electricistas, albañiles, carpinteros y techistas.
     - Botón para **Dar Conformidad del Trabajo** finalizado, notificando a Vertia para liberar el pago.

2. **🔧 Alta de Profesionales & Mediación de Servicios (Escrow Vertia):**
   - Modal de **Alta de Profesional** (`RegistroProfesionalModal.tsx`): nombre, rubro, matrícula habilitante, teléfono, zona y tarifa horaria.
   - Modal de **Solicitar Profesional de Red** (`SolicitarProfesionalModal.tsx`): selección de obra, rubro, descripción de tarea, fecha requerida y presupuesto objetivo.
   - En `/meta-admin` (Pestaña *"Profesionales & Oficios Red"*):
     - Bandeja central de control de oficios.
     - Botón **"Registrar Cobro"**: registra el ingreso del pago del cliente en custodia.
     - Botón **"Liberar Pago"**: transfiere los honorarios al profesional una vez verificada la conformidad del cliente (reteniendo comisión Vertia del 12-15%).

3. **🏭 Control Granular de Stock Disponible en InvenTrack (`/productos`):**
   - Modal **"Configurar Cupo Comercial & Red Vertia"** disponible en el catálogo de materiales.
   - Permite al Administrador del corralón elegir entre:
     - **100% Automático:** $\text{Stock Disponible} = \text{Stock Real} - \text{Stock Comprometido}$.
     - **Cupo Manual Reservado:** El administrador fija un tope numérico específico para la red (ej. 35 bolsas), reservando el resto para venta de mostrador.
     - **Protección Invariante Defensiva:** Si el stock físico cae por debajo del cupo manual, el sistema ajusta automáticamente el disponible para prevenir sobreventas.
     - **Toggle de Red Vertia:** Interruptor directo para publicar o pausar la mercadería en la Red Vertia.
     - **Control RBAC Estricto:** **Solo el Administrador del corralón** puede modificar el cupo comercial o toggle; los operarios de galpón lo ven restringido con aviso informativo.

4. **🏢 Módulo de Consulta de Corralones & Asignación en Vertia (`/meta-admin`):**
   - Pestaña **"Consulta de Corralones & Stock (InvenTrack)"** para el Operador de Vertia (Humberto & Federico).
   - Selector en caliente entre corralones asociados (Corralón Los Pinos vs Materiales del Centro).
   - Monitoreo en vivo de inventarios: **Stock Real Físico**, **Comprometido** y **Disponible para Red**.
   - **Mesa de Asignación & Emisión de Presupuestos:**
     - El operador analiza las solicitudes de constructoras y pulsa **"Emitir Presupuesto"** cargando materiales, flete consolidado y corralón proveedor asignado.
     - O asigna directo al corralón para picking inmediato.
   - **Modo Auditoría Garantizado:** Vertia audita los números pero no puede alterar datos internos del corralón.

5. **🛡️ Navegación y Rutas Protegidas:**
   - `Sidebar.tsx` actualizado a **"Red Vertia"**, **"Catálogo Red Vertia"** y accesos según rol.
   - `DashboardAuthGuard.tsx` enruta a los clientes directamente a `/cliente`, bloqueando el acceso a galpones físicos de corralones.
   - `login/page.tsx` redirige el 1-Click Login de Sofía Valenzuela a `/cliente`.

---

## 🧪 Resultados de Verificación y Control de Calidad

### 1. Compilación de Rutas Next.js 16 (Turbopack)
```bash
npm run build
```
- **Resultado:** Compilación exitosa en 4.9s.
- **Rutas estáticas generadas (14/14):**
  - `○ /`
  - `○ /cliente` (Nueva App del Cliente)
  - `○ /meta-admin` (Con pestaña de Consulta de Corralones)
  - `○ /productos` (Con modal de Cupo Comercial)
  - `○ /almacenes`, `○ /ordenes`, `○ /evidencias`, `○ /red-b2b`, `○ /login`, etc.

### 2. Suite de Pruebas Automatizadas
```bash
npm test
```
- **Auth & Multi-Tenant Suite:** 32 / 32 tests PASSED.
- **Hybrid Services Suite (Suites 1 a 7):** 64 / 64 tests PASSED.
  - `✔ PASS` - `setCupoDisponible` sets manual commercial quota.
  - `✔ PASS` - `setCupoDisponible` defensively clamps manual quota to maximum free stock.
  - `✔ PASS` - `setCupoDisponible` restores 100% automatic mode.
  - `✔ PASS` - `getStoredObras` retrieves active registered works for client.
  - `✔ PASS` - `saveStoredObra` registers new construction site into client portfolio.
  - `✔ PASS` - `asignarCorralonAOrden` transfers order from Vertia coordination to corralón.
- **Total:** **96 / 96 tests en verde (0 fallos)**.

---

## 🧭 Guía de Prueba Interactiva en el Navegador

Puedes probar la interacción completa en [http://localhost:3000](http://localhost:3000):

1. **Paso 1: Portal del Cliente (Arq. Sofia Valenzuela)**
   - En el Switcher superior, elige **"Arq. Sofia Valenzuela"**.
   - Accederás directamente al nuevo **Portal de Abastecimiento & Obras** (`/cliente`).
   - Prueba pulsar **"Registrar Frente de Obra"**: carga un nuevo proyecto (ej. *"Torre Pellegrini"*).
   - Prueba pulsar **"Nueva Solicitud de Material"**: selecciona la obra, agrega materiales y envíala a Vertia.

2. **Paso 2: Operador de Vertia (Humberto Rivero Gonzalez)**
   - Conmuta a **"Humberto Rivero Gonzalez"** y ve a **"Empresas & Clientes de Red"** (`/meta-admin`).
   - Abre la nueva pestaña **"Consulta de Corralones & Stock (InvenTrack)"**.
   - Verás el stock en tiempo real de Corralón Los Pinos (físico, comprometido y disponible).
   - En la **Mesa de Asignación**, verás el pedido que acabas de crear como cliente y podrás hacer clic en **"Asignar a Corralón Los Pinos"**.

3. **Paso 3: Administrador del Corralón (Ing. Martín Rossi)**
   - Conmuta a **"Ing. Martín Rossi"** y ve a **"Materiales & Stock"** (`/productos`).
   - En la fila de Cemento Loma Negra, haz clic en el botón **"Cupo Red"**.
   - Cambia la modalidad a **"Cupo Manual Reservado"**, fija 35 bolsas y guarda.
   - Observa cómo la columna Stock Disponible ahora muestra la etiqueta morada `Cupo Red: 35`.
   - Conmuta a **"Juan Capataz"** (operario) y comprueba que el botón "Cupo Red" está deshabilitado con aviso de permisos.
   - Ve a **"Pedidos & Despachos"** (`/ordenes`): verás la orden asignada por Vertia lista para iniciar el picking guiado y emitir el remito PDF.
