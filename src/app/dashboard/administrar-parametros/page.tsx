"use client";
import Table from "@/components/Table";
import Popover from "@/components/Popover";
import React, { useState, useEffect } from "react";
import useUserSession from "@/hooks/useSession";

interface Option {
	id: number;
	descripcion: string;
}

const Page = () => {
	const categories = [
		{ label: "Sub Área (Tag Prefijo)", value: "subarea", needsCode: true },
		{ label: "Activo (Tag Centro)", value: "activo", needsCode: true },
		{ label: "Disciplina", value: "disciplina", needsCode: false },
		{ label: "Proyecto", value: "proyecto", needsCode: false },
		{ label: "Turno", value: "turno", needsCode: false },
		{ label: "Responsable", value: "responsable", needsCode: false },
		{ label: "Elemento de Riesgo", value: "riesgo-a", needsCode: false },
		{ label: "Impacto", value: "impacto", needsCode: false },
		{ label: "Tipo de forzado", value: "tipo-forzado", needsCode: false },
		{ label: "Motivo de Rechazo", value: "motivo-rechazo", needsCode: false },
	];
	const [selectedCategory, setSelectedCategory] = useState("");
	const [data, setData] = useState<Record<string, { id: number; codigo: string; descripcion: string; probabilidad?: string; impacto?: string }[]>>({
		disciplina: [],
		turno: [],
		responsable: [],
		riesgo: [],
		proyecto: [],
		"tipo-forzado": [],
		impacto: [],
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<"create" | "edit">("create");
	const [newRecord, setNewRecord] = useState({ codigo: "", descripcion: "", categoria: "", probabilidad: "", impacto: "" });
	const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
	const [showPopover, setShowPopover] = useState(false);
	const [popoverMessage, setPopoverMessage] = useState("");
	const [popoverType, setPopoverType] = useState<"success" | "error">("success");
	const { user } = useUserSession();
	const [probabilidades, setProbabilidades] = useState<Option[]>([]);
	const [impactos, setImpactos] = useState<Option[]>([]);

	const fetchData = async (category: string) => {
		try {
			const response = await fetch(`/api/maestras/${category}`);
			const result = await response.json();
			// console.log("data fetched for", category, result.values);
			const normalizedData = result.values.map((item: { id: number; codigo?: string; descripcion?: string; nombre?: string; probabilidad?: string; impacto?: string }) => ({
				id: item.id,
				codigo: item.codigo || item.id.toString(),
				descripcion: item.descripcion || item.nombre,
				probabilidad: item.probabilidad || "",
				impacto: item.impacto || "",
			}));
			setData((prevData) => ({
				...prevData,
				[category]: normalizedData,
			}));
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const fetchDataForProbabilities = async (url: string, setState: React.Dispatch<React.SetStateAction<Option[]>>) => {
		try {
			const response = await fetch(url);
			const data = await response.json();

			// console.log(data.values, `data values from ${url}`);

			setState(data.values);
		} catch (error) {
			console.error(`Error fetching data from ${url}:`, error);
		}
	};

	const findObjectById = (id: string, array: Option[]) => {
		return array.find((item) => item.id === parseInt(id));
	};

	useEffect(() => {
		if (selectedCategory) {
			fetchData(selectedCategory);
		}
		if (selectedCategory === "subarea") {
			fetchDataForProbabilities("/api/maestras/probabilidad", setProbabilidades);
			fetchDataForProbabilities("/api/maestras/impacto", setImpactos);
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
					descripcion: newRecord.descripcion.toUpperCase(),
					...(selectedCategoryObject?.needsCode && { codigo: newRecord.codigo.toUpperCase() }),
					probabilidad: Number(newRecord.probabilidad),
					impacto: Number(newRecord.impacto),
					usuario: user?.id,
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
					descripcion: newRecord.descripcion.toUpperCase(),
					...(selectedCategoryObject?.needsCode && { codigo: newRecord.codigo.toUpperCase() }),
					probabilidad: newRecord.probabilidad,
					impacto: newRecord.impacto,
					usuario: user?.id,
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
		setNewRecord({ codigo: "", descripcion: "", categoria: "", probabilidad: "", impacto: "" });
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
				probabilidad: recordToEdit.probabilidad,
				impacto: recordToEdit.impacto,
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
				body: JSON.stringify({ id, usuario: user?.id }),
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
		...(selectedCategory === "subarea" && {
			probabilidad: findObjectById(row.probabilidad, probabilidades)?.descripcion || "-",
			impacto: findObjectById(row.impacto, impactos)?.descripcion || "-",
		}),
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
						setNewRecord({ codigo: "", descripcion: "", categoria: selectedCategory, probabilidad: "", impacto: "" });
					}}
					className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
				>
					Crear nuevo registro
				</button>
			</div>

			{selectedCategory ? (
				<Table
					columns={[
						{ key: "codigo", label: "Código" },
						{ key: "descripcion", label: "Descripción" },
						...(selectedCategory === "subarea"
							? [
									{ key: "probabilidad", label: "Probabilidad" },
									{ key: "impacto", label: "Impacto" },
							  ]
							: []),
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
						{selectedCategory === "subarea" && (
							<div>
								<div className="mb-4">
									<label className="block text-sm font-medium mb-2">Probabilidad</label>
									<select className="w-full p-2 border rounded-lg" value={newRecord.probabilidad} onChange={(e) => setNewRecord({ ...newRecord, probabilidad: e.target.value })}>
										<option value="">Seleccionar opción</option>
										{probabilidades.map((option) => (
											<option key={option.id} value={option.id}>
												{option.descripcion}
											</option>
										))}
									</select>
								</div>
								<div className="mb-4">
									<label className="block text-sm font-medium mb-2">Impacto</label>
									<select className="w-full p-2 border rounded-lg" value={newRecord.impacto} onChange={(e) => setNewRecord({ ...newRecord, impacto: e.target.value })}>
										<option value="">Seleccionar opción</option>
										{impactos.map((option) => (
											<option key={option.id} value={option.id}>
												{option.descripcion}
											</option>
										))}
									</select>
								</div>
							</div>
						)}
						{/* {modalType === "create" && (
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
						)} */}
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
