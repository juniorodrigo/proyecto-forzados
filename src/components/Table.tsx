import React from "react";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

type Status =
  | "rechazado"
  | "pendiente"
  | "aprobado"
  | "ejecutado"
  | "finalizado";

interface TableColumn {
  key: string;
  label: string;
}

interface TableRow {
  [key: string]: string | number | Status;
}

type Action = "view" | "edit" | "delete";

interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  actions?: Action[]; // Define qué acciones mostrar
}

const Table: React.FC<TableProps> = ({
  columns,
  rows,
  onView,
  onEdit,
  onDelete,
  actions = ["view", "edit", "delete"], // Acciones predeterminadas
}) => {
  const getStatusClass = (status: Status) => {
    switch (status) {
      case "rechazado":
        return "bg-red-100 text-red-700";
      case "pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "aprobado":
        return "bg-green-100 text-green-700";
      case "ejecutado":
        return "bg-blue-100 text-blue-700";
      case "finalizado":
        return "bg-gray-100 text-gray-700";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-auto rounded-lg shadow-lg mt-4">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="border-b-2 border-gray-200 text-sm text-left">
            {columns.map((column) => (
              <th key={column.key} className="p-3 font-semibold text-gray-600">
                {column.label}
              </th>
            ))}
            {actions.length > 0 && ( // Solo muestra la columna de acciones si hay acciones definidas
              <th className="p-3 font-semibold text-gray-600">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-3 text-sm">
                    {column.key === "estado" ? (
                      <span
                        className={`inline-block px-6 py-2 font-semibold rounded-full ${getStatusClass(
                          row[column.key] as Status
                        )}`}
                      >
                        {row[column.key]}
                      </span>
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="p-3 flex space-x-2">
                    {actions.includes("view") && onView && (
                      <button
                        onClick={() => onView(row.id as number)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEye />
                      </button>
                    )}
                    {actions.includes("edit") && onEdit && (
                      <button
                        onClick={() => onEdit(row.id as number)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <FaEdit />
                      </button>
                    )}
                    {actions.includes("delete") && onDelete && (
                      <button
                        onClick={() => onDelete(row.id as number)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrashAlt />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                className="p-3 text-center text-gray-500"
              >
                No se encontraron registros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
