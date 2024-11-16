import React from "react";

const StepThree: React.FC = () => {
  return (
    <form className="space-y-6">
      {[...Array(4)].map((_, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-600">
            Select {index + 1}
          </label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Seleccione una opción</option>
          </select>
        </div>
      ))}
    </form>
  );
};

export default StepThree;
