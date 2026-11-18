"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  PackageCheck,
  AlertTriangle,
  Globe2,
  Warehouse,
  Barcode,
  MessageSquare,
  ShieldCheck,
  Truck,
  Send,
  X,
  MapPin,
  Building2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DetalleSolicitud {
  id: string;
  material: string;
  codigo: string;
  cantidadSolicitada: number;
  cantidadDisponibleCorralon: number; // 60
  stockRealFisico: number;             // 120
  cantidadAutorizadaExtension: number; // 40
  unidad: string;
  estadoItem: "Completo" | "Extensión requerida" | "Extensión autorizada";
}

interface SolicitudOrden {
  id: string;
  folio: string;
  tipo: "Material" | "Mantenimiento";
  proyectoUbicacion: string;
  cliente: string;
  corralonAsignado: string;
  fecha: string;
  estado: "Por cotizar" | "Asignada" | "En preparación" | "En camino" | "Entregada";
  detalles: DetalleSolicitud[];
  distanciaKm: number;
}

const mockSolicitudes: SolicitudOrden[] = [
  {
    id: "sol-1",
    folio: "VT-1049",
    tipo: "Material",
    proyectoUbicacion: "Torre Sur - Bodega Central (Obra Torre Sur)",
    cliente: "Constructora Arcos S.A.",
    corralonAsignado: "Corralón Los Pinos S.R.L.",
    fecha: "Hoy, 10:15 hs",
    estado: "Asignada",
    distanciaKm: 4.8,
    detalles: [
      {
        id: "det-1",
        material: "Cemento Loma Negra 50kg (Bolsa)",
        codigo: "7791234567890",
        cantidadSolicitada: 100,
        cantidadDisponibleCorralon: 60,
        stockRealFisico: 120,
        cantidadAutorizadaExtension: 0,
        unidad: "BL",
        estadoItem: "Extensión requerida",
      },
    ],
  },
  {
    id: "sol-2",
    folio: "VT-1048",
    tipo: "Mantenimiento",
    proyectoUbicacion: "Torre Norte - Piso 3 (Puerta de acceso)",
    cliente: "Administración Torre Norte",
    corralonAsignado: "Herrería Soluciones S.A.",
    fecha: "Hoy, 09:10 hs",
    estado: "En preparación",
    distanciaKm: 8.2,
    detalles: [
      {
        id: "det-2",
        material: "Kit Cerradura de Alta Seguridad + Bisagras 4x4",
        codigo: "7798765432109",
        cantidadSolicitada: 1,
        cantidadDisponibleCorralon: 4,
        stockRealFisico: 4,
        cantidadAutorizadaExtension: 0,
        unidad: "JGO",
        estadoItem: "Completo",
      },
    ],
  },
  {
    id: "sol-3",
    folio: "VT-1052",
    tipo: "Material",
    proyectoUbicacion: "Torre Sur - Terraza & Cocheras",
    cliente: "Desarrollos Urbanos",
    corralonAsignado: "Materiales del Centro S.A.",
    fecha: "Ayer, 16:40 hs",
    estado: "Por cotizar",
    distanciaKm: 12.0,
    detalles: [
      {
        id: "det-3",
        material: "Hierro Nervado Ø 10mm (Barra 12m)",
        codigo: "7795556667771",
        cantidadSolicitada: 150,
        cantidadDisponibleCorralon: 150,
        stockRealFisico: 250,
        cantidadAutorizadaExtension: 0,
        unidad: "UN",
        estadoItem: "Completo",
      },
    ],
  },
];

