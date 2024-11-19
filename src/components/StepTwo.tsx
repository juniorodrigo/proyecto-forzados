import React from "react";

interface StepTwoProps {
  interlockSeguridad: string;
  setInterlockSeguridad: React.Dispatch<React.SetStateAction<string>>;
  responsable: string;
  setResponsable: React.Dispatch<React.SetStateAction<string>>;
  riesgo: string;
  setRiesgo: React.Dispatch<React.SetStateAction<string>>;
  probabilidad: string;
  setProbabilidad: React.Dispatch<React.SetStateAction<string>>;
  impacto: string;
  setImpacto: React.Dispatch<React.SetStateAction<string>>;
  solicitante: string;
  setSolicitante: React.Dispatch<React.SetStateAction<string>>;
}

const StepTwo: React.FC<StepTwoProps> = ({
  interlockSeguridad,
  setInterlockSeguridad,
  responsable,
  setResponsable,
  riesgo,
  setRiesgo,
  probabilidad,
  setProbabilidad,
  impacto,
  setImpacto,
  solicitante,
  setSolicitante,
}) => {
  return (
    <form className="space-y-6">
      {/* Interlock Seguridad */}
      <div>
        <h2 className="text-center font-semibold text-2xl mb-2">
          Responsable y Riesgo
        </h2>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Interlock Seguridad
        </label>
        <select
          value={interlockSeguridad}
          onChange={(e) => setInterlockSeguridad(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccione Interlock</option>
          <option value="Interlock1">Interlock 1</option>
          <option value="Interlock2">Interlock 2</option>
          <option value="Interlock3">Interlock 3</option>
        </select>
      </div>

      {/* Responsable */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Responsable
        </label>
        <select
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccione Gerencia Responsable del Forzado</option>
          <option value="Responsable1">Responsable 1</option>
          <option value="Responsable2">Responsable 2</option>
          <option value="Responsable3">Responsable 3</option>
        </select>
      </div>

      {/* Riesgo */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Riesgo
        </label>
        <select
          value={riesgo}
          onChange={(e) => setRiesgo(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">
            Seleccione Riesgo al que puede afectar el Forzado
          </option>
          <option value="Riesgo1">Riesgo 1</option>
          <option value="Riesgo2">Riesgo 2</option>
          <option value="Riesgo3">Riesgo 3</option>
        </select>
      </div>

      {/* Probabilidad */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Probabilidad
        </label>
        <select
          value={probabilidad}
          onChange={(e) => setProbabilidad(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Categoría de consecuencias</option>
          <option value="Probabilidad1">Probabilidad 1</option>
          <option value="Probabilidad2">Probabilidad 2</option>
          <option value="Probabilidad3">Probabilidad 3</option>
        </select>
      </div>

      {/* Impacto */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Impacto
        </label>
        <select
          value={impacto}
          onChange={(e) => setImpacto(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccione Impacto de la Consecuencia</option>
          <option value="Impacto1">Impacto 1</option>
          <option value="Impacto2">Impacto 2</option>
          <option value="Impacto3">Impacto 3</option>
        </select>
      </div>

      {/* Solicitante (AN) */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Solicitante (AN)
        </label>
        <select
          value={solicitante}
          onChange={(e) => setSolicitante(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccione Solicitante del Forzado</option>
          <option value="Solicitante1">Solicitante 1</option>
          <option value="Solicitante2">Solicitante 2</option>
          <option value="Solicitante3">Solicitante 3</option>
        </select>
      </div>
    </form>
  );
};

export default StepTwo;
