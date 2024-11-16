"use client";
import StepOne from "@/components/StepOne";
import StepThree from "@/components/StepThree";
import StepTwo from "@/components/StepTwo";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const ForcedRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: "Paso 1" },
    { id: 2, title: "Paso 2" },
    { id: 3, title: "Paso 3" },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
        Alta Forzado
      </h1>

      {/* Barra de pasos con retroceso al costado */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative flex-1 flex justify-center items-center">
          {/* Flecha de retroceso */}
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`absolute left-[-1px] transform ${
              currentStep === 1 ? "opacity-0" : "opacity-100"
            } transition-opacity duration-200`}
          >
            <FaArrowLeft className="text-blue-500 text-2xl" />
          </button>

          {/* Paso actual */}
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center justify-center relative"
            >
              {/* Círculo */}
              <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 transition-all duration-300">
                <span
                  className={`text-lg font-medium rounded-full flex items-center justify-center w-full h-full ${
                    step.id < currentStep
                      ? "bg-blue-600 text-white border-blue-600"
                      : step.id === currentStep
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-200 text-gray-400 border-gray-300"
                  }`}
                >
                  {step.id}
                </span>
              </div>

              {/* Línea de separación */}
              {index < steps.length - 1 && (
                <div
                  className={`w-20 h-1 rounded-full ${
                    step.id < currentStep ? "bg-blue-600" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formulario del paso actual */}
      <div>{renderStep()}</div>

      {/* Botones de navegación centrados */}
      <div className="flex justify-center mt-10 space-x-6">
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length}
          className={`px-6 py-3 text-white rounded-md flex items-center gap-2 ${
            currentStep === steps.length
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {currentStep === steps.length ? (
            <span>Aprobar</span>
          ) : (
            <>
              Continuar
              <span className="ml-2 text-lg">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ForcedRegistration;
