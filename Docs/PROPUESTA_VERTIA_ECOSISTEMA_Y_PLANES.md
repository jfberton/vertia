# VERTIA - Propuesta de Ecosistema Operativo, Red de Materiales y Modelo de Negocio

**Elaborado por:** Federico Bertoncini  
**Para:** Humberto Rivero Gonzalez  
**Fecha:** Noviembre 2026  
**Versión:** 1.0 (Etapa 1 - Núcleo Operativo & Red de Corralones)

---

## 1. Visión Ejecutiva de la Plataforma

**VERTIA** es una plataforma colaborativa integral diseñada para optimizar y asegurar el abastecimiento de materiales y la ejecución de servicios en proyectos, construcciones e inmuebles. 

En esta **Primera Etapa**, el foco está puesto en dos pilares fundamentales:
1. **El Módulo InvenTrack**: La herramienta operativa para los **Corralones / Proveedores de Materiales**, permitiéndoles gestionar sus almacenes, la ubicación exacta dentro del galpón (racks, estanterías, niveles), lotes, remisiones y choferes.
2. **La Red Central VERTIA & Portal de Administración de Plataforma**: El centro de control donde el equipo interno de VERTIA monitorea la disponibilidad global de materiales, gestiona los pedidos, coordina la cobertura de faltantes entre corralones y administra integralmente el negocio a través de roles de administración de plataforma.

---

## 2. Lógica de Stock en Corralones: "Stock Real" vs. "Stock Disponible"

