"use client";
import Table from "@/components/Table";
import Popover from "@/components/Popover";
import React, { useState, useEffect } from "react";

const Page = () => {
	const categories = [
		{ label: "Sub Área (Tag Prefijo)", value: "subarea", needsCode: true },
		{ label: "Activo (Tag Centro)", value: "activo", needsCode: true },
		{ label: "Disciplina", value: "disciplina", needsCode: false },
		{ label: "Turno", value: "turno", needsCode: false },
		{ label: "Responsable", value: "responsable", needsCode: false },
		{ label: "Elemento de Riesgo", value: "riesgo-a", needsCode: false },
		{ label: "Impacto", value: "impacto", needsCode: false },
		{ label: "Tipo de forzado", value: "tipo-forzado", needsCode: false },
	];
	const [selectedCategory, setSelectedCategory] = useState("");
	const [data, setData] = useState<Record<string, { id: number; codigo: string; descripcion: string }[]>>({
		disciplina: [],
		turno: [],
		responsable: [],
		riesgo: [],
		"tipo-forzado": [],
		impacto: [],
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
			const response = await fetch(`/api/maestras/${category}`);
			const result = await response.json();
			console.log("data fetched for", category, result.values);
			const normalizedData = result.values.map((item: { id: number; codigo?: string; descripcion?: string; nombre?: string }) => ({
				id: item.id,
				codigo: item.codigo || item.id.toString(),
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
		if (!newRecord.descripcion || !newRecord.categoria || (selectedCategoryObject?.needsCode && !newRecord.codigo)) {
			alert("Por favor, complete todos los campos.");
			return;
		}

		if (modalType === "create") {
			if (selectedCategoryObject?.needsCode) {
				const existingRecord = data[selectedCategory]?.find((record) => record.codigo === newRecord.codigo);
				if (existingRecord) {
					setPopoverMessage("No puede haber un código duplicado.");
					setPopoverType("error");
					setShowPopover(true);
					setTimeout(() => {
						setShowPopover(false);
					}, 2000);
					return;
				}
			}
			fetch(`/api/maestras/${newRecord.categoria.toLowerCase()}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					descripcion: newRecord.descripcion,
					...(selectedCategoryObject?.needsCode && { codigo: newRecord.codigo }),
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						setPopoverMessage("Registro creado exitosamente.");
						setPopoverType("success");
						fetchData(newRecord.categoria);
					} else {
						setPopoverMessage("Error al crear el registro.");
						setPopoverType("error");
					}
					setShowPopover(true);

					setTimeout(() => {
						setShowPopover(false);
					}, 2000);
				})
				.catch((error) => {
					console.error("Error:", error);
					setPopoverMessage("Error al crear el registro.");
					setPopoverType("error");
					setShowPopover(true);

					// Ocultar el popover después de 2 segundos
					setTimeout(() => {
						setShowPopover(false);
					}, 2000);
				});
		} else if (modalType === "edit" && editingRecordId !== null) {
			fetch(`/api/maestras/${newRecord.categoria.toLowerCase()}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: editingRecordId,
					descripcion: newRecord.descripcion,
					...(selectedCategoryObject?.needsCode && { codigo: newRecord.codigo }),
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						setPopoverMessage("Registro actualizado exitosamente.");
						setPopoverType("success");
						fetchData(newRecord.categoria);
					} else {
						setPopoverMessage("Error al actualizar el registro.");
						setPopoverType("error");
					}
					setShowPopover(true);

					// Ocultar el popover después de 2 segundos
					setTimeout(() => {
						setShowPopover(false);
					}, 2000);
				})
				.catch((error) => {
					console.error("Error:", error);
					setPopoverMessage("Error al actualizar el registro.");
					setPopoverType("error");
					setShowPopover(true);
					// Ocultar el popover después de 2 segundos
					setTimeout(() => {
						setShowPopover(false);
					}, 2000);
				});
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
			setShowPopover(true);

			// Ocultar el popover después de 2 segundos
			setTimeout(() => {
				setShowPopover(false);
			}, 2000);
		} catch (error) {
			console.error("Error deleting record:", error);
			setPopoverMessage("Error al eliminar el registro.");
			setPopoverType("error");
			setShowPopover(true);

			// Ocultar el popover después de 2 segundos
			setTimeout(() => {
				setShowPopover(false);
			}, 2000);
		}
	};

	const selectedCategoryObject = categories.find((category) => category.value === selectedCategory);

	const tableRows = (data[selectedCategory] || []).map((row) => ({
		...row,
		codigo: selectedCategoryObject?.needsCode ? row.codigo : row.id,
	}));

	return (
		<div className="p-4">
			<div className="mb-4 flex items-center space-x-4 justify-between">
				<select className="p-2 border rounded-lg w-1/3" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
					<option value="">Seleccionar categoría</option>
					{categories.map((category) => (
						<option key={category.value} value={category.value}>
							{category.label}
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
					rows={tableRows}
					onEdit={handleEdit}
					onDelete={handleDelete}
					actions={["edit", "delete"]}
				/>
			) : (
				<p className="text-gray-500">Seleccione una categoría para ver sus registros.</p>
			)}

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
						<h2 className="text-lg font-semibold mb-4">{modalType === "create" ? "Crear nuevo registro" : "Editar registro"}</h2>
						{selectedCategoryObject?.needsCode && (
							<div className="mb-4">
								<label className="block text-sm font-medium mb-2">Código</label>
								<input type="text" className="w-full p-2 border rounded-lg" value={newRecord.codigo} onChange={(e) => setNewRecord({ ...newRecord, codigo: e.target.value })} />
							</div>
						)}
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
										<option key={category.value} value={category.value}>
											{category.label}
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

			{showPopover && <Popover message={popoverMessage} type={popoverType} show={showPopover} />}
		</div>
	);
};

export default Page;
