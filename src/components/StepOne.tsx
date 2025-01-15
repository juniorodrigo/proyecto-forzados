import React, { useEffect, useState } from "react";

interface StepOneProps {
	tagPrefijo: string;
	setTagPrefijo: React.Dispatch<React.SetStateAction<string>>;
	tagCentro: string;
	setTagCentro: React.Dispatch<React.SetStateAction<string>>;
	tagSubfijo: string;
	setTagSubfijo: React.Dispatch<React.SetStateAction<string>>;
	descripcion: string;
	setDescripcion: React.Dispatch<React.SetStateAction<string>>;
	disciplina: string;
	setDisciplina: React.Dispatch<React.SetStateAction<string>>;
	turno: string;
	setTurno: React.Dispatch<React.SetStateAction<string>>;
	proyecto: string;
	setProyecto: React.Dispatch<React.SetStateAction<string>>;
}

interface Option {
	id: string;
	descripcion: string;
	probabilidad?: string;
	impacto?: string;
}

const StepOne: React.FC<StepOneProps> = ({
	tagPrefijo,
	setTagPrefijo,
	tagCentro,
	setTagCentro,
	tagSubfijo = "",
	setTagSubfijo,
	descripcion = "",
	setDescripcion,
	disciplina,
	setDisciplina,
	turno,
	setTurno,
	proyecto,
	setProyecto,
}) => {
	const [tagPrefijos, setTagPrefijos] = useState<Option[]>([]);
	const [tagCentros, setTagCentros] = useState<Option[]>([]);
	const [disciplinas, setDisciplinas] = useState<Option[]>([]);
	const [turnos, setTurnos] = useState<Option[]>([]);
	const [proyectosList, setProyectosList] = useState<Option[]>([]);

	useEffect(() => {
		const fetchData = async (url: string, setState: React.Dispatch<React.SetStateAction<Option[]>>) => {
			try {
				const response = await fetch(url);
				const data = await response.json();

				// if (url.includes("subarea")) {
				// 	console.log(data.values, `data values from ${url}`);
				// }

				setState(data.values);
				// console.log(data.values, `data values from ${url}`);
			} catch (error) {
				console.error(`Error fetching data from ${url}:`, error);
			}
		};

		fetchData("/api/maestras/subarea", setTagPrefijos);
		fetchData("/api/maestras/activo", setTagCentros);
		fetchData("/api/maestras/disciplina", setDisciplinas);
		fetchData("/api/maestras/turno", setTurnos);
		fetchData("/api/maestras/proyecto", setProyectosList);
	}, [setDescripcion, setDisciplina, setTagCentro, setTagPrefijo, setTagSubfijo, setTurno]);

	useEffect(() => {
		const fetchSolicitudData = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const id = urlParams.get("id");
			if (id) {
				try {
					const response = await fetch(`/api/solicitudes/alta/${id}`);
					const result = await response.json();

					if (result.success && result.data.length > 0) {
						const solicitud = result.data[0];

						setTagPrefijo(String(solicitud.tagPrefijo));
						setTagCentro(String(solicitud.tagCentro));
						setTagSubfijo(solicitud.tagSubfijo || ""); // Asegurarse de que no sea null/undefined
						setDescripcion(solicitud.descripcion || "");
						setDisciplina(String(solicitud.disciplina));
						setProyecto(String(solicitud.proyecto));
						setTurno(String(solicitud.turno));
					} else {
						console.error("No se encontraron datos para la solicitud.");
					}
				} catch (error) {
					console.error("Error fetching solicitud data:", error);
				}
			}
		};
		fetchSolicitudData();
	}, [setTagPrefijo, setTagCentro, setTagSubfijo, setDescripcion, setDisciplina, setTurno, setProyecto]);

	return (
		<form className="space-y-6">
			{/* Proyecto */}
			<div>
				<h2 className="text-center font-semibold text-2xl mb-2">Datos generales</h2>
				<label className="block text-sm font-medium text-gray-600 mb-2">Área de forzado</label>
				<select value={proyecto} onChange={(e) => setProyecto(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
					<option value="">Nombre del área de forzado</option>
					{proyectosList.map((option) => (
						<option key={option.id} value={option.id}>
							{option.descripcion}
						</option>
					))}
				</select>
			</div>

			{/* Tag (Prefijo) */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Sub Área (Tag Prefijo)</label>
				<select
					value={tagPrefijo}
					onChange={(e) => setTagPrefijo(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">Prefijo del Tag o Sub Area</option>
					{tagPrefijos.map((option) => (
						<option key={option.id} value={option.id}>
							{option.descripcion}
						</option>
					))}
				</select>
			</div>

			{/* Tag (Centro) */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Activo (Tag Centro)</label>
				<select
					value={tagCentro}
					onChange={(e) => setTagCentro(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">Parte central del Tag asociado al Instrumento o Equipo</option>
					{tagCentros.map((option) => (
						<option key={option.id} value={option.id}>
							{option.descripcion}
						</option>
					))}
				</select>
			</div>

			{/* Tag (Sufijo) */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Tag (Sufijo)</label>
				<input
					type="text"
					value={tagSubfijo}
					onChange={(e) => setTagSubfijo(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Ingrese el subfijo del Tag"
					required
				/>
			</div>

			{/* Descripción */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Descripción</label>
				<textarea
					value={descripcion}
					onChange={(e) => setDescripcion(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					rows={4}
					placeholder="Agregue una descripción"
					required
				/>
			</div>

			{/* Disciplina */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Disciplina</label>
				<select
					value={disciplina}
					onChange={(e) => {
						setDisciplina(e.target.value);
					}}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">Disciplina que solicita el forzado</option>
					{disciplinas.map((option) => (
						<option key={option.id} value={option.id}>
							{option.descripcion}
						</option>
					))}
				</select>
			</div>

			{/* Turno */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Turno</label>
				<select value={turno} onChange={(e) => setTurno(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
					<option value="">Turno que solicita el forzado</option>
					{turnos.map((option) => (
						<option key={option.id} value={option.id}>
							{option.descripcion}
						</option>
					))}
				</select>
			</div>
		</form>
	);
};

export default StepOne;
