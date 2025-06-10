import React, { useState, useEffect } from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { ClockIcon, TruckIcon, CheckIcon } from "@heroicons/react/24/outline";
import axios from "axios";



export function StepperComp({ pedidoId, estadoActual, onStatusChange }) {
  const [activeStep, setActiveStep] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(estadoActual || "Pendiente");
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!pedidoId) return;

        const response = await axios.get(`http://localhost:3001/api/pedidos/detalle/${pedidoId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        console.log("Fetched response data:", response.data);
        const { Estado } = response.data;
        console.log("Fetched Estado from backend:", Estado);

        setCurrentStatus(Estado || "Pendiente");
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchStatus();
  }, [pedidoId]);

  useEffect(() => {
    if (!currentStatus) return;

    const normalizedStatus = currentStatus.trim();
    console.log("Normalized Status:", normalizedStatus);

    const stepMap = {
      "Pendiente": 0,
      "En curso": 1,
      "Curso": 1,
      "Entregado": 2
    };

    setActiveStep(stepMap[normalizedStatus] ?? 0);
  }, [currentStatus]);

const updateStatus = async (status) => {
  try {
    if (!pedidoId) return;

    const validStatuses = ["Pendiente", "En curso", "Curso", "Entregado"];
    if (!validStatuses.includes(status)) {
      console.error("Estatus inválido:", status);
      return;
    }

    const response = await axios.put(
      `http://localhost:3001/api/pedidos/estatus/${pedidoId}`,
      { estatusPedido: status },
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    setCurrentStatus(status);
    if (onStatusChange) onStatusChange(status);

    let mensaje2 = "";
    if (status === "Curso" || status === "En curso") {
      mensaje2 = "¡Tu pedido ha sido actualizado a En curso!";
    } else if (status === "Pendiente") {
      mensaje2 = "¡Tu pedido ha sido actualizado a Pendiente!";
    } else {
      mensaje2 = `¡Tu pedido ha sido actualizado a ${status}!`;
    }

    try {
      console.log("typeof idPedido:", typeof idPedido); 
      console.log("typeof idTipoNotificacion:", typeof idTipoNotificacion);
      console.log("typeof mensaje:", typeof mensaje);
      const spResponse = await fetch(`http://localhost:3001/notificaciones/actualizarProveedor/${pedidoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          idPedido: pedidoId,
          idTipoNotificacion: 9,
          mensaje: mensaje2
        })
      });

      console.log("LLAMADO CORRECTAMENTE AL STORED PROCEDURE");
    } catch (error) {
      console.log("ERROR EN STORE PROCEDURE ACTUALIZAR", error);
    }

  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
     if (error.response) {
    console.error("Backend response error:", error.response.data);
  } else {
    console.error("Network or other error:", error.message);
  }
  }
};
*/

  return (
    <div className="w-full">
      <Stepper activeStep={activeStep}>
        <Step
          data-testid="StepPendiente"
          onClick={() => currentStatus !== "Entregado" && updateStatus("Pendiente")}
          className={`cursor-pointer ${activeStep >= 0 ? "!bg-blue-500" : "bg-black"}`}
        >
          <ClockIcon className="h-5 w-5" />
          <div className="absolute -bottom-[2rem] w-max text-center">
            <Typography variant="h6" color={activeStep >= 0 ? "black" : "gray"}>
              Pendiente
            </Typography>
          </div>
        </Step>

        <Step
          data-testid="StepCurso"
          onClick={() => currentStatus !== "Entregado" && updateStatus("Curso")}
          className={`cursor-pointer ${activeStep >= 1 ? "!bg-blue-500" : "bg-black"}`}
        >
          <TruckIcon className="h-5 w-5" />
          <div className="absolute -bottom-[2rem] w-max text-center">
            <Typography variant="h6" color={activeStep >= 1 ? "black" : "gray"}>
              Curso
            </Typography>
          </div>
        </Step>

        <Step
          className={`cursor-not-allowed ${activeStep >= 2 ? "!bg-blue-500" : "bg-black"}`}
        >
          <CheckIcon className="h-5 w-5" />
          <div className="absolute -bottom-[2rem] w-max text-center">
            <Typography variant="h6" color={activeStep >= 2 ? "black" : "gray"}>
              Entregado
            </Typography>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
