"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Calendar, X } from "lucide-react";
import Popover from "@/components/Popover";
import { FaEye, FaEdit, FaPlay, FaMinus } from "react-icons/fa";

type Status = "RECHAZADO-ALTA" | "PENDIENTE-ALTA" | "APROBADO-ALTA" | "EJECUTADO-ALTA" | "RECHAZADO" | "PENDIENTE-BAJA" | "APROBADO-BAJA" | "EJECUTADO-BAJA" | "FINALIZADO";

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
	const [popoverMessage, setPopoverMessage] = useState("");
	const [popoverType, setPopoverType] = useState<"success" | "error">("success");
	const [showPopover, setShowPopover] = useState(false);
	const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
	const [executeDate, setExecuteDate] = useState("");
	const [selectedExecuteRow, setSelectedExecuteRow] = useState<Row | null>(null);
	const [executeFile, setExecuteFile] = useState<File | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
	const [rejectReason, setRejectReason] = useState("");
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
		return format(new Date(dateString), "dd/MM/yy HH:mm", { locale: es });
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
					console.log(formattedData);
					setRows(formattedData);
				} else {
					setError(result.message);
				}
			} catch {
				setError("Error al cargar los datos. Por favor, intente nuevamente.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const [rejectReasons, setRejectReasons] = useState<{ id: number; descripcion: string }[]>([]);

	useEffect(() => {
		const fetchRejectReasons = async () => {
			try {
				const response = await fetch("/api/maestras/motivo-rechazo");
				const result = await response.json();
				if (result.success) {
					setRejectReasons(result.values);
					// console.log(rejectReasons, "LUJANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
				} else {
					setError(result.message);
				}
			} catch {
				setError("Error al cargar los motivos de rechazo. Por favor, intente nuevamente.");
			}
		};

		fetchRejectReasons();
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

	const closeModalBaja = () => {
		setIsModalOpen(false);
		setSelectedRow(null);
	};

	const handleEdit = (id: number) => {
		router.push(`/dashboard/generar-alta?id=${id}`);
	};

	const handleDelete = (id: number) => {
		router.push(`/dashboard/generar-baja?id=${id}`);
	};

	const handleClearFilters = () => {
		setSelectedRange(undefined);
		setSelectedSolicitante("");
		setSelectedEstado("");
		setSelectedArea("");
	};

	const getStatusClass = (estado: Status) => {
		if (estado.includes("PENDIENTE")) {
			return "bg-yellow-200";
		} else if (estado.includes("APROBADO")) {
			return "bg-green-200";
		} else if (estado.includes("EJECUTADO")) {
			return "bg-green-600 text-white";
		} else if (estado.includes("FINALIZADO")) {
			return "bg-blue-200";
		} else if (estado.includes("RECHAZADO")) {
			return "bg-red-500 text-white";
		} else {
			return "";
		}
	};

	const handleApprove = async (id: number, tipo: string) => {
		if (confirm("¿Está seguro de aprobar?")) {
			try {
				const response = await fetch(`/api/solicitudes/${tipo.toLowerCase()}/aprobar`, { method: "POST", body: JSON.stringify({ id }) });
				if (response.ok) {
					setPopoverMessage("Aprobación exitosa");
					setPopoverType("success");
					// Recargar datos
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
						} catch {
							setError("Error al cargar los datos. Por favor, intente nuevamente.");
						} finally {
							setIsLoading(false);
						}
					};
					fetchData();
					closeModal(); // Cerrar modal
				} else {
					setPopoverMessage("Error al aprobar");
					setPopoverType("error");
				}
			} catch {
				setPopoverMessage("Error al aprobar");
				setPopoverType("error");
			} finally {
				setShowPopover(true);
				setTimeout(() => setShowPopover(false), 3000);
			}
		}
	};

	const handleExecute = async (id: number) => {
		const row = rows.find((row) => row.id === id);
		if (row) {
			openExecuteModal(row);
		}
	};

	const openExecuteModal = (row: Row) => {
		setSelectedExecuteRow(row);
		setIsExecuteModalOpen(true);
	};

	const closeExecuteModal = () => {
		setIsExecuteModalOpen(false);
		setSelectedExecuteRow(null);
		setExecuteDate("");
	};

	const handleExecuteConfirm = async (tipo: string) => {
		if (!executeDate) {
			setPopoverMessage("Por favor, ingrese la fecha y hora de ejecución");
			setPopoverType("error");
			setShowPopover(true);
			setTimeout(() => setShowPopover(false), 3000);
			return;
		}
		if (confirm("¿Está seguro de ejecutar?")) {
			try {
				const response = await fetch(`/api/solicitudes/${tipo.toLowerCase()}/ejecutar`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: selectedExecuteRow?.id, fechaEjecucion: executeDate }),
				});
				if (response.ok) {
					setPopoverMessage("Ejecución exitosa");
					setPopoverType("success");
					// Recargar datos
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
						} catch {
							setError("Error al cargar los datos. Por favor, intente nuevamente.");
						} finally {
							setIsLoading(false);
						}
					};
					fetchData();
					closeExecuteModal(); // Cerrar modal
				} else {
					setPopoverMessage("Error al ejecutar");
					setPopoverType("error");
				}
			} catch {
				setPopoverMessage("Error al ejecutar");
				setPopoverType("error");
			} finally {
				setShowPopover(true);
				setTimeout(() => setShowPopover(false), 3000);
			}
		}
	};

	const openRejectModal = () => {
		setIsRejectModalOpen(true);
	};

	const closeRejectModal = () => {
		setIsRejectModalOpen(false);
		setRejectReason("");
	};

	const handleRejectConfirm = async (id: number, tipo: string) => {
		if (!rejectReason) {
			setPopoverMessage("Por favor, ingrese el motivo del rechazo");
			setPopoverType("error");
			setShowPopover(true);
			setTimeout(() => setShowPopover(false), 3000);
			return;
		}
		if (confirm("¿Está seguro de rechazar?")) {
			try {
				const response = await fetch(`/api/solicitudes/${tipo.toLowerCase()}/rechazar`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id, motivoRechazo: rejectReason }),
				});
				if (response.ok) {
					setPopoverMessage("Rechazo exitoso");
					setPopoverType("success");
					// Recargar datos
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
						} catch {
							setError("Error al cargar los datos. Por favor, intente nuevamente.");
						} finally {
							setIsLoading(false);
						}
					};
					fetchData();
					closeRejectModal(); // Cerrar modal de rechazo
					closeModal(); // Cerrar modal de detalles
				} else {
					setPopoverMessage("Error al rechazar");
					setPopoverType("error");
				}
			} catch {
				setPopoverMessage("Error al rechazar");
				setPopoverType("error");
			} finally {
				setShowPopover(true);
				setTimeout(() => setShowPopover(false), 3000);
			}
		}
	};

	const handleReject = async (id: number, tipo: string) => {
		if (confirm("¿Está seguro de rechazar?")) {
			try {
				const response = await fetch(`/api/solicitudes/${tipo.toLowerCase()}/rechazar`, { method: "POST", body: JSON.stringify({ id }) });
				if (response.ok) {
					setPopoverMessage("Rechazo exitoso");
					setPopoverType("success");
					// Recargar datos
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
						} catch {
							setError("Error al cargar los datos. Por favor, intente nuevamente.");
						} finally {
							setIsLoading(false);
						}
					};
					fetchData();
					closeModal(); // Cerrar modal
				} else {
					setPopoverMessage("Error al rechazar");
					setPopoverType("error");
				}
			} catch {
				setPopoverMessage("Error al rechazar");
				setPopoverType("error");
			} finally {
				setShowPopover(true);
				setTimeout(() => setShowPopover(false), 3000);
			}
		}
	};

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(e.type === "dragover");
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setExecuteFile(e.dataTransfer.files[0]);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setExecuteFile(e.target.files[0]);
		}
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
							disabled
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
							disabled
						>
							<option value="">Todos los estados</option>
							<option value="PENDIENTE">Pendiente</option>
							<option value="APROBADO">Aprobado</option>
							<option value="EJECUTADO">Ejecutado</option>
							<option value="RECHAZADO">Rechazado</option>
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
									value={selectedRange?.from?.toISOString().split("T")[0] || ""}
									onChange={(e) => setSelectedRange({ from: new Date(e.target.value), to: selectedRange?.to })}
									className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled
								/>
								<Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
							</div>
							{/* <div className="relative flex-1">
								<input
									type="date"
									value={selectedRange?.to?.toISOString().split("T")[0] || ""}
									onChange={(e) => setSelectedRange({ from: selectedRange?.from, to: new Date(e.target.value) })}
									className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
							</div> */}
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
									<th key={column.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
											<div className={`text-sm text-gray-900 ${column.key === "estado" ? `${getStatusClass(row.estado)} text-center rounded-full py-1 px-3` : ""}`}>{row[column.key]}</div>
										</td>
									))}
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button onClick={() => handleView(row.id)} className="text-indigo-600 hover:text-indigo-900 mr-2">
											<FaEye />
										</button>
										{row.estado !== "FINALIZADO" && row.estado !== "APROBADO-ALTA" && !row.estado.includes("APROBADO") && !row.estado.includes("RECHAZADO") && !row.estado.includes("EJECUTADO") && (
											<button onClick={() => handleEdit(row.id)} className="text-green-600 hover:text-green-900 mr-2">
												<FaEdit />
											</button>
										)}
										{row.estado !== "FINALIZADO" && row.estado === "EJECUTADO-ALTA" && (
											<button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900 mr-2">
												<FaMinus />
											</button>
										)}
										{row.estado !== "FINALIZADO" && !row.estado.includes("EJECUTADO") && !row.estado.includes("RECHAZADO") && row.estado.includes("APROBADO") && (
											<button onClick={() => handleExecute(row.id)} className="text-blue-600 hover:text-blue-900">
												<FaPlay />
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Modal */}
			{isModalOpen && selectedRow && (selectedRow.estado.includes("ALTA") || selectedRow.estado.includes("RECHAZADO") || selectedRow.estado.includes("finalizado")) && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-2xl font-bold mb-4">Detalles del Registro</h2>
							<div className="bg-gray-100 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4">
								<p>
									<strong>ID:</strong> {selectedRow.id}
								</p>
								<p>
									<strong>Nombre:</strong> {selectedRow.nombre}
								</p>
								<p>
									<strong>Área:</strong> {selectedRow.area}
								</p>
								<p>
									<strong>Solicitante:</strong> {selectedRow.solicitante}
								</p>
								<p>
									<strong>Estado:</strong> <span className={`p-2 rounded ${getStatusClass(selectedRow.estado)}`}>{selectedRow.estado}</span>
								</p>
								<p>
									<strong>Fecha:</strong> {selectedRow.fecha}
								</p>
								<p>
									<strong>Descripción:</strong> {selectedRow.descripcion}
								</p>
								<p>
									<strong>Disciplina:</strong> {selectedRow.disciplinaDescripcion}
								</p>
								<p>
									<strong>Estado Solicitud:</strong> {selectedRow.estadoSolicitud}
								</p>
								<p>
									<strong>Fecha Cierre:</strong> {selectedRow.fechaCierre ? formatDate(selectedRow.fechaCierre.toString()) : "N/A"}
								</p>
								<p>
									<strong>Fecha Realización:</strong> {selectedRow.fechaRealizacion ? formatDate(selectedRow.fechaRealizacion.toString()) : "N/A"}
								</p>
								<p>
									<strong>Motivo de Rechazo:</strong> {selectedRow.motivoRechazoDescripcion}
								</p>
								<p>
									<strong>Responsable Nombre:</strong> {selectedRow.responsableNombre}
								</p>
								<p>
									<strong>Riesgo A:</strong> {selectedRow.riesgoDescripcion}
								</p>
								<p>
									<strong>Subárea:</strong> {selectedRow.subareaDescripcion}
								</p>
								<p>
									<strong>Tag Centro:</strong> {selectedRow.tagCentroDescripcion}
								</p>
								<p>
									<strong>Tipo Forzado:</strong> {selectedRow.tipoForzadoDescripcion}
								</p>
								<p>
									<strong>Turno:</strong> Turno {selectedRow.turnoDescripcion}
								</p>
							</div>
							<div className="flex justify-end gap-4">
								<button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
									Cerrar
								</button>
								{selectedRow.estado === "PENDIENTE-ALTA" && (
									<>
										<button onClick={openRejectModal} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
											Rechazar
										</button>
									</>
								)}
								{selectedRow.estado !== "APROBADO-ALTA" && !selectedRow.estado.includes("EJECUTADO") && (
									<button
										onClick={() => handleApprove(selectedRow.id, "ALTA")}
										className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
									>
										Aprobar
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			{isModalOpen && selectedRow && selectedRow.estado.includes("BAJA") && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-2xl font-bold mb-4">Detalles del Registro de Baja</h2>
							<div className="bg-gray-100 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4">
								<p>
									<strong>ID:</strong> {selectedRow.id}
								</p>
								<p>
									<strong>Nombre:</strong> {selectedRow.nombre}
								</p>
								<p>
									<strong>Área:</strong> {selectedRow.area}
								</p>
								<p>
									<strong>Solicitante:</strong> {selectedRow.usuarioCreacion}
								</p>
								<p>
									<strong>Estado:</strong> <span className={`p-2 rounded ${getStatusClass(selectedRow.estado)}`}>{selectedRow.estado}</span>
								</p>
								<p>
									<strong>Fecha:</strong> {selectedRow.fecha}
								</p>
								<p>
									<strong>Descripción:</strong> {selectedRow.descripcion}
								</p>
							</div>
							<div className="flex justify-end gap-4">
								<button onClick={closeModalBaja} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
									Cerrar
								</button>
								{selectedRow.estado === "PENDIENTE-BAJA" && (
									<>
										<button
											onClick={() => handleReject(selectedRow.id, "ALTA")}
											className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
										>
											Rechazar
										</button>
									</>
								)}
								{selectedRow.estado !== "APROBADO-BAJA" && !selectedRow.estado.includes("EJECUTADO") && (
									<button
										onClick={() => handleApprove(selectedRow.id, "BAJA")}
										className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
									>
										Aprobar
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			{isExecuteModalOpen && selectedExecuteRow && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-2xl font-bold mb-4">{`Ejecutar ${selectedRow?.estado.includes("ALTA") ? "Alta" : "Baja"} de Forzado`}</h2>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ejecución</label>
								<input type="datetime-local" value={executeDate} onChange={(e) => setExecuteDate(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300" />
							</div>
							<div className="mb-4">
								<label htmlFor="executeFile" className="block text-sm font-medium text-gray-700 mb-1">
									Datos Adjuntos
								</label>
								<div
									className={`flex items-center justify-center border-2 ${
										dragActive ? "border-blue-500" : "border-gray-300"
									} border-dashed rounded-md p-4 cursor-pointer hover:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500`}
									onDragOver={handleDrag}
									onDragEnter={handleDrag}
									onDragLeave={handleDrag}
									onDrop={handleDrop}
									onClick={() => document.getElementById("executeFile")?.click()}
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16v-3a4 4 0 10-8 0v3M8 16v2a4 4 0 004 4h0a4 4 0 004-4v-2m4-4a8 8 0 10-16 0v3m4-8a4 4 0 118 0" />
									</svg>
									<span className="text-sm text-gray-500">{executeFile ? executeFile.name : "Arrastre y suelte archivos o haga clic aquí"}</span>
								</div>
								<input id="executeFile" name="executeFile" type="file" className="hidden" onChange={handleFileChange} />
							</div>

							<div className="flex justify-end gap-4">
								<button onClick={closeExecuteModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
									Cancelar
								</button>
								<button
									onClick={() => handleExecuteConfirm(selectedExecuteRow?.estado.includes("ALTA") ? "Alta" : "Baja")}
									className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
									disabled={!executeDate}
								>
									Ejecutar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			{isRejectModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-md">
						<div className="p-6">
							<h2 className="text-2xl font-bold mb-4">Motivo del Rechazo</h2>
							<select value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4">
								<option value="">Seleccione un motivo</option>
								{rejectReasons.map((reason) => (
									<option key={reason.id} value={reason.id}>
										{reason.descripcion}
									</option>
								))}
							</select>
							<div className="flex justify-end gap-4">
								<button onClick={closeRejectModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
									Cancelar
								</button>
								<button
									onClick={() => selectedRow && handleRejectConfirm(selectedRow.id, "ALTA")}
									disabled={!rejectReason} // Deshabilitar si no hay un motivo seleccionado
									className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
										!rejectReason ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
									}`}
								>
									Confirmar Rechazo
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<Popover message={popoverMessage} type={popoverType} show={showPopover} />
		</div>
	);
};

export default Page;
