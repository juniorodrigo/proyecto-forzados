import React from "react";

interface StepOneProps {
  tagPrefijo: string;
  setTagPrefijo: React.Dispatch<React.SetStateAction<string>>;
  tagCentro: string;
  setTagCentro: React.Dispatch<React.SetStateAction<string>>;
  tagSubfijo: string;
  setTagSubfijo: React.Dispatch<React.SetStateAction<string>>;
  descripcion: string;
  setDescripcion: React.Dispatch<React.SetStateAction<string>>;
  disciplina: string;
  setDisciplina: React.Dispatch<React.SetStateAction<string>>;
  turno: string;
  setTurno: React.Dispatch<React.SetStateAction<string>>;
}

const StepOne: React.FC<StepOneProps> = ({
  tagPrefijo,
  setTagPrefijo,
  tagCentro,
  setTagCentro,
  tagSubfijo,
  setTagSubfijo,
  descripcion,
  setDescripcion,
  disciplina,
  setDisciplina,
  turno,
  setTurno,
}) => {
  return (
    <form className="space-y-6">
      {/* Tag (Prefijo) */}
      <div>
        <h2 className="text-center font-semibold text-2xl mb-2">
          Tag y SubFijo
        </h2>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Tag (Prefijo)
        </label>
        <select
          value={tagPrefijo}
          onChange={(e) => setTagPrefijo(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Prefijo del Tag o Sub Area</option>
          <option value="Prefijo1">Prefijo 1</option>
          <option value="Prefijo2">Prefijo 2</option>
          <option value="Prefijo3">Prefijo 3</option>
        </select>
      </div>

      {/* Tag (Centro) */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Tag (Centro)
        </label>
        <select
          value={tagCentro}
          onChange={(e) => setTagCentro(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">
            Parte central del Tag asociado al Instrumento o Equipo
          </option>
          <option value="Centro1">Centro 1</option>
          <option value="Centro2">Centro 2</option>
          <option value="Centro3">Centro 3</option>
        </select>
      </div>

      {/* Tag (Subfijo) */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Tag (Subfijo)
        </label>
        <select
          value={tagSubfijo}
          onChange={(e) => setTagSubfijo(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Subfijo del Tag</option>
          <option value="Subfijo1">Subfijo 1</option>
          <option value="Subfijo2">Subfijo 2</option>
          <option value="Subfijo3">Subfijo 3</option>
        </select>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Agregue una descripción"
          required
        />
      </div>

      {/* Disciplina */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Disciplina
        </label>
        <select
          value={disciplina}
          onChange={(e) => setDisciplina(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Disciplina que solicita el forzado</option>
          <option value="Disciplina1">Disciplina 1</option>
          <option value="Disciplina2">Disciplina 2</option>
          <option value="Disciplina3">Disciplina 3</option>
        </select>
      </div>

      {/* Turno */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Turno
        </label>
        <select
          value={turno}
          onChange={(e) => setTurno(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Turno que solicita el forzado</option>
          <option value="Turno1">Turno 1</option>
          <option value="Turno2">Turno 2</option>
          <option value="Turno3">Turno 3</option>
        </select>
      </div>
    </form>
  );
};

export default StepOne;
