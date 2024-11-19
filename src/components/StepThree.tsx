import React from "react";

interface StepThreeProps {
  aprobador: string;
  setAprobador: React.Dispatch<React.SetStateAction<string>>;
  ejecutor: string;
  setEjecutor: React.Dispatch<React.SetStateAction<string>>;
  autorizacion: string;
  setAutorizacion: React.Dispatch<React.SetStateAction<string>>;
  tipoForzado: string;
  setTipoForzado: React.Dispatch<React.SetStateAction<string>>;
}

const StepThree: React.FC<StepThreeProps> = ({
  aprobador,
  setAprobador,
  ejecutor,
  setEjecutor,
  autorizacion,
  setAutorizacion,
  tipoForzado,
  setTipoForzado,
}) => {
  return (
    <form className="space-y-6">
      {/* Aprobador */}
      <div>
        <h2 className="text-center font-semibold text-2xl mb-2">
          Autorización
        </h2>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Aprobador
        </label>
        <select
          value={aprobador}
          onChange={(e) => setAprobador(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccione Aprobador del Forzado</option>
          <option value="Aprobador1">Aprobador 1</option>
          <option value="Aprobador2">Aprobador 2</option>
          <option value="Aprobador3">Aprobador 3</option>
        </select>
      </div>

      {/* Ejecutor */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Ejecutor
        </label>
        <select
          value={ejecutor}
          onChange={(e) => setEjecutor(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccione Ejecutor</option>
          <option value="Ejecutor1">Ejecutor 1</option>
          <option value="Ejecutor2">Ejecutor 2</option>
          <option value="Ejecutor3">Ejecutor 3</option>
        </select>
      </div>

      {/* Autorización */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Autorización
        </label>
        <select
          value={autorizacion}
          onChange={(e) => setAutorizacion(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccione Autorización</option>
          <option value="Autorizacion1">Autorización 1</option>
          <option value="Autorizacion2">Autorización 2</option>
          <option value="Autorizacion3">Autorización 3</option>
        </select>
      </div>

      {/* Tipo de Forzado */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Tipo de Forzado
        </label>
        <select
          value={tipoForzado}
          onChange={(e) => setTipoForzado(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccione Tipo de Forzado</option>
          <option value="Forzado1">Forzado 1</option>
          <option value="Forzado2">Forzado 2</option>
          <option value="Forzado3">Forzado 3</option>
        </select>
      </div>
    </form>
  );
};

export default StepThree;
