import React, { useState, useEffect } from "react";

type ModalCreacionUsuarioProps = {
	isOpen: boolean;
	onClose: () => void;
	isEditing: boolean; // Nueva prop
};

const ModalCreacionUsuario: React.FC<ModalCreacionUsuarioProps> = ({ isOpen, onClose, isEditing }) => {
	const [areas, setAreas] = useState<{ id: string; descripcion: string }[]>([]);
	const [puestos, setPuestos] = useState<{ id: string; descripcion: string }[]>([]);
	const [formData, setFormData] = useState({
		area: "",
		usuario: "",
		nombre: "",
		apellidoPaterno: "",
		apellidoMaterno: "",
		dni: "",
		correo: "",
		rol: "",
		estado: "activo",
		puesto: "",
	});

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

		fetchAreas();
		fetchPuestos();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		onClose(); // Cerrar el modal después de enviar el formulario
	};

	const handleResetPassword = async () => {
		// Llamar a la API para reiniciar la contraseña
		await fetch("/api/reset-password", {
			method: "POST",
			body: JSON.stringify({ usuario: formData.usuario }),
		});
	};

	if (!isOpen) return null;

	return (
		<>
			<div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
			<div className="fixed inset-0 flex items-center justify-center z-50">
				<div className="bg-white p-8 rounded-lg shadow-lg relative max-w-lg mx-auto">
					<button title="Close" className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none" onClick={onClose}>
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
						<select name="area" value={formData.area} onChange={handleChange} className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0">
							<option value="">Seleccione un área</option>
							{areas.map((area) => (
								<option key={area.id} value={area.id}>
									{area.descripcion}
								</option>
							))}
						</select>
						<input
							type="text"
							name="usuario"
							value={formData.usuario}
							onChange={handleChange}
							placeholder="Usuario"
							className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0 mt-4"
						/>
						<input
							type="text"
							name="nombre"
							value={formData.nombre}
							onChange={handleChange}
							placeholder="Nombre"
							className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0 mt-4"
						/>
						<input
							type="text"
							name="apellidoPaterno"
							value={formData.apellidoPaterno}
							onChange={handleChange}
							placeholder="Apellido Paterno"
							className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0 mt-4"
						/>
						<input
							type="text"
							name="apellidoMaterno"
							value={formData.apellidoMaterno}
							onChange={handleChange}
							placeholder="Apellido Materno"
							className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0 mt-4"
						/>
						<input
							type="text"
							name="dni"
							value={formData.dni}
							onChange={handleChange}
							placeholder="DNI"
							className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0 mt-4"
						/>
						<input
							type="email"
							name="correo"
							value={formData.correo}
							onChange={handleChange}
							placeholder="Correo"
							className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0 mt-4"
						/>
						<select name="rol" value={formData.rol} onChange={handleChange} className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0 mt-4">
							<option value="">Seleccione un rol</option>
							<option value="admin">Admin</option>
							<option value="user">User</option>
						</select>
						<select name="estado" value={formData.estado} onChange={handleChange} className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0 mt-4">
							<option value="activo">Activo</option>
							<option value="inactivo">Inactivo</option>
						</select>
						<select name="puesto" value={formData.puesto} onChange={handleChange} className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0 mt-4">
							<option value="">Seleccione un puesto</option>
							{puestos.map((puesto) => (
								<option key={puesto.id} value={puesto.id}>
									{puesto.descripcion}
								</option>
							))}
						</select>
						<div className="flex justify-between mt-4">
							<button type="submit" className="px-6 py-4 bg-blue-500 text-white rounded-md text-lg focus:outline-none focus:ring-0">
								Guardar
							</button>
							<button type="button" onClick={onClose} className="px-6 py-4 bg-red-500 text-white rounded-md text-lg focus:outline-none focus:ring-0">
								Cerrar
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default ModalCreacionUsuario;
