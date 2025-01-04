import React, { useState, useEffect } from "react";
import Popover from "./Popover"; // Importar Popover
import { Puesto } from "../app/dashboard/administrar-puestos/page";
import useUserSession from "@/hooks/useSession";

type ModalCreacionPuestoProps = {
	isOpen: boolean;
	onClose: () => void;
	isEditing: boolean;
	puestoData?: Puesto;
	onSuccess: () => void;
};

const ModalCreacionPuesto: React.FC<ModalCreacionPuestoProps> = ({ isOpen, onClose, isEditing, puestoData, onSuccess }) => {
	const [roles, setRoles] = useState<{ id: number; descripcion: string }[]>([]);
	const [formData, setFormData] = useState<Puesto>({
		id: 0,
		descripcion: "",
		estado: 1,
		roles: {} as { [key: string]: { id: number; descripcion: string } }, // Cambiar el tipo de roles
	});
	const [popoverMessage, setPopoverMessage] = useState("");
	const [popoverType, setPopoverType] = useState<"success" | "error">("success");
	const [showPopover, setShowPopover] = useState(false);
	const { user } = useUserSession();

	const resetForm = () => {
		setFormData({
			id: 0,
			descripcion: "",
			estado: 1,
			roles: {},
		});
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const hasRole = (roleId: number) => {
		return formData.roles.hasOwnProperty(roleId);
	};

	useEffect(() => {
		const fetchRoles = async () => {
			const response = await fetch("/api/maestras/rol");
			const data = await response.json();
			setRoles(data.values);
		};

		fetchRoles();
	}, []);

	useEffect(() => {
		if (isEditing && puestoData) {
			setFormData({
				id: puestoData.id || 0,
				descripcion: puestoData.descripcion || "",
				estado: puestoData.estado || 1,
				roles: puestoData.roles || {},
			});
		} else {
			resetForm();
		}
	}, [isEditing, puestoData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleRoleChange = (roleId: number) => {
		setFormData((prevFormData) => {
			const updatedRoles = { ...prevFormData.roles };
			if (hasRole(roleId)) {
				delete updatedRoles[roleId];
			} else {
				updatedRoles[roleId] = roles.find((rol) => rol.id === roleId) || { id: roleId, descripcion: "" };
			}
			return { ...prevFormData, roles: updatedRoles };
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const method = isEditing ? "PUT" : "POST";
		const url = "/api/puestos";
		const dataToSend = {
			...formData,
			id: formData.id,
			estado: formData.estado === 1 ? 1 : 0,
			usuarioId: formData.id,
			usuarioCreacion: user?.id,
			usuarioModificacion: user?.id,
		};

		console.log(dataToSend, "____________________SENDDDDDDDDDDINGGGGGGG");
		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(dataToSend),
		});
		const result = await response.json();
		if (response.ok) {
			setPopoverMessage("Operación exitosa");
			setPopoverType("success");
			setShowPopover(true);
			onSuccess();
		} else {
			setPopoverMessage(result.message || "Error en la operación");
			setPopoverType("error");
			setShowPopover(true);
		}
		setTimeout(() => setShowPopover(false), 3000);
		resetForm();
		onClose();
	};

	const isFormValid = formData.descripcion && formData.estado;

	if (!isOpen) return null;

	return (
		<>
			{/* Mostrar Popover si showPopover es true */}
			<div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose}></div>
			<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
					<div className="p-8 relative">
						<button title="Close" className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none" onClick={handleClose}>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
						<h2 className="text-2xl font-bold mb-4">{isEditing ? "Modificación" : "Creación"}</h2>
						<form onSubmit={handleSubmit}>
							<label className="block text-sm font-medium text-gray-700">Descripción</label>
							<input
								type="text"
								name="descripcion"
								value={formData.descripcion}
								onChange={handleChange}
								placeholder="Descripción"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4"
							/>
							<label className="block text-sm font-medium text-gray-700">Estado</label>
							<select name="estado" value={formData.estado} onChange={handleChange} className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 mb-4">
								<option value="activo">Activo</option>
								<option value="inactivo">Inactivo</option>
							</select>
							<label className="block text-sm font-medium text-gray-700">Roles</label>
							<div className="mb-4 grid grid-cols-2 gap-4">
								{roles.map((rol) => (
									<div key={rol.id} className="flex items-center mb-2">
										<input
											type="checkbox"
											id={`${rol.id}`}
											checked={hasRole(rol.id)}
											onChange={() => handleRoleChange(rol.id)}
											className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										/>
										<label htmlFor={`${rol.id}`} className="text-sm font-medium text-gray-700">
											{rol.descripcion}
										</label>
									</div>
								))}
							</div>
							<div className="flex justify-between mt-4">
								<button type="submit" className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${isFormValid ? "bg-blue-500" : "bg-gray-500"} text-white`} disabled={!isFormValid}>
									Guardar
								</button>
								<button type="button" onClick={handleClose} className="px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
									Cerrar
								</button>
							</div>
						</form>
					</div>
				</div>
				<Popover message={popoverMessage} type={popoverType} show={showPopover} />
			</div>
		</>
	);
};

export default ModalCreacionPuesto;
