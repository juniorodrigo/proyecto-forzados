import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Status = "rechazado" | "pendiente" | "aprobado" | "ejecutado" | "finalizado";

interface TableColumn {
	key: string;
	label: string;
	filterable?: boolean;
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
	actions?: Action[];
	onFilterChange?: (key: string, value: string | DateRange) => void;
}

const Table: React.FC<TableProps> = ({ columns, rows, onView, onEdit, onDelete, actions = ["view", "edit", "delete"], onFilterChange }) => {
	const [filtersOpen, setFiltersOpen] = useState<{ [key: string]: boolean }>({
		estado: false,
		fecha: false,
		area: false,
	});

	const [selectedEstado, setSelectedEstado] = useState<Status | "">("");
	const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
	const [selectedArea, setSelectedArea] = useState<string | "">("");

	const toggleFilter = (key: string) => {
		setFiltersOpen((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleFilterChange = (key: string, value: string | DateRange) => {
		if (onFilterChange) {
			onFilterChange(key, value);
		}

		if (key === "estado") {
			setSelectedEstado(value as Status);
			setFiltersOpen({
				estado: false,
				fecha: false,
				area: false,
			});
		} else if (key === "fecha") {
			// Verifica que el valor sea un DateRange, no una cadena vacía
			if (value && (value as DateRange).from && (value as DateRange).to) {
				setSelectedDateRange(value as DateRange);
				setFiltersOpen({
					estado: false,
					area: false,
					fecha: true,
				});
				if (selectedDateRange !== undefined) {
					setFiltersOpen({
						estado: false,
						fecha: false,
						area: false,
					});
				}
			}
			console.log(selectedDateRange);
		} else if (key === "area") {
			setSelectedArea(value as string);
			setFiltersOpen({
				estado: false,
				fecha: false,
				area: false,
			});
		}
	};

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
		<div className={`overflow-auto rounded-lg bg-white shadow-lg mt-4 ${onFilterChange ? "min-h-[400px]" : ""}`}>
			<table className="min-w-full bg-white">
				<thead>
					<tr className="border-b-2 border-gray-200 text-sm text-left">
						{columns.map((column) => (
							<th key={column.key} className="p-3 font-semibold text-gray-600 relative">
								<div className="flex items-center justify-between">
									<span>{column.label}</span>
									{column.filterable && (
										<button className="text-gray-500 focus:outline-none" onClick={() => toggleFilter(column.key)}>
											{filtersOpen[column.key] ? <FaChevronUp /> : <FaChevronDown />}
										</button>
									)}
								</div>
								{filtersOpen[column.key] && column.key === "area" && (
									<div className="absolute left-0 w-full mt-2 z-50">
										<select
											className="px-3 py-2 border border-gray-300 rounded w-full bg-white text-gray-700 focus:outline-none"
											onChange={(e) => handleFilterChange(column.key, e.target.value)}
											value={selectedArea}
										>
											<option value="" className="hover:bg-gray-200">
												Todos
											</option>
											<option value="Desarrollo" className={`${selectedArea === "Desarrollo" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												Desarrollo
											</option>
											<option value="Marketing" className={`${selectedArea === "Marketing" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												Marketing
											</option>
											<option value="Finanzas" className={`${selectedArea === "Finanzas" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												Finanzas
											</option>
											<option value="Recursos Humanos" className={`${selectedArea === "Recursos Humanos" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												Recursos Humanos
											</option>
											<option value="IT" className={`${selectedArea === "IT" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												IT
											</option>
											<option value="Ventas" className={`${selectedArea === "Ventas" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												Ventas
											</option>
										</select>
									</div>
								)}
								{filtersOpen[column.key] && column.key === "estado" && (
									<div className="absolute left-0 w-full mt-2 z-50">
										<select
											className="px-3 py-2 border border-gray-300 rounded w-full bg-white text-gray-700 focus:outline-none"
											onChange={(e) => handleFilterChange(column.key, e.target.value)}
											value={selectedEstado}
										>
											<option value="" className="hover:bg-gray-200">
												Todos
											</option>
											<option value="rechazado" className={`${selectedEstado === "rechazado" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												Rechazado
											</option>
											<option value="pendiente" className={`${selectedEstado === "pendiente" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												Pendiente
											</option>
											<option value="aprobado" className={`${selectedEstado === "aprobado" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												Aprobado
											</option>
											<option value="ejecutado" className={`${selectedEstado === "ejecutado" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												Ejecutado
											</option>
											<option value="finalizado" className={`${selectedEstado === "finalizado" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}>
												Finalizado
											</option>
										</select>
									</div>
								)}
								{filtersOpen[column.key] && column.key === "fecha" && (
									<div className="absolute left-0 mt-2 bg-white border border-gray-300 shadow-lg p-4 z-50">
										<DayPicker mode="range" selected={selectedDateRange} onSelect={(range) => handleFilterChange(column.key, range || "")} />
										{selectedDateRange && (
											<div className="mt-2">
												<p className="text-sm text-gray-700">Desde: {selectedDateRange?.from ? selectedDateRange.from.toLocaleDateString() : "N/A"}</p>
												<p className="text-sm text-gray-700">Hasta: {selectedDateRange?.to ? selectedDateRange.to.toLocaleDateString() : "N/A"}</p>
											</div>
										)}
									</div>
								)}
							</th>
						))}
						{actions.length > 0 && <th className="p-3 font-semibold text-gray-600">Acciones</th>}
					</tr>
				</thead>
				<tbody>
					{rows.length > 0 ? (
						rows.map((row) => (
							<tr key={row.id} className="border-b border-gray-200 hover:bg-gray-100">
								{columns.map((column) => (
									<td key={column.key} className="p-3 text-sm">
										{column.key === "estado" ? <span className={`inline-block px-6 py-2 font-semibold rounded-full ${getStatusClass(row[column.key] as Status)}`}>{row[column.key]}</span> : row[column.key]}
									</td>
								))}
								{actions.length > 0 && (
									<td className="p-3 flex space-x-2">
										{actions.includes("view") && onView && (
											<button onClick={() => onView(row.id as number)} className="text-blue-600 hover:text-blue-800">
												<FaEye />
											</button>
										)}
										{actions.includes("edit") && onEdit && (
											<button onClick={() => onEdit(row.id as number)} className="text-yellow-600 hover:text-yellow-800">
												<FaEdit />
											</button>
										)}
										{actions.includes("delete") && onDelete && (
											<button onClick={() => onDelete(row.id as number)} className="text-red-600 hover:text-red-800">
												<FaTrashAlt />
											</button>
										)}
									</td>
								)}
							</tr>
						))
					) : (
						<tr>
							<td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="p-3 text-center text-gray-500">
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
