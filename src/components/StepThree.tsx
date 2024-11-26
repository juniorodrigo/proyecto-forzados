import React, { useEffect, useState } from "react";

interface StepThreeProps {
	aprobador: string;
	setAprobador: React.Dispatch<React.SetStateAction<string>>;
	ejecutor: string;
	setEjecutor: React.Dispatch<React.SetStateAction<string>>;
	autorizacion: string;
	setAutorizacion: React.Dispatch<React.SetStateAction<string>>;
	tipoForzado: string;
	setTipoForzado: React.Dispatch<React.SetStateAction<string>>;
}

interface TipoForzado {
	id: string;
	descripcion: string;
}

const StepThree: React.FC<StepThreeProps> = ({ aprobador, setAprobador, ejecutor, setEjecutor, autorizacion, setAutorizacion, tipoForzado, setTipoForzado }) => {
	const [tiposForzado, setTiposForzado] = useState<TipoForzado[]>([]);

	useEffect(() => {
		const fetchTiposForzado = async () => {
			try {
				const response = await fetch("/api/maestras/tipo-forzado");
				const data = await response.json();
				setTiposForzado(data.values);
			} catch (error) {
				console.error("Error fetching tipos de forzado:", error);
			}
		};

		fetchTiposForzado();
	}, []);

	useEffect(() => {
		if (aprobador && ejecutor) {
			fetch(`/api/etiquetas?aprobador=${aprobador}&ejecutor=${ejecutor}`)
				.then((response) => response.json())
				.then((labels) => {
					setAprobador(labels.aprobadorLabel);
					setEjecutor(labels.ejecutorLabel);
				})
				.catch((error) => console.error("Error al obtener etiquetas:", error));
		}
	}, [aprobador, ejecutor, setAprobador, setEjecutor]);

	return (
		<form className="space-y-6">
			{/* Aprobador */}
			<div>
				<h2 className="text-center font-semibold text-2xl mb-2">Autorización</h2>
				<label className="block text-sm font-medium text-gray-600 mb-2">Aprobador</label>
				<select
					value={aprobador}
					onChange={(e) => setAprobador(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">Seleccione Aprobador del Forzado</option>
					<option value="Aparicio Jorge">Aparicio Jorge</option>
					<option value="Araya Ricardo">Araya Ricardo</option>
					<option value="Carrillo Cristian">Carrillo Cristian</option>
				</select>
			</div>

			{/* Ejecutor */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Ejecutor</label>
				<select value={ejecutor} onChange={(e) => setEjecutor(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
					<option value="">Seleccione Ejecutor</option>
					<option value="Chamorro Felipe">Chamorro Felipe</option>
					<option value="Cornejo Joaquín">Cornejo Joaquín</option>
					<option value="Fernández Rodrigo">Fernández Rodrigo</option>
				</select>
			</div>

			{/* Autorización */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Autorización</label>
				<select
					value={autorizacion}
					onChange={(e) => setAutorizacion(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">Seleccione Autorización</option>
					<option value="autorizado">Autorizado</option>
					<option value="rechazado">Rechazado</option>
				</select>
			</div>

			{/* Tipo de Forzado */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Tipo de Forzado</label>
				<select
					value={tipoForzado}
					onChange={(e) => setTipoForzado(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">Seleccione Tipo de Forzado</option>
					{tiposForzado.map((tipo) => (
						<option key={tipo.id} value={tipo.id}>
							{tipo.descripcion}
						</option>
					))}
				</select>
			</div>
		</form>
	);
};

export default StepThree;
