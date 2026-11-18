# Arquitectura Tecnológica, Infraestructura Serverless y Costos de Operación
## Plataforma VERTIA / InvenTrack v2

**Elaborado por:** Federico Bertoncini  
**Para:** Humberto Rivero Gonzalez  
**Fecha:** Noviembre 2026  
**Versión:** 1.0 (Informe Técnico y de Capacidad Operativa)

---

## 1. Resumen Ejecutivo de la Arquitectura

Para el desarrollo y modernización de la plataforma **VERTIA** (que integra el motor logístico de corralones **InvenTrack** con los entornos de **Operaciones** y **Clientes**), se ha diseñado una arquitectura web moderna de grado industrial basada en el paradigma **JAMstack & Serverless**.

Esta arquitectura elimina por completo la necesidad de mantener servidores físicos o máquinas virtuales dedicadas (como VPS, Windows Server o instancias EC2 tradicionales), garantizando:
- **Cero costo fijo de infraestructura inicial ($0.00 USD/mes)** durante la fase de lanzamiento, validación comercial y primeros clientes.
- **Tiempos de carga instantáneos** distribuidos en más de 300 ciudades del mundo a través de la red perimetral (Edge CDN).
- **Despliegues continuos automáticos (CI/CD)**: cada mejora o corrección en el código se compila y publica en producción de forma autónoma.
- **Escalabilidad elástica sin fricción**: el sistema puede pasar de atender 5 corralones a 500 sin necesidad de reescribir la base de la plataforma.

```
                              ┌───────────────────────────────────┐
                              │     Repositorio GitHub Privado    │
                              │    (Control de Versiones CI/CD)   │
                              └─────────────────┬─────────────────┘
                                                │ (Push automático)
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          CLOUDFLARE PAGES (Hosting Edge)                         │
│  - Frontend Next.js 15 (React 19, TypeScript, Tailwind CSS)                     │
│  - Red CDN Global (SSL automático, Protección anti-DDoS, Ancho de banda libre)  │
│  - Producción: https://vertia-6yu.pages.dev                                     │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │ Conexión Segura HTTPS (Anon / JWT)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      SUPABASE ENTERPRISE (Backend as a Service)                 │
│  ┌─────────────────────────┐  ┌────────────────────────┐  ┌──────────────────┐  │
│  │   PostgreSQL 15 (DB)    │  │     Supabase Auth      │  │ Supabase Storage │  │
│  │ - 26 tablas relacionales│  │ - Multi-rol (Operador, │  │ - Buckets Fotos  │  │
│  │ - Ubicaciones & Stock   │  │   Corralón, Cliente)   │  │   Evidencias     │  │
│  │ - Seguridad RLS Tenant  │  │ - Sesiones seguras JWT │  │ - Remitos en PDF │  │
│  └─────────────────────────┘  └────────────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Ecosistema Tecnológico Detallado

### A. Frontend: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Framework React de última generación:** Next.js 15 con arquitectura App Router. Permite construir interfaces web de alta velocidad, responsivas y optimizadas tanto para computadoras de escritorio en oficinas centrales como para celulares de capataces y choferes en obra.
- **Tipado estricto en TypeScript:** Evita errores en tiempo de ejecución al manipular inventarios, ubicaciones en galpones y montos de cotización.
- **Diseño corporativo con Tailwind CSS:** Interfaz limpia en modo claro (*Light Corporate*), con componentes desacoplados, menús contextuales y gráficos de seguimiento visual en tiempo real.
- **Iconografía con Lucide Icons:** Simbología estandarizada para logística, transportes, cámaras de fotos, alertas y matrices de racks.

### B. Base de Datos & Backend: Supabase (PostgreSQL 15 Administrado)
- **Motor Relacional SQL:** Base de datos relacional PostgreSQL con soporte de transacciones ACID estrictas. Garantiza que jamás se duplique un número de remito o se descuente stock inexistente.
- **Seguridad por Fila (Row Level Security - RLS):** Cada corralón o empresa asociada posee su propio identificador de inquilino (`tenant_id`). Esto asegura que **ningún corralón pueda ver ni espiar el inventario privado ni los clientes de otro corralón de la red**, salvo lo que explícitamente se decida publicar en la Red B2B.
- **Supabase Storage (Buckets S3):** Sistema de almacenamiento de archivos binarios en la nube para guardar de manera segura:
  1. Fotos de evidencias del cliente al abrir una solicitud (roturas, estado inicial).
  2. Fotos de evidencias del proveedor al finalizar el trabajo o descargar el material.
  3. Documentos adjuntos (remitos firmados, contratos, órdenes de compra en formato PDF).

### C. Infraestructura & CDN: Cloudflare Pages
- **Red perimetral global (Edge):** La aplicación no reside en un servidor único en un país distante; se distribuye en la red de Cloudflare con servidores locales en Argentina, México, Estados Unidos y el resto de la región, entregando el sistema al usuario en menos de 50 milisegundos.
- **Certificados SSL/TLS automáticos:** Conexión cifrada de extremo a extremo (`https://`) sin costo adicional de renovación.
- **Protección contra ataques (DDoS Shield):** Mitigación automática de ataques maliciosos o saturación de tráfico.

