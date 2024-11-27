"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";

type Status = "rechazado" | "pendiente" | "aprobado" | "ejecutado" | "finalizado";

interface Row {
	id: number;
	nombre: string;
	area: string;
	solicitante: string;
	estado: string;
	fecha: string;
	[key: string]: string | number; // Añadir signatura de índice
}

const Page = () => {
	const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
	const [selectedSolicitante, setSelectedSolicitante] = useState("");
	const [selectedEstado, setSelectedEstado] = useState<Status | "">("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<Row | null>(null);
	const [selectedArea, setSelectedArea] = useState<string | "">("");
	const [rows, setRows] = useState<Row[]>([]); // Asegura que rows sea de tipo Row[]
	const router = useRouter();

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "nombre", label: "Descripcion" },
		{ key: "area", label: "Área", filterable: true },
		{ key: "solicitante", label: "Solicitante" },
		{ key: "estado", label: "Estado", filterable: true },
		{ key: "fecha", label: "Fecha y Hora", filterable: true },
	];

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			timeZone: "UTC",
		};
		return new Date(dateString).toLocaleDateString("es-ES", options);
	};

	useEffect(() => {
		const fetchData = async () => {
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
					console.error(result.message);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	const fetchResumen = async (id: number) => {
		try {
			const response = await fetch(`/api/solicitudes/alta/resumen?id=${id}`);
			const result = await response.json();
			if (result.success) {
				setSelectedRow(result.data);
			} else {
				console.error(result.message);
			}
		} catch (error) {
			console.error("Error fetching resumen:", error);
		}
	};

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
		setSelectedRow(null); // Limpia los datos al cerrar
	};

	const handleEdit = (id: number) => {
		router.push(`/dashboard/generar-alta?id=${id}`);
	};

	const handleDelete = (id: number) => {
		alert(`Eliminar ${id}`);
	};

	const handleClearFilters = () => {
		setSelectedRange(undefined);
		setSelectedSolicitante("");
		setSelectedEstado("");
		setSelectedArea("");
	};

	const handleApprove = async () => {
		if (selectedRow) {
			try {
				const response = await fetch(`/api/solicitudes/aprobar?id=${selectedRow.id}`, {
					method: "POST",
				});
				const result = await response.json();
				if (result.success) {
					alert("Solicitud aprobada con éxito");
					closeModal();
				} else {
					console.error(result.message);
				}
			} catch (error) {
				console.error("Error approving request:", error);
			}
		}
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			{/* Contenedor de filtros y botón */}
			<div className="flex flex-wrap items-end gap-4 mb-6">
				{/* Solicitante */}
				<div className="flex-1 max-w-[300px]">
					<label className="block text-sm font-medium text-gray-700 mb-1">Solicitante</label>
					<input
						type="text"
						value={selectedSolicitante}
						onChange={(e) => setSelectedSolicitante(e.target.value)}
						placeholder="Nombre del solicitante"
						className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{/* Botón para limpiar filtros */}
				<div className="max-w-[140px]">
					<button onClick={handleClearFilters} className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">
						Limpiar Filtros
					</button>
				</div>
			</div>

			{/* Tabla */}
			<Table columns={columns} rows={filteredRows} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} onFilterChange={handleFilterChange} />
			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
					<div className="bg-white rounded-lg shadow-lg w-11/12 max-w-3xl">
						<div className="p-6 max-h-[80vh] overflow-y-auto">
							<h2 className="text-xl font-bold mb-4">Detalles del Registro</h2>
							{selectedRow && (
								<div className="bg-gray-100 p-4 rounded mb-4">
									<p>
										<strong>ID:</strong> {selectedRow.id}
									</p>
									<p>
										<strong>Nombre:</strong> {selectedRow.nombre}
									</p>
									<p>
										<strong>Área:</strong> {selectedRow.area}
									</p>
								</div>
							)}
							<form>
								{/* Tag (Prefijo) */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Tag (Prefijo)</label>
								<input type="text" value={selectedRow?.tagPrefijo || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Tag (Centro) */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Tag (Centro)</label>
								<input type="text" value={selectedRow?.tagCentro || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Tag (SubFijo) */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Tag (SubFijo)</label>
								<input type="text" value={selectedRow?.tagSubFijo || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Descripción */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
								<textarea value={selectedRow?.descripcion || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" placeholder="Ingrese una descripción"></textarea>

								{/* Disciplina */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Disciplina</label>
								<input type="text" value={selectedRow?.disciplinaDescripcion || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Turno */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Turno</label>
								<input type="text" value={selectedRow?.turnoDescripcion || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Interlock Seguridad */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Interlock Seguridad</label>
								<input type="text" value={selectedRow?.interlockSeguridad || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Responsable */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
								<input type="text" value={selectedRow?.responsableNombre || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Riesgo */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Riesgo</label>
								<input type="text" value={selectedRow?.riesgoDescripcion || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Probabilidad */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Probabilidad</label>
								<input type="text" value={selectedRow?.probabilidad || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Impacto */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Impacto</label>
								<input type="text" value={selectedRow?.impacto || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Solicitante (AN) */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Solicitante (AN)</label>
								<input type="text" value={selectedRow?.solicitanteAN || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Aprobador */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Aprobador</label>
								<input type="text" value={selectedRow?.aprobador || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Ejecutor */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Ejecutor</label>
								<input type="text" value={selectedRow?.ejecutor || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Autorización */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Autorización</label>
								<input type="text" value={selectedRow?.autorizacion || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								{/* Tipo de Forzado */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Forzado</label>
								<input type="text" value={selectedRow?.tipoForzadoDescripcion || ""} readOnly className="w-full px-3 py-2 border rounded mb-4" />

								<div className="flex justify-end p-4 border-t">
									<button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" onClick={closeModal}>
										Cancelar
									</button>
									<button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
									<button className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleApprove}>
										Aprobar
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
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

