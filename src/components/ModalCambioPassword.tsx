import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import useUserSession from "@/hooks/useSession";

type ModalCambioPasswordProps = {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
};

const ModalCambioPassword: React.FC<ModalCambioPasswordProps> = ({ isOpen, onClose, onSuccess }) => {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const { user, disableFlagNuevoIngreso } = useUserSession();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validatePassword = (password: string) => {
		const errors = [];
		if (!/.{8,}/.test(password)) errors.push("al menos 8 caracteres");
		return errors;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		if (newPassword !== confirmPassword) {
			alert("Las contraseñas no coinciden");
			setIsSubmitting(false);
			return;
		}

		const passwordErrors = validatePassword(newPassword);
		if (passwordErrors.length > 0) {
			alert(`La contraseña debe tener ${passwordErrors.join(", ")}`);
			setIsSubmitting(false);
			return;
		}

		const response = await fetch("/api/usuarios/reiniciar-contrasena", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: user?.id, usuario: user?.id, password: newPassword }),
		});
		const result = await response.json();
		if (response.ok) {
			disableFlagNuevoIngreso();
			onSuccess();
		} else {
			alert(result.message || "Error en el cambio de contraseña");
		}
		setIsSubmitting(false);
	};

	if (!isOpen) return null;

	return (
		<>
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}></div>
			<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
				<div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
					<div className="p-8 relative">
						<h2 className="text-2xl font-bold mb-4">Cambio de Contraseña</h2>
						<form onSubmit={handleSubmit}>
							<label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="newPassword"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder="Nueva Contraseña"
									className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4"
								/>
							</div>
							<label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="confirmPassword"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Confirmar Contraseña"
									className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 mb-4"
								/>
							</div>
							<div className="text-right mb-4">
								<button type="button" className="text-blue-500" onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} onMouseLeave={() => setShowPassword(false)}>
									Mostrar contraseñas
								</button>
							</div>
							<div className="flex justify-center mt-4">
								<button type="submit" className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${isSubmitting ? "bg-gray-400" : "bg-blue-500 text-white"}`} disabled={isSubmitting}>
									{isSubmitting ? <FaSpinner className="animate-spin" /> : "Cambiar Contraseña"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ModalCambioPassword;
