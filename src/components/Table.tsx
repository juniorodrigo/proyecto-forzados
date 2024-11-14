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

interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const Table: React.FC<TableProps> = ({
  columns,
  rows,
  onView,
  onEdit,
  onDelete,
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
          <tr className="border-b-2 border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className="p-3 text-left font-semibold text-gray-600"
              >
                {column.label}
              </th>
            ))}
            <th className="p-3 text-left font-semibold text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`p-3 ${
                    column.key === "estado"
                      ? getStatusClass(row[column.key] as Status) +
                        " rounded-lg px-2 py-1 text-center"
                      : ""
                  }`}
                >
                  {row[column.key]}
                </td>
              ))}
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => onView(row.id as number)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => onEdit(row.id as number)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(row.id as number)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
