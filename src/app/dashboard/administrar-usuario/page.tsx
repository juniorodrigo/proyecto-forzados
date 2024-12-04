"use client";
import Table from "@/components/Table";
import React, { useState, useMemo } from "react";
import ModalCreacionUsuario from "@/components/ModalCreacionUsuario";

const Page = () => {
	const userData = useMemo(
		() => [
			{ id: 1, usuario: "Juan Pérez" },
			{ id: 2, usuario: "María López" },
			{ id: 3, usuario: "Carlos García" },
			{ id: 4, usuario: "Ana Torres" },
		],
		[]
	);

	const [userSearch, setUserSearch] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false); // Nuevo estado

	const filteredUsers = useMemo(() => userData.filter((row) => row.usuario.toLowerCase().includes(userSearch.toLowerCase())), [userSearch, userData]);

	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<label className="block text-sm font-medium text-gray-700">Filtrar por Usuario</label>
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
						{ key: "usuario", label: "Usuario" },
						{ key: "rol", label: "Rol" },
						{ key: "area", label: "Area" },
						{ key: "estado", label: "Estado" },
					]}
					rows={filteredUsers}
					onEdit={(id) => {
						setIsEditing(true);
						setIsModalOpen(true);
					}}
					onDelete={(id) => alert(`Eliminando usuario ${id}`)}
					actions={["edit", "delete"]}
				/>
			</div>
			<ModalCreacionUsuario isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isEditing={isEditing} />
		</div>
	);
};

export default Page;
