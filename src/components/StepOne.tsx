import React from "react";

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

const StepOne: React.FC<StepOneProps> = ({
	tagPrefijo,
	setTagPrefijo,
	tagCentro,
	setTagCentro,
	tagSubfijo,
	setTagSubfijo,
	descripcion,
	setDescripcion,
	disciplina,
	setDisciplina,
	turno,
	setTurno,
}) => {
	return (
		<form className="space-y-6">
			{/* Tag (Prefijo) */}
			<div>
				<h2 className="text-center font-semibold text-2xl mb-2">Tag y SubFijo</h2>
				<label className="block text-sm font-medium text-gray-600 mb-2">Tag (Prefijo)</label>
				<select
					value={tagPrefijo}
					onChange={(e) => setTagPrefijo(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">Prefijo del Tag o Sub Area</option>
					<option value="CHANCADOR PRINCIPAL">CHANCADOR PRINCIPAL</option>
					<option value="CORREA ALIMENTACION ACOPIO GRUESOS">CORREA ALIMENTACION ACOPIO GRUESOS</option>
					<option value="ACOPIO DE GRUESOS Y SISTEMA DE RECUPERACION">ACOPIO DE GRUESOS Y SISTEMA DE RECUPERACION</option>
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
					<option value="AGITADOR">AGITADOR</option>
					<option value="INDICADOR DE ANALIZADOR">INDICADOR DE ANALIZADOR</option>
					<option value="CONTROL DE ANALIZADOR">CONTROL DE ANALIZADOR</option>
				</select>
			</div>

			{/* Tag (Subfijo) */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Tag (Subfijo)</label>
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
					<option value="Comisionamiento">Comisionamiento</option>
					<option value="Dcs">Dcs</option>
					<option value="Eléctrica">Eléctrica</option>
				</select>
			</div>

			{/* Turno */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Turno</label>
				<select value={turno} onChange={(e) => setTurno(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
					<option value="">Turno que solicita el forzado</option>
					<option value="Turno A">Turno A</option>
					<option value="Turno B">Turno B</option>
				</select>
			</div>
		</form>
	);
};

export default StepOne;
