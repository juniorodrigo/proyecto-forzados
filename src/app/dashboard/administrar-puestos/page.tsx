"use client";
import Table from "@/components/Table";
import React, { useState, useMemo, useEffect } from "react";
import ModalCreacionPuesto from "@/components/ModalCreacionPuesto";

export interface Role {
	id: number;
	descripcion: string;
}

export interface Puesto {
	id: number;
	descripcion: string;
	estado: number;
	roles: { [key: string]: Role };
}

const Page = () => {
	const [puestosData, setPuestosData] = useState<Puesto[]>([]);
	const [puestoSearch, setPuestoSearch] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedPuesto, setSelectedPuesto] = useState<Puesto | undefined>(undefined);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch("/api/puestos");
			const result = await response.json();
			for (let i = 0; i < result.values.length; i++) {
				result.values[i].roles = JSON.parse(result.values[i].roles);
			}

			if (result.success) {
				setPuestosData(result.values);
			}
		};
		fetchData();
	}, []);

	const filteredPuestos = useMemo(() => puestosData.filter((row) => row.descripcion.toLowerCase().includes(puestoSearch.toLowerCase())), [puestoSearch, puestosData]);

	const handleSuccess = async () => {
		const response = await fetch("/api/puestos");
		const result = await response.json();

		for (let i = 0; i < result.values.length; i++) {
			result.values[i].roles = JSON.parse(result.values[i].roles);
		}

		if (result.success) {
			setPuestosData(result.values);
		}
	};

	return (
		<div className="space-y-8">
			<div className="space-y-4">
				
				<div className="relative flex justify-between items-center">
					<input
						type="text"
						value={puestoSearch}
						onChange={(e) => setPuestoSearch(e.target.value)}
						className="w-1/3 border border-gray-300 rounded-lg shadow-sm py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Buscar puesto..."
					/>
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
					]}
					rows={filteredPuestos.map((puesto) => ({
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
					}))}
					onEdit={(id) => {
						const puesto = puestosData.find((puesto) => puesto.id === id);
						setSelectedPuesto(puesto || undefined);
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
					setSelectedPuesto(undefined); // Restablecer selectedUser al cerrar
				}}
				isEditing={isEditing}
				puestoData={selectedPuesto}
				onSuccess={handleSuccess}
			/>
		</div>
	);
};

export default Page;
