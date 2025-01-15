import React, { useState, useEffect } from "react";
import Popover from "./Popover"; // Importar Popover
import useUserSession from "@/hooks/useSession";

type UserData = {
	id: number; // Cambiar usuarioId a id
	areaId: string;
	usuario: string;
	nombre: string;
	apePaterno: string;
	apeMaterno: string;
	dni: string;
	correo: string;
	rolId: string;
	estado: number;
	puestoId: string;
};

type ModalCreacionUsuarioProps = {
	isOpen: boolean;
	onClose: () => void;
	isEditing: boolean;
	userData?: UserData;
	onSubmit: (formData: any, isEditing: boolean) => void;
};

const ModalCreacionUsuario: React.FC<ModalCreacionUsuarioProps> = ({ isOpen, onClose, isEditing, userData, onSubmit }) => {
	const [areas, setAreas] = useState<{ id: string; descripcion: string }[]>([]);
	const [puestos, setPuestos] = useState<{ id: string; descripcion: string }[]>([]);
	const [, setRoles] = useState<{ id: string; descripcion: string }[]>([]);
	const { user } = useUserSession();

	const [formData, setFormData] = useState<{
		areaId: string;
		usuario: string;
		nombre: string;
		apePaterno: string;
		apeMaterno: string;
		dni: string;
		correo: string;
		rolId: string;
		estado: string;
		puestoId: string;
		id?: number;
	}>({
		areaId: "",
		usuario: "",
		nombre: "",
		apePaterno: "",
		apeMaterno: "",
		dni: "",
		correo: "",
		rolId: "",
		estado: "activo",
		puestoId: "",
		id: undefined,
	});

	const resetForm = () => {
		setFormData({
			areaId: "",
			usuario: "",
			nombre: "",
			apePaterno: "",
			apeMaterno: "",
			dni: "",
			correo: "",
			rolId: "",
			estado: "activo",
			puestoId: "",
			id: undefined,
		});
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	useEffect(() => {
		const fetchAreas = async () => {
			const response = await fetch("/api/maestras/area");
			const data = await response.json();
			setAreas(data.values);
		};

		const fetchPuestos = async () => {
			const response = await fetch("/api/maestras/puesto");
			const data = await response.json();
			setPuestos(data.values);
		};

		const fetchRoles = async () => {
			const response = await fetch("/api/maestras/rol");
			const data = await response.json();
			setRoles(data.values);
		};

		fetchAreas();
		fetchPuestos();
		fetchRoles();
	}, []);

	useEffect(() => {
		if (isEditing && userData) {
			// Asegurarse de que userData existe
			setFormData({
				areaId: userData.areaId || "",
				usuario: userData.usuario || "",
				nombre: userData.nombre || "",
				apePaterno: userData.apePaterno || "",
				apeMaterno: userData.apeMaterno || "",
				dni: userData.dni || "",
				correo: userData.correo || "",
				rolId: userData.rolId || "",
				estado: userData.estado === 1 ? "activo" : "inactivo",
				puestoId: userData.puestoId || "",
				id: userData.id,
			});
		} else {
			setFormData({
				areaId: "",
				usuario: "",
				nombre: "",
				apePaterno: "",
				apeMaterno: "",
				dni: "",
				correo: "",
				rolId: "",
				estado: "activo",
				puestoId: "",
				id: undefined,
			});
		}
	}, [isEditing, userData]);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isModified, setIsModified] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setIsModified(true);
	};

	const [showPopover, setShowPopover] = useState(false);
	const [popoverMessage, setPopoverMessage] = useState("");
	const [popoverType, setPopoverType] = useState<"error" | "success">("error");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true); // Deshabilitar el botón de guardar

		if (formData.usuario.length < 5 || formData.usuario.length > 20) {
			setPopoverMessage("El nombre de usuario debe tener entre 5 y 20 caracteres.");
			setPopoverType("error");
			setShowPopover(true);
			setTimeout(() => setShowPopover(false), 3000);
			setIsSubmitting(false); // Habilitar el botón de guardar
			return;
		}

		const response = await fetch("/api/usuarios/usuario-existe", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username: formData.usuario, userId: formData.id, mail: formData.correo }),
		});

		const data = await response.json();

		if (data.exists) {
			setPopoverMessage(data.message);
			setPopoverType("error");
			setShowPopover(true);
			setTimeout(() => setShowPopover(false), 3000);
			setIsSubmitting(false); // Habilitar el botón de guardar
			return;
		}

		onSubmit(formData, isEditing);
		resetForm();
		setIsSubmitting(false); // Habilitar el botón de guardar
	};

	const handleResetPassword = async () => {
		const response = await fetch("/api/usuarios/reiniciar-contrasena", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: formData.id, usuario: user?.id }),
		});
		const data = await response.json();
		if (data.success) {
			setPopoverMessage("Contraseña reiniciada con éxito");
			setPopoverType("success");
			setShowPopover(true);
			setTimeout(() => setShowPopover(false), 3000);
		}
	};

	const isFormValid = Boolean(
		formData.areaId && formData.usuario && formData.nombre && formData.apePaterno && formData.apeMaterno && formData.dni && formData.correo && formData.estado && formData.puestoId && isModified
	);

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
							{isEditing && (
								<button type="button" onClick={handleResetPassword} className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded-md text-lg focus:outline-none focus:ring-0">
									Reiniciar Contraseña
								</button>
							)}
							<label className="block text-sm font-medium text-gray-700">Área</label>
							<select name="areaId" value={formData.areaId} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4">
								<option value="">Seleccione un área</option>
								{areas.map((area) => (
									<option key={area.id} value={area.id}>
										{area.descripcion}
									</option>
								))}
							</select>
							<label className="block text-sm font-medium text-gray-700">Usuario</label>
							<input
								type="text"
								name="usuario"
								value={formData.usuario}
								onChange={handleChange}
								placeholder="Usuario"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4"
							/>
							<label className="block text-sm font-medium text-gray-700">Nombre</label>
							<input
								type="text"
								name="nombre"
								value={formData.nombre}
								onChange={handleChange}
								placeholder="Nombre"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4"
							/>
							<label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
							<input
								type="text"
								name="apePaterno"
								value={formData.apePaterno}
								onChange={handleChange}
								placeholder="Apellido Paterno"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4"
							/>
							<label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
							<input
								type="text"
								name="apeMaterno"
								value={formData.apeMaterno}
								onChange={handleChange}
								placeholder="Apellido Materno"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4"
							/>
							<label className="block text-sm font-medium text-gray-700">DNI</label>
							<input
								type="text"
								name="dni"
								value={formData.dni}
								onChange={handleChange}
								placeholder="DNI"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4"
								pattern="\d*"
								maxLength={8} // Limitar a 8 caracteres
								onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))}
							/>
							<label className="block text-sm font-medium text-gray-700">Correo</label>
							<input
								type="email"
								name="correo"
								value={formData.correo}
								onChange={handleChange}
								placeholder="Correo"
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4"
							/>
							{/* <label className="block text-sm font-medium text-gray-700">Rol</label>
							<select name="rolId" value={formData.rolId} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4">
								<option value="">Seleccione un rol</option>
								{roles.map((rol) => (
									<option key={rol.id} value={rol.id}>
										{rol.descripcion}
									</option>
								))}
							</select> */}
							<label className="block text-sm font-medium text-gray-700">Estado</label>
							<select name="estado" value={formData.estado} onChange={handleChange} className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 mb-4">
								<option value="activo">Activo</option>
								<option value="inactivo">Inactivo</option>
							</select>
							<label className="block text-sm font-medium text-gray-700">Puesto</label>
							<select name="puestoId" value={formData.puestoId} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4">
								<option value="">Seleccione un puesto</option>
								{puestos.map((puesto) => (
									<option key={puesto.id} value={puesto.id}>
										{puesto.descripcion}
									</option>
								))}
							</select>
							<div className="flex justify-between mt-4">
								<button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
									Cerrar
								</button>
								<button
									type="submit"
									className={`px-4  rounded-md focus:outline-none focus:ring-2 ${isFormValid && !isSubmitting ? "bg-blue-500" : "bg-gray-500"} text-white`}
									disabled={!isFormValid || isSubmitting}
								>
									Guardar
								</button>
							</div>
						</form>
					</div>
				</div>
				{showPopover && <Popover message={popoverMessage} type={popoverType} show={showPopover} />}
			</div>
		</>
	);
};

export default ModalCreacionUsuario;
