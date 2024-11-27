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
}

interface Option {
	id: string;
	descripcion: string;
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
}) => {
	const [tagPrefijos, setTagPrefijos] = useState<Option[]>([]);
	const [tagCentros, setTagCentros] = useState<Option[]>([]);
	const [disciplinas, setDisciplinas] = useState<Option[]>([]);
	const [turnos, setTurnos] = useState<Option[]>([]);

	useEffect(() => {
		const fetchData = async (url: string, setState: React.Dispatch<React.SetStateAction<Option[]>>) => {
			try {
				const response = await fetch(url);
				const data = await response.json();

				setState(data.values);
				console.log(data.values, `data values from ${url}`);
			} catch (error) {
				console.error(`Error fetching data from ${url}:`, error);
			}
		};

		fetchData("/api/maestras/subarea", setTagPrefijos);
		fetchData("/api/maestras/activo", setTagCentros);
		fetchData("/api/maestras/disciplina", setDisciplinas);
		fetchData("/api/maestras/turno", setTurnos);
	}, [setDescripcion, setDisciplina, setTagCentro, setTagPrefijo, setTagSubfijo, setTurno]);

	useEffect(() => {
		const fetchSolicitudData = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const id = await urlParams.get("id");
			if (id) {
				try {
					const response = await fetch(`/api/solicitudes/alta/${id}`);
					const data = await response.json();
					setTagPrefijo(data.tagPrefijo);
					setTagCentro(data.tagCentro);
					setTagSubfijo(data.tagSubfijo);
					setDescripcion(data.descripcion);
					setDisciplina(data.disciplina);
					setTurno(data.turno);
				} catch (error) {
					console.error("Error fetching solicitud data:", error);
				}
			}
		};
		fetchSolicitudData();
	}, [setDescripcion, setDisciplina, setTagCentro, setTagPrefijo, setTagSubfijo, setTurno]);

	useEffect(() => {
		console.log(tagPrefijos, "tagPrefijos");
	}, [tagPrefijos]);

	useEffect(() => {
		console.log(tagCentros, "tagCentros");
	}, [tagCentros]);

	return (
		<form className="space-y-6">
			{/* Tag (Prefijo) */}
			<div>
				<h2 className="text-center font-semibold text-2xl mb-2">Datos generales</h2>
				<label className="block text-sm font-medium text-gray-600 mb-2">Tag (Prefijo)</label>
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
				<label className="block text-sm font-medium text-gray-600 mb-2">Tag (Centro)</label>
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
					onChange={(e) => setDisciplina(e.target.value)}
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
