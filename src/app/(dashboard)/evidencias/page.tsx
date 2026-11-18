"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ZoomIn,
  MapPin,
  FileText,
  User,
  ShieldCheck,
  ExternalLink,
  UploadCloud,
  HardDrive,
  Cloud,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  FileCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  getEvidencias,
  uploadEvidencia,
  validarEvidencia,
  solicitarAjuste,
  compressImage,
  formatBytes,
  CompressedImageResult,
  MultiTenantEvidencia,
} from "@/lib/services";

export default function EvidenciasPage() {
  const { user, tenant } = useAuth();
  const isSuperAdmin = user?.is_super_admin ?? false;

  const [evidencias, setEvidencias] = useState<MultiTenantEvidencia[]>([]);
  const [casoSeleccionado, setCasoSeleccionado] =
    useState<MultiTenantEvidencia | null>(null);
  const [cargando, setCargando] = useState(true);
  const [zoomActivo, setZoomActivo] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Modal para subir nueva evidencia / remito firmado
  const [modalSubidaAbierto, setModalSubidaAbierto] = useState(false);
  const [nuevoFolio, setNuevoFolio] = useState(
    `VT-${Math.floor(1050 + Math.random() * 8900)}`
  );
  const [nuevoTipo, setNuevoTipo] = useState<string>("Remito firmado");
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaUbicacion, setNuevaUbicacion] = useState(
    "Bodega Central - Sector Obra"
  );
  const [nuevasNotas, setNuevasNotas] = useState("");
  const [comprimiendo, setComprimiendo] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [resultadoCompresion, setResultadoCompresion] =
    useState<CompressedImageResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Tenant activo efectivo
  const effectiveTenantId = useMemo(() => {
    return user?.tenant_id || "tenant-los-pinos";
  }, [user?.tenant_id]);

  // Cargar evidencias del tenant
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setCargando(true);
        const data = await getEvidencias(effectiveTenantId, isSuperAdmin);
        if (isMounted) {
          setEvidencias(data);
          if (data.length > 0) {
            setCasoSeleccionado(data[0]);
          }
        }
      } catch (err) {
        console.error("Error al cargar evidencias:", err);
      } finally {
        if (isMounted) setCargando(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [effectiveTenantId, isSuperAdmin]);

  // Manejar selección y compresión inmediata de foto
  const handleSeleccionarArchivo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorModal(null);
    setComprimiendo(true);

    try {
      // Compresión client-side en Canvas WebP/JPEG 0.82 máx 1600x1200
      const res = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.82,
        preferredFormat: "image/webp",
      });
      setResultadoCompresion(res);

      if (!nuevoTitulo) {
        setNuevoTitulo(
          nuevoTipo === "Remito firmado"
            ? `Remito conformado orden ${nuevoFolio}`
            : `Descarga y entrega de materiales ${nuevoFolio}`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setErrorModal(`No se pudo procesar la imagen: ${msg}`);
    } finally {
      setComprimiendo(false);
    }
  };

  // Confirmar y subir a Supabase Storage con fallback local
  const handleConfirmarSubida = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultadoCompresion) {
      setErrorModal("Debes seleccionar una foto o remito para continuar.");
      return;
    }

    setSubiendo(true);
    setErrorModal(null);

    try {
      const resp = await uploadEvidencia(resultadoCompresion.blob, {
        folio: nuevoFolio,
        tipo: nuevoTipo,
        titulo:
          nuevoTitulo || `Entrega de materiales y remito firmado ${nuevoFolio}`,
        notas:
          nuevasNotas ||
          "Material descargado y remito físico verificado sin observaciones.",
        tenantId: effectiveTenantId,
        ubicacion: nuevaUbicacion,
        responsable:
          user?.nombre_completo ||
          (tenant?.nombre ? `${tenant.nombre} - Depósito` : "Operario de Obra"),
        descripcionAlcance: `Constatación de entrega en obra y remito digitalizado ${nuevoFolio}.`,
      });

      // Actualizar estado local inmediatamente
      setEvidencias((prev) => [resp.evidencia, ...prev]);
      setCasoSeleccionado(resp.evidencia);
      setModalSubidaAbierto(false);

      // Resetear formulario
      setResultadoCompresion(null);
      setNuevoFolio(`VT-${Math.floor(1050 + Math.random() * 8900)}`);
      setNuevoTitulo("");
      setNuevasNotas("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      const storageMsg =
        resp.storageProvider === "supabase"
          ? 'en la nube Supabase Storage (bucket "evidencias")'
          : "en almacenamiento local seguro (fallback offline)";

      setMensajeExito(
        `¡Evidencia fotográfica ${resp.evidencia.folio} procesada y guardada con éxito ${storageMsg}!`
      );
      setTimeout(() => setMensajeExito(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setErrorModal(`Error al guardar la evidencia: ${msg}`);
    } finally {
      setSubiendo(false);
    }
  };

  // Validar y autorizar cierre
  const handleValidar = async () => {
    if (!casoSeleccionado) return;
    try {
      await validarEvidencia(casoSeleccionado.folio);
      const updated = {
        ...casoSeleccionado,
        estado: "Validada" as const,
      };
      setCasoSeleccionado(updated);
      setEvidencias((prev) =>
        prev.map((c) => (c.folio === updated.folio ? updated : c))
      );

      setMensajeExito(
        `¡Evidencia de solicitud ${casoSeleccionado.folio} validada y autorizada para cierre con éxito!`
      );
      setTimeout(() => setMensajeExito(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Solicitar ajuste al proveedor
  const handleSolicitarAjuste = async () => {
    if (!casoSeleccionado) return;
    try {
      await solicitarAjuste(
        casoSeleccionado.folio,
        "Foto borrosa o fuera de ángulo requerido"
      );
      const updated = {
        ...casoSeleccionado,
        estado: "Ajuste solicitado" as const,
      };
      setCasoSeleccionado(updated);
      setEvidencias((prev) =>
        prev.map((c) => (c.folio === updated.folio ? updated : c))
      );

      setMensajeExito(
        `Se notificó al proveedor ${casoSeleccionado.responsable} para solicitar ajuste o nueva foto de evidencia.`
      );
      setTimeout(() => setMensajeExito(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Corporativo con Acción de Subida */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Validación de Evidencias Fotográficas & Remitos
              </h1>
              <p className="text-xs text-slate-500">
                Compresión client-side automática en Canvas (WebP ~250 KB) y
                almacenamiento en Supabase Storage con fallback offline.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold px-2.5 py-1">
            Motor de Compresión Activo
          </Badge>

          <Button
            onClick={() => setModalSubidaAbierto(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 h-9"
          >
            <UploadCloud className="w-4 h-4" />
            Subir Nueva Evidencia / Remito Firmado
          </Button>
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
        {cargando ? (
          <div className="col-span-3 text-center py-6 text-xs text-slate-400">
            Cargando evidencias del tenant...
          </div>
        ) : evidencias.length === 0 ? (
          <div className="col-span-3 text-center py-6 text-xs text-slate-400">
            No hay evidencias registradas en este depósito.
          </div>
        ) : (
          evidencias.map((caso) => {
            const esActivo = caso.folio === casoSeleccionado?.folio;
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
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {caso.folio}
                    </span>
                    {caso.storageProvider === "supabase" ? (
                      <span
                        title="Almacenado en Supabase Storage"
                        className="inline-flex items-center text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100"
                      >
                        <Cloud className="w-2.5 h-2.5 mr-0.5" /> Nube
                      </span>
                    ) : (
                      <span
                        title="Almacenado localmente (Offline)"
                        className="inline-flex items-center text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200"
                      >
                        <HardDrive className="w-2.5 h-2.5 mr-0.5" /> Local
                      </span>
                    )}
                  </div>
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

                {caso.tamanoComprimido && (
                  <div className="mt-1 text-[10px] text-emerald-700 font-mono">
                    Comprimido: {formatBytes(caso.tamanoComprimido)} (
                    {caso.ahorroPorcentaje || 94}% ahorro)
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Contenedor Principal: Vista del Comparador y Panel de Criterios */}
      {casoSeleccionado && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Visor Comparativo Lado a Lado (8 columnas) */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm p-4 rounded-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Comparador Visual
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0">
                      {casoSeleccionado.tipo}
                    </Badge>
                  </div>
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
                    <span className="text-[10px] text-slate-400">
                      Foto de apertura
                    </span>
                  </div>
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={casoSeleccionado.fotoClienteAntes}
                      alt="Evidencia Antes"
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        zoomActivo
                          ? "scale-125 cursor-zoom-out"
                          : "group-hover:scale-105"
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
                      Evidencia Proveedor / Remito
                    </span>
                    <span className="text-[10px] text-indigo-600 font-semibold">
                      {casoSeleccionado.fecha}
                    </span>
                  </div>
                  <div className="relative rounded-lg overflow-hidden border border-indigo-200 bg-indigo-50/30 aspect-4/3 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={casoSeleccionado.fotoProveedorDespues}
                      alt="Evidencia Después"
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        zoomActivo
                          ? "scale-125 cursor-zoom-out"
                          : "group-hover:scale-105"
                      }`}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-indigo-900/80 backdrop-blur-xs text-[10px] text-white font-mono flex items-center gap-1">
                      {casoSeleccionado.storageProvider === "supabase" ? (
                        <Cloud className="w-2.5 h-2.5 text-emerald-300" />
                      ) : (
                        <HardDrive className="w-2.5 h-2.5 text-amber-300" />
                      )}
                      <span>PROVEEDOR • TRABAJO EJECUTADO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Métricas de Compresión y Ahorro */}
              {casoSeleccionado.tamanoComprimido && (
                <div className="mt-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Compresión Automática Client-Side:</span>
                  </div>
                  <div className="font-mono text-[11px] text-emerald-900">
                    Original:{" "}
                    {formatBytes(
                      casoSeleccionado.tamanoOriginal || 5242880
                    )}{" "}
                    ➔ Comprimido:{" "}
                    <span className="font-bold">
                      {formatBytes(casoSeleccionado.tamanoComprimido)}
                    </span>{" "}
                    ({casoSeleccionado.ahorroPorcentaje || 94.5}% ahorro de cuota)
                  </div>
                </div>
              )}

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

          {/* Columna Derecha: Panel de Validación VERTIA */}
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
                  Verificación de calidad y trazabilidad antes de habilitar el
                  cierre al cliente.
                </p>
              </div>

              {/* Checklist de Criterios Operativos */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs font-medium text-slate-700">
                    Mismo punto de captura
                  </span>
                  {casoSeleccionado.criterios.mismoPuntoCaptura ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  )}
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs font-medium text-slate-700">
                    Mejora visible evidente
                  </span>
                  {casoSeleccionado.criterios.mejoraVisible ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  )}
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs font-medium text-slate-700">
                    Trabajo conforme al alcance
                  </span>
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
                    style={{
                      width: `${casoSeleccionado.coincidenciaPorcentaje}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Metadatos del Trabajo */}
              <div className="text-[11px] space-y-1.5 text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">
                    {casoSeleccionado.ubicacion}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Proveedor: {casoSeleccionado.responsable}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    Storage:{" "}
                    {casoSeleccionado.storageProvider === "supabase"
                      ? "Supabase Storage Nube"
                      : "Local Seguro Cache"}
                  </span>
                </div>
              </div>

              {/* Botones de Acción */}
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

            {/* Panel de Incidencias Operativas */}
            <Card className="bg-white border-slate-200 shadow-sm p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Incidencias Registradas
                </h4>
                <Badge
                  variant="outline"
                  className="text-[10px] border-amber-200 text-amber-800 bg-amber-50"
                >
                  {evidencias.filter((e) => e.estado === "Incidencia").length}{" "}
                  Activa
                </Badge>
              </div>

              {evidencias.filter((e) => e.estado === "Incidencia").length >
              0 ? (
                evidencias
                  .filter((e) => e.estado === "Incidencia")
                  .map((inc) => (
                    <div
                      key={inc.folio}
                      className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-rose-900">
                        <span>
                          {inc.folio} • {inc.titulo}
                        </span>
                        <span className="text-[10px] text-rose-600">
                          Pendiente
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-700">
                        {inc.notasProveedor}
                      </p>
                    </div>
                  ))
              ) : (
                <div className="text-xs text-slate-500">
                  No hay incidencias registradas en este momento.
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Modal Interactivo: Subir Nueva Evidencia / Remito Firmado */}
      {modalSubidaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 w-full max-w-lg space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600" />
                Subir Nueva Evidencia / Remito Firmado
              </h2>
              <button
                onClick={() => setModalSubidaAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorModal && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorModal}</span>
              </div>
            )}

            <form onSubmit={handleConfirmarSubida} className="space-y-4 text-xs">
              {/* Selector de Archivo / Captura de Cámara */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 block">
                  Foto de Evidencia / Remito (Cámara o Archivo)
                </label>
                <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl p-4 text-center bg-indigo-50/20 transition-all cursor-pointer relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    required
                    onChange={handleSeleccionarArchivo}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Camera className="w-8 h-8 text-indigo-500" />
                    <span className="font-semibold text-slate-700">
                      Tocar para abrir cámara o subir archivo
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Formatos JPEG, PNG, WebP de celular (hasta 15 MB)
                    </span>
                  </div>
                </div>
              </div>

              {/* Indicador de Compresión en Curso */}
              {comprimiendo && (
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs flex items-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span>
                    Comprimiendo imagen en Canvas WebP (resolución máx
                    1600x1200)...
                  </span>
                </div>
              )}

              {/* Badge Comparativo de Ahorro y Vista Previa */}
              {resultadoCompresion && (
                <div className="space-y-3">
                  {/* Badge Comparativo */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-300 text-emerald-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Optimización Inmediata Completada</span>
                    </div>
                    <p className="font-mono text-xs font-semibold text-emerald-900">
                      Original:{" "}
                      <span className="line-through text-slate-500 font-normal">
                        {formatBytes(resultadoCompresion.originalSize)}
                      </span>{" "}
                      ➔ Comprimido:{" "}
                      <span className="font-bold text-emerald-700">
                        {formatBytes(resultadoCompresion.compressedSize)}
                      </span>{" "}
                      <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold">
                        {resultadoCompresion.ratioPercent}% ahorro de cuota
                      </span>
                    </p>
                    <div className="text-[10px] text-emerald-700">
                      Resolución: {resultadoCompresion.width}x
                      {resultadoCompresion.height} px • Formato:{" "}
                      {resultadoCompresion.mimeType}
                    </div>
                  </div>

                  {/* Vista Previa de la Foto Comprimida */}
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-16/9 bg-slate-100 max-h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resultadoCompresion.dataUrl}
                      alt="Vista previa comprimida"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                      PREVIEW COMPRIMIDA (~
                      {formatBytes(resultadoCompresion.compressedSize)})
                    </div>
                  </div>
                </div>
              )}

              {/* Metadatos de la Orden */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Folio de la Orden
                  </label>
                  <Input
                    required
                    value={nuevoFolio}
                    onChange={(e) => setNuevoFolio(e.target.value)}
                    className="h-8 text-xs font-mono font-bold"
                    placeholder="VT-1050"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Tipo de Evidencia
                  </label>
                  <select
                    value={nuevoTipo}
                    onChange={(e) => setNuevoTipo(e.target.value)}
                    className="w-full h-8 bg-white border border-slate-200 rounded px-2 text-xs"
                  >
                    <option value="Remito firmado">Remito firmado</option>
                    <option value="Descarga de material en obra">
                      Descarga de material en obra
                    </option>
                    <option value="Estado previo/posterior">
                      Estado previo/posterior
                    </option>
                    <option value="Mantenimiento general">
                      Mantenimiento general
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Título Descriptivo
                </label>
                <Input
                  required
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="Ej: Remito firmado y descarga de perfiles galvanizados"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Ubicación de Inspección / Obra
                </label>
                <Input
                  value={nuevaUbicacion}
                  onChange={(e) => setNuevaUbicacion(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="Ej: Bodega Central - Sector Obra Torre Sur"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Notas de Inspección / Observaciones del Remito
                </label>
                <textarea
                  rows={2}
                  value={nuevasNotas}
                  onChange={(e) => setNuevasNotas(e.target.value)}
                  placeholder="Detalles de la entrega, remito conformado por capataz de obra, observaciones del estado del material..."
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              {/* Botones de Acción */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalSubidaAbierto(false)}
                  className="h-8 text-xs border-slate-300"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={subiendo || comprimiendo || !resultadoCompresion}
                  className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5"
                >
                  {subiendo ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      Subiendo a Supabase Storage...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5" />
                      Confirmar y Subir Evidencia
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
