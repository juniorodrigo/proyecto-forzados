"use client";
import React, { useState, useMemo, useEffect } from "react";
import { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Table from "@/components/Table";
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
		const row = rows.find((row) => row.id === id); // Encuentra la fila seleccionada
		if (row) {
			setSelectedRow(row); // Almacena los datos en `selectedRow`
			setIsModalOpen(true); // Abre el modal
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
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Tag (Centro) */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Tag (Centro)</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Tag (SubFijo) */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Tag (SubFijo)</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Descripción */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
								<textarea required className="w-full px-3 py-2 border rounded mb-4" placeholder="Ingrese una descripción"></textarea>

								{/* Disciplina */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Disciplina</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Turno */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Turno</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Interlock Seguridad */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Interlock Seguridad</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Responsable */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Riesgo */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Riesgo</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Probabilidad */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Probabilidad</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Impacto */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Impacto</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Solicitante (AN) */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Solicitante (AN)</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Aprobador */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Aprobador</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Ejecutor */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Ejecutor</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Autorización */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Autorización</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>

								{/* Tipo de Forzado */}
								<label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Forzado</label>
								<select required className="w-full px-3 py-2 border rounded mb-4">
									<option value="">Seleccione una opción</option>
									<option value="op1">Opción 1</option>
									<option value="op2">Opción 2</option>
								</select>
								<div className="flex justify-end p-4 border-t">
									<button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" onClick={closeModal}>
										Cancelar
									</button>
									<button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Page;