Para que la red funcione de forma ágil y transparente, cada producto dentro de un corralón maneja dos indicadores en tiempo real:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INVENTARIO TOTAL DEL CORRALÓN                   │
│                                                                        │
│   ┌──────────────────────────────┐   ┌─────────────────────────────┐   │
│   │    STOCK DISPONIBLE          │   │     STOCK COMPROMETIDO      │   │
│   │    (Venta libre inmediata)   │   │     (Reservado/Apalabrado)  │   │
│   │         60 bolsas            │   │          60 bolsas          │   │
│   └──────────────────────────────┘   └─────────────────────────────┘   │
│                                                                        │
│   ◄────────────────────── STOCK REAL FÍSICO ────────────────────────►   │
│                            (120 bolsas en galpón)                      │
└────────────────────────────────────────────────────────────────────────┘
```

### El Caso Práctico de Negociación:
- **Demanda**: Una obra solicita con urgencia **100 bolsas de cemento**.
- **Situación en Red**: El *Corralón X* muestra **60 bolsas disponibles**, pero un **stock real de 120**.
- **Gestión por Mensajería VERTIA**:
  - El operador de VERTIA envía una consulta directa al encargado del corralón:
    > *"Tenemos una orden cerrada por 100 bolsas para Torre Norte. Vemos que tienes 60 disponibles y 120 reales en galpón. ¿Podrías liberar 40 bolsas de tu stock físico para adjudicarte el pedido completo?"*
  - **Opciones del Corralón**:
    - **Autorizar extensión**: Con un clic confirma la excepción y el pedido se procesa por 100 bolsas.
    - **Rechazar extensión**: Si esas 60 están reservadas formalmente para otro cliente, VERTIA ejecuta un *Split Order* (despacha 60 con Corralón X y 40 con Corralón Y de la red).

---

## 3. Portal de Administración de Plataforma y Gobierno de Roles

Para la gestión global de VERTIA se define una clara distinción entre la **herramienta de administración** y los **roles de las personas que la operan**:

- **La Herramienta:** El **Portal de Administración de Plataforma (VERTIA Core / Backoffice)** es la consola central exclusiva del equipo interno de VERTIA. No es accesible por los corralones ni por los clientes de obra.
- **Los Roles de Administración:** Perfiles específicos asignados al personal propio de VERTIA, donde cada integrante accede a las secciones e indicadores pertinentes a su función y responsabilidad.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   PORTAL DE ADMINISTRACIÓN DE PLATAFORMA (VERTIA BACKOFFICE)             │
│                                                                                          │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────────────────────┐  │
│  │ 1. Empresas & Planes  │  │ 2. Economía & Finanzas│  │ 3. Salud, Tickets & Errores  │  │
│  │ - Padrón de Corralones│  │ - Ingresos (MRR SaaS) │  │ - Telemetría de operaciones  │  │
│  │ - Clientes / Obras    │  │ - Egresos e infraestr.│  │ - Mesa de ayuda y reclamos   │  │
│  │ - Licencias y Desc.   │  │ - Movimientos / Cobros│  │ - Registro de fallas / APIs  │  │
│  └───────────────────────┘  └───────────────────────┘  └──────────────────────────────┘  │
│                                                                                          │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 4. Usuarios Internos de Administración & Matriz de Permisos (Gobierno de Roles)    │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1. Módulos Funcionales del Portal de Administración

1. **Gestión de Empresas & Licenciamiento (Corralones y Clientes):**
   - **Padrón General:** Registro de todas las empresas afiliadas a la red (corralones de materiales, constructoras, cuadrillas contratistas).
   - **Administración de Planes:** Control de capacidades contratadas según el esquema de licencias:
     - *Plan Inicial (Mono-Almacén):* 1 depósito/sucursal, 1 administrador, ideal para corralones chicos o un solo equipo.
     - *Plan Profesional (Multi-Almacén):* Hasta 4 depósitos, usuarios ilimitados, gestión detallada de ubicaciones dentro del galpón y trazabilidad de lotes.
     - *Plan Enterprise (Red Corporativa + API):* Almacenes ilimitados, conexión API bidireccional con ERPs (Tango, SAP) y prioridad en la red B2B.
   - **Políticas de Descuentos y Promociones:** Capacidad para configurar convenios comerciales (ej. bonificaciones del 100% por 3 meses de bienvenida o tarifas preferenciales para cámaras del sector).

2. **Economía & Finanzas de la Plataforma:**
   - **Indicadores Clave de Ingresos:** Seguimiento del MRR (*Monthly Recurring Revenue* o Ingresos Recurrentes Mensuales por suscripción de licencias InvenTrack).
   - **Egresos Operativos:** Registro de costos de infraestructura en la nube, pasarelas de pago y comisiones bancarias.
   - **Libro de Movimientos y Cobranzas:** Detalle cronológico de pagos recibidos, facturas emitidas, vencimientos y estado de mora de cada cuenta.

3. **Salud Operativa, Tickets de Soporte & Rendimiento:**
   - **Telemetría y Rendimiento Global:** Métricas consolidadas sobre cantidad total de solicitudes creadas, pedidos entregados en término, tiempo de respuesta y tasa de coincidencia en validación de evidencias.
   - **Mesa de Ayuda (Sistema de Tickets):** Recepción y seguimiento de consultas, incidencias comerciales o desacuerdos entre obras y corralones reportados a la plataforma.
   - **Detección y Registro de Errores (Error Logs):** Monitoreo proactivo de fallas de sincronización con APIs externas, errores en el checkout o caídas de conectividad.

4. **Gobierno de Usuarios Internos de Plataforma:**
   - Altas, bajas y asignación de credenciales al personal propio de VERTIA, asegurando que cada operador cuente con los privilegios exactos según su función.

---

### 3.2. Matriz de Roles de Administración de Plataforma

Para garantizar la seguridad y confidencialidad operativa, el acceso al portal se segmenta en **cuatro perfiles de administración**:

| Rol de Administración | Responsable Típico | Alcance de Permisos y Vistas Asignadas |
| :--- | :--- | :--- |
| **Super Administrador de Plataforma** | Humberto Rivero Gonzalez / Dirección General | **Control Total (360°):**<br>• Acceso irrestricto a todos los módulos.<br>• Visualización de finanzas completas (ingresos, egresos y márgenes).<br>• Aprobación de descuentos comerciales especiales.<br>• Creación, bloqueo y auditoría de otros administradores.<br>• Configuración de políticas y parámetros globales de la red. |
| **Administrador Financiero (Billing & Finance)** | Administración y Finanzas | **Enfoque Económico y de Facturación:**<br>• Módulo de Economía y Finanzas al 100%.<br>• Gestión de cobros, facturación de licencias y conciliación bancaria.<br>• Seguimiento de cobranzas y alertas de suspensión por mora.<br>• *Sin acceso a la operativa logística diaria ni a la reasignación de órdenes.* |
| **Administrador de Operaciones & Red (Operations Lead)** | Jefatura de Operaciones VERTIA | **Enfoque de Rendimiento y Despacho:**<br>• Monitoreo de solicitudes activas y pedidos de materiales.<br>• Mediación y resolución de pedidos trabados entre corralones y obras.<br>• Auditoría de validación de evidencias fotográficas.<br>• Alta y activación operativa de nuevos corralones en la red.<br>• *Sin acceso a los balances financieros internos ni a la rentabilidad corporativa.* |
| **Soporte Técnico & Mesa de Ayuda (Support & Telemetry)** | Equipo Técnico / Helpdesk | **Enfoque de Asistencia y Estabilidad:**<br>• Gestión y respuesta de tickets de soporte reportados por usuarios.<br>• Monitoreo de logs de errores del sistema y rendimiento de APIs.<br>• Asistencia y desbloqueo de usuarios de corralones o clientes.<br>• *Acceso restringido: no visualiza información contable, tarifas ni datos sensibles.* |

---

## 4. Ubicación Física en el Galpón y Articulación con Sistemas Contables (API In/Out)

### 4.1. Identificación Precisa de Ubicaciones en Cada Corralón
En **VERTIA**, todos los almacenes y galpones (chicos, medianos o grandes) cuentan por defecto con organización precisa de ubicaciones físicas:
- **Estructura Interna**: `Pasillo / Fila` • `Rack` • `Estantería` • `Nivel` • `Posición`.
- **Área de Recepción / Pulmón Operativo**: Todo almacén cuenta automáticamente con un sector de recepción física donde aterriza la mercadería antes de ser acomodada en su lugar definitivo en el galpón.

### 4.2. Articulación entre el Sistema Contable (ERP) y la Ubicación en el Corralón
Los sistemas contables y ERPs habituales de corralones (Tango, SAP, Bejerman, Xubio, etc.) **solo manejan cantidades globales y precios, no la ubicación física dentro del galpón**. 

Para resolver esto sin exigirle cambios al sistema contable del corralón:
1. **El ERP del corralón envía a la API In de VERTIA**:
   ```json
   {
     "codigo_producto": "7791234567890",
     "nombre": "Cemento Loma Negra 50kg",
     "precio": 9500.00,
     "stock_total": 500,
     "almacen_id": "sucursal-norte"
   }
   ```
2. **Tratamiento inteligente de VERTIA**:
   - Actualiza el precio y el stock disponible para la red de forma inmediata.
   - El stock ingresante se deposita de manera transparente en la **Zona de Recepción / Pulmón** del almacén.
   - El operario del corralón (con su celular o tablet) visualiza la mercadería pendiente de acomodar y confirma su ubicación física en el galpón con un solo toque.

---

## 5. Geolocalización y Búsqueda Inteligente por Radio de Cobertura

En el rubro de la construcción, el flete es un costo crítico y mover materiales pesados (cemento, arena, hierros, ladrillos) a largas distancias resulta inviable.

Por ello, la Red VERTIA implementa **Geolocalización Nativa**:
1. **Coordenadas de Almacenes**: Cada corralón registra su dirección física con coordenadas GPS (`Latitud`, `Longitud`) y su **radio de entrega operativo en kilómetros** (ej. 15 km, 30 km, 50 km).
2. **Punto de Entrega de la Obra**: Al crear una solicitud, el cliente indica la ubicación exacta del proyecto/obra.
3. **Búsqueda Radial Automática**:
   - El motor de VERTIA calcula la distancia euclidiana/vial en tiempo real.
   - Prioriza y filtra únicamente los corralones que tengan stock (disponible o negociable) **dentro del radio logístico viable de la obra**, mostrando la distancia estimada y minimizando costos de transporte y tiempos de entrega.
