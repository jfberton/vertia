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
  ShieldCheck,
  SlidersHorizontal,
  CheckCircle2,
  Truck,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface PublicacionRed {
  id: string;
  empresa: string;
  distanciaKm: number;
  ciudad: string;
  producto_nombre: string;
  codigo_barras: string;
  stock_disponible: number;
  stock_real_fisico: number; // Permite ver si tienen más stock físico negociable
  unidad: string;
  precio_unitario: number;
  notas: string;
  fecha: string;
}

const mockPublicacionesRed: PublicacionRed[] = [
  {
    id: "pub-1",
    empresa: "Corralón Los Pinos S.R.L.",
    distanciaKm: 4.8,
    ciudad: "Rosario (Zona Oeste)",
    producto_nombre: "Cemento Loma Negra 50kg (Bolsa)",
    codigo_barras: "7791234567890",
    stock_disponible: 60,
    stock_real_fisico: 120,
    unidad: "BL",
    precio_unitario: 9800.0,
    notas: "Pallets protegidos bajo techo. Acepta solicitudes de extensión sobre stock físico.",
    fecha: "Hoy 10:15",
  },
  {
    id: "pub-2",
    empresa: "Materiales del Centro S.A.",
    distanciaKm: 9.3,
    ciudad: "Rosario (Centro)",
    producto_nombre: "Hierro Nervado Ø 10mm (Barra 12m)",
    codigo_barras: "7798765432109",
    stock_disponible: 150,
    stock_real_fisico: 250,
    unidad: "UN",
    precio_unitario: 14500.0,
    notas: "Atado estandarizado IRAM. Flete con grúa disponible para descarga en obra.",
    fecha: "Hoy 09:30",
  },
  {
    id: "pub-3",
    empresa: "Cantera & Áridos San Lorenzo",
    distanciaKm: 18.5,
    ciudad: "San Lorenzo",
    producto_nombre: "Arena Fina de Río (Bolsón 1m³)",
    codigo_barras: "7795556667771",
    stock_disponible: 45,
    stock_real_fisico: 80,
    unidad: "M3",
    precio_unitario: 22000.0,
    notas: "Árido lavado seleccionado. Salida continua de bateas para obras viales y edificios.",
    fecha: "Ayer 17:10",
  },
];

export default function RedB2BPage() {
  const [busqueda, setBusqueda] = useState("");
  const [radioFiltroKm, setRadioFiltroKm] = useState(25);
  const [publicaciones] = useState<PublicacionRed[]>(mockPublicacionesRed);
  const [modalContacto, setModalContacto] = useState<PublicacionRed | null>(null);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const filtradas = publicaciones.filter(
    (p) =>
      p.distanciaKm <= radioFiltroKm &&
      (p.producto_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.empresa.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const handleEnviarSolicitud = () => {
    setMensajeEnviado(true);
    setTimeout(() => {
      setMensajeEnviado(false);
      setModalContacto(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Red Vertia de Corralones & Suministros
              </h1>
              <p className="text-xs text-slate-500">
                Interconexión de stock entre corralones asociados a VERTIA con filtro logístico por radio de flete.
              </p>
            </div>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
          <Share2 className="w-4 h-4 mr-1.5" />
          Publicar Sobrante / Oferta a la Red
        </Button>
      </div>

      {/* Barra de Filtros y Radio de Cobertura */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar material o corralón..."
            className="pl-9 h-9 text-xs border-slate-200"
          />
        </div>

        {/* Selector de Radio Logístico (Km) */}
        <div className="flex items-center gap-3 w-full sm:w-auto text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            Radio de flete:
          </span>
          <div className="flex items-center gap-1.5">
            {[10, 25, 50].map((km) => (
              <button
                key={km}
                onClick={() => setRadioFiltroKm(km)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                  radioFiltroKm === km
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                ≤ {km} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Publicaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtradas.map((pub) => (
          <Card
            key={pub.id}
            className="p-5 bg-white border-slate-200 shadow-xs rounded-xl flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  {pub.empresa}
                </span>
                <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-semibold">
                  {pub.distanciaKm} km de la obra
                </Badge>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm">
                {pub.producto_nombre}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {pub.notas}
              </p>

              {/* Métrica Dual de Stock del Corralón */}
              <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Stock Disponible</span>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {pub.stock_disponible} {pub.unidad}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Stock Físico Real</span>
                  <span className="font-extrabold text-slate-700 text-sm">
                    {pub.stock_real_fisico} {pub.unidad}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Precio Unitario</span>
                <span className="text-base font-black text-slate-900">
                  ${pub.precio_unitario.toLocaleString("es-AR")}
                </span>
              </div>
              <Button
                onClick={() => setModalContacto(pub)}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1" />
                Solicitar / Negociar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Solicitud de Stock Red Vertia */}
      {modalContacto && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="bg-white border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 rounded-xl">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Red Vertia
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Solicitud a {modalContacto.empresa}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {modalContacto.producto_nombre} — A {modalContacto.distanciaKm} km de tu ubicación.
              </p>
            </div>

            {mensajeEnviado ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  ¡Solicitud enviada con éxito! La orden de vinculación se generó en tu panel de Pedidos (VT-1049).
                </span>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Cantidad Requerida ({modalContacto.unidad}):
                  </label>
                  <Input
                    type="number"
                    defaultValue={modalContacto.stock_disponible}
                    max={modalContacto.stock_real_fisico}
                    className="border-slate-200 text-sm"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Disponible inmediato: {modalContacto.stock_disponible} {modalContacto.unidad}. Stock físico total: {modalContacto.stock_real_fisico} {modalContacto.unidad}.
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-800 space-y-1">
                  <div className="font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Flete coordinado automáticamente
                  </div>
                  <div>
                    Al confirmar, el sistema emite la pre-orden y avisa al corralón para la reserva del material.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModalContacto(null)}
                    className="text-xs border-slate-200"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleEnviarSolicitud}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    Confirmar Solicitud
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
