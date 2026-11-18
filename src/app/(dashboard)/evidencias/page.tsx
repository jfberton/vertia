"use client";

import React, { useState } from "react";
import {
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ZoomIn,
  ArrowRightLeft,
  Calendar,
  MapPin,
  FileText,
  User,
  ShieldCheck,
  RotateCw,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EvidenciaCaso {
  folio: string;
  tipo: "Mantenimiento" | "Material";
  titulo: string;
  ubicacion: string;
  responsable: string;
  fecha: string;
  estado: "En validación" | "Validada" | "Ajuste solicitado" | "Incidencia";
  coincidenciaPorcentaje: number;
  criterios: {
    mismoPuntoCaptura: boolean;
    mejoraVisible: boolean;
    conformeAlAlcance: boolean;
  };
  descripcionAlcance: string;
  fotoClienteAntes: string;
  fotoProveedorDespues: string;
  notasProveedor: string;
  documentoAdjunto?: string;
}

const mockEvidencias: EvidenciaCaso[] = [
  {
    folio: "VT-1048",
    tipo: "Mantenimiento",
    titulo: "Reparación y ajuste de puerta de acceso peatonal",
    ubicacion: "Torre Norte - Piso 3 (Acceso principal)",
    responsable: "Herrería Soluciones S.A.",
    fecha: "Hoy, 16:18 hs",
    estado: "En validación",
    coincidenciaPorcentaje: 98,
    criterios: {
      mismoPuntoCaptura: true,
      mejoraVisible: true,
      conformeAlAlcance: true,
    },
    descripcionAlcance:
      "Corrección de bisagras vencidas, aplicación de soldadura en marco y pintura anticorrosiva negro mate.",
    fotoClienteAntes:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=700&q=80",
    fotoProveedorDespues:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80",
    notasProveedor:
      "Se reemplazaron 3 pernos de bisagra de alta resistencia y se calibró la cerradura con doble cerrojo. Pintura seca.",
    documentoAdjunto: "Reporte_Herreria_VT1048.pdf",
  },
  {
    folio: "VT-1049",
    tipo: "Material",
    titulo: "Descarga y estiba de Cemento Loma Negra (100 bolsas)",
    ubicacion: "Bodega Central - Sector Obra Torre Sur",
    responsable: "Corralón Los Pinos S.R.L.",
    fecha: "Hoy, 14:30 hs",
    estado: "En validación",
    coincidenciaPorcentaje: 95,
    criterios: {
      mismoPuntoCaptura: true,
      mejoraVisible: true,
      conformeAlAlcance: true,
    },
    descripcionAlcance:
      "Entrega acordada mediante extensión de stock físico autorizada. Palletizado protegido de humedad y remito firmado.",
    fotoClienteAntes:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
    fotoProveedorDespues:
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=700&q=80",
    notasProveedor:
      "Descargado con autoelevador en zona techada. Remito nro 0004-9812 firmado por el capataz Ing. Rossi.",
    documentoAdjunto: "Remito_Firmado_VT1049.pdf",
  },
  {
    folio: "VT-0112",
    tipo: "Mantenimiento",
    titulo: "Reparación de grieta y resane en muro de estacionamiento",
    ubicacion: "Torre Norte - Estacionamiento (Nivel -1)",
    responsable: "Albañilería Alfa",
    fecha: "Ayer, 17:20 hs",
    estado: "Incidencia",
    coincidenciaPorcentaje: 62,
    criterios: {
      mismoPuntoCaptura: true,
      mejoraVisible: false,
      conformeAlAlcance: false,
    },
    descripcionAlcance:
      "Apertura de fisura en 'V', sellado con masilla elastomérica y dos manos de pintura epoxi gris.",
    fotoClienteAntes:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=700&q=80",
    fotoProveedorDespues:
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=700&q=80",
    notasProveedor:
      "Se aplicó resane rápido, pendiente lijado final por humedad ambiente.",
    documentoAdjunto: "Detalle_Fisura_Alfa.pdf",
  },
];

export default function EvidenciasPage() {
  const [casoSeleccionado, setCasoSeleccionado] = useState<EvidenciaCaso>(
    mockEvidencias[0]
  );
  const [zoomActivo, setZoomActivo] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const handleValidar = () => {
    setMensajeExito(`¡Evidencia de solicitud ${casoSeleccionado.folio} validada y autorizada para cierre con éxito!`);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  const handleSolicitarAjuste = () => {
    setMensajeExito(`Se notificó al proveedor ${casoSeleccionado.responsable} para solicitar ajuste o nueva foto de evidencia.`);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Corporativo Claro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Validación de Evidencias Fotográficas
              </h1>
              <p className="text-xs text-slate-500">
                Comparación lado a lado de evidencias (Cliente Antes vs. Proveedor/Corralón Después) con control de coincidencia.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold px-2.5 py-1">
            Motor de Verificación Activo
          </Badge>
        </div>
      </div>

      {mensajeExito && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Selector de Casos Pendientes de Validación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {mockEvidencias.map((caso) => {
          const esActivo = caso.folio === casoSeleccionado.folio;
          return (
            <button
              key={caso.folio}
              onClick={() => setCasoSeleccionado(caso)}
              className={`p-3.5 rounded-xl text-left border transition-all ${
                esActivo
                  ? "bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-sm"
                  : "bg-white/80 border-slate-200 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-800">
                  {caso.folio}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    caso.estado === "Validada"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : caso.estado === "Incidencia"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {caso.estado}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                {caso.titulo}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="line-clamp-1">{caso.responsable}</span>
                <span className="font-bold text-indigo-600">
                  {caso.coincidenciaPorcentaje}% coincidencia
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Contenedor Principal: Vista 2 del Banner de Humberto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Visor Comparativo Lado a Lado (8 columnas) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm p-4 rounded-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Comparador Visual
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {casoSeleccionado.folio} — {casoSeleccionado.titulo}
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomActivo(!zoomActivo)}
                className="h-8 text-xs border-slate-200"
              >
                <ZoomIn className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {zoomActivo ? "Vista Normal" : "Zoom Comparativo"}
              </Button>
            </div>

            {/* Cuadrícula de Fotos Antes vs Después */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Foto 1: Evidencia Cliente / Inicial (Antes) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    Evidencia del Cliente (Antes)
                  </span>
                  <span className="text-[10px] text-slate-400">Foto de apertura</span>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={casoSeleccionado.fotoClienteAntes}
                    alt="Evidencia Antes"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      zoomActivo ? "scale-125 cursor-zoom-out" : "group-hover:scale-105"
                    }`}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[10px] text-white font-mono">
                    CLIENTE • ESTADO INICIAL
                  </div>
                </div>
              </div>

              {/* Foto 2: Evidencia Proveedor / Corralón (Después) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    Evidencia del Proveedor (Después)
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold">{casoSeleccionado.fecha}</span>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-indigo-200 bg-indigo-50/30 aspect-4/3 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={casoSeleccionado.fotoProveedorDespues}
                    alt="Evidencia Después"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      zoomActivo ? "scale-125 cursor-zoom-out" : "group-hover:scale-105"
                    }`}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-indigo-900/80 backdrop-blur-xs text-[10px] text-white font-mono">
                    PROVEEDOR • TRABAJO EJECUTADO
                  </div>
                </div>
              </div>
            </div>

            {/* Notas del proveedor y documento adjunto */}
            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-800">
                Observaciones del Proveedor / Transportista:
              </div>
              <p className="text-slate-600 leading-relaxed">
                &ldquo;{casoSeleccionado.notasProveedor}&rdquo;
              </p>
              {casoSeleccionado.documentoAdjunto && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    {casoSeleccionado.documentoAdjunto}
                  </span>
                  <button className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
                    Ver documento <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Panel de Validación VERTIA (4 columnas, idéntico al banner) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm p-4 rounded-xl space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Control Operativo
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Comparación VERTIA
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verificación de calidad y trazabilidad antes de habilitar el cierre al cliente.
              </p>
            </div>

            {/* Checklist de Criterios Operativos */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs font-medium text-slate-700">Mismo punto de captura</span>
                {casoSeleccionado.criterios.mismoPuntoCaptura ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs font-medium text-slate-700">Mejora visible evidente</span>
                {casoSeleccionado.criterios.mejoraVisible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs font-medium text-slate-700">Trabajo conforme al alcance</span>
                {casoSeleccionado.criterios.conformeAlAlcance ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )}
              </div>
            </div>

            {/* Medidor de Coincidencia */}
            <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-center space-y-1">
              <span className="text-xs text-indigo-800 font-semibold block">
                Nivel de Coincidencia Estimado
              </span>
              <div className="text-2xl font-black text-indigo-700">
                {casoSeleccionado.coincidenciaPorcentaje}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${casoSeleccionado.coincidenciaPorcentaje}%` }}
                ></div>
              </div>
            </div>

            {/* Metadatos del Trabajo */}
            <div className="text-[11px] space-y-1.5 text-slate-500 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-1">{casoSeleccionado.ubicacion}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Proveedor: {casoSeleccionado.responsable}</span>
              </div>
            </div>

            {/* Botones de Acción (Igual al banner de Humberto) */}
            <div className="pt-2 space-y-2">
              <Button
                onClick={handleValidar}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm py-2"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Validar Evidencia & Habilitar Cierre
              </Button>

              <Button
                onClick={handleSolicitarAjuste}
                variant="outline"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 text-xs py-2"
              >
                Solicitar Ajuste al Proveedor
              </Button>
            </div>
          </Card>

          {/* Panel de Incidencias Operativas (Vista 3 de Humberto) */}
          <Card className="bg-white border-slate-200 shadow-sm p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Incidencias Registradas
              </h4>
              <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-800 bg-amber-50">
                1 Activa
              </Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200/80 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-rose-900">
                <span>VT-0112 • Grieta en muro</span>
                <span className="text-[10px] text-rose-600">Pendiente</span>
              </div>
              <p className="text-[11px] text-rose-700">
                Evidencia fotográfica incompleta: falta lijado final y pintura epoxi según alcance contratado.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
