import React from "react";
import { Row } from "@/app/dashboard/consultas/page";

interface ModalsProps {
	isModalOpen: boolean;
	selectedRow: Row;
	closeModal: () => void;
	openRejectModal: () => void;
	handleApprove: (id: number, tipo: string) => void;
	closeModalBaja: () => void;
	handleReject: (id: number, tipo: string) => void;
	handleApproveBaja: (id: number, tipo: string) => void;
	isExecuteModalOpen: boolean;
	selectedExecuteRow: Row;
	executeDate: string;
	setExecuteDate: (date: string) => void;
	handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
	handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	executeFile: File | null;
	closeExecuteModal: () => void;
	handleExecuteConfirm: (tipo: string) => void;
	isRejectModalOpen: boolean;
	rejectReason: string;
	setRejectReason: (reason: string) => void;
	rejectReasons: { id: number; descripcion: string; tipo: string }[];
	closeRejectModal: () => void;
	handleRejectConfirm: (id: number, tipo: string) => void;
	getStatusClass: (estado: string) => string;
	formatDate: (dateString: string) => string;
}

const Modals: React.FC<ModalsProps> = ({
	isModalOpen,
	selectedRow,
	closeModal,
	closeModalBaja,
	isExecuteModalOpen,
	selectedExecuteRow,
	executeDate,
	setExecuteDate,
	handleDrag,
	handleDrop,
	handleFileChange,
	executeFile,
	closeExecuteModal,
	handleExecuteConfirm,
	isRejectModalOpen,
	rejectReason,
	setRejectReason,
	rejectReasons,
	closeRejectModal,
	handleRejectConfirm,
	getStatusClass,
	formatDate,
}) => {
	const [dragActive] = React.useState(false);

	const formatStatus = (status: string) => {
		return status
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");
	};

	return (
		<>
			{isModalOpen &&
				!selectedRow.estado.includes("BAJA") &&
				selectedRow &&
				(selectedRow.estado.includes("ALTA") || selectedRow.estado.includes("RECHAZADO") || selectedRow.estado.includes("finalizado")) && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
						<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
							<div className="p-6">
								<h2 className="text-2xl font-bold mb-4">Detalles del Registro</h2>
								<div className="bg-gray-100 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4">
									{/* <p>
									<strong>ID:</strong> {selectedRow.id}
								</p> */}
									{/* <p>
									<strong>Descripcion:</strong> {selectedRow.nombre}
								</p> */}
									<p>
										<strong>Estado:</strong> <span className={`p-2 rounded ${getStatusClass(selectedRow.estado)}`}>{formatStatus(selectedRow.estado)}</span>
									</p>
									<p>
										<strong>Área:</strong> {selectedRow.area}
									</p>
									<p>
										<strong>Solicitante:</strong> {selectedRow.solicitante}
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
										<strong>Gerencia Responsable:</strong> {selectedRow.responsableNombre}
									</p>
									<p>
										<strong>Elemento de Riesgo:</strong> {selectedRow.riesgoDescripcion}
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
										<strong>Turno:</strong> TURNO {selectedRow.turnoDescripcion}
									</p>
								</div>
								<div className="flex justify-end gap-4">
									<button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
										Cerrar
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			{isModalOpen && selectedRow && (selectedRow.estado.includes("BAJA") || selectedRow.estado.includes("FINALIZADO")) && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-2xl font-bold mb-4">Detalles del Registro de Baja</h2>
							<div className="bg-gray-100 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4">
								{/* <p>
									<strong>ID:</strong> {selectedRow.id}
								</p> */}
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
									<strong>Estado:</strong> <span className={`p-2 rounded ${getStatusClass(selectedRow.estado)}`}>{formatStatus(selectedRow.estado)}</span>
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
							</div>
						</div>
					</div>
				</div>
			)}
			{isExecuteModalOpen && selectedExecuteRow && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-2xl font-bold mb-4">{`Ejecutar ${selectedExecuteRow?.estado.includes("ALTA") ? "Alta" : "Baja"} de Forzado`}</h2>
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
									disabled={!executeDate}
									className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
										!executeDate ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
									}`}
								>
									Ejecutar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			{isRejectModalOpen && selectedRow && selectedRow.estado.includes("ALTA") && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-md">
						<div className="p-6">
							<h2 className="text-2xl font-bold mb-4">Motivo del Rechazo</h2>
							<select value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4">
								<option value="">Seleccione un motivo</option>
								{rejectReasons
									.filter((reason) => reason.tipo === "A")
									.map((reason) => (
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
			{isRejectModalOpen &&
				selectedRow &&
				selectedRow.estado.includes("BAJA") && ( // Asegurarse de que el modal de rechazo se abra para "BAJA"
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
						<div className="bg-white rounded-lg shadow-xl w-full max-w-md">
							<div className="p-6">
								<h2 className="text-2xl font-bold mb-4">Motivo del Rechazo</h2>
								<select value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4">
									<option value="">Seleccione un motivo</option>
									{rejectReasons
										.filter((reason) => reason.tipo === "B")
										.map((reason) => (
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
										onClick={() => selectedRow && handleRejectConfirm(selectedRow.id, "BAJA")} // Cambiado para manejar el rechazo de "BAJA"
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
		</>
	);
};

export default Modals;
