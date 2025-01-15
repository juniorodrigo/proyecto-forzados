"use client";
import Table from "@/components/Table";
import React, { useState, useEffect } from "react";
import Popover from "@/components/Popover";

export interface Role {
	id: number;
	descripcion: string;
}

interface Option {
	id: number;
	descripcion: string;
}

export interface Row {
	id: number;
	prefijoId: number;
	centroId: number;
	sufijo: string;
	probabilidadId: number;
	impactoId: number;
}

const Page = () => {
	const [matrizData, setMatrizData] = useState<Row[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedRow, setSelectedRow] = useState<Row | undefined>(undefined);
	const [popoverMessage, setPopoverMessage] = useState("");
	const [popoverType, setPopoverType] = useState<"success" | "error">("success");
	const [showPopover, setShowPopover] = useState(false);
	const [modalType, setModalType] = useState<"create" | "edit">("create");
	const [newRecord, setNewRecord] = useState<Row>();

	const [tagPrefijos, setTagPrefijos] = useState<Option[]>([]);
	const [tagCentros, setTagCentros] = useState<Option[]>([]);
	const [probabilidades, setProbabilidades] = useState<Option[]>([]);
	const [impactos, setImpactos] = useState<Option[]>([]);

	useEffect(() => {
		const fetchParameters = async (url: string, setState: React.Dispatch<React.SetStateAction<Option[]>>) => {
			try {
				const response = await fetch(url);
				const data = await response.json();
				setState(data.values);
			} catch (error) {
				console.error(`Error fetching data from ${url}:`, error);
			}
		};

		const fetchData = async () => {
			const response = await fetch("/api/maestras/tags-matriz-riesgo");
			const result = await response.json();

			setMatrizData(result.values);

			// for (const singleRow of result.values) {
			// 	singleRow.values[singleRow.id] = JSON.parse(result.values[i].roles);
			// }

			// if (result.success) {
			// 	setMatrizData(result.values);
			// }
		};
		fetchData();

		fetchParameters("/api/maestras/subarea", setTagPrefijos);
		fetchParameters("/api/maestras/activo", setTagCentros);
		fetchParameters("/api/maestras/probabilidad", setProbabilidades);
		fetchParameters("/api/maestras/impacto", setImpactos);
	}, []);

	const getDescriptionById = (id: number, options: Option[]): string => {
		const option = options.find((opt) => opt.id === id);
		return option ? option.descripcion : "N/A";
	};

	const handleCreateOrUpdate = async () => {
		if (!newRecord.prefijoId || !newRecord.centroId || !newRecord.sufijo || !newRecord.probabilidadId || !newRecord.impactoId) {
			setPopoverMessage("Por favor, complete todos los campos.");
			setPopoverType("error");
			setShowPopover(true);
			setTimeout(() => setShowPopover(false), 3000);
			return;
		}

		const fetchData = async () => {
			const response = await fetch("/api/maestras/tags-matriz-riesgo");
			const result = await response.json();
			setMatrizData(result.values);
		};

		if (isEditing) {
			try {
				const response = await fetch(`/api/maestras/tags-matriz-riesgo`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newRecord),
				});
				const result = await response.json();
				if (result.success) {
					await fetchData();
					setPopoverMessage("Registro actualizado correctamente");
					setPopoverType("success");
				} else {
					setPopoverMessage("Error al actualizar el registro");
					setPopoverType("error");
				}
			} catch (error) {
				console.error("Error updating record:", error);
				setPopoverMessage("Error al actualizar el registro");
				setPopoverType("error");
			}
		} else {
			try {
				const response = await fetch("/api/maestras/tags-matriz-riesgo", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newRecord),
				});
				const result = await response.json();
				if (result.success) {
					await fetchData();
					setPopoverMessage("Registro creado correctamente");
					setPopoverType("success");
				} else {
					setPopoverMessage("Error al crear el registro");
					setPopoverType("error");
				}
			} catch (error) {
				console.error("Error creating record:", error);
				setPopoverMessage("Error al crear el registro");
				setPopoverType("error");
			}
		}
		setShowPopover(true);
		setTimeout(() => setShowPopover(false), 3000);
		setIsModalOpen(false);
	};

	return (
		<div className="space-y-8 p-4">
			<div className="space-y-4">
				<div className="relative flex justify-between items-center">
					<button
						onClick={() => {
							setIsEditing(false);
							setIsModalOpen(true);
							setNewRecord({ id: 0, prefijoId: 0, centroId: 0, sufijo: "", probabilidadId: 0, impactoId: 0 });
						}}
						className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md"
					>
						Añadir Registro
					</button>
				</div>
				<Table
					//TODO: Cambiar el nombre dle objeto no tiene sentido no es user y no es nombrecompleto
					columns={[
						{ key: "id", label: "Código" },
						{ key: "prefijo", label: "Prefijo" },
						{ key: "centro", label: "Centro" },
						{ key: "sufijo", label: "Sufijo" },
						{ key: "probabilidad", label: "Probabilidad" },
						{ key: "impacto", label: "Impacto" },
					]}
					rows={matrizData.map((rowx) => ({
						...rowx,
						prefijo: getDescriptionById(rowx.prefijoId, tagPrefijos),
						centro: getDescriptionById(rowx.centroId, tagCentros),
						probabilidad: getDescriptionById(rowx.probabilidadId, probabilidades),
						impacto: getDescriptionById(rowx.impactoId, impactos),
					}))}
					onEdit={(id) => {
						const puesto = matrizData.find((rowx) => rowx.id === id);
						setSelectedRow(puesto || undefined);
						setIsEditing(true);
						setIsModalOpen(true);
						setNewRecord(puesto);
					}}
					// Eliminar la acción de eliminar
					actions={["edit"]}
				/>
			</div>
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
						<h2 className="text-lg font-semibold mb-4">{isEditing ? "Editar registro" : "Crear nuevo registro"}</h2>

						<div>
							<div className="mb-4">
								<label className="block text-sm font-medium mb-2">Prefijo (sub área)</label>
								<select className="w-full p-2 border rounded-lg" value={newRecord.prefijoId} onChange={(e) => setNewRecord({ ...newRecord, prefijoId: Number(e.target.value) })}>
									<option value="">Seleccionar opción</option>
									{tagPrefijos.map((option) => (
										<option key={option.id} value={option.id}>
											{option.descripcion}
										</option>
									))}
								</select>
							</div>
							<div className="mb-4">
								<label className="block text-sm font-medium mb-2">Tag Centro (activo)</label>
								<select className="w-full p-2 border rounded-lg" value={newRecord.centroId} onChange={(e) => setNewRecord({ ...newRecord, centroId: Number(e.target.value) })}>
									<option value="">Seleccionar opción</option>
									{tagCentros.map((option) => (
										<option key={option.id} value={option.id}>
											{option.descripcion}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Tag Sufijo</label>
							<input type="text" className="w-full p-2 border rounded-lg" value={newRecord.sufijo} onChange={(e) => setNewRecord({ ...newRecord, sufijo: e.target.value })} />
						</div>

						<div>
							<div className="mb-4">
								<label className="block text-sm font-medium mb-2">Probabilidad</label>
								<select className="w-full p-2 border rounded-lg" value={newRecord.probabilidadId} onChange={(e) => setNewRecord({ ...newRecord, probabilidadId: Number(e.target.value) })}>
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
								<select className="w-full p-2 border rounded-lg" value={newRecord.impactoId} onChange={(e) => setNewRecord({ ...newRecord, impactoId: Number(e.target.value) })}>
									<option value="">Seleccionar opción</option>
									{impactos.map((option) => (
										<option key={option.id} value={option.id}>
											{option.descripcion}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="flex justify-end space-x-4">
							<button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
								Cancelar
							</button>
							<button onClick={handleCreateOrUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
								{isEditing ? "Guardar cambios" : "Crear"}
							</button>
						</div>
					</div>
				</div>
			)}
			<Popover message={popoverMessage} type={popoverType} show={showPopover} />
		</div>
	);
};

export default Page;
