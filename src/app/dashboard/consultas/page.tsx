"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Calendar, X } from "lucide-react";
import Popover from "@/components/Popover";
import { FaEye, FaEdit, FaPlay, FaCheck, FaArrowUp, FaArrowDown, FaCircle } from "react-icons/fa";
import useUserSession from "@/hooks/useSession";
import Modals from "@/components/Modals";
import ModalAprobacionRechazo from "@/components/ModalAprobacionRechazo";
import ModalCambioPassword from "@/components/ModalCambioPassword";

import { solicitantes, aprobadores, ejecutores, administradores } from "@/hooks/rolesPermitidos";

type Status = "RECHAZADO-ALTA" | "PENDIENTE-ALTA" | "APROBADO-ALTA" | "EJECUTADO-ALTA" | "RECHAZADO" | "PENDIENTE-BAJA" | "APROBADO-BAJA" | "EJECUTADO-BAJA" | "FINALIZADO";

export interface Row {
	id: number;
	nombre: string;
	area: string;
	solicitante: string;
	estado: Status;
	fecha: string;
	fechaModificacion: string;
	tipo: string;
	aprobador: string;
	ejecutor: string;
	solicitanteAId: number;
	aprobadorAId: number;
	ejecutorAId: number;
	solicitanteBId: number;
	aprobadorBId: number;
	ejecutorBId: number;
	interlock: number;
	[key: string]: string | number;
}

