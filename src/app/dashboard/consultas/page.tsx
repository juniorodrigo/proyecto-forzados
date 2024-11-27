"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Calendar, X } from 'lucide-react';

type Status = "rechazado" | "pendiente" | "aprobado" | "ejecutado" | "finalizado";

interface Row {
  id: number;
  nombre: string;
  area: string;
  solicitante: string;
  estado: Status;
  fecha: string;
  [key: string]: string | number;
}

const Page: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [selectedSolicitante, setSelectedSolicitante] = useState("");
  const [selectedEstado, setSelectedEstado] = useState<Status | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | "">("");
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Descripción" },
    { key: "area", label: "Área", filterable: true },
    { key: "solicitante", label: "Solicitante" },
    { key: "estado", label: "Estado", filterable: true },
    { key: "fecha", label: "Fecha y Hora", filterable: true },
  ];

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/solicitudes/alta");
        const result = await response.json();
        if (result.success) {
          const formattedData = result.data.map((row: Row) => ({
            ...row,
            fecha: formatDate(row.fecha),
          }));
          setRows(formattedData);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const rowDate = new Date(row.fecha);
      const isWithinDateRange = (!selectedRange?.from || rowDate >= selectedRange.from) && (!selectedRange?.to || rowDate <= selectedRange.to);
      const matchesSolicitante = selectedSolicitante ? row.solicitante.toLowerCase().includes(selectedSolicitante.toLowerCase()) : true;
      const matchesEstado = selectedEstado ? row.estado === selectedEstado : true;
      const matchesArea = selectedArea ? row.area === selectedArea : true;

      return isWithinDateRange && matchesSolicitante && matchesEstado && matchesArea;
    });
  }, [rows, selectedRange, selectedSolicitante, selectedEstado, selectedArea]);

  const handleFilterChange = (key: string, value: string | DateRange) => {
    if (key === "fecha" && typeof value !== "string") {
      setSelectedRange(value);
    } else if (key === "estado" && typeof value === "string") {
      setSelectedEstado(value as Status);
    } else if (key === "area" && typeof value === "string") {
      setSelectedArea(value as string);
    }
  };

  const handleView = (id: number) => {
    const row = rows.find((row) => row.id === id);
    if (row) {
      setSelectedRow(row);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/generar-alta?id=${id}`);
  };

  const handleDelete = (id: number) => {
    alert(`¿Está seguro que desea eliminar la solicitud ${id}?`);
  };

  const handleClearFilters = () => {
    setSelectedRange(undefined);
    setSelectedSolicitante("");
    setSelectedEstado("");
    setSelectedArea("");
  };

  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Consultas</h1>
      
      {/* Contenedor de filtros y botón */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Solicitante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Solicitante</label>
            <div className="relative">
              <input
                type="text"
                value={selectedSolicitante}
                onChange={(e) => setSelectedSolicitante(e.target.value)}
                placeholder="Nombre del solicitante"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las áreas</option>
              <option value="Producción">Producción</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Calidad">Calidad</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value as Status)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="ejecutado">Ejecutado</option>
              <option value="rechazado">Rechazado</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>

          {/* Rango de fechas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rango de fechas</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="date"
                  value={selectedRange?.from?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setSelectedRange({ from: new Date(e.target.value), to: selectedRange?.to })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative flex-1">
                <input
                  type="date"
                  value={selectedRange?.to?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setSelectedRange({ from: selectedRange?.from, to: new Date(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        <div className="flex justify-end">
          <button
            onClick={handleClearFilters}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Tabla */}
      {isLoading ? (
        <div className="text-center py-4">Cargando datos...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{row[column.key]}</div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleView(row.id)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                      Ver
                    </button>
                    <button onClick={() => handleEdit(row.id)} className="text-green-600 hover:text-green-900 mr-2">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Detalles del Registro</h2>
              <div className="bg-gray-100 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {selectedRow.id}</p>
                <p><strong>Nombre:</strong> {selectedRow.nombre}</p>
                <p><strong>Área:</strong> {selectedRow.area}</p>
                <p><strong>Solicitante:</strong> {selectedRow.solicitante}</p>
                <p><strong>Estado:</strong> {selectedRow.estado}</p>
                <p><strong>Fecha:</strong> {selectedRow.fecha}</p>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleEdit(selectedRow.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

