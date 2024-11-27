"use client";

import React, { useState } from "react";

const BajaForzado = () => {
	const [formData, setFormData] = useState({
		solicitanteRetiro: "",
		aprobadorRetiro: "",
		ejecutorRetiro: "",
		autorizacionRetiro: "",
		fechaCierre: "",
		observaciones: "",
		datosAdjuntos: null as File | null,
	});

	const [errors, setErrors] = useState<Record<string, boolean>>({});
	const [dragActive, setDragActive] = useState(false);

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

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(e.type === "dragover");
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setFormData({
				...formData,
				datosAdjuntos: e.dataTransfer.files[0],
			});
			setErrors({
				...errors,
				datosAdjuntos: false,
			});
		}
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			alert("Formulario enviado exitosamente.");
			console.log("Datos del formulario:", formData);
		}
	};

	return (
		<div className=" mx-auto p-6 bg-white shadow-md rounded-md">
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
						<option value="">Prefijo del Tag o Sub área</option>
						<option value="Juan Pérez">Juan Pérez</option>
						<option value="Ana Martínez">Ana Martínez</option>
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
						<option value="">Parte central del Tag Asociado al Instrumento o Equipo</option>
						<option value="Carlos Gómez">Carlos Gómez</option>
						<option value="Sofía López">Sofía López</option>
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
						<option value="">Sufijo del Tag</option>
						<option value="Pedro González">Pedro González</option>
						<option value="María Fernández">María Fernández</option>
					</select>
					{errors.ejecutorRetiro && <span className="text-red-500 text-sm mt-1">Este campo es requerido.</span>}
				</div>

				{/* Autorización Retiro */}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">Autorización Retiro</label>
					<select
						name="autorizacionRetiro"
						value={formData.autorizacionRetiro}
						onChange={handleInputChange}
						className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.autorizacionRetiro ? "border-red-500" : "border-gray-300"}`}
					>
						<option value="">Sufijo del Tag</option>
						<option value="Luisa Ramírez">Luisa Ramírez</option>
						<option value="Carlos Herrera">Carlos Herrera</option>
					</select>
					{errors.autorizacionRetiro && <span className="text-red-500 text-sm mt-1">Este campo es requerido.</span>}
				</div>

				{/* Fecha de Cierre */}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Cierre</label>
					<input
						type="datetime-local"
						name="fechaCierre"
						value={formData.fechaCierre}
						onChange={handleInputChange}
						className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.fechaCierre ? "border-red-500" : "border-gray-300"}`}
					/>
					{errors.fechaCierre && <span className="text-red-500 text-sm mt-1">Este campo es requerido.</span>}
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
				<div className="mb-4">
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
				</div>

				{/* Botón de Enviar */}
				<button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
					Enviar
				</button>
			</form>
		</div>
	);
};

export default BajaForzado;
