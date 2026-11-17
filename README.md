# Vertia

**Vertia** es una plataforma SaaS moderna, serverless y colaborativa de gestión de almacenes e inventarios (WMS / Stock Control) y red colaborativa B2B de stock inter-empresas.

## 🚀 Stack Tecnológico
- **Frontend / Fullstack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Lucide Icons.
- **Despliegue Serverless**: Cloudflare Pages / Workers ($0 costo de mantenimiento de VPS).
- **Base de Datos & Auth**: Supabase (PostgreSQL con Row Level Security multi-tenant nativo).
- **Storage**: Supabase Storage (Buckets S3-compatible).

## 📦 Características Principales
1. **Multi-Tenancy con Aislamiento Estricto (RLS)**: Cada empresa gestiona sus propios almacenes, productos y stock de forma 100% aislada.
2. **Matriz Espacial 3D**: Ubicaciones físicas por Pasillo, Rack, Estantería, Nivel y Caja con trazabilidad por lote.
3. **Flujo de Picking Desacoplado**: Surtido de pedidos limpio hacia remisión de despacho.
4. **Red Colaborativa B2B**: Consulta y negociación de faltantes (BackOrders) y excedentes de stock entre empresas adheridas.

## 💻 Desarrollo Local
```bash
npm install
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
