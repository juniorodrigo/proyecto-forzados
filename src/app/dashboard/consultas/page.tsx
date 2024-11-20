"use client";
import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Table from "@/components/Table";
import { useAtom } from "jotai";
import { rowsAtom } from "@/state/mainAtom";

type Status = "rechazado" | "pendiente" | "aprobado" | "ejecutado" | "finalizado";

const Page = () => {
	const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
	const [isPickerOpen, setIsPickerOpen] = useState(false); // Estado para manejar la visibilidad del picker
	const [selectedSolicitante, setSelectedSolicitante] = useState("");
	const [selectedEstado, setSelectedEstado] = useState<Status | "">("");

	// useEffect(() => {
	// 	// Llamada a la API para obtener los datos
	// 	const fetchData = async () => {
	// 		try {
	// 			const response = await fetch("/api/solicitudes/alta", {
	// 				method: "GET",
	// 			});
	// 			const data = await response.json();
	// 			console.log(data, "Esta es información de prueba");
	// 			// setRows(data);
	// 		} catch (error) {
	// 			console.error("Error fetching data:", error);
	// 		}
	// 	};

	// 	fetchData();
	// }, []);

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "nombre", label: "Nombre" },
		{ key: "area", label: "Área" },
		{ key: "solicitante", label: "Solicitante" },
		{ key: "estado", label: "Estado" },
		{ key: "fecha", label: "Fecha" },
	];

	const [rows] = useAtom(rowsAtom);

	const filteredRows = useMemo(() => {
		return rows.filter((row) => {
			const rowDate = new Date(row.fecha);
			const isWithinDateRange = (!selectedRange?.from || rowDate >= selectedRange.from) && (!selectedRange?.to || rowDate <= selectedRange.to);
			const matchesSolicitante = selectedSolicitante ? row.solicitante.toLowerCase().includes(selectedSolicitante.toLowerCase()) : true;
			const matchesEstado = selectedEstado ? row.estado === selectedEstado : true;

			return isWithinDateRange && matchesSolicitante && matchesEstado;
		});
	}, [rows, selectedRange, selectedSolicitante, selectedEstado]);

	const mappedRows = filteredRows.map((row) => ({
		id: row.id,
		nombre: row.nombre,
		area: row.area,
		solicitante: row.solicitante,
		estado: row.estado,
		fecha: row.fecha,
	}));

	const handleView = (id: number) => {
		alert(`Ver detalles de ${id}`);
	};

	const handleEdit = (id: number) => {
		alert(`Editar ${id}`);
	};

	const handleDelete = (id: number) => {
		alert(`Eliminar ${id}`);
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				{/* Rango de Fechas */}
				<div className="relative">
					<label className="block text-sm font-medium text-gray-700 mb-1">Rango de Fechas</label>
					<input
						type="text"
						readOnly
						value={selectedRange?.from && selectedRange?.to ? `${format(selectedRange.from, "yyyy-MM-dd")} - ${format(selectedRange.to, "yyyy-MM-dd")}` : "Seleccione un rango"}
						onClick={() => setIsPickerOpen((prev) => !prev)}
						placeholder="Seleccione un rango"
						className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
					/>
					{isPickerOpen && (
						<div className="absolute z-10 bg-white border border-gray-300 rounded shadow-lg p-2 mt-2">
							<DayPicker
								mode="range"
								selected={selectedRange}
								onSelect={setSelectedRange}
								onDayClick={() => setIsPickerOpen(false)} // Cierra el picker al seleccionar una fecha
							/>
						</div>
					)}
				</div>

				{/* Solicitante */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Solicitante</label>
					<input
						type="text"
						value={selectedSolicitante}
						onChange={(e) => setSelectedSolicitante(e.target.value)}
						placeholder="Nombre del solicitante"
						className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{/* Estado */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
					<select
						value={selectedEstado}
						onChange={(e) => setSelectedEstado(e.target.value as Status)}
						className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Todos</option>
						<option value="rechazado">Rechazado</option>
						<option value="pendiente">Pendiente</option>
						<option value="aprobado">Aprobado</option>
						<option value="ejecutado">Ejecutado</option>
						<option value="finalizado">Finalizado</option>
					</select>
				</div>
			</div>

			{/* Tabla */}
			<Table columns={columns} rows={mappedRows} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
		</div>
	);
};

export default Page;
