"use client";

import React, { useState } from "react";
import {
  Globe2,
  Search,
  Building2,
  MapPin,
  Share2,
  Plus,
  MessageSquare,
  ShieldAlert,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface PublicacionRed {
  id: string;
  empresa: string;
  ciudad: string;
  pais: string;
  producto_nombre: string;
  codigo_barras: string;
  cantidad_disponible: number;
  precio_unitario: number;
  notas: string;
  fecha: string;
}

const mockPublicacionesRed: PublicacionRed[] = [
  {
    id: "pub-1",
    empresa: "Metalúrgica Del Centro S.A.",
    ciudad: "Córdoba Capital",
    pais: "Argentina",
    producto_nombre: "Aceite Sintético Hidráulico ISO 68",
    codigo_barras: "7798765432109",
    cantidad_disponible: 800,
    precio_unitario: 3100.0,
    notas: "Tambores cerrados originales de fábrica. Entrega inmediata en zona centro.",
    fecha: "Hoy 10:15",
  },
  {
    id: "pub-2",
    empresa: "Trans-Sur Logística",
    ciudad: "Rosario",
    pais: "Argentina",
    producto_nombre: "Rodamiento SKF 6204-2RSH",
    codigo_barras: "7791234567890",
    cantidad_disponible: 350,
    precio_unitario: 7900.0,
    notas: "Lote de importación directa. Descuento por lote completo.",
    fecha: "Ayer 16:40",
  },
  {
    id: "pub-3",
    empresa: "Empresa Adherida (Confidencial)",
    ciudad: "Buenos Aires",
    pais: "Argentina",
    producto_nombre: "Filtro de Aceite Donaldson P550008",
    codigo_barras: "7794443332220",
    cantidad_disponible: 45,
    precio_unitario: 18500.0,
    notas: "Excedente de proyecto de mantenimiento minero. Consultar retiro.",
    fecha: "15/11/2026",
  },
];

export default function RedB2BPage() {
  const [tabActiva, setTabActiva] = useState<"explorar" | "mis_publicaciones">("explorar");
  const [busqueda, setBusqueda] = useState("");
  const [modalContacto, setModalContacto] = useState<PublicacionRed | null>(null);
  const [mensajeContacto, setMensajeContacto] = useState("");
  const [enviado, setEnviado] = useState(false);

  const filtrados = mockPublicacionesRed.filter(
    (p) =>
      p.producto_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo_barras.includes(busqueda) ||
      p.ciudad.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-indigo-400" />
            Red Colaborativa de Stock B2B
          </h1>
          <p className="text-sm text-zinc-400">
            Conecta con otros almacenes y empresas de la red InvenTrack para cubrir faltantes o comercializar excedentes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={tabActiva === "explorar" ? "default" : "outline"}
            onClick={() => setTabActiva("explorar")}
            className="text-xs h-9"
          >
            Explorar Red B2B
          </Button>
          <Button
            variant={tabActiva === "mis_publicaciones" ? "default" : "outline"}
            onClick={() => setTabActiva("mis_publicaciones")}
            className="text-xs h-9"
          >
            Mis Publicaciones (2)
          </Button>
        </div>
      </div>

      {/* Banner Informativo */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/80 via-zinc-900 to-zinc-900 border border-indigo-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-white">¿Tienes órdenes con faltantes (BackOrders)?</div>
            <div className="text-xs text-zinc-300 mt-0.5">
              Busca en la red interconectada. Si otra empresa tiene stock disponible, puedes solicitarle una venta directa o traspaso para no demorar tus entregas.
            </div>
          </div>
        </div>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs shrink-0">
          <Plus className="w-3.5 h-3.5 mr-1" />
          Publicar Stock Excedente
        </Button>
      </div>

      {/* Buscador de la Red */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto, código de barras o ciudad..."
            className="pl-9 h-9 text-xs bg-zinc-950 border-zinc-800"
          />
        </div>
        <div className="text-xs text-zinc-400 font-medium">
          {filtrados.length} publicaciones disponibles en la red
        </div>
      </div>

      {/* Grid de Publicaciones B2B */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map((pub) => (
          <div
            key={pub.id}
            className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  {pub.ciudad}, {pub.pais}
                </span>
                <span className="text-[11px] text-zinc-500">{pub.fecha}</span>
              </div>

              <div className="font-bold text-base text-white">{pub.producto_nombre}</div>
              <div className="font-mono text-xs text-zinc-400 mt-0.5">Cód: {pub.codigo_barras}</div>

              <p className="text-xs text-zinc-300 mt-2.5 line-clamp-2 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-900">
                &ldquo;{pub.notas}&rdquo;
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-zinc-500">Disponible</div>
                  <div className="text-sm font-bold text-emerald-400">{pub.cantidad_disponible} u.</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-zinc-500">Precio Ref.</div>
                  <div className="text-sm font-bold text-white">
                    ${pub.precio_unitario.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="text-xs text-zinc-400 truncate flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{pub.empresa}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setModalContacto(pub);
                    setEnviado(false);
                    setMensajeContacto(`Hola, vimos su publicación en la Red InvenTrack de ${pub.producto_nombre}. Nos interesaría adquirir un lote.`);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs shrink-0"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Contactar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Solicitud / Contacto */}
      {modalContacto && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Solicitud Inter-Empresas (Red B2B)</h3>
              <Badge variant="secondary" className="text-xs">
                {modalContacto.empresa}
              </Badge>
            </div>

            <p className="text-xs text-zinc-400">
              Artículo: <strong className="text-white">{modalContacto.producto_nombre}</strong> • Stock disponible: {modalContacto.cantidad_disponible} u.
            </p>

            {enviado ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <div className="font-semibold text-white">¡Solicitud enviada con éxito!</div>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  La empresa ofertante ha recibido tu solicitud en su bandeja de la Red B2B y se comunicará a la brevedad.
                </p>
                <Button onClick={() => setModalContacto(null)} className="mt-2">
                  Cerrar
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Mensaje de propuesta / cantidad requerida:</label>
                  <textarea
                    rows={4}
                    value={mensajeContacto}
                    onChange={(e) => setMensajeContacto(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setModalContacto(null)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => setEnviado(true)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Enviar Solicitud B2B
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
