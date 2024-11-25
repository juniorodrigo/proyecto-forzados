import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

type Status = "rechazado" | "pendiente" | "aprobado" | "ejecutado" | "finalizado";

interface TableColumn {
	key: string;
	label: string;
	filterable?: boolean; // Añadido para controlar si la columna es filtrable
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
	onFilterChange?: (key: string, value: string) => void; // Función para manejar los filtros
}

const Table: React.FC<TableProps> = ({
	columns,
	rows,
	onView,
	onEdit,
	onDelete,
	actions = ["view", "edit", "delete"], // Acciones predeterminadas
	onFilterChange,
}) => {
	const [filtersOpen, setFiltersOpen] = useState<{ [key: string]: boolean }>({
		estado: false,
		fecha: false,
	});

	const [selectedEstado, setSelectedEstado] = useState<Status | "">("");
	const [selectedFecha, setSelectedFecha] = useState<string>("");

	const toggleFilter = (key: string) => {
		setFiltersOpen((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: string) => {
		if (onFilterChange) {
			onFilterChange(key, e.target.value);
		}

		if (key === "estado") {
			setSelectedEstado(e.target.value as Status);
		} else if (key === "fecha") {
			setSelectedFecha(e.target.value);
		}

		setFiltersOpen((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
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
		<div className="overflow-auto rounded-lg shadow-lg mt-4">
			<table className="min-w-full bg-white">
				<thead>
					<tr className="border-b-2 border-gray-200 text-sm text-left">
						{columns.map((column) => (
							<th key={column.key} className="p-3 font-semibold text-gray-600 relative">
								{column.label}
								{column.filterable && (
									<div className="absolute right-10 top-2 mt-2 mr-2">
										<button className="text-gray-500 focus:outline-none" onClick={() => toggleFilter(column.key)}>
											{filtersOpen[column.key] ? <FaChevronUp /> : <FaChevronDown />}
										</button>
										{filtersOpen[column.key] && column.key === "estado" && (
											<select className="px-2 py-1 border border-gray-300 rounded absolute mt-6 z-10" onChange={(e) => handleFilterChange(e, column.key)} value={selectedEstado}>
												<option value="">Todos</option>
												<option value="rechazado">Rechazado</option>
												<option value="pendiente">Pendiente</option>
												<option value="aprobado">Aprobado</option>
												<option value="ejecutado">Ejecutado</option>
												<option value="finalizado">Finalizado</option>
											</select>
										)}
										{filtersOpen[column.key] && column.key === "fecha" && (
											<input type="date" className="w-32 px-2 py-1 border border-gray-300 rounded absolute mt-6 z-10" onChange={(e) => handleFilterChange(e, column.key)} value={selectedFecha} />
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
									<td className="p-3 flex space-x-2 mt-2">
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
