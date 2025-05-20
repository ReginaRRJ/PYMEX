import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ventasData from './ventas'

function VentasVendedor({ ventaModal, setVentaModal }) {
  const [ventas, setVentas] = useState(ventasData);

  return (
    <motion.div
      className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div className="h-[20%] w-full">
        <h1 className="text-[40px]">Ventas</h1>
        <div className="h-[50px] w-full flex justify-between items-center">
          <h1>Generar ticket</h1>
          <button
            className="w-[18%] h-full bg-slate-900 rounded-2xl text-white"
            onClick={() => setVentaModal(!ventaModal)}>
            + Crear ticket
          </button>
        </div>
      </div>

      <div className="w-full h-[75%]">
      <table className="table-fixed w-full border-collapse">
        <thead className="bg-slate-100">
            <tr className="flex w-full">
            <th className="w-1/4 px-4 py-2 text-left">Producto</th>
            <th className="w-1/4 px-4 py-2 text-left">Importe</th>
            <th className="w-1/4 px-4 py-2 text-left">Cantidad</th>
            <th className="w-1/4 px-4 py-2 text-left">Estado</th>
            </tr>
        </thead>

        <tbody className="block max-h-[55vh] overflow-y-auto w-full">
            {ventas.length > 0 ? (
            ventas.map((venta, index) => (
                <tr key={index} className="flex w-full hover:bg-slate-100 duration-300 cursor-pointer rounded-md">
                <td className="w-1/4 px-4 py-2">{venta.producto}</td>
                <td className="w-1/4 px-4 py-2">$ {venta.importe} MXN</td>
                <td className="w-1/4 px-4 py-2">{venta.cantidad}</td>
                <td className="w-1/4 px-4 py-2">{venta.estado}</td>
                </tr>
            ))
            ) : (
            <tr className="flex w-full">
                <td colSpan="4" className="text-center w-full py-4 text-gray-500">
                No se encontraron ventas.
                </td>
            </tr>
            )}
        </tbody>
    </table>

      </div>
    </motion.div>
  );
}

export default VentasVendedor;