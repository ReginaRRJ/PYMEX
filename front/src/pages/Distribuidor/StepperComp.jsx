import React from "react";
import { useState } from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { ClockIcon, TruckIcon, CheckIcon,} from "@heroicons/react/24/outline";
 
export function StepperComp() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
 
  // const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  // const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
 
  return (
    <div className="w-full">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step onClick={() => setActiveStep(0)} className={`cursor-pointer ${activeStep === 1} ? 'bg-blue-500' : 'bg-black'`} >
          <ClockIcon className="h-5 w-5" />
          <div className="absolute -bottom-[2rem] w-max text-center">
            <Typography
              variant="h6"
              color="black"
            >
              Pendiente
            </Typography>
          </div>
        </Step>

        <Step onClick={() => setActiveStep(1)} className={`cursor-pointer ${activeStep >= 2} ? 'bg-blue-500' : 'bg-black'`} >
          <TruckIcon className="h-5 w-5" />
          <div className="absolute -bottom-[2rem] w-max text-center">
            <Typography
              variant="h6"
              color={activeStep >= 1 ? "black" : "gray"}
            >
              En progreso
            </Typography>
          </div>
        </Step>

        <Step onClick={() => setActiveStep(2)} className={`cursor-pointer ${activeStep === 2} ? 'bg-blue-500' : 'bg-black'`}>
          <CheckIcon className="h-5 w-5" />
          <div className="absolute -bottom-[2rem] w-max text-center">
            <Typography
              variant="h6"
              color={activeStep >= 2 ? "black" : "gray"}
            >
              Entregado
            </Typography>
          </div>
        </Step>
      </Stepper>
      {/* <div className="mt-32 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={isLastStep}>
          Next
        </Button>
      </div> */}
    </div>
  );
}
