import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function VentasVendedor({ ventaModal, setVentaModal, refreshTickets }) {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user || !user.idSucursal) return;

    const fetchTickets = async () => {
      try {
        const response = await axios.get(`https://pymex-production.up.railway.app/api/tickets/branch/${user.idSucursal}`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
        setTickets(response.data);
      } catch (error) {
        console.error("Error obteniendo tickets:", error);
        setTickets([]);
      }
    };

    fetchTickets();
  }, [user, refreshTickets]);

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
            <th className="w-1/4 px-4 py-2 text-left">Fecha Venta</th>
            </tr>
        </thead>

        <tbody className="block max-h-[55vh] overflow-y-auto w-full">
            {tickets.length > 0 ? (
                tickets.map((ticket) => (
                    ticket.products.map((product, prodIndex) => (
                        <tr key={`${ticket.idTicket}-${prodIndex}`} className="flex w-full hover:bg-slate-100 duration-300 cursor-pointer rounded-md">
                            <td className="w-1/4 px-4 py-2">{product.productName}</td>
                            <td className="w-1/4 px-4 py-2">${product.itemImporte.toFixed(2)} MXN</td>
                            <td className="w-1/4 px-4 py-2">{product.cantidad}</td>
                            <td className="w-1/4 px-4 py-2">{ticket.fechaVenta}</td>
                        </tr>
                    ))
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