### D. Flujo de Integración y Despliegue Continuo (CI/CD con GitHub)
El ciclo de mantenimiento del software opera de manera completamente desatendida:
1. El equipo de desarrollo realiza una mejora o funcionalidad (ej. incorporar un nuevo filtro o ajustar un reporte).
2. Se envía el código al repositorio central de GitHub (`git push`).
3. Cloudflare Pages detecta el cambio al instante, ejecuta la compilación automática de la plataforma (`next build`), optimiza los recursos estáticos y los publica en caliente en **[https://vertia-6yu.pages.dev](https://vertia-6yu.pages.dev)** en un lapso de 60 a 90 segundos.
4. **Cero caída de servicio (Zero Downtime):** Los usuarios conectados nunca experimentan cortes ni pantallas de error por actualización de versión.

---

## 3. Estimación Cuantitativa y Capacidad del Entorno Gratuito

La infraestructura actual está montada enteramente sobre los **Planes Gratuitos (Free Tiers)** de Cloudflare y Supabase. Esta modalidad permite operar el proyecto sin incurrir en gastos de hosting mientras se valida el modelo de negocio y se incorporan los primeros corralones asociados a la red.

A continuación se detalla la capacidad operativa real y los volúmenes que soporta este entorno antes de requerir una suscripción de pago:

| Componente | Capacidad Incluida en Plan Gratuito | Equivalencia Práctica en VERTIA |
| :--- | :--- | :--- |
| **Tráfico Web (Cloudflare Pages)** | **Ilimitado** (Sin tope de ancho de banda) | Millones de visitas mensuales de clientes, corralones y operadores sin costo. |
| **Despliegues Automáticos (CI/CD)** | Hasta 500 compilaciones por mes | Permite actualizar la plataforma hasta 16 veces por día de forma continua. |
| **Base de Datos Relacional (Supabase)** | **500 MB** de almacenamiento en disco | Almacena aproximadamente **1,500,000 registros** de stock, movimientos y solicitudes (el texto y los números consumen muy poco espacio). |
| **Usuarios Activos Mensuales (Auth)** | **50,000 usuarios activos / mes** | Capacidad sobrada para 50 a 100 corralones, cada uno con 10 empleados y cientos de clientes de obra. |
| **Almacenamiento de Fotos (Storage)** | **1.00 GB** en buckets de archivos | Almacena entre **2,500 y 4,000 fotografías** de evidencias comprimidas (formato WebP o JPG a 250-400 KB por foto) + 1,000 remitos PDF. |
| **Peticiones a la Base de Datos (API)** | Peticiones ilimitadas dentro de márgenes normales | Más de 2,000,000 de consultas al catálogo o al panel de operaciones por mes. |

### ¿Para cuánto tiempo o volumen de negocio alcanza el entorno gratuito?
- **Fase de Validación y MVP:** 100% holgada.
- **Volumen Operativo Estimado:**
  - **10 a 25 corralones asociados** a la red.
  - **2,000 a 3,000 solicitudes de materiales y órdenes de trabajo** mensuales.
  - **30 a 50 usuarios simultáneos** interactuando en el Centro de Operaciones, validando evidencias y cargando stock en racks y estantes.

---

## 4. Limitaciones Técnicas del Entorno Gratuito a Tener en Cuenta

Para una gestión técnica y operativa transparente, es fundamental considerar tres particularidades técnicas de este entorno:

1. **Pausa de la Base de Datos por Inactividad (Supabase Free):**  
   Si una base de datos gratuita no recibe ninguna consulta durante 7 días consecutivos, Supabase la coloca en estado de reposo (*pausada*). Al recibir un nuevo ingreso, tarda entre 1 y 2 minutos en reactivarse.  
   *Mitigación operativa:* En etapa de desarrollo y producción activa esto rara vez ocurre, y puede automatizarse un ping programado o bot de monitoreo para mantenerla despierta de forma permanente.

2. **Tope de 1 GB en Archivos Fotográficos:**  
   Al tratarse de una plataforma donde cada trabajo o entrega sube dos evidencias (Antes y Después) más remitos firmados, al superar las ~3,500 fotos el almacenamiento llegará al límite de 1 GB.  
   *Estrategia técnica:* Se implementa compresión automática del lado del cliente en el navegador antes de enviar la imagen al bucket, reduciendo imágenes de 5 MB tomadas por celulares modernos a fotos optimizadas de ~300 KB sin pérdida perceptible de calidad.

3. **Copias de Seguridad (Backups) en Plan Free:**  
   El plan gratuito conserva copias de seguridad lógicas de los últimos días, pero no incluye el servicio de restauración automatizada a un punto exacto en el tiempo (*Point-in-Time Recovery - PITR*).  
   *Mitigación operativa:* Se pueden programar exportaciones automáticas periódicas del archivo `.sql` de la base de datos hacia un repositorio secundario.

---

## 5. Hoja de Ruta de Escalabilidad y Costos Futuros

Cuando la red VERTIA comience a crecer y los corralones empiecen a pagar sus planes de suscripción mensual (**$49 USD** en plan Mono-almacén o **$129 USD** en Multi-almacén), el salto a infraestructura de pago es inmediato, económico y predecible:

### Paso 1: Salto a Supabase Pro (Costo: $25.00 USD/mes)
Al superar el límite gratuito de 1 GB de fotos o 500 MB de base de datos, se contrata el plan Pro de Supabase:
- **Base de datos ampliada:** De 500 MB a **8 GB de datos** (decenas de millones de registros).
- **Almacenamiento de evidencias:** De 1 GB a **100 GB de fotos y remitos** (más de 300,000 fotografías de obras).
- **Backups automatizados diarios:** Con retención de 7 días y soporte prioritario.
- **Sin pausa por inactividad:** Servidor dedicado 24/7 de alta disponibilidad (99.99% uptime).

### Análisis de Rentabilidad:
$$\text{Ingresos estimados con 5 corralones en Plan Mono-Almacén} = 5 \times \$49 = \$245\text{ USD/mes}$$
$$\text{Costo de Infraestructura Cloudflare + Supabase Pro} = \$0 + \$25 = \$25\text{ USD/mes}$$
$$\textbf{Margen operativo bruto para VERTIA} = \mathbf{89.8\%}$$

Con tan solo **1 corralón** suscrito a un plan de $49 USD/mes, la plataforma cubre con creces todos los costos de infraestructura en la nube, dejando el 100% de los ingresos restantes como margen neto para la empresa.

---

## 6. Conclusión y Recomendación Técnica

La decisión de haber montado **VERTIA** sobre **Next.js 15, Cloudflare Pages y Supabase** le otorga al proyecto tres ventajas estratégicas inigualables:
1. **Velocidad de comercialización (Time-to-Market):** La plataforma ya está funcionando en producción real en [vertia-6yu.pages.dev](https://vertia-6yu.pages.dev) sin haber incurrido en costos de servidores.
2. **Robustez y Seguridad:** La separación estricta de datos por corralón (RLS) y la infraestructura de Cloudflare ofrecen el mismo estándar de seguridad que utilizan las grandes corporaciones de software SaaS.
3. **Cero riesgo financiero:** Permite afiliar los primeros corralones y empresas contratistas con costo operativo de infraestructura nulo, posponiendo cualquier costo de servidor ($25 USD/mes) únicamente para cuando la plataforma genere un flujo sostenido de ingresos recurrentes.
