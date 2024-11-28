"use client";

import React, { useState, useEffect } from "react";
import Popover from "../../../components/Popover";
import { useSearchParams } from "next/navigation";

const BajaForzado = () => {
	const [formData, setFormData] = useState({
		solicitanteRetiro: "",
		aprobadorRetiro: "",
		ejecutorRetiro: "",
		observaciones: "",
		datosAdjuntos: null as File | null,
	});

	const [errors, setErrors] = useState<Record<string, boolean>>({});
	// const [dragActive, setDragActive] = useState(false);
	const [popover, setPopover] = useState({ show: false, message: "", type: "success" as "success" | "error" });
	const [usuarios, setUsuarios] = useState<{ id: string; nombre: string }[]>([]);
	const [aprobadores, setAprobadores] = useState<{ id: string; nombre: string }[]>([]);

	const searchParams = useSearchParams();
	const id = searchParams.get("id");

	useEffect(() => {
		const fetchUsuarios = async () => {
			try {
				const response = await fetch("/api/usuarios");
				const data = await response.json();

				setUsuarios(data.values);
			} catch (error) {
				console.error("Error al obtener usuarios:", error);
			}
		};
		fetchUsuarios();
	}, []);

	useEffect(() => {
		const fetchUsuarios = async () => {
			try {
				const response = await fetch("/api/usuarios/aprobadores");
				const data = await response.json();
				setAprobadores(data.values);
			} catch (error) {
				console.error("Error al obtener usuarios:", error);
			}
		};
		fetchUsuarios();
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, files } = e.target as HTMLInputElement;
		setFormData({
			...formData,
			[name]: files ? files[0] : value,
		});
		setErrors({
			...errors,
			[name]: false,
		});
	};

	// const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
	// 	e.preventDefault();
	// 	e.stopPropagation();
	// 	setDragActive(e.type === "dragover");
	// };

	// const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
	// 	e.preventDefault();
	// 	e.stopPropagation();
	// 	setDragActive(false);
	// 	if (e.dataTransfer.files && e.dataTransfer.files[0]) {
	// 		setFormData({
	// 			...formData,
	// 			datosAdjuntos: e.dataTransfer.files[0],
	// 		});
	// 		setErrors({
	// 			...errors,
	// 			datosAdjuntos: false,
	// 		});
	// 	}
	// };

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
						body: JSON.stringify({ ...formData, id }),
					});
					if (response.ok) {
						setPopover({ show: true, message: "Baja generada exitosamente.", type: "success" });
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
		<div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
			<Popover message={popover.message} type={popover.type} show={popover.show} />
			<h1 className="text-2xl font-bold text-gray-800 mb-6">Baja Forzado</h1>
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
						{usuarios.map((usuario) => (
							<option key={usuario.id} value={usuario.id}>
								{usuario.nombre}
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
						{aprobadores.map((aprobador) => (
							<option key={aprobador.id} value={aprobador.id}>
								{aprobador.nombre}
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
						{usuarios.map((usuario) => (
							<option key={usuario.id} value={usuario.id}>
								{usuario.nombre}
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

				{/* Datos Adjuntos */}
				{/* <div className="mb-4">
					<label htmlFor="datosAdjuntos" className="block text-sm font-medium text-gray-700 mb-1">
						Datos Adjuntos
					</label>
					<div
						className={`flex items-center justify-center border-2 ${
							dragActive ? "border-blue-500" : "border-gray-300"
						} border-dashed rounded-md p-4 cursor-pointer hover:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500`}
						onDragOver={handleDrag}
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDrop={handleDrop}
						onClick={() => document.getElementById("datosAdjuntos")?.click()}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16v-3a4 4 0 10-8 0v3M8 16v2a4 4 0 004 4h0a4 4 0 004-4v-2m4-4a8 8 0 10-16 0v3m4-8a4 4 0 118 0" />
						</svg>
						<span className="text-sm text-gray-500">{formData.datosAdjuntos ? formData.datosAdjuntos.name : "Arrastre y suelte archivos o haga clic aquí"}</span>
					</div>
					<input id="datosAdjuntos" name="datosAdjuntos" type="file" className="hidden" onChange={handleInputChange} />
					{errors.datosAdjuntos && <span className="text-red-500 text-sm mt-1">Este campo es requerido.</span>}
				</div> */}

				{/* Botón de Enviar */}
				<button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
					Enviar
				</button>
			</form>
		</div>
	);
};

export default BajaForzado;
