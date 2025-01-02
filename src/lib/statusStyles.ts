export const getStatusClass = (estado: string) => {
    if (estado.includes("PENDIENTE")) {
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    } else if (estado.includes("APROBADO")) {
      return "bg-green-50 text-green-700 border border-green-200";
    } else if (estado.includes("EJECUTADO")) {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    } else if (estado.includes("FINALIZADO")) {
      return "bg-gray-50 text-gray-700 border border-gray-200";
    } else if (estado.includes("RECHAZADO")) {
      return "bg-red-50 text-red-700 border border-red-200";
    }
    return "";
  };
  
  