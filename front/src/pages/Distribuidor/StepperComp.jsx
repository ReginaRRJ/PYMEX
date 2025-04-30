import React, { useState } from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { ClockIcon, TruckIcon, CheckIcon } from "@heroicons/react/24/outline";
import axios from 'axios';

export function StepperComp({ pedidoId }) {
  const [activeStep, setActiveStep] = useState(0);

  // Function to update the status of the order
  const updateStatus = async (status) => {
    try {
      if (!pedidoId) return;

      // Valid statuses the backend accepts
      const validStatuses = [1, 2, 3, 4];

      // Check if the status is valid before sending the request
      if (!validStatuses.includes(status)) {
        console.error("Estatus inválido:", status);
        return; // Abort the update if the status is invalid
      }

      // Send the status update to the backend
      const response = await axios.put(`http://localhost:3001/api/pedidos/estatus/${pedidoId}`, {
        estatusPedido: status, // Make sure the key here matches the backend's expected key
      });

      console.log('Pedido actualizado:', response.data);
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    }
  };

  // Stepper event handlers
  const handleStepChange = (step) => {
    setActiveStep(step);

    // Send the appropriate status update when a step is clicked
    switch (step) {
      case 0:
        updateStatus(1); // Pendiente
        break;
      case 1:
        updateStatus(3); // En Progreso
        break;
      case 2:
        updateStatus(4); // Entregado
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full">
      <Stepper activeStep={activeStep} onStepClick={handleStepChange}>
        <Step
          onClick={() => handleStepChange(0)}
          className={`cursor-pointer ${activeStep === 0 ? 'bg-blue-500' : 'bg-black'}`}
        >
          <ClockIcon className="h-5 w-5" />
          <div className="absolute -bottom-[2rem] w-max text-center">
            <Typography variant="h6" color="black">
              Pendiente
            </Typography>
          </div>
        </Step>

        <Step
          onClick={() => handleStepChange(1)}
          className={`cursor-pointer ${activeStep === 1 ? 'bg-blue-500' : 'bg-black'}`}
        >
          <TruckIcon className="h-5 w-5" />
          <div className="absolute -bottom-[2rem] w-max text-center">
            <Typography variant="h6" color={activeStep === 1 ? "black" : "gray"}>
              En Progreso
            </Typography>
          </div>
        </Step>

        <Step
          onClick={() => handleStepChange(2)}
          className={`cursor-pointer ${activeStep === 2 ? 'bg-blue-500' : 'bg-black'}`}
        >
          <CheckIcon className="h-5 w-5" />
          <div className="absolute -bottom-[2rem] w-max text-center">
            <Typography variant="h6" color={activeStep === 2 ? "black" : "gray"}>
              Entregado
            </Typography>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}


// import React from "react";
// import { useState } from "react";
// import { Stepper, Step, Typography } from "@material-tailwind/react";
// import { ClockIcon, TruckIcon, CheckIcon,} from "@heroicons/react/24/outline";
 
// export function StepperComp() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [isLastStep, setIsLastStep] = useState(false);
//   const [isFirstStep, setIsFirstStep] = useState(false);
 
//   // const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
//   // const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
 
//   return (
//     <div className="w-full">
//       <Stepper
//         activeStep={activeStep}
//         isLastStep={(value) => setIsLastStep(value)}
//         isFirstStep={(value) => setIsFirstStep(value)}
//       >
//         <Step onClick={() => setActiveStep(0)} className={`cursor-pointer ${activeStep === 1} ? 'bg-blue-500' : 'bg-black'`} >
//           <ClockIcon className="h-5 w-5" />
//           <div className="absolute -bottom-[2rem] w-max text-center">
//             <Typography
//               variant="h6"
//               color="black"
//             >
//               Pendiente
//             </Typography>
//           </div>
//         </Step>

//         <Step onClick={() => setActiveStep(1)} className={`cursor-pointer ${activeStep >= 2} ? 'bg-blue-500' : 'bg-black'`} >
//           <TruckIcon className="h-5 w-5" />
//           <div className="absolute -bottom-[2rem] w-max text-center">
//             <Typography
//               variant="h6"
//               color={activeStep >= 1 ? "black" : "gray"}
//             >
//               En progreso
//             </Typography>
//           </div>
//         </Step>

//         <Step onClick={() => setActiveStep(2)} className={`cursor-pointer ${activeStep === 2} ? 'bg-blue-500' : 'bg-black'`}>
//           <CheckIcon className="h-5 w-5" />
//           <div className="absolute -bottom-[2rem] w-max text-center">
//             <Typography
//               variant="h6"
//               color={activeStep >= 2 ? "black" : "gray"}
//             >
//               Entregado
//             </Typography>
//           </div>
//         </Step>
//       </Stepper>
//       {/* <div className="mt-32 flex justify-between">
//         <Button onClick={handlePrev} disabled={isFirstStep}>
//           Prev
//         </Button>
//         <Button onClick={handleNext} disabled={isLastStep}>
//           Next
//         </Button>
//       </div> */}
//     </div>
//   );
// }
