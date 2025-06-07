import React, { useState, useEffect } from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { ClockIcon, TruckIcon, CheckIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export function StepperComp({ pedidoId, estadoActual, onStatusChange }) {
  const [activeStep, setActiveStep] = useState(0);  // Track active step
  const [currentStatus, setCurrentStatus] = useState(estadoActual || "Pendiente");  // Track current status with a fallback to "Pendiente"

  // Fetch the initial status from the backend
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!pedidoId) return;

        // Fetching the status using pedidoId
        const response = await axios.get(`http://localhost:3001/api/pedidos/detalle/${pedidoId}`);
        
        // Check the structure of the response
        console.log("Fetched response data:", response.data);

        // Now using "Estado" based on the response structure.
        const { Estado } = response.data;  // Get the correct status from the backend

        // Log the fetched status
        console.log("Fetched Estado from backend:", Estado);

        // Update the status in the state based on the backend response
        setCurrentStatus(Estado || "Pendiente");
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchStatus();
  }, [pedidoId]);  // Fetch status when pedidoId changes

  // Automatically update the active step based on the current status (Estado)
  useEffect(() => {
    if (!currentStatus) {
      return; // Don't proceed if the currentStatus is undefined
    }

    // Normalize current status to handle potential discrepancies (like whitespace or casing)
    const normalizedStatus = currentStatus.trim(); // Remove any surrounding spaces
    console.log("Normalized Status:", normalizedStatus); // Debugging log

    // Mapping status to step index
    const stepMap = {
      "Pendiente": 0,    // First step should be active
      "En curso": 1,     // First and second steps should be active
      "Curso": 1,        // First and second steps should be active
      "Entregado": 2,    // All steps should be active
    };

    // Set active step based on normalized status
    setActiveStep(stepMap[normalizedStatus] ?? 0);  // Default to step 0 if status is unrecognized
  }, [currentStatus]);  // Re-run the effect when the status changes

  // Function to update the status of the order in the backend
  const updateStatus = async (status) => {
    try {
      if (!pedidoId) return;

      const validStatuses = ["Pendiente", "En curso", "Curso", "Entregado"]; // String-based status values

      // Validate the status before updating
      if (!validStatuses.includes(status)) {
        console.error("Estatus inválido:", status);
        return;
      }

      // Send the status update to the backend
      const response = await axios.put(
        `http://localhost:3001/api/pedidos/estatus/${pedidoId}`,
        { estatusPedido: status }  // Ensure status is a string
      );

      console.log("Pedido actualizado:", response.data);

      // Update the current status in the parent component if needed
      setCurrentStatus(status);
      if (onStatusChange) onStatusChange(status);
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  return (
    <div className="w-full">
      <Stepper activeStep={activeStep}>

        {/* Pendiente Step */}
        {/* ID para Pruebas  */}
        <Step
          data-testid="StepPendiente"
          onClick={() => currentStatus !== "Entregado" && updateStatus("Pendiente")}
          className={`cursor-pointer ${activeStep >= 0 ? "!bg-blue-500" : "bg-black"}`}
        >
          <ClockIcon className="h-5 w-5" />

          
          <div  className="absolute -bottom-[2rem] w-max text-center">
            <Typography variant="h6" color={activeStep >= 0 ? "black" : "gray"}>
              Pendiente
            </Typography>
          </div>
        </Step>


        {/* En Proceso Step */}
        {/* ID para Pruebas  */}
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

        {/* Entregado Step */}
        <Step
          //onClick={() => currentStatus !== "Entregado" && updateStatus("Entregado")}
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



