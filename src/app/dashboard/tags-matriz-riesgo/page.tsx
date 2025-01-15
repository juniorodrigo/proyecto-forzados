"use client";
import Table from "@/components/Table";
import React, { useState, useEffect } from "react";
import ModalCreacionPuesto from "@/components/ModalCreacionPuesto";
import Popover from "@/components/Popover";

export interface Role {
	id: number;
	descripcion: string;
}

export interface Row {
	id: number;
	prefijoId: string;
	centroId: string;
	sufijo: string;
	probabilidadId: string;
	impactoId: string;
}

const Page = () => {
	const [matrizData, setMatrizData] = useState<Row[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedRow, setSelectedRow] = useState<Row | undefined>(undefined);
	const [popoverMessage, setPopoverMessage] = useState("");
	const [popoverType, setPopoverType] = useState<"success" | "error">("success");
	const [showPopover, setShowPopover] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch("/api/maestras/tags-matriz-riesgo");
			const result = await response.json();

			console.log(result.values);

			for (let i = 0; i < result.values.length; i++) {
				result.values[i].roles = JSON.parse(result.values[i].roles);
			}

			if (result.success) {
				setMatrizData(result.values);
			}
		};
		fetchData();
	}, []);

	const handleSuccess = async () => {
		const response = await fetch("/api/puestos");
		const result = await response.json();

		for (let i = 0; i < result.values.length; i++) {
			result.values[i].roles = JSON.parse(result.values[i].roles);
		}

		if (result.success) {
			setMatrizData(result.values);
			setPopoverMessage("Puesto guardado correctamente");
			setPopoverType("success");
			setShowPopover(true);
			setTimeout(() => setShowPopover(false), 3000);
		}
	};

	return (
		<div className="space-y-8 p-4">
			<div className="space-y-4">
				<div className="relative flex justify-between items-center">
					<button
						onClick={() => {
							setIsEditing(false);
							setIsModalOpen(true);
						}}
						className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md"
					>
						Añadir Puesto
					</button>
				</div>
				<Table
					//TODO: Cambiar el nombre dle objeto no tiene sentido no es user y no es nombrecompleto
					columns={[
						{ key: "id", label: "Código" },
						{ key: "descripcion", label: "Descripción" },
						{ key: "roles", label: "Roles" },
						{ key: "estado", label: "Estado" },
						{ key: "aprobadorNivel", label: "Nivel de Aprobador" },
					]}
					rows={matrizData.map((puesto) => ({
						...puesto,
						descripcion: puesto.descripcion,
						estado: <span className={`px-2 py-1 rounded-full ${puesto.estado === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{puesto.estado === 1 ? "Activo" : "Inactivo"}</span>,
						roles: puesto.roles ? (
							<div className="flex flex-wrap">
								{Object.values(puesto.roles).map((role, index) => (
									<span key={index} className="px-2 py-1 mr-1 mb-1 rounded-full bg-blue-100 text-blue-800">
										{role.descripcion}
									</span>
								))}
							</div>
						) : (
							<span></span>
						),
						aprobadorNivel: <>{renderNivelAprobador(puesto.aprobadorNivel)}</>, // Renderizar nivelAprobador
					}))}
					onEdit={(id) => {
						const puesto = matrizData.find((puesto) => puesto.id === id);
						setSelectedRow(puesto || undefined);
						setIsEditing(true);
						setIsModalOpen(true);
					}}
					// Eliminar la acción de eliminar
					actions={["edit"]}
				/>
			</div>
			<ModalCreacionPuesto
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedRow(undefined); // Restablecer selectedUser al cerrar
				}}
				isEditing={isEditing}
				puestoData={selectedRow}
				onSuccess={handleSuccess}
			/>
			<Popover message={popoverMessage} type={popoverType} show={showPopover} />
		</div>
	);
};

export default Page;
