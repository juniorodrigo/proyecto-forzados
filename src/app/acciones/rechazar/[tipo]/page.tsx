"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Popover from "@/components/Popover";

const AprobarPage = () => {
	const searchParams = useSearchParams();
	// const router = useRouter();
	const token = searchParams.get("token");
	const id = searchParams.get("id");
	const usuario = searchParams.get("bsx");

	const [rejectReason, setRejectReason] = useState<number | string>("");
	const [popoverMessage, setPopoverMessage] = useState("");
	const [popoverType, setPopoverType] = useState<"success" | "error">("success");
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(true);
	const [rejectReasons, setRejectReasons] = useState<{ id: number; descripcion: string; tipo: string }[]>([]);

	const [showPopover, setShowPopover] = useState(false);

	const handleRejectConfirm = async () => {
		if (confirm("¿Está seguro de rechazar?")) {
			try {
				const response = await fetch(`/api/solicitudes/alta/rechazar`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id, motivoRechazo: rejectReason, usuario, token }),
				});
				const result = await response.json();
				if (response.ok) {
					setPopoverMessage(result.message || "Solicitud rechazada exitosamente");
					setPopoverType("success");
					setIsRejectModalOpen(false); // Cerrar el modal
					setShowPopover(true); // Mostrar el popover
				} else {
					setPopoverMessage(result.message || "Error al rechazar la solicitud");
					setPopoverType("error");
					setShowPopover(true); // Mostrar el popover
				}
			} catch {
				setPopoverMessage("Error interno de servidor al rechazar solicitud");
				setPopoverType("error");
				setShowPopover(true); // Mostrar el popover
			} finally {
				setTimeout(() => setShowPopover(false), 3000);
			}
		}
	};

	useEffect(() => {
		const fetchRejectReasons = async () => {
			try {
				const response = await fetch("/api/maestras/motivo-rechazo");
				const result = await response.json();
				if (result.success) {
					console.log(result.values);

					setRejectReasons(result.values);
				} else {
					setPopoverMessage("Error al obtener motivos de rechazo");
					setPopoverType("error");
					setShowPopover(true);
				}
			} catch {
				setPopoverMessage("Error al obtener motivos de rechazo");
				setPopoverType("error");
				setShowPopover(true);
			}
		};

		fetchRejectReasons();
	}, []);

	return (
		<div>
			{isRejectModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-md">
						<div className="p-6">
							<h2 className="text-2xl font-bold mb-4">Motivo del Rechazo</h2>
							<select value={rejectReason} onChange={(e) => setRejectReason(Number(e.target.value) || "")} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4">
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
								<button
									onClick={handleRejectConfirm}
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

export default AprobarPage;
