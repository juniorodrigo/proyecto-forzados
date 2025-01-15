import React, { useEffect, useState } from "react";
import { solicitantes } from "@/hooks/rolesPermitidos";

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
	nivelRiesgo: string;
	setNivelRiesgo: React.Dispatch<React.SetStateAction<string>>;

	tagPrefijo: string;
	tagCentro: string;
	tagSufijo: string;
}

interface Option {
	id: string;
	descripcion: string;
}

interface responsablesOptions {
	id: string;
	nombre: string;
}

interface RowMatrizRiesgo {
	id: number;
	prefijoId: number;
	centroId: number;
	sufijo: string;
	probabilidadId: number;
	impactoId: number;
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
	nivelRiesgo,
	setNivelRiesgo,
	tagPrefijo,
	tagCentro,
	tagSufijo,
}) => {
	const [responsables, setResponsables] = useState<responsablesOptions[]>([]);
	const [riesgos, setRiesgos] = useState<Option[]>([]);
	const [probabilidades, setProbabilidades] = useState<Option[]>([]);
	const [impactos, setImpactos] = useState<Option[]>([]);
	const [usuarios, setUsuarios] = useState<{ id: string; nombre: string; apePaterno: string; apeMaterno: string; roles: Record<string, any> }[]>([]);
	const [matrizData, setMatrizData] = useState<RowMatrizRiesgo[]>([]);

	useEffect(() => {
		const fetchData = async (url: string, setState: React.Dispatch<React.SetStateAction<Option[]>>) => {
			try {
				const response = await fetch(url);
				const data = await response.json();

				// console.log(data.values, `data values from ${url}`);

				setState(data.values);
			} catch (error) {
				console.error(`Error fetching data from ${url}:`, error);
			}
		};

		const fetchResponsableData = async (url: string, setState: React.Dispatch<React.SetStateAction<responsablesOptions[]>>) => {
			try {
				const response = await fetch(url);
				const data = await response.json();
				setState(data.values);
			} catch (error) {
				console.error(`Error fetching data from ${url}:`, error);
			}
		};

		const fetchMatrizRiesgoData = async () => {
			const response = await fetch("/api/maestras/tags-matriz-riesgo");
			const result = await response.json();

			setMatrizData(result.values);

			// Recorrer matrizData y buscar registros que cumplan con los parámetros
			result.values.forEach((row: RowMatrizRiesgo) => {
				if (row.prefijoId === parseInt(tagPrefijo) && row.centroId === parseInt(tagCentro) && row.sufijo === tagSufijo) {
					console.log("Encontrada una regla de matriz que coincide. Aplicando probabilidad e impacto...");
					setProbabilidad(String(row.probabilidadId));
					setImpacto(String(row.impactoId));
				} else console.log(`No se encontraron reglas de matriz de riesgos para los valores de tagPrefijo : ${tagPrefijo}, tagCentro: ${tagCentro}, tagSufijo: ${tagSufijo}`);
			});
		};

		fetchResponsableData("/api/maestras/responsable", setResponsables);
		fetchData("/api/maestras/riesgo-a", setRiesgos);
		fetchData("/api/maestras/probabilidad", setProbabilidades);
		fetchData("/api/maestras/impacto", setImpactos);
		fetchMatrizRiesgoData();
	}, [setInterlockSeguridad, setResponsable, setRiesgo, setProbabilidad, setImpacto, setSolicitante, tagPrefijo, tagCentro, tagSufijo]);

	useEffect(() => {
		const fetchUsuarios = async () => {
			try {
				const response = await fetch("/api/usuarios");
				const data = await response.json();

				// Filtrar usuarios según rolesPermitidos.solicitantes
				const filteredUsuarios = data.values.filter((usuario: any) => solicitantes.some((roleId) => Object.keys(usuario.roles).includes(roleId.toString())));

				setUsuarios(filteredUsuarios);
			} catch (error) {
				console.error("Error al obtener usuarios:", error);
			}
		};
		fetchUsuarios();
	}, []);

	useEffect(() => {
		const fetchSolicitudData = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const id = urlParams.get("id");
			if (id) {
				try {
					const response = await fetch(`/api/solicitudes/alta/${id}`);
					const result = await response.json();

					// console.log(result, "SOLICITUD DATA");

					if (result.success && result.data.length > 0) {
						const solicitud = result.data[0];

						setInterlockSeguridad(String(solicitud.interlockSeguridad)); // Convertimos a string porque el value del select es string
						setResponsable(String(solicitud.responsable));
						setRiesgo(String(solicitud.riesgo));
						setProbabilidad(String(solicitud.probabilidad));
						setImpacto(String(solicitud.impacto));
						setSolicitante(String(solicitud.solicitante));
					} else {
						console.error("No se encontraron datos para la solicitud.");
					}
				} catch (error) {
					console.error("Error fetching solicitud data:", error);
				}
			}
		};
		fetchSolicitudData();
	}, [setInterlockSeguridad, setResponsable, setRiesgo, setProbabilidad, setImpacto, setSolicitante]);

	useEffect(() => {
		// Cálculo de nivel de riesgo basado en impacto y probabilidad
		if (probabilidad && impacto) {
			// Obtener descripciones basadas en los IDs
			const impactoDesc = impactos.find((item) => item.id == impacto)?.descripcion;
			const probabilidadDesc = probabilidades.find((item) => item.id == probabilidad)?.descripcion;

			if (impactoDesc && probabilidadDesc) {
				const mappings: { [key: string]: { [key: string]: string } } = {
					INSIGNIFICANTE: {
						"CASI SEGURO": "MODERADO",
						PROBABLE: "BAJO",
						POSIBLE: "BAJO",
						IMPROBABLE: "BAJO",
						RARO: "BAJO",
					},
					MENOR: {
						"CASI SEGURO": "MODERADO",
						PROBABLE: "MODERADO",
						POSIBLE: "MODERADO",
						IMPROBABLE: "MODERADO",
						RARO: "BAJO",
					},
					MODERADO: {
						"CASI SEGURO": "ALTO",
						PROBABLE: "MODERADO",
						POSIBLE: "MODERADO",
						IMPROBABLE: "MODERADO",
						RARO: "BAJO",
					},
					MAYOR: {
						"CASI SEGURO": "ALTO",
						PROBABLE: "ALTO",
						POSIBLE: "MODERADO",
						IMPROBABLE: "MODERADO",
						RARO: "MODERADO",
					},
					EXTREMO: {
						"CASI SEGURO": "ALTO",
						PROBABLE: "ALTO",
						POSIBLE: "ALTO",
						IMPROBABLE: "ALTO",
						RARO: "ALTO",
					},
				};

				const riesgoLabel = mappings[impactoDesc]?.[probabilidadDesc] || nivelRiesgo || "DESCONOCIDO";
				setNivelRiesgo(riesgoLabel);
			} else {
				// Solo establecer "DESCONOCIDO" si nivelRiesgo está vacío
				if (!nivelRiesgo) {
					setNivelRiesgo("DESCONOCIDO");
				}
			}
		} else {
			// Solo establecer "" si nivelRiesgo está vacío
			if (!nivelRiesgo) {
				setNivelRiesgo("");
			}
		}
	}, [probabilidad, impacto, impactos, probabilidades, nivelRiesgo, setNivelRiesgo]);

	return (
		<form className="space-y-6">
			{/* Interlock Seguridad */}
			<div>
				<h2 className="text-center font-semibold text-2xl mb-2">Responsable y Riesgo</h2>
				<label className="block text-sm font-medium text-gray-600 mb-2">¿Requiere Interlock de Seguridad?</label>
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
					{responsables.map((option) => (
						<option key={option.id} value={option.id}>
							{option.nombre}
						</option>
					))}
				</select>
			</div>

			{/* Riesgo */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Riesgo a</label>
				<select value={riesgo} onChange={(e) => setRiesgo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
					<option value="">Seleccione Riesgo al que puede afectar el Forzado</option>
					{riesgos.map((option) => (
						<option key={option.id} value={option.id}>
							{option.descripcion}
						</option>
					))}
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
					disabled={false}
				>
					<option value="">Seleccione la probabilidad de ocurrencia</option>
					{probabilidades.map((option) => (
						<option key={option.id} value={option.id}>
							{option.descripcion}
						</option>
					))}
				</select>
			</div>

			{/* Impacto */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Impacto</label>
				<select
					value={impacto}
					onChange={(e) => setImpacto(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
					disabled={false}
				>
					<option value="">Seleccione Impacto de la Consecuencia</option>
					{impactos.map((option) => (
						<option key={option.id} value={option.id}>
							{option.descripcion}
						</option>
					))}
				</select>
			</div>

			{/* Nivel de Riesgo */}
			{nivelRiesgo && (
				<div>
					<label className="block text-sm font-medium text-gray-600 mb-2">Nivel de Riesgo</label>
					<p>{nivelRiesgo}</p>
				</div>
			)}

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
					{usuarios.map((usuario) => (
						<option key={usuario.id} value={usuario.id}>
							{usuario.nombre + " " + usuario.apePaterno + " " + usuario.apeMaterno}
						</option>
					))}
				</select>
			</div>
		</form>
	);
};

export default StepTwo;
