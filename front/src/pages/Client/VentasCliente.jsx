import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";


function VentasCliente() {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem('token');
  
  const storedUserString = localStorage.getItem('usuario');
  let idPyme = null;

  if (storedUserString) {
    try {
      const parsedUser = JSON.parse(storedUserString);
      idPyme = parsedUser.idPyme;
    } catch (e) {
      console.error("Error cargando datos del localStorage:", e);
      setError("Error al leer los datos de usuario. Por favor, intenta iniciar sesión de nuevo.");
    }
  }

  const API_BASE_URL = 'https://pymex-production.up.railway.app/';

  const fetchVentas = useCallback(async () => {
    if (!idPyme) {
      setError("ID de PYME no disponible. Por favor, inicia sesión para ver las ventas.");
      setVentas([]);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/ventasClient/${idPyme}`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});

      if (Array.isArray(response.data)) {
        const processedVentas = response.data.map(venta => ({
          nombreSucursal: venta.nombreSucursal || 'N/A',
          cantidadTotal: venta.cantidadTotal || 0,
          fechaVenta: venta.fechaVenta,
          productosVendidos: venta.PRODUCTOSVENDIDOS || 'No products',
          totalTicketPrice: parseFloat(venta.TOTALTICKETPRICE) || 0.00
        }));
        setVentas(processedVentas);
      } else {
        console.warn("API response for ventas is not an array:", response.data);
        setVentas([]);
        setError("El formato de datos de ventas recibido es incorrecto.");
      }
    } catch (err) {
      console.error("Error fetching ventas:", err);
      if (err.response) {
        setError(`Error del servidor (${err.response.status}): ${err.response.data.message || err.response.data || 'Mensaje desconocido'}`);
      } else if (err.request) {
        setError("Error de red: No se recibió respuesta del servidor. Asegúrate de que el backend esté corriendo.");
      } else {
        setError(`Error al configurar la solicitud: ${err.message}`);
      }
      setVentas([]);
    }
  }, [idPyme]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  return (
    <motion.div
      className="h-full w-full flex flex-col pt-[6vh] pr-[50px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-[20%] w-full">
        <h1 className="text-[40px]">Ventas</h1>
        <div className="h-[50px] w-full flex justify-between items-center">
          <h1>Ventas que ha realizado cada sucursal</h1>
        </div>
      </div>

      <div className="w-full h-[75%]">
        {error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <table className="table-fixed w-full h-full border-spacing-0">
            <thead className="block bg-slate-100 w-full">
              <tr className="w-full flex">
                <th className="w-1/5 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Sucursal</th>
                <th className="w-1/5 px-4 py-2 text-left">Producto</th>
                <th className="w-1/5 px-4 py-2 text-left">Cantidad</th>
                <th className="w-1/5 px-4 py-2 text-left">Total</th>
                <th className="w-1/5 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Fecha de entrega</th>
              </tr>
            </thead>
            <tbody className="block w-full overflow-y-auto max-h-[55vh]">
              {ventas.length > 0 ? (
                ventas.map((venta, index) => (
                  <tr
                    key={index}
                    className="flex w-full rounded-md cursor-pointer hover:bg-slate-200 duration-200 items-start" 
                  >
                    <td className="w-1/5 px-4 py-2">{venta.nombreSucursal}</td>
                    <td className="w-1/5 px-4 py-2 whitespace-normal">{venta.productosVendidos}</td> 
                    <td className="w-1/5 px-4 py-2">{venta.cantidadTotal}</td>
                    <td className="w-1/5 px-4 py-2">${venta.totalTicketPrice ? venta.totalTicketPrice.toFixed(2) : '0.00'} MXN</td>
                    <td className="w-1/5 px-4 py-2">{venta.fechaVenta}</td>
                  </tr>
                ))
              ) : (
                <tr className="w-full flex">
                  <td colSpan="5" className="text-center w-full py-4 text-gray-500">No se encontraron ventas.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

export default VentasCliente;

