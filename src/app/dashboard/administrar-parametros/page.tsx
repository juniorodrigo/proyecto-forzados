"use client";
import Table from "@/components/Table";
import React, { useState } from "react";

const Page = () => {
	const categories = ["Disciplina", "Turno", "Responsable", "Riesgo"];
	const [selectedCategory, setSelectedCategory] = useState("");
	const [data, setData] = useState<Record<string, { id: number; codigo: string; descripcion: string }[]>>({
		Disciplina: [],
		Turno: [],
		Responsable: [],
		Riesgo: [],
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<"create" | "edit">("create");
	const [newRecord, setNewRecord] = useState({ codigo: "", descripcion: "", categoria: "" });
	const [editingRecordId, setEditingRecordId] = useState<number | null>(null);

	const handleCreateOrUpdate = () => {
		if (!newRecord.codigo || !newRecord.descripcion || !newRecord.categoria) {
			alert("Por favor, complete todos los campos.");
			return;
		}

		if (modalType === "create") {
			console.log(newRecord.categoria.toLowerCase(), "___________________________");

			// TODO: Evaluar la integridad del nombre de categoría para no vulnerar las apis existentes
			fetch(`/api/maestras/${newRecord.categoria.toLowerCase()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					// codigo: newRecord.codigo,
					descripcion: newRecord.descripcion,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("Success:", data);
				})
				.catch((error) => {
					console.error("Error:", error);
				});

			// XDDDDDDDDDDDDDDDDDDDDDDDDDD
			setData((prevData) => ({
				...prevData,
				[newRecord.categoria]: [...prevData[newRecord.categoria], { id: Math.random(), codigo: newRecord.codigo, descripcion: newRecord.descripcion }],
			}));
		} else if (modalType === "edit" && editingRecordId !== null) {
			setData((prevData) => ({
				...prevData,
				[selectedCategory]: prevData[selectedCategory].map((row) => (row.id === editingRecordId ? { ...row, codigo: newRecord.codigo, descripcion: newRecord.descripcion } : row)),
			}));
		}

		setIsModalOpen(false);
		setNewRecord({ codigo: "", descripcion: "", categoria: "" });
		setEditingRecordId(null);
	};

	const handleEdit = (id: number) => {
		const recordToEdit = data[selectedCategory]?.find((row) => row.id === id);
		if (recordToEdit) {
			setModalType("edit");
			setIsModalOpen(true);
			setNewRecord({
				codigo: recordToEdit.codigo,
				descripcion: recordToEdit.descripcion,
				categoria: selectedCategory,
			});
			setEditingRecordId(id);
		}
	};

	return (
		<div className="p-4">
			<div className="mb-4 flex items-center space-x-4 justify-between">
				<select className="p-2 border rounded-lg w-1/3" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
					<option value="">Seleccionar categoría</option>
					{categories.map((category) => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>

				<button
					onClick={() => {
						setModalType("create");
						setIsModalOpen(true);
						setNewRecord({ codigo: "", descripcion: "", categoria: selectedCategory });
					}}
					className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
				>
					Crear nuevo registro
				</button>
			</div>

			{selectedCategory ? (
				<Table
					columns={[
						{ key: "codigo", label: "Código" },
						{ key: "descripcion", label: "Descripción" },
					]}
					rows={data[selectedCategory] || []}
					onEdit={handleEdit}
					onDelete={(id) =>
						setData((prevData) => ({
							...prevData,
							[selectedCategory]: prevData[selectedCategory].filter((row) => row.id !== id),
						}))
					}
					actions={["edit", "delete"]} // Solo editar y eliminar
				/>
			) : (
				<p className="text-gray-500">Seleccione una categoría para ver sus registros.</p>
			)}

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
						<h2 className="text-lg font-semibold mb-4">{modalType === "create" ? "Crear nuevo registro" : "Editar registro"}</h2>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Código</label>
							<input type="text" className="w-full p-2 border rounded-lg" value={newRecord.codigo} onChange={(e) => setNewRecord({ ...newRecord, codigo: e.target.value })} />
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Descripción</label>
							<input type="text" className="w-full p-2 border rounded-lg" value={newRecord.descripcion} onChange={(e) => setNewRecord({ ...newRecord, descripcion: e.target.value })} />
						</div>
						{modalType === "create" && (
							<div className="mb-4">
								<label className="block text-sm font-medium mb-2">Categoría</label>
								<select className="w-full p-2 border rounded-lg" value={newRecord.categoria} onChange={(e) => setNewRecord({ ...newRecord, categoria: e.target.value })}>
									<option value="">Seleccionar categoría</option>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>
						)}
						<div className="flex justify-end space-x-4">
							<button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
								Cancelar
							</button>
							<button onClick={handleCreateOrUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
								{modalType === "create" ? "Crear" : "Guardar"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Page;
