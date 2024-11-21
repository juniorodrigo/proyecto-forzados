import React from "react";

interface StepTwoProps {
	interlockSeguridad: string;
	setInterlockSeguridad: React.Dispatch<React.SetStateAction<string>>;
	responsable: string;
	setResponsable: React.Dispatch<React.SetStateAction<string>>;
	riesgo: string;
	setRiesgo: React.Dispatch<React.SetStateAction<string>>;
	probabilidad: string;
	setProbabilidad: React.Dispatch<React.SetStateAction<string>>;
	impacto: string;
	setImpacto: React.Dispatch<React.SetStateAction<string>>;
	solicitante: string;
	setSolicitante: React.Dispatch<React.SetStateAction<string>>;
}

const StepTwo: React.FC<StepTwoProps> = ({
	interlockSeguridad,
	setInterlockSeguridad,
	responsable,
	setResponsable,
	riesgo,
	setRiesgo,
	probabilidad,
	setProbabilidad,
	impacto,
	setImpacto,
	solicitante,
	setSolicitante,
}) => {
	return (
		<form className="space-y-6">
			{/* Interlock Seguridad */}
			<div>
				<h2 className="text-center font-semibold text-2xl mb-2">Responsable y Riesgo</h2>
				<label className="block text-sm font-medium text-gray-600 mb-2">Interlock Seguridad</label>
				<select
					value={interlockSeguridad}
					onChange={(e) => setInterlockSeguridad(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">¿Requiere Interlock?</option>
					<option value="SÍ">SÍ</option>
					<option value="NO">NO</option>
				</select>
			</div>

			{/* Responsable */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Responsable</label>
				<select
					value={responsable}
					onChange={(e) => setResponsable(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">Seleccione Gerencia Responsable del Forzado</option>
					<option value="Gerencia Asset Performance">Gerencia Asset Performance</option>
					<option value="Gerencia Planta">Gerencia Planta</option>
				</select>
			</div>

			{/* Riesgo */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Riesgo</label>
				<select value={riesgo} onChange={(e) => setRiesgo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
					<option value="">Seleccione Riesgo al que puede afectar el Forzado</option>
					<option value="Equipos">Equipos</option>
					<option value="Personas">Personas</option>
					<option value="Procesos">Procesos</option>
				</select>
			</div>

			{/* Probabilidad */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Probabilidad</label>
				<select
					value={probabilidad}
					onChange={(e) => setProbabilidad(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">Seleccione la probabilidad de ocurrencia</option>
					<option value="Raro">Raro</option>
					<option value="Improbable">Improbable</option>
					<option value="Posible">Posible</option>
					<option value="Probable">Probable</option>
					<option value="Seguro">Seguro</option>
				</select>
			</div>

			{/* Impacto */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Impacto</label>
				<select value={impacto} onChange={(e) => setImpacto(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
					<option value="">Seleccione Impacto de la Consecuencia</option>
					<option value="Insignificante">Insignificante</option>
					<option value="Menor">Menor</option>
					<option value="Moderado">Moderado</option>
					<option value="Mayor">Mayor</option>
					<option value="Extremo">Extremo</option>
				</select>
			</div>

			{/* Solicitante (AN) */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Solicitante (AN)</label>
				<select
					value={solicitante}
					onChange={(e) => setSolicitante(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="">Seleccione Solicitante del Forzado</option>
					<option value="Carlos Fernandez">Aparicio Jorge</option>
					<option value="Miguel Barrantes">Araya Ricardo</option>
					<option value="Hernando Zurita">Carrillo Cristian</option>
				</select>
			</div>
		</form>
	);
};

export default StepTwo;
