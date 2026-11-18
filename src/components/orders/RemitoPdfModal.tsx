"use client";

import React, { useRef } from "react";
import {
  FileText,
  Printer,
  Download,
  X,
  Truck,
  Building2,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Barcode,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MultiTenantOrden, MOCK_TENANTS } from "@/lib/data/mock-multi-tenant";
import { resolveItemLocation } from "./PickingModal";

interface RemitoPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: MultiTenantOrden;
  transportInfo?: {
    chofer: string;
    dni: string;
    vehiculo: string;
    patente: string;
    muelle?: string;
  };
}

export function RemitoPdfModal({
  isOpen,
  onClose,
  order,
  transportInfo,
}: RemitoPdfModalProps) {
  const printContainerRef = useRef<HTMLDivElement>(null);

  // Obtener datos del corralón emisor
  const tenantEmisor = MOCK_TENANTS.find((t) => t.id === order.tenant_id) || {
    id: "tenant-los-pinos",
    nombre: order.corralonAsignado || "Corralón Los Pinos S.R.L.",
    slug: "corralon-los-pinos",
    cuit_rut_taxid: "30-71458921-9",
    direccion: "Av. Circunvalación 4500, Rosario Oeste",
    ciudad: "Rosario Oeste",
    pais: "Argentina",
    radio_cobertura_km: 25,
    tipo_empresa: "corralon" as const,
    plan: "pro" as const,
    activo: true,
    habilitado_inventrack: true,
    created_at: "2024-01-15T08:00:00Z",
  };

  // Número oficial de remito (R-XXXX-XXXXXXXX)
  const remitoNumero = React.useMemo(() => {
    if (order.remito_numero) return order.remito_numero;
    const digits = order.folio.replace(/\D/g, "");
    const sufijo = digits ? digits.padStart(8, "0") : "00004921";
    return `R-0001-${sufijo}`;
  }, [order.remito_numero, order.folio]);

  // Datos de chofer y transporte asignado
  const chofer = transportInfo?.chofer || order.chofer_asignado || "Ramón González";
  const dniChofer = transportInfo?.dni || order.dni_chofer || "28.491.802";
  const vehiculo = transportInfo?.vehiculo || order.vehiculo_asignado || "Mercedes-Benz 1634 Chasis con Cabina";
  const patente = transportInfo?.patente || order.patente_asignada || "AB-492-CD";
  const muelle = transportInfo?.muelle || order.zona_embarque || "Muelle Salida 1 - Grúa Autopropulsada";

  // Desglose de materiales con lote, ubicación y peso
  const items = React.useMemo(() => {
    return (order.detalles || []).map((det, idx) => {
      const loc = resolveItemLocation(det, idx);
      return {
        ...loc,
        itemNum: idx + 1,
      };
    });
  }, [order.detalles]);

  const totalBultos = items.reduce((acc, curr) => acc + curr.cantidadSolicitada, 0);
  const totalPesoKg = items.reduce((acc, curr) => acc + curr.pesoTotalKg, 0);

  const fechaHoy = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const horaHoy = new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleImprimir = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Estilos CSS específicos para salida A4 ultra nítida al imprimir o guardar en PDF */}
      <style jsx global>{`
        @media print {
          /* Ocultar todos los elementos ajenos al documento impreso */
          body * {
            visibility: hidden;
          }
          #remito-document-print,
          #remito-document-print * {
            visibility: visible;
          }
          #remito-document-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-size: 10pt !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>

      <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Barra Superior de Herramientas (No imprimible) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Generador de Remito Oficial de Despacho
                <span className="font-mono text-xs text-amber-300 font-extrabold bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/80">
                  {remitoNumero}
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Documento legal de entrega para traslado vehicular y control de descarga en obra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleImprimir}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-8 px-3.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Imprimir Remito / Descargar PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visor Scrollable del Documento en Pantalla */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/70 flex justify-center">
          {/* HOJA DE REMITO A4 OFICIAL */}
          <div
            id="remito-document-print"
            ref={printContainerRef}
            className="w-full max-w-[800px] bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-xl border border-slate-300 space-y-4 font-sans text-xs"
          >
            {/* 1. CABECERA REGLAMENTARIA (3 COLUMNAS: EMISOR | LETRA 'R' | DATOS REMITO) */}
            <div className="border border-slate-900 rounded-lg overflow-hidden grid grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-900">
              {/* Columna Izquierda: Datos del Corralón Emisor */}
              <div className="col-span-12 md:col-span-5 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-900 font-black text-sm uppercase tracking-wide">
                  <Building2 className="w-4 h-4 text-indigo-700" />
                  {tenantEmisor.nombre}
                </div>
                <p className="text-[10px] text-slate-600 font-medium leading-tight">
                  {tenantEmisor.direccion} • {tenantEmisor.ciudad}, {tenantEmisor.pais}
                </p>
                <div className="text-[10px] text-slate-700 pt-1 space-y-0.5">
                  <p>
                    <strong>C.U.I.T.:</strong> {tenantEmisor.cuit_rut_taxid || "30-71458921-9"}
                  </p>
                  <p>
                    <strong>Ing. Brutos:</strong> 902-839410-4 • Conv. Multilateral
                  </p>
                  <p>
                    <strong>IVA:</strong> Responsable Inscripto
                  </p>
                  <p>
                    <strong>Inicio de Actividades:</strong> 01/03/2012
                  </p>
                  <p>
                    <strong>Teléfono:</strong> +54 (0341) 455-8900
                  </p>
                </div>
              </div>

              {/* Columna Central: Recuadro Oficial de Letra 'R' */}
              <div className="col-span-12 md:col-span-2 flex flex-col items-center justify-center p-2 text-center bg-slate-50">
                <div className="w-12 h-12 border-2 border-slate-900 flex items-center justify-center rounded-md font-black text-2xl text-slate-900">
                  R
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-900 mt-1">
                  CÓDIGO 091
                </span>
                <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-tighter leading-tight mt-0.5">
                  DOCUMENTO NO VÁLIDO COMO FACTURA
                </span>
              </div>

              {/* Columna Derecha: Número Oficial y Fechas */}
              <div className="col-span-12 md:col-span-5 p-3 space-y-1 bg-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  REMITO DE SALIDA & ENTREGA
                </span>
                <div className="font-mono text-base font-black text-slate-900 tracking-tight">
                  {remitoNumero}
                </div>
                <div className="text-[10px] text-slate-700 pt-1 space-y-0.5">
                  <p>
                    <strong>Fecha de Emisión:</strong> {fechaHoy}
                  </p>
                  <p>
                    <strong>Hora de Despacho:</strong> {horaHoy} hs
                  </p>
                  <p>
                    <strong>Orden / Pedido WMS:</strong> <span className="font-mono font-bold">{order.folio}</span>
                  </p>
                  <p>
                    <strong>Muelle de Carga:</strong> {muelle}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. DATOS DEL CLIENTE Y PUNTO DE ENTREGA */}
            <div className="border border-slate-900 rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50/50">
              <div className="space-y-1 border-b md:border-b-0 md:border-r border-slate-200 pb-2 md:pb-0 md:pr-3">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
                  Datos del Destinatario / Cliente
                </span>
                <p className="font-bold text-slate-900 text-sm">{order.cliente}</p>
                <p className="text-[11px] text-slate-600">
                  <strong>Condición IVA:</strong> IVA Responsable Inscripto
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong>C.U.I.T. Destino:</strong> 30-71239841-2
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong>Condición de Venta:</strong> Cuenta Corriente Vertia WMS
                </p>
              </div>

              <div className="space-y-1 md:pl-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
                  Punto de Entrega & Destino Obra
                </span>
                <p className="font-bold text-slate-900 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-700 shrink-0 mt-0.5" />
                  {order.proyectoUbicacion}
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong>Distancia Logística:</strong> {order.distanciaKm} km desde galpón
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong>Contacto en Obra:</strong> Arq. Marcelo Varela (Cel: 341-590-1288)
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong>Horario de Descarga:</strong> Lunes a Viernes 07:30 a 16:30 hs
                </p>
              </div>
            </div>

            {/* 3. DATOS DEL TRANSPORTE Y CHOFER */}
            <div className="border border-slate-900 rounded-lg p-2.5 bg-slate-50 text-xs">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                Datos del Transporte & Unidad Vehicular
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9.5px]">Chofer Asignado:</span>
                  <strong className="text-slate-900">{chofer}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9.5px]">D.N.I. Chofer:</span>
                  <strong className="text-slate-900 font-mono">{dniChofer}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9.5px]">Vehículo / Modelo:</span>
                  <strong className="text-slate-900">{vehiculo}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9.5px]">Patente / Placa:</span>
                  <strong className="text-slate-900 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">
                    {patente}
                  </strong>
                </div>
              </div>
            </div>

            {/* 4. TABLA DETALLADA DE MATERIALES */}
            <div className="border border-slate-900 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2 px-2.5 text-center w-10">#</th>
                    <th className="py-2 px-2 font-mono">Código / EAN</th>
                    <th className="py-2 px-3">Descripción del Material</th>
                    <th className="py-2 px-2.5 font-mono">Lote</th>
                    <th className="py-2 px-2.5 text-right">Cant.</th>
                    <th className="py-2 px-2 text-center">Unidad</th>
                    <th className="py-2 px-2.5 text-right">Peso Unit.</th>
                    <th className="py-2 px-3 text-right">Peso Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 text-[11px]">
                      <td className="py-2 px-2.5 text-center font-bold text-slate-500">{item.itemNum}</td>
                      <td className="py-2 px-2 font-mono text-slate-600">{item.codigo}</td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-slate-900 block">{item.material}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Ubic. Origen: {item.codigoVisual} ({item.pasilloNombre})
                        </span>
                      </td>
                      <td className="py-2 px-2.5 font-mono text-[10px] font-semibold text-indigo-900">
                        {item.lote}
                      </td>
                      <td className="py-2 px-2.5 text-right font-extrabold text-slate-900">
                        {item.cantidadSolicitada}
                      </td>
                      <td className="py-2 px-2 text-center font-medium text-slate-600">{item.unidad}</td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-600">
                        {item.pesoKgUnitario} kg
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        {item.pesoTotalKg.toLocaleString()} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-black border-t-2 border-slate-900 text-xs">
                    <td colSpan={4} className="py-2.5 px-3 text-right text-slate-700 uppercase tracking-wider">
                      TOTALES DE CARGA & DESPACHO:
                    </td>
                    <td className="py-2.5 px-2.5 text-right text-slate-900 font-black">
                      {totalBultos}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-700">unidades</td>
                    <td className="py-2.5 px-2.5 text-right text-slate-700">-</td>
                    <td className="py-2.5 px-3 text-right text-indigo-950 font-black font-mono">
                      {totalPesoKg.toLocaleString()} kg ({(totalPesoKg / 1000).toFixed(2)} Tn)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 5. CLÁUSULA LEGAL Y OBSERVACIONES */}
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-[9.5px] text-slate-600 leading-relaxed">
              <strong>Condiciones de Traslado y Recepción:</strong> La firma y sello del receptor al pie del presente
              remito acredita la conformidad de la entrega en cuanto a cantidades, estado de bultos y lotes de
              fabricación recibidos. Cualquier discrepancia o rotura debe ser asentada en esta misma copia antes del retiro
              del chofer. Documento emitido conforme reglamentación de la Administración Tributaria para el transporte
              interurbano de materiales.
            </div>

            {/* 6. VALIDACIÓN DIGITAL QR Y CASILLAS REGLAMENTARIAS DE FIRMA */}
            <div className="border border-slate-900 rounded-lg p-3 grid grid-cols-12 gap-3 items-center">
              {/* Código QR de Validación WMS */}
              <div className="col-span-12 sm:col-span-4 flex items-center gap-2.5 border-b sm:border-b-0 sm:border-r border-slate-300 pb-2 sm:pb-0 sm:pr-2">
                <div className="w-16 h-16 shrink-0 bg-white p-1 border border-slate-800 rounded flex items-center justify-center">
                  {/* SVG de Código QR de Alta Fidelidad */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    {/* Finder Pattern Top-Left */}
                    <rect x="5" y="5" width="28" height="28" rx="2" />
                    <rect x="9" y="9" width="20" height="20" fill="white" />
                    <rect x="13" y="13" width="12" height="12" />
                    {/* Finder Pattern Top-Right */}
                    <rect x="67" y="5" width="28" height="28" rx="2" />
                    <rect x="71" y="9" width="20" height="20" fill="white" />
                    <rect x="75" y="13" width="12" height="12" />
                    {/* Finder Pattern Bottom-Left */}
                    <rect x="5" y="67" width="28" height="28" rx="2" />
                    <rect x="9" y="71" width="20" height="20" fill="white" />
                    <rect x="13" y="75" width="12" height="12" />
                    {/* Timing & Data Pattern Matrix */}
                    <rect x="38" y="10" width="5" height="5" />
                    <rect x="48" y="10" width="5" height="5" />
                    <rect x="58" y="10" width="5" height="5" />
                    <rect x="38" y="25" width="5" height="5" />
                    <rect x="48" y="20" width="5" height="5" />
                    <rect x="58" y="25" width="5" height="5" />
                    <rect x="10" y="38" width="5" height="5" />
                    <rect x="10" y="48" width="5" height="5" />
                    <rect x="10" y="58" width="5" height="5" />
                    <rect x="25" y="38" width="5" height="5" />
                    <rect x="25" y="48" width="5" height="5" />
                    <rect x="25" y="58" width="5" height="5" />
                    {/* Center Data Matrix */}
                    <rect x="38" y="38" width="8" height="8" />
                    <rect x="52" y="38" width="8" height="8" />
                    <rect x="45" y="48" width="8" height="8" />
                    <rect x="38" y="58" width="8" height="8" />
                    <rect x="52" y="58" width="8" height="8" />
                    {/* Bottom Right Data Matrix */}
                    <rect x="67" y="38" width="6" height="6" />
                    <rect x="78" y="45" width="6" height="6" />
                    <rect x="88" y="38" width="6" height="6" />
                    <rect x="67" y="52" width="6" height="6" />
                    <rect x="78" y="60" width="6" height="6" />
                    <rect x="88" y="52" width="6" height="6" />
                    <rect x="38" y="70" width="6" height="6" />
                    <rect x="48" y="78" width="6" height="6" />
                    <rect x="58" y="70" width="6" height="6" />
                    <rect x="40" y="88" width="6" height="6" />
                    <rect x="52" y="88" width="6" height="6" />
                    <rect x="67" y="72" width="7" height="7" />
                    <rect x="80" y="72" width="7" height="7" />
                    <rect x="72" y="84" width="7" height="7" />
                    <rect x="85" y="84" width="7" height="7" />
                  </svg>
                </div>
                <div className="text-[8.5px] text-slate-500 leading-tight">
                  <span className="font-bold text-slate-800 block">Autenticación Digital</span>
                  <span>Certificado WMS InvenTrack</span>
                  <span className="font-mono text-[8px] text-slate-400 block mt-0.5 truncate max-w-[130px]">
                    HASH: {order.id.slice(0, 16)}
                  </span>
                </div>
              </div>

              {/* Casilla 1: Firma Despachante */}
              <div className="col-span-6 sm:col-span-4 text-center px-2">
                <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
                <span className="font-bold text-slate-800 block text-[9.5px]">
                  Firma y Sello Despachante
                </span>
                <span className="text-[8.5px] text-slate-500 block">
                  Responsable de Expedición • Corralón
                </span>
              </div>

              {/* Casilla 2: Firma Receptor en Obra */}
              <div className="col-span-6 sm:col-span-4 text-center px-2">
                <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
                <span className="font-bold text-slate-800 block text-[9.5px]">
                  Firma / D.N.I. Receptor en Obra
                </span>
                <span className="text-[8.5px] text-slate-500 block">
                  Conforme Recepción • Obra {order.proyectoUbicacion.slice(0, 18)}
                </span>
              </div>
            </div>

            {/* Pie de Página Oficial */}
            <div className="pt-1 text-center text-[8.5px] text-slate-400 flex items-center justify-between border-t border-slate-100">
              <span>VERTIA — Plataforma Corporativa de Gestión y Logística de Materiales</span>
              <span>Página 1 de 1 • Ejemplar Original para Obra & Transporte</span>
            </div>
          </div>
        </div>

        {/* Footer del Modal (No imprimible) */}
        <div className="no-print bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Formato: <strong>A4 Estándar Reglamentario</strong> • Optimizado para impresión física y PDF.
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs border-slate-300 text-slate-700 h-8"
            >
              Cerrar
            </Button>
            <Button
              onClick={handleImprimir}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-8 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Imprimir Remito / Descargar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
