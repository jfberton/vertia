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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MockDetalleOrden {
  id: string;
  producto_nombre: string;
  codigo_barras: string;
  cantidad_solicitada: number;
  cantidad_surtida: number;
  ubicacion_sugerida: string;
  lote: string;
  stock_disponible: number;
}

interface MockOrden {
  id: string;
  numero_orden: string;
  usuario_solicitante: string;
  fecha_solicitud: string;
  estado: "Pendiente" | "Parcialmente Surtido" | "Surtido" | "Remisionado";
  detalles: MockDetalleOrden[];
}

const mockOrdenes: MockOrden[] = [
  {
    id: "ord-1",
    numero_orden: "OS-2026-00104",
    usuario_solicitante: "Mantenimiento Planta Norte",
    fecha_solicitud: "17/11/2026 09:30",
    estado: "Pendiente",
    detalles: [
      {
        id: "det-1",
        producto_nombre: "Rodamiento SKF 6204-2RSH",
        codigo_barras: "7791234567890",
        cantidad_solicitada: 50,
        cantidad_surtida: 0,
        ubicacion_sugerida: "F01-R01-E01-N1",
        lote: "L-2026-A",
        stock_disponible: 120,
      },
      {
        id: "det-2",
        producto_nombre: "Aceite Sintético Hidráulico ISO 68",
        codigo_barras: "7798765432109",
        cantidad_solicitada: 40,
        cantidad_surtida: 0,
        ubicacion_sugerida: "F02-R01-E03-N1",
        lote: "L-2026-B",
        stock_disponible: 15, // Faltante!
      },
    ],
  },
  {
    id: "ord-2",
    numero_orden: "OS-2026-00103",
    usuario_solicitante: "Línea de Ensamble B",
    fecha_solicitud: "16/11/2026 15:10",
    estado: "Parcialmente Surtido",
    detalles: [
      {
        id: "det-3",
        producto_nombre: "Correa Dentada HTD 8M-1200",
        codigo_barras: "7795556667771",
        cantidad_solicitada: 20,
        cantidad_surtida: 20,
        ubicacion_sugerida: "F01-R01-E02-N1",
        lote: "L-2025-Z",
        stock_disponible: 65,
      },
    ],
  },
];

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState(mockOrdenes);
  const [ordenActiva, setOrdenActiva] = useState<MockOrden | null>(mockOrdenes[0]);
  const [modalSurtir, setModalSurtir] = useState<MockDetalleOrden | null>(null);
  const [cantidadInput, setCantidadInput] = useState<number>(0);

  const ejecutarSurtido = () => {
    if (!modalSurtir || !ordenActiva || cantidadInput <= 0) return;

    setOrdenes(
      ordenes.map((o) => {
        if (o.id !== ordenActiva.id) return o;
        const nuevosDetalles = o.detalles.map((d) => {
          if (d.id !== modalSurtir.id) return d;
          const nuevaSurtida = Math.min(d.cantidad_surtida + cantidadInput, d.cantidad_solicitada);
          return { ...d, cantidad_surtida: nuevaSurtida };
        });

        const totalPedido = nuevosDetalles.reduce((acc, cur) => acc + cur.cantidad_solicitada, 0);
        const totalSurtido = nuevosDetalles.reduce((acc, cur) => acc + cur.cantidad_surtida, 0);

        let nuevoEstado: MockOrden["estado"] = "Parcialmente Surtido";
        if (totalSurtido === totalPedido) nuevoEstado = "Surtido";
        if (totalSurtido === 0) nuevoEstado = "Pendiente";

        const ordenActualizada = { ...o, detalles: nuevosDetalles, estado: nuevoEstado };
        setOrdenActiva(ordenActualizada);
        return ordenActualizada;
      })
    );

    setModalSurtir(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-400" />
            Órdenes de Suministro & Picking
          </h1>
          <p className="text-sm text-zinc-400">
            Prepara y surte pedidos de mercadería con trazabilidad física por lote y ubicación.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-1.5" />
          Nueva Orden de Suministro
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Listado de Órdenes */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-1">
            Órdenes Registradas
          </div>
          {ordenes.map((o) => {
            const isSelected = ordenActiva?.id === o.id;

            return (
              <div
                key={o.id}
                onClick={() => setOrdenActiva(o)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-zinc-900 border-indigo-500 shadow-md shadow-indigo-500/10"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-white">{o.numero_orden}</span>
                  <Badge
                    variant={
                      o.estado === "Surtido"
                        ? "success"
                        : o.estado === "Parcialmente Surtido"
                        ? "warning"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {o.estado}
                  </Badge>
                </div>
                <div className="text-xs text-zinc-300 font-medium">{o.usuario_solicitante}</div>
                <div className="text-[11px] text-zinc-500 mt-2 flex items-center justify-between">
                  <span>{o.detalles.length} renglones</span>
                  <span>{o.fecha_solicitud}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Columna Derecha: Detalle de Surtido / Picking */}
        <div className="lg:col-span-2">
          {ordenActiva ? (
            <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
              <CardHeader className="border-b border-zinc-800/80 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <CardTitle className="text-lg text-white">{ordenActiva.numero_orden}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {ordenActiva.estado}
                      </Badge>
                    </div>
                    <CardDescription className="text-zinc-400 mt-1">
                      Solicitante: <strong className="text-zinc-200">{ordenActiva.usuario_solicitante}</strong> • {ordenActiva.fecha_solicitud}
                    </CardDescription>
                  </div>

                  {ordenActiva.estado === "Surtido" && (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                      <PackageCheck className="w-4 h-4 mr-1.5" />
                      Emitir Remisión de Despacho
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Renglones para Surtir (Picking)
                </div>

                <div className="space-y-3">
                  {ordenActiva.detalles.map((d) => {
                    const restante = d.cantidad_solicitada - d.cantidad_surtida;
                    const tieneFaltante = d.stock_disponible < restante;

                    return (
                      <div
                        key={d.id}
                        className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">{d.producto_nombre}</span>
                            <span className="font-mono text-[11px] text-zinc-500">{d.codigo_barras}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                            <span className="flex items-center gap-1 text-indigo-300">
                              <Warehouse className="w-3.5 h-3.5" />
                              Ub: <strong>{d.ubicacion_sugerida}</strong>
                            </span>
                            <span>Lote: <strong className="text-zinc-300">{d.lote}</strong></span>
                            <span>Stock en ubicación: <strong>{d.stock_disponible} u.</strong></span>
                          </div>

                          {tieneFaltante && (
                            <div className="text-xs text-amber-400 flex items-center gap-1.5 mt-1 font-medium">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>Faltan {restante - d.stock_disponible} u. para completar el pedido.</span>
                            </div>
                          )}
                        </div>

                        {/* Progreso y Acciones */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-xs text-zinc-400">Surtido</div>
                            <div className="text-sm font-bold text-white">
                              {d.cantidad_surtida} / {d.cantidad_solicitada}
                            </div>
                          </div>

                          {restante > 0 ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setModalSurtir(d);
                                  setCantidadInput(Math.min(restante, d.stock_disponible));
                                }}
                                disabled={d.stock_disponible <= 0}
                                className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                              >
                                Surtir Ítem
                              </Button>

                              {tieneFaltante && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs border-indigo-900 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900"
                                >
                                  <Globe2 className="w-3.5 h-3.5 mr-1" />
                                  Buscar en Red B2B
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Badge variant="success" className="text-xs py-1">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Listo
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-64 flex items-center justify-center border border-zinc-800 rounded-xl text-zinc-500">
              Selecciona una orden para ver su detalle de surtido
            </div>
          )}
        </div>
      </div>

      {/* Modal / Dialog de Confirmación de Surtido */}
      {modalSurtir && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Surtir {modalSurtir.producto_nombre}</h3>
            <p className="text-xs text-zinc-400">
              Ubicación física: <strong className="text-indigo-400">{modalSurtir.ubicacion_sugerida}</strong> (Lote: {modalSurtir.lote})
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Cantidad a extraer y surtir:</label>
              <Input
                type="number"
                min={1}
                max={Math.min(modalSurtir.cantidad_solicitada - modalSurtir.cantidad_surtida, modalSurtir.stock_disponible)}
                value={cantidadInput}
                onChange={(e) => setCantidadInput(parseInt(e.target.value) || 0)}
                className="bg-zinc-950 border-zinc-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setModalSurtir(null)}>
                Cancelar
              </Button>
              <Button onClick={ejecutarSurtido} className="bg-indigo-600 hover:bg-indigo-700">
                Confirmar Surtido
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