const Page: React.FC = () => {
	const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
	const [selectedSolicitante, setSelectedSolicitante] = useState("");
	const [selectedEstado, setSelectedEstado] = useState<Status | "">("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<Row | null>(null);
	const [selectedArea, setSelectedArea] = useState<string | "">("");
	const [selectedTipo, setSelectedTipo] = useState<string | "">("");
	const [selectedAprobador, setSelectedAprobador] = useState<string | "">("");
	const [selectedEjecutor, setSelectedEjecutor] = useState<string | "">("");
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
	const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
	const [selectedApprovalRow, setSelectedApprovalRow] = useState<Row | null>(null);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const router = useRouter();
	const { user } = useUserSession();

	console.log(user, "________________________DATOS______________________________");

	const usuariosEjecutores = ejecutores;
	const usuariosSolicitantes = solicitantes;
	const usuariosAprobadores = aprobadores;
	const usuariosAdministradores = administradores;

	const uniqueAreas = Array.from(new Set(rows.map((row) => row.area)));
	const uniqueSolicitantes = Array.from(new Set(rows.map((row) => row.solicitante)));
	const uniqueEstados = Array.from(new Set(rows.map((row) => row.estado)));
	const uniqueAprobadores = Array.from(new Set(rows.map((row) => row.aprobador)));
	const uniqueEjecutores = Array.from(new Set(rows.map((row) => row.ejecutor)));

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "tipo", label: "Etapa", filterable: true, options: ["alta", "baja"] },
		{ key: "estado", label: "Estado", filterable: true, options: uniqueEstados },
		{ key: "nombre", label: "Descripción" },
		{ key: "area", label: "Área", filterable: true, options: uniqueAreas },
		{ key: "solicitante", label: "Solicitante", filterable: true, options: uniqueSolicitantes },
		{ key: "aprobador", label: "Aprobador", filterable: true, options: uniqueAprobadores },
		{ key: "ejecutor", label: "Ejecutor", filterable: true, options: uniqueEjecutores },
		{ key: "fecha", label: "Fecha Actualización", filterable: false },
	];

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), "dd/MM/yy HH:mm", { locale: es });
	};

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch("/api/solicitudes/alta");
			const result = await response.json();

			if (result.success) {
				const formattedData = result.data.map((row: Row) => ({
					...row,
					fecha: formatDate(row.fechaModificacion),
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
	}, []);

	useEffect(() => {
		fetchData();
		if (user) {
			setSelectedSolicitante(user.name);
		}
	}, [fetchData, user]);

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

	useEffect(() => {
		if (user) {
			if (usuariosSolicitantes.includes(user.role)) {
				setSelectedSolicitante(user.name);
			}
			if (usuariosAprobadores.includes(user.role)) {
				setSelectedAprobador(user.name);
			}
			if (usuariosEjecutores.includes(user.role)) {
				setSelectedEjecutor(user.name);
			}
		}
	}, [user, usuariosSolicitantes, usuariosAprobadores, usuariosEjecutores]);

	useEffect(() => {
		if (user && user.flagNuevoIngreso) {
			setIsPasswordModalOpen(true);
		}
	}, [user]);

	const filteredRows = useMemo(() => {
		return rows.filter((row) => {
			const rowDate = new Date(row.fechaModificacion);
			const isWithinDateRange = (!selectedRange?.from || rowDate >= selectedRange.from) && (!selectedRange?.to || rowDate <= selectedRange.to);
			const matchesSolicitante = selectedSolicitante ? row.solicitante.toLowerCase().includes(selectedSolicitante.toLowerCase()) : true;
			const matchesEstado = selectedEstado ? row.estado === selectedEstado : true;
			const matchesArea = selectedArea ? row.area === selectedArea : true;
			const matchesTipo = selectedTipo ? row.tipo === selectedTipo : true;
			const matchesAprobador = selectedAprobador ? row.aprobador.toLowerCase().includes(selectedAprobador.toLowerCase()) : true;
			const matchesEjecutor = selectedEjecutor ? row.ejecutor.toLowerCase().includes(selectedEjecutor.toLowerCase()) : true;

			return isWithinDateRange && matchesSolicitante && matchesEstado && matchesArea && matchesTipo && matchesAprobador && matchesEjecutor;
		});
	}, [rows, selectedRange, selectedSolicitante, selectedEstado, selectedArea, selectedTipo, selectedAprobador, selectedEjecutor]);

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
		setSelectedAprobador("");
		setSelectedEjecutor("");
		const selects = document.querySelectorAll("select");
		selects.forEach((select) => {
			select.value = "";
		});
	};

	const areFiltersApplied = useMemo(() => {
		return selectedRange || selectedSolicitante || selectedEstado || selectedArea || selectedEndDate || selectedAprobador || selectedEjecutor;
	}, [selectedRange, selectedSolicitante, selectedEstado, selectedArea, selectedEndDate, selectedAprobador, selectedEjecutor]);

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
					fetchData();
					closeModal();
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
		if (row && user && (usuariosEjecutores.includes(user?.role) || usuariosAdministradores.includes(user?.role || -1))) {
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
					fetchData();
					closeExecuteModal();
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
		if (selectedApprovalRow) {
			setSelectedRow(selectedApprovalRow);
		}
		setIsRejectModalOpen(true);
		setIsApprovalModalOpen(false);
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
					fetchData();
					closeRejectModal();
					closeModal();
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
					fetchData();
					closeModal();
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

	const handleOpenApprovalModal = (row: Row) => {
		setSelectedApprovalRow(row);
		setIsApprovalModalOpen(true);
	};

	const handlePasswordChangeSuccess = () => {
		setPopoverMessage("Cambio de contraseña exitoso");
		setPopoverType("success");
		setShowPopover(true);
		setTimeout(() => setShowPopover(false), 3000);
		setIsPasswordModalOpen(false);
	};

	return (
		<div className="p-4 min-h-screen  ">
			<h1 className="text-3xl font-bold mb-8 text-gray-800">Consultas</h1>

			{/* Contenedor de filtros y botón */}
			<div className="bg-white p-6 rounded-lg shadow-md mb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
					{/* Solicitante */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Solicitante</label>
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
					{/* Aprobador */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Aprobador</label>
						<div className="relative">
							<input
								type="text"
								value={selectedAprobador}
								onChange={(e) => setSelectedAprobador(e.target.value)}
								placeholder="Nombre del aprobador"
								className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
						</div>
					</div>
					{/* Ejecutor */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Ejecutor</label>
						<div className="relative">
							<input
								type="text"
								value={selectedEjecutor}
								onChange={(e) => setSelectedEjecutor(e.target.value)}
								placeholder="Nombre del ejecutor"
								className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
						</div>
					</div>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
					{/* Rango de fechas */}
					<div className="w-full md:w-auto">
						<label className="block text-sm font-medium text-gray-700 mb-2">Rango de fechas</label>
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
					<button
						onClick={handleClearFilters}
						className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
							areFiltersApplied ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500" : "bg-gray-300 text-gray-500 cursor-not-allowed"
						}`}
						disabled={!areFiltersApplied}
					>
						<X className="w-4 h-4 mr-2 inline-block" />
						Limpiar Filtros
					</button>
				</div>
			</div>

			{/* Mensaje de error */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
					<strong className="font-bold">Error: </strong>
					<span className="block sm:inline">{error}</span>
				</div>
			)}

			{/* Tabla */}
			{isLoading ? (
				<div className="text-center py-8 text-gray-600">Cargando datos...</div>
			) : (
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="overflow-x-auto">
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
														if (column.key === "tipo") setSelectedTipo(e.target.value);
														if (column.key === "aprobador") setSelectedAprobador(e.target.value);
														if (column.key === "ejecutor") setSelectedEjecutor(e.target.value);
													}}
													className="ml-2 border border-gray-300 rounded-md text-sm"
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
								{filteredRows.length > 0 ? (
									filteredRows.map((row) => (
										<tr key={row.id} className="hover:bg-gray-50">
											{columns.map((column) => (
												<td key={column.key} className={`px-6 py-4 ${column.key === "nombre" ? "max-w-xs break-words" : "whitespace-nowrap"}`}>
													<div className={`text-sm text-gray-900 ${column.key === "estado" ? `${getStatusClass(row.estado)} text-center rounded-full px-2 py-1 inline-block` : ""}`}>
														{column.key === "estado" ? (
															formatStatus(row[column.key] as string)
														) : column.key === "tipo" ? (
															<span className={row.estadoSolicitud == "FINALIZADO" ? "text-green-600" : row.tipo === "alta" ? "text-red-500" : "text-green-500"}>
																{row.estadoSolicitud == "FINALIZADO" ? <FaCircle /> : row.tipo === "alta" ? <FaArrowUp /> : <FaArrowDown />}
															</span>
														) : (
															row[column.key]
														)}
													</div>
												</td>
											))}
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
												<button onClick={() => handleView(row.id)} className="text-indigo-600 hover:text-indigo-900 mr-2" title="Ver detalles">
													<FaEye />
												</button>
												{row.estado.startsWith("PENDIENTE") && user && (usuariosAprobadores.includes(user.role) || usuariosAdministradores.includes(user.role)) && (
													<button onClick={() => handleOpenApprovalModal(row)} className="text-green-600 hover:text-green-900 mr-2" title="Aprobar/Rechazar">
														<FaCheck />
													</button>
												)}
												{row.estado !== "FINALIZADO" &&
													(usuariosSolicitantes.includes(user?.role || -1) || usuariosAdministradores.includes(user?.role || -1)) &&
													row.estado !== "APROBADO-ALTA" &&
													!row.estado.includes("APROBADO") &&
													!row.estado.includes("RECHAZADO") &&
													!row.estado.includes("EJECUTADO") && (
														<button onClick={() => handleEdit(row.id, row.estado)} className="text-blue-600 hover:text-blue-900 mr-2" title="Editar">
															<FaEdit />
														</button>
													)}
												{row.estado !== "FINALIZADO" && row.estado === "EJECUTADO-ALTA" && user && (usuariosSolicitantes.includes(user.role) || usuariosAdministradores.includes(user?.role || -1)) && (
													<button onClick={() => handleDelete(row.id)} className="text-green-600 hover:text-green-900 mr-2" title="Eliminar">
														<FaArrowDown />
													</button>
												)}
												{row.estado !== "FINALIZADO" &&
													!row.estado.includes("EJECUTADO") &&
													!row.estado.includes("RECHAZADO") &&
													row.estado.includes("APROBADO") &&
													user &&
													(usuariosEjecutores.includes(user?.role) || usuariosAdministradores.includes(user?.role || -1)) && (
														<button onClick={() => handleExecute(row.id)} className="text-blue-600 hover:text-blue-900" title="Ejecutar">
															<FaPlay />
														</button>
													)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
											No se encontraron registros
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
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
			<ModalAprobacionRechazo
				isOpen={isApprovalModalOpen}
				onClose={() => setIsApprovalModalOpen(false)}
				onApprove={() => selectedApprovalRow && handleApprove(selectedApprovalRow.id, selectedApprovalRow.estado.includes("ALTA") ? "ALTA" : "BAJA")}
				onReject={openRejectModal}
			/>
			{/* Mostrar ModalCambioPassword si isPasswordModalOpen es true */}
			<ModalCambioPassword isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSuccess={handlePasswordChangeSuccess} />

			<Popover message={popoverMessage} type={popoverType} show={showPopover} className="z-40" />
		</div>
	);
};

export default Page;
