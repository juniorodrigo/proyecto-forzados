"use client";

import React, { useState, useEffect, Suspense } from "react";
import Popover from "./Popover";
import { useSearchParams } from "next/navigation";
import useUserSession from "@/hooks/useSession";
import { aprobadores, ejecutores, solicitantes } from "@/hooks/rolesPermitidos";

const BajaForzado = () => {
	const [formData, setFormData] = useState({
		solicitanteRetiro: "",
		aprobadorRetiro: "",
		ejecutorRetiro: "",
		observaciones: "",
	});

	const [errors, setErrors] = useState<Record<string, boolean>>({});
	// const [dragActive, setDragActive] = useState(false);
	const [popover, setPopover] = useState({ show: false, message: "", type: "success" as "success" | "error" });
	const [aprobadoresList, setAprobadoresList] = useState<{ id: string; nombre: string; apePaterno: string; apeMaterno: string }[]>([]);
	const [solicitantesList, setSolicitantesList] = useState<{ id: string; nombre: string; apePaterno: string; apeMaterno: string }[]>([]);
	const [ejecutoresList, setEjecutoresList] = useState<{ id: string; nombre: string; apePaterno: string; apeMaterno: string }[]>([]);
	const { user } = useUserSession();

	const searchParams = useSearchParams();
	const id = searchParams.get("id");

	useEffect(() => {
		const fetchUsuarios = async () => {
			try {
				const response = await fetch("/api/usuarios");
				const data = await response.json();

				// Filtrar solicitantes
				const filteredSolicitantes = data.values.filter((usuario: any) => solicitantes.some((roleId) => Object.keys(usuario.roles).includes(roleId.toString())));

				// Filtrar aprobadores
				const filteredAprobadores = data.values.filter((usuario: any) => aprobadores.some((roleId) => Object.keys(usuario.roles).includes(roleId.toString())));

				// Filtrar ejecutores
				const filteredEjecutores = data.values.filter((usuario: any) => ejecutores.some((roleId) => Object.keys(usuario.roles).includes(roleId.toString())));

				setSolicitantesList(filteredSolicitantes);
				setAprobadoresList(filteredAprobadores);
				setEjecutoresList(filteredEjecutores);
			} catch (error) {
				console.error("Error al obtener usuarios:", error);
			}
		};
		fetchUsuarios();
	}, []);

	useEffect(() => {
		const fetchSolicitud = async () => {
			if (id) {
				try {
					const response = await fetch(`/api/solicitudes/baja/${id}`);
					const { data } = await response.json();
					if (data) {
						setFormData({
							solicitanteRetiro: data.solicitante || "",
							aprobadorRetiro: data.aprobador || "",
							ejecutorRetiro: data.ejecutor || "",
							observaciones: data.observaciones || "",
						});
					}
				} catch (error) {
					console.error("Error al obtener la solicitud:", error);
				}
			}
		};
		fetchSolicitud();
	}, [id]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target as HTMLInputElement;
		setFormData({
			...formData,
			[name]: value,
		});
		setErrors({
			...errors,
			[name]: false,
		});
	};

	const validateForm = () => {
		const newErrors: Record<string, boolean> = {};
		Object.keys(formData).forEach((key) => {
			if (!formData[key as keyof typeof formData]) {
				newErrors[key] = true;
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			const confirmed = window.confirm("¿Está seguro de que desea generar la baja?");
			if (confirmed) {
				try {
					const response = await fetch("/api/solicitudes/baja", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ ...formData, id, usuario: user?.id }),
					});
					if (response.ok) {
						setPopover({ show: true, message: "Baja solicitada exitosamente.", type: "success" });
						setTimeout(() => {
							window.location.href = "/dashboard/consultas";
						}, 3000);
					} else {
						throw new Error("Error al generar la baja.");
					}
				} catch (error) {
					setPopover({ show: true, message: (error as Error).message, type: "error" });
				}
			}
		}
	};

	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
				<Popover message={popover.message} type={popover.type} show={popover.show} />
				<h1 className="text-2xl font-bold text-gray-800 mb-6">Solicitud de Retiro</h1>
				<form onSubmit={handleSubmit}>
					{/* Solicitante Retiro */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">Solicitante Retiro</label>
						<select
							name="solicitanteRetiro"
							value={formData.solicitanteRetiro}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.solicitanteRetiro ? "border-red-500" : "border-gray-300"}`}
						>
							<option value="">Seleccione un usuario</option>
							{solicitantesList.map((usuario) => (
								<option key={usuario.id} value={usuario.id}>
									{usuario.nombre + " " + usuario.apePaterno + " " + usuario.apeMaterno}
								</option>
							))}
						</select>
						{errors.solicitanteRetiro && <span className="text-red-500 text-sm mt-1">Este campo es requerido.</span>}
					</div>

					{/* Aprobador Retiro */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">Aprobador Retiro (AN)</label>
						<select
							name="aprobadorRetiro"
							value={formData.aprobadorRetiro}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.aprobadorRetiro ? "border-red-500" : "border-gray-300"}`}
						>
							<option value="">Seleccione un usuario</option>
							{aprobadoresList.map((aprobador) => (
								<option key={aprobador.id} value={aprobador.id}>
									{aprobador.nombre + " " + aprobador.apePaterno + " " + aprobador.apeMaterno}
								</option>
							))}
						</select>
						{errors.aprobadorRetiro && <span className="text-red-500 text-sm mt-1">Este campo es requerido.</span>}
					</div>

					{/* Ejecutor Retiro */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">Ejecutor Retiro (AN)</label>
						<select
							name="ejecutorRetiro"
							value={formData.ejecutorRetiro}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.ejecutorRetiro ? "border-red-500" : "border-gray-300"}`}
						>
							<option value="">Seleccione un usuario</option>
							{ejecutoresList.map((usuario) => (
								<option key={usuario.id} value={usuario.id}>
									{usuario.nombre + " " + usuario.apePaterno + " " + usuario.apeMaterno}
								</option>
							))}
						</select>
						{errors.ejecutorRetiro && <span className="text-red-500 text-sm mt-1">Este campo es requerido.</span>}
					</div>

					{/* Observaciones */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
						<textarea
							name="observaciones"
							value={formData.observaciones}
							onChange={handleInputChange}
							className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.observaciones ? "border-red-500" : "border-gray-300"}`}
							rows={4}
							placeholder="Escriba sus observaciones aquí..."
						/>
						{errors.observaciones && <span className="text-red-500 text-sm mt-1">Este campo es requerido.</span>}
					</div>

					{/* Botón de Enviar */}
					<button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
						Enviar
					</button>
				</form>
			</div>
		</Suspense>
	);
};

export default BajaForzado;
