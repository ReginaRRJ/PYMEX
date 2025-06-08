import React, { useState, useEffect } from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { ClockIcon, TruckIcon, CheckIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export function StepperComp({ pedidoId, estadoActual, onStatusChange }) {
  const [activeStep, setActiveStep] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(estadoActual || "Pendiente");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!pedidoId) return;

        const token = localStorage.getItem('token'); // Leer token justo antes
        const response = await axios.get(`http://localhost:3001/api/pedidos/detalle/${pedidoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { Estado } = response.data;
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

    const stepMap = {
      "Pendiente": 0,
      "En curso": 1,
      "Curso": 1,
      "Entregado": 2,
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

      const token = localStorage.getItem('token'); // Leer token justo antes
      await axios.put(
        `http://localhost:3001/api/pedidos/estatus/${pedidoId}`,
        { estatusPedido: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentStatus(status);
      if (onStatusChange) onStatusChange(status);

      // Notificación personalizada
      let mensaje = "";
      if (status === "Curso" || status === "En curso") {
        mensaje = "¡Tu pedido ha sido actualizado a En curso!";
      } else if (status === "Pendiente") {
        mensaje = "¡Tu pedido ha sido actualizado a Pendiente!";
      } else {
        mensaje = `¡Tu pedido ha sido actualizado a ${status}!`;
      }

      const spToken = localStorage.getItem('token'); // Leer token justo antes
      await fetch(`http://localhost:3001/notificaciones/actualizarProveedor/${pedidoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spToken}`,
        },
        body: JSON.stringify({
          idPedido: pedidoId,
          idTipoNotificacion: 6,
          mensaje: mensaje,
        }),
      });

    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

/*
import React, { useState, useEffect } from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { ClockIcon, TruckIcon, CheckIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const token = localStorage.getItem('token');

export function StepperComp({ pedidoId, estadoActual, onStatusChange }) {
  const [activeStep, setActiveStep] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(estadoActual || "Pendiente");

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

    // 👉 Notificación personalizada según el estatus
    let mensaje = "";
    if (status === "Curso" || status === "En curso") {
      mensaje = "¡Tu pedido ha sido actualizado a En curso!";
    } else if (status === "Pendiente") {
      mensaje = "¡Tu pedido ha sido actualizado a Pendiente!";
    } else {
      mensaje = `¡Tu pedido ha sido actualizado a ${status}!`;
    }

    try {
      console.log("Pedido ID ",pedidoId)
      console.log("Mensaje", mensaje)
      const spResponse = await fetch(`http://localhost:3001/notificaciones/actualizarProveedor/${pedidoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          idPedido: pedidoId,
          idTipoNotificacion: 6,
          mensaje: mensaje
        })
      });

      console.log("LLAMADO CORRECTAMENTE AL STORED PROCEDURE");
    } catch (error) {
      console.log("ERROR EN STORE PROCEDURE ACTUALIZAR", error);
    }

    // onClose(); // ✅ Only after all is successful
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
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
