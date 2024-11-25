"use client";
import Table from "@/components/Table";
import React, { useState, useEffect } from "react";

const Page = () => {
	const categories = ["Disciplina", "Turno", "Responsable", "Riesgo-a", "Tipo-forzado", "Impacto"];
	const [selectedCategory, setSelectedCategory] = useState("");
	const [data, setData] = useState<Record<string, { id: number; codigo: string; descripcion: string }[]>>({
		Disciplina: [],
		Turno: [],
		Responsable: [],
		Riesgo: [],
		"Tipo-forzado": [],
		Impacto: [],
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<"create" | "edit">("create");
	const [newRecord, setNewRecord] = useState({ codigo: "", descripcion: "", categoria: "" });
	const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
	const [showPopover, setShowPopover] = useState(false);
	const [popoverMessage, setPopoverMessage] = useState("");
	const [popoverType, setPopoverType] = useState<"success" | "error">("success");

	const fetchData = async (category: string) => {
		try {
			const response = await fetch(`/api/maestras/${category.toLowerCase()}`);
			const result = await response.json();
			const normalizedData = result.values.map((item: { id: number; descripcion?: string; nombre?: string }) => ({
				id: item.id,
				codigo: item.id.toString(),
				descripcion: item.descripcion || item.nombre,
			}));
			setData((prevData) => ({
				...prevData,
				[category]: normalizedData,
			}));
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		if (selectedCategory) {
			fetchData(selectedCategory);
		}
	}, [selectedCategory]);

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
					if (data.success) {
						setPopoverMessage("Registro creado exitosamente.");
						setPopoverType("success");
						fetchData(newRecord.categoria); // Recargar datos desde el API
					} else {
						setPopoverMessage("Error al crear el registro.");
						setPopoverType("error");
					}
					setShowPopover(true); // Mostrar el popover

					// Ocultar el popover después de 2 segundos
					setTimeout(() => {
						setShowPopover(false);
					}, 2000);
				})
				.catch((error) => {
					console.error("Error:", error);
					setPopoverMessage("Error al crear el registro.");
					setPopoverType("error");
					setShowPopover(true); // Mostrar el popover

					// Ocultar el popover después de 2 segundos
					setTimeout(() => {
						setShowPopover(false);
					}, 2000);
				});
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

	const handleDelete = async (id: number) => {
		try {
			const response = await fetch(`/api/maestras/${selectedCategory.toLowerCase()}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id }),
			});
			const data = await response.json();
			if (data.success) {
				setData((prevData) => ({
					...prevData,
					[selectedCategory]: prevData[selectedCategory].filter((row) => row.id !== id),
				}));
				setPopoverMessage("Registro eliminado exitosamente.");
				setPopoverType("success");
			} else {
				setPopoverMessage("Error al eliminar el registro.");
				setPopoverType("error");
			}
			setShowPopover(true); // Mostrar el popover

			// Ocultar el popover después de 2 segundos
			setTimeout(() => {
				setShowPopover(false);
			}, 2000);
		} catch (error) {
			console.error("Error deleting record:", error);
			setPopoverMessage("Error al eliminar el registro.");
			setPopoverType("error");
			setShowPopover(true); // Mostrar el popover

			// Ocultar el popover después de 2 segundos
			setTimeout(() => {
				setShowPopover(false);
			}, 2000);
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
					onDelete={handleDelete}
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

			{showPopover && (
				<div
					className={`fixed top-10 left-1/2 transform -translate-x-1/2 transition-transform ${popoverType === "success" ? "bg-green-500" : "bg-red-500"}`}
					style={{
						transition: "transform 0.5s ease-out",
					}}
				>
					<div className="text-white text-center py-2 px-4 rounded-lg shadow-lg">{popoverMessage}</div>
				</div>
			)}
		</div>
	);
};

export default Page;
