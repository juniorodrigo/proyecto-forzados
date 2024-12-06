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
import useUserSession from "@/hooks/useSession";
import Modals from "@/components/Modals";

type Status = "RECHAZADO-ALTA" | "PENDIENTE-ALTA" | "APROBADO-ALTA" | "EJECUTADO-ALTA" | "RECHAZADO" | "PENDIENTE-BAJA" | "APROBADO-BAJA" | "EJECUTADO-BAJA" | "FINALIZADO";

export interface Row {
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
	const [, setDragActive] = useState(false);
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
	const [rejectReason, setRejectReason] = useState("");
	const [selectedEndDate, setSelectedEndDate] = useState<string | "">("");
	const router = useRouter();
	const { user } = useUserSession();

	const usuariosEjecutores = [4, 7];
	const usuariosSolicitantes = [2, 5];
	// usuariosEjecutores.push(1, 2, 4, 5, 7);

	const uniqueAreas = Array.from(new Set(rows.map((row) => row.area)));
	const uniqueSolicitantes = Array.from(new Set(rows.map((row) => row.solicitante)));
	const uniqueEstados = Array.from(new Set(rows.map((row) => row.estado)));

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "nombre", label: "Descripción" },
		{ key: "area", label: "Área", filterable: true, options: uniqueAreas },
		{ key: "solicitante", label: "Solicitante", filterable: true, options: uniqueSolicitantes },
		{ key: "estado", label: "Estado", filterable: true, options: uniqueEstados },
		{ key: "fecha", label: "Fecha y Hora", filterable: false },
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

	const [rejectReasons, setRejectReasons] = useState<{ id: number; descripcion: string; tipo: string }[]>([]);

	useEffect(() => {
		const fetchRejectReasons = async () => {
			try {
				const response = await fetch("/api/maestras/motivo-rechazo");
				const result = await response.json();
				if (result.success) {
					setRejectReasons(result.values);
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

	const handleEdit = (id: number, estado: Status) => {
		if (estado === "PENDIENTE-BAJA") {
			router.push(`/dashboard/generar-baja?id=${id}`);
		} else {
			router.push(`/dashboard/generar-alta?id=${id}`);
		}
	};

	const handleDelete = (id: number) => {
		router.push(`/dashboard/generar-baja?id=${id}`);
	};

	const handleClearFilters = () => {
		setSelectedRange(undefined);
		setSelectedSolicitante("");
		setSelectedEstado("");
		setSelectedArea("");
		setSelectedEndDate("");
	};

	const formatStatus = (status: string) => {
		return status
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");
	};

	const getStatusClass = (estado: string) => {
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
				const response = await fetch(`/api/solicitudes/${tipo.toLowerCase()}/aprobar`, { method: "POST", body: JSON.stringify({ id, usuario: user?.id }) });
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
		//TODO: xd
		if (row && user && usuariosEjecutores.includes(user?.role)) {
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
					body: JSON.stringify({ id: selectedExecuteRow?.id, fechaEjecucion: executeDate, usuario: user?.id }),
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
					body: JSON.stringify({ id, motivoRechazo: rejectReason, usuario: user?.id }),
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
				const response = await fetch(`/api/solicitudes/${tipo.toLowerCase()}/rechazar`, { method: "POST", body: JSON.stringify({ id, usuario: user?.id }) });
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
				<div className="flex flex-col md:flex-row md:items-center mb-4">
					{/* Solicitante */}
					<div className="mb-4 md:mb-0 md:mr-6">
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

					{/* Rango de fechas y botón Limpiar */}
					<div className="flex items-center">
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
									/>
									<Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
								</div>
								<div className="relative flex-1">
									<input
										type="date"
										value={selectedRange?.to?.toISOString().split("T")[0] || ""}
										onChange={(e) => setSelectedRange({ from: selectedRange?.from, to: new Date(e.target.value) })}
										disabled={!selectedRange?.from}
										className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
								</div>
							</div>
						</div>
						{/* Botón para limpiar filtros */}
						<div className="flex items-center justify-center w-full h-full">
							<button
								onClick={handleClearFilters}
								className="ml-4 flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
							>
								<X className="w-4 h-4 mr-1" />
								Limpiar Filtros
							</button>
						</div>
					</div>
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
				// Añadir 'overflow-auto' al contenedor de la tabla
				<div className="bg-white rounded-lg shadow overflow-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								{columns.map((column) => (
									<th key={column.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										{column.label}
										{column.filterable && (
											<select
												onChange={(e) => {
													if (column.key === "area") setSelectedArea(e.target.value);
													if (column.key === "solicitante") setSelectedSolicitante(e.target.value);
													if (column.key === "estado") setSelectedEstado(e.target.value as Status);
												}}
												className="ml-2 border border-gray-300 rounded-md"
											>
												<option value="">Todos</option>
												{column.options?.map((option) => (
													<option key={option} value={option}>
														{option}
													</option>
												))}
											</select>
										)}
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
										<td key={column.key} className={`px-6 py-4 ${column.key === "nombre" ? "max-w-xs break-words" : "whitespace-nowrap"}`}>
											<div className={`text-sm text-gray-900 ${column.key === "estado" ? `${getStatusClass(row.estado)} text-center rounded px-2 py-0.5 inline-block` : ""}`}>
												{column.key === "estado" ? formatStatus(row[column.key] as string) : row[column.key]}
											</div>
										</td>
									))}
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button onClick={() => handleView(row.id)} className="text-indigo-600 hover:text-indigo-900 mr-2">
											<FaEye />
										</button>
										{row.estado !== "FINALIZADO" &&
											usuariosSolicitantes.includes(user.role) &&
											row.estado !== "APROBADO-ALTA" &&
											!row.estado.includes("APROBADO") &&
											!row.estado.includes("RECHAZADO") &&
											!row.estado.includes("EJECUTADO") && (
												<button onClick={() => handleEdit(row.id, row.estado)} className="text-green-600 hover:text-green-900 mr-2">
													<FaEdit />
												</button>
											)}
										{row.estado !== "FINALIZADO" && row.estado === "EJECUTADO-ALTA" && user && usuariosSolicitantes.includes(user.role) && (
											<button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900 mr-2">
												<FaMinus />
											</button>
										)}
										{row.estado !== "FINALIZADO" &&
											!row.estado.includes("EJECUTADO") &&
											!row.estado.includes("RECHAZADO") &&
											row.estado.includes("APROBADO") &&
											user &&
											usuariosEjecutores.includes(user?.role) && (
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

			<Modals
				isModalOpen={isModalOpen}
				selectedRow={selectedRow!}
				closeModal={closeModal}
				openRejectModal={openRejectModal}
				handleApprove={handleApprove}
				closeModalBaja={closeModalBaja}
				handleReject={handleReject}
				handleApproveBaja={handleApprove}
				isExecuteModalOpen={isExecuteModalOpen}
				selectedExecuteRow={selectedExecuteRow as Row}
				executeDate={executeDate}
				setExecuteDate={setExecuteDate}
				handleDrag={handleDrag}
				handleDrop={handleDrop}
				handleFileChange={handleFileChange}
				executeFile={executeFile}
				closeExecuteModal={closeExecuteModal}
				handleExecuteConfirm={handleExecuteConfirm}
				isRejectModalOpen={isRejectModalOpen}
				rejectReason={rejectReason}
				setRejectReason={setRejectReason}
				rejectReasons={rejectReasons}
				closeRejectModal={closeRejectModal}
				handleRejectConfirm={handleRejectConfirm}
				getStatusClass={getStatusClass}
				formatDate={formatDate}
			/>
			<Popover message={popoverMessage} type={popoverType} show={showPopover} />
		</div>
	);
};

export default Page;
