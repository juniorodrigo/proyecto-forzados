"use client";
import Table from "@/components/Table";
import React, { useState, useMemo, useEffect } from "react";
import ModalCreacionUsuario from "@/components/ModalCreacionUsuario";
import Popover from "@/components/Popover";
import useUserSession from "@/hooks/useSession";

const Page = () => {
	interface User {
		id: number;
		nombre: string;
		apePaterno: string;
		apeMaterno: string;
		areaId: string; // Cambiar a string
		areaDescripcion: string;
		rolId: string; // Cambiar a string
		rolDescripcion: string;
		estado: number;
		dni: string;
		puestoId: string; // Cambiar a string
		puestoDescripcion: string;
		correo: string;
		usuario: string;
		[key: string]: string | number;
	}

	const [userData, setUserData] = useState<User[]>([]);
	const [userSearch, setUserSearch] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [popoverMessage, setPopoverMessage] = useState("");
	const [popoverType, setPopoverType] = useState<"success" | "error">("success");
	const [showPopover, setShowPopover] = useState(false);
	const { user } = useUserSession();

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch("/api/usuarios");
			const result = await response.json();
			if (result.success) {
				setUserData(result.values);
			}
		};
		fetchData();
	}, []);

	const filteredUsers = useMemo(() => userData.filter((row) => row.usuario.toLowerCase().includes(userSearch.toLowerCase())), [userSearch, userData]);

	const handleUserSubmit = async (formData: any, isEditing: boolean) => {
		const method = isEditing ? "PUT" : "POST";
		const url = "/api/usuarios";
		const dataToSend = {
			...formData,
			estado: formData.estado === "activo" ? 1 : 0,
			usuarioId: formData.id,
			usuarioCreacion: user?.id,
			usuarioModificacion: user?.id,
		};
		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(dataToSend),
		});
		const result = await response.json();
		if (response.ok) {
			setIsModalOpen(false);
			setPopoverMessage("Usuario guardado correctamente");
			setPopoverType("success");
			setShowPopover(true);
			// Refrescar los datos de la tabla
			const fetchData = async () => {
				const response = await fetch("/api/usuarios");
				const result = await response.json();
				if (result.success) {
					setUserData(result.values);
				}
			};
			fetchData();
		} else {
			setPopoverMessage(result.message || "Error en la operación");
			setPopoverType("error");
			setShowPopover(true);
		}
		setTimeout(() => setShowPopover(false), 3000);
		setSelectedUser(null); // Restablecer selectedUser después de enviar
	};

	return (
		<div className="space-y-8 p-4">
			<div className="space-y-4">
				<div className="relative flex justify-between items-center">
					<input
						type="text"
						value={userSearch}
						onChange={(e) => setUserSearch(e.target.value)}
						className="w-1/2 border border-gray-300 rounded-lg shadow-sm py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Buscar usuario..."
					/>
					<button
						onClick={() => {
							setIsEditing(false);
							setIsModalOpen(true);
						}}
						className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md"
					>
						Añadir Usuario
					</button>
				</div>
				<Table
					columns={[
						{ key: "id", label: "Código" },
						{ key: "nombreCompleto", label: "Nombre Completo" },
						{ key: "puestoDescripcion", label: "Puesto" },
						{ key: "areaDescripcion", label: "Area" },
						{ key: "estado", label: "Estado" },
					]}
					rows={filteredUsers.map((user) => ({
						...user,
						nombreCompleto: `${user.nombre} ${user.apePaterno} ${user.apeMaterno}`,
						estado: <span className={`px-2 py-1 rounded-full ${user.estado === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{user.estado === 1 ? "Activo" : "Inactivo"}</span>,
					}))}
					onEdit={(id) => {
						const user = userData.find((user) => user.id === id);
						setSelectedUser(user || null);
						setIsEditing(true);
						setIsModalOpen(true);
					}}
					// Eliminar la acción de eliminar
					actions={["edit"]}
				/>
			</div>
			<ModalCreacionUsuario
				isOpen={isModalOpen}
				onClose={() => {
					setSelectedUser(null); // Restablecer selectedUser al cerrar
					setIsModalOpen(false);
				}}
				isEditing={isEditing}
				userData={selectedUser}
				onSubmit={handleUserSubmit}
			/>
			<Popover message={popoverMessage} type={popoverType} show={showPopover} />
		</div>
	);
};

export default Page;