export default function OrdenesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudOrden[]>(mockSolicitudes);
  const [solicitudActiva, setSolicitudActiva] = useState<SolicitudOrden>(mockSolicitudes[0]);
  const [modalChatAbierto, setModalChatAbierto] = useState(false);
  const [mensajesChat, setMensajesChat] = useState<{ remitente: string; texto: string; hora: string }[]>([
    {
      remitente: "Operador VERTIA",
      texto:
        "Hola Corralón Los Pinos. La obra Torre Sur requiere 100 bolsas de Cemento Loma Negra (VT-1049). Notamos que tienen 60 bolsas marcadas como disponibles pero 120 en stock físico real en su galpón. ¿Podrían autorizar extenderse en 40 bolsas adicionales de su inventario físico para completar el pedido?",
      hora: "10:18 hs",
    },
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [extensionConfirmada, setExtensionConfirmada] = useState(false);

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;
    setMensajesChat([
      ...mensajesChat,
      { remitente: "Operador VERTIA", texto: nuevoMensaje, hora: "Ahora" },
    ]);
    setNuevoMensaje("");
  };

  const autorizarExtensionCorralon = () => {
    // Simula la autorización del corralón
    setMensajesChat((prev) => [
      ...prev,
      {
        remitente: "Corralón Los Pinos (Martín Rossi)",
        texto:
          "¡Confirmado! Revisamos el galpón y autorizamos liberar 40 bolsas de nuestro stock físico de seguridad para cubrir la orden VT-1049 al 100%. Ya generamos la orden de carga.",
        hora: "Ahora",
      },
    ]);

    // Actualiza el estado de la solicitud en memoria
    setSolicitudes((prev) =>
      prev.map((s) => {
        if (s.folio === "VT-1049") {
          return {
            ...s,
            estado: "En preparación",
            detalles: s.detalles.map((d) => ({
              ...d,
              cantidadAutorizadaExtension: 40,
              estadoItem: "Extensión autorizada",
            })),
          };
        }
        return s;
      })
    );

    setSolicitudActiva((prev) => ({
      ...prev,
      estado: "En preparación",
      detalles: prev.detalles.map((d) => ({
        ...d,
        cantidadAutorizadaExtension: 40,
        estadoItem: "Extensión autorizada",
      })),
    }));

    setExtensionConfirmada(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Gestión de Solicitudes, Pedidos & Negociación de Stock
              </h1>
              <p className="text-xs text-slate-500">
                Coordinación de pedidos con corralones asociados y solicitud de extensión de stock físico en tiempo real.
              </p>
            </div>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Nueva Solicitud de Material
        </Button>
      </div>

      {/* Grid de Solicitudes / Vistas 4 y 5 de Humberto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Lista de Solicitudes (5 columnas) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Solicitudes Recibidas (Vistas Proveedor & Red)
            </h3>
            <span className="text-[11px] font-semibold text-indigo-600">
              {solicitudes.length} pedidos
            </span>
          </div>

          <div className="space-y-2.5">
            {solicitudes.map((sol) => {
              const esActivo = sol.id === solicitudActiva.id;
              return (
                <button
                  key={sol.id}
                  onClick={() => setSolicitudActiva(sol)}
                  className={`w-full p-4 rounded-xl text-left border transition-all ${
                    esActivo
                      ? "bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {sol.folio}
                    </span>
                    <Badge
                      className={`text-[10px] font-semibold border ${
                        sol.estado === "Asignada"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : sol.estado === "En preparación"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {sol.estado}
                    </Badge>
                  </div>

                  <div className="font-semibold text-slate-800 text-xs line-clamp-1">
                    {sol.detalles[0]?.material}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {sol.corralonAsignado}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3 h-3 text-indigo-600" />
                      {sol.distanciaKm} km
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Detalle de Solicitud & Negociación de Stock (7 columnas) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-white border-slate-200 shadow-sm p-5 rounded-xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {solicitudActiva.folio}
                  </span>
                  <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-600">
                    {solicitudActiva.tipo}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Cliente: <strong className="text-slate-800">{solicitudActiva.cliente}</strong> • Obra: {solicitudActiva.proyectoUbicacion}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Corralón Asignado</span>
                <span className="text-xs font-bold text-slate-800">
                  {solicitudActiva.corralonAsignado}
                </span>
              </div>
            </div>

            {/* Listado de Materiales y Comparativa Real vs Disponible */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Desglose de Materiales & Cobertura de Stock
              </h4>

              {solicitudActiva.detalles.map((det) => {
                const necesitaExtension =
                  det.cantidadSolicitada > det.cantidadDisponibleCorralon &&
                  det.cantidadAutorizadaExtension === 0;

                return (
                  <div
                    key={det.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{det.material}</div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Barcode className="w-3.5 h-3.5" />
                          {det.codigo}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Requerido por Obra</span>
                        <span className="text-base font-black text-slate-900">
                          {det.cantidadSolicitada} {det.unidad}
                        </span>
                      </div>
                    </div>

                    {/* Comparativa de Stock del Corralón */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Stock Disponible (Venta)</span>
                        <span className="font-extrabold text-slate-800 text-sm">
                          {det.cantidadDisponibleCorralon} {det.unidad}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Stock Real (Físico Galpón)</span>
                        <span className="font-extrabold text-indigo-700 text-sm">
                          {det.stockRealFisico} {det.unidad}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Estado Cobertura</span>
                        <span
                          className={`font-bold text-xs ${
                            det.estadoItem === "Extensión autorizada"
                              ? "text-emerald-700"
                              : necesitaExtension
                              ? "text-amber-700"
                              : "text-slate-700"
                          }`}
                        >
                          {det.estadoItem}
                        </span>
                      </div>
                    </div>

                    {/* Banner de Negociación si falta stock disponible pero hay stock real físico */}
                    {necesitaExtension && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-2">
                        <div className="flex items-center gap-2 text-amber-900 font-bold">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Stock disponible insuficiente para cubrir las 100 bolsas (+40 faltantes)</span>
                        </div>
                        <p className="text-amber-800 text-[11px] leading-relaxed">
                          El corralón cuenta con <strong>120 bolsas en stock físico real</strong> en su galpón.
                          Puedes abrir un canal directo de mensajería para solicitar que autorice liberar 40 bolsas.
                        </p>
                        <Button
                          onClick={() => setModalChatAbierto(true)}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2 shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                          Negociar Extensión de Stock con Corralón
                        </Button>
                      </div>
                    )}

                    {det.estadoItem === "Extensión autorizada" && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between text-emerald-800 font-medium">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Extensión de 40 bolsas autorizada por Corralón Los Pinos. Pedido 100% cubierto.
                        </span>
                        <Button
                          onClick={() => setModalChatAbierto(true)}
                          variant="outline"
                          size="sm"
                          className="h-7 text-[11px] border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                        >
                          Ver Chat & Registro
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Acciones Finales */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Radio logístico: <strong className="text-slate-800">{solicitudActiva.distanciaKm} km</strong> de distancia.
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setModalChatAbierto(true)}
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-200 text-slate-700"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Mensajería de Pedido
                </Button>
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  <Truck className="w-3.5 h-3.5 mr-1" />
                  Emitir Remito de Despacho
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Interactivo de Chat & Negociación de Extensión de Stock */}
      {modalChatAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="bg-white border-slate-200 shadow-xl max-w-xl w-full p-5 space-y-4 rounded-xl flex flex-col max-h-[90vh]">
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Negociación de Extensión de Stock — {solicitudActiva.folio}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Canal B2B con {solicitudActiva.corralonAsignado}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalChatAbierto(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha Rápida del Faltante */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800">Cemento Loma Negra 50kg</span>
                <span className="text-[11px] text-slate-500 block">
                  Solicitado: 100 BL • Disponible: 60 BL • Stock Físico: 120 BL
                </span>
              </div>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-bold text-[10px]">
                Extensión: +40 BL
              </Badge>
            </div>

            {/* Historial de Mensajes */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100 min-h-[220px]">
              {mensajesChat.map((m, idx) => {
                const esOperador = m.remitente.includes("Operador");
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${esOperador ? "items-start" : "items-end"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-slate-600">{m.remitente}</span>
                      <span className="text-[9px] text-slate-400">{m.hora}</span>
                    </div>
                    <div
                      className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                        esOperador
                          ? "bg-white border border-slate-200 text-slate-800"
                          : "bg-indigo-600 text-white font-medium"
                      }`}
                    >
                      {m.texto}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botonera de Simulación de Respuesta del Corralón */}
            {!extensionConfirmada && (
              <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
                <span className="text-[11px] font-bold text-indigo-900 block">
                  Simular Acción desde el Entorno del Corralón:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={autorizarExtensionCorralon}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Autorizar Extensión (+40 bolsas)
                  </Button>
                  <Button
                    onClick={() => {
                      setMensajesChat((prev) => [
                        ...prev,
                        {
                          remitente: "Corralón Los Pinos",
                          texto:
                            "Lamentablemente ese excedente en stock físico ya está comprometido para un retiro programado mañana temprano. Solo podemos entregar las 60 bolsas disponibles.",
                          hora: "Ahora",
                        },
                      ]);
                    }}
                    variant="outline"
                    className="border-slate-300 text-slate-700 text-xs"
                  >
                    Rechazar Extensión
                  </Button>
                </div>
              </div>
            )}

            {/* Input de Envío de Mensaje */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <Input
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
                placeholder="Escribe un mensaje al corralón..."
                className="text-xs border-slate-200 h-9"
              />
              <Button
                onClick={enviarMensaje}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-3 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
