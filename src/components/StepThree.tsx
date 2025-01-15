import React, { useEffect, useState } from "react";
import { aprobadores, ejecutores } from "@/hooks/rolesPermitidos";
import useUserSession from "@/hooks/useSession";
import { nivelRiesgoDePersonasId, rolAprobadorInterlockId, nombreReglaNivelBajo } from "@/hooks/variablesHardcodeadas";

interface StepThreeProps {
	aprobador: string;
	setAprobador: React.Dispatch<React.SetStateAction<string>>;
	ejecutor: string;
	setEjecutor: React.Dispatch<React.SetStateAction<string>>;
	tipoForzado: string;
	setTipoForzado: React.Dispatch<React.SetStateAction<string>>;
	interlockSeguridad: string; // Nuevo prop
	nivelRiesgo: string;
	solicitante: string;
	riesgo: string;
}

interface TipoForzado {
	id: string;
	descripcion: string;
}

const StepThree: React.FC<StepThreeProps> = ({ aprobador, setAprobador, ejecutor, setEjecutor, tipoForzado, setTipoForzado, interlockSeguridad, nivelRiesgo, solicitante, riesgo }) => {
	const [tiposForzado, setTiposForzado] = useState<TipoForzado[]>([]);
	const [aprobadoresList, setAprobadoresList] = useState<{ id: string; nombre: string; apePaterno: string; apeMaterno: string }[]>([]);
	const [ejecutoresList, setEjecutoresList] = useState<{ id: string; nombre: string; apePaterno: string; apeMaterno: string }[]>([]);
	const [aplicaReglaRiesgoBajo, setAplicaReglaRiesgoBajo] = useState<boolean>(false);

	const { user } = useUserSession();

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
	}, [setAprobador, setEjecutor, setTipoForzado]);

	useEffect(() => {
		const fetchUsuarios = async () => {
			try {
				const response = await fetch("/api/usuarios");
				const data = await response.json();

				const findUserById = (id: number) => {
					return data.values.find((usuario: any) => usuario.id === id);
				};

				// Filtrar aprobadores
				let filteredAprobadores = data.values.filter((usuario: any) => aprobadores.some((roleId) => Object.keys(usuario.roles).includes(roleId.toString())));

				//TODO: mover a variables hardcodeadas
				if ((interlockSeguridad === "SÍ" || Number(riesgo) == nivelRiesgoDePersonasId) && filteredAprobadores.length > 0) {
					const newFilteredAprobadores = [];
					for (const aprobador of filteredAprobadores) {
						console.log(aprobador.roles);
						if (aprobador.roles[rolAprobadorInterlockId]) {
							newFilteredAprobadores.push(aprobador);
						}
					}
					filteredAprobadores = newFilteredAprobadores;
				} else {
					console.log(aplicaReglaRiesgoBajo, "aplica regla nivel de reisgo");
					if (aplicaReglaRiesgoBajo && (nivelRiesgo === "BAJO" || nivelRiesgo === "MODERADO")) {
						const solicitantex = findUserById(Number(solicitante));

						filteredAprobadores.push({
							id: solicitantex.id,
							nombre: solicitantex.nombre,
							apePaterno: solicitantex.apePaterno,
							apeMaterno: solicitantex.apeMaterno,
						});
					}
				}

				// Filtrar ejecutores
				const filteredEjecutores = data.values.filter((usuario: any) => ejecutores.some((roleId) => Object.keys(usuario.roles).includes(roleId.toString())));

				setAprobadoresList(filteredAprobadores);
				setEjecutoresList(filteredEjecutores);
			} catch (error) {
				console.error("Error al obtener usuarios:", error);
			}
		};
		fetchUsuarios();
	}, [interlockSeguridad, nivelRiesgo, user, riesgo, solicitante, aplicaReglaRiesgoBajo]);

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

						setAprobador(String(solicitud.aprobador));
						setEjecutor(String(solicitud.ejecutor));
						setTipoForzado(String(solicitud.tipoForzado));
					} else {
						console.error("No se encontraron datos para la solicitud.");
					}
				} catch (error) {
					console.error("Error fetching solicitud data:", error);
				}
			}
		};
		fetchSolicitudData();
	}, [setAprobador, setEjecutor, setTipoForzado]);

	useEffect(() => {
		const fetchParametrosGlobales = async () => {
			try {
				const response = await fetch("/api/parametros-globales");
				const data = await response.json();
				if (!data || data.values.length == 0 || !data.values) return;
				setAplicaReglaRiesgoBajo(data.values[nombreReglaNivelBajo]);
			} catch (error) {
				console.error("Error fetching regla de riesgo bajo:", error);
			}
		};

		fetchParametrosGlobales();
	});

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
					{aprobadoresList.map((aprobador) => (
						<option key={aprobador.id} value={aprobador.id}>
							{aprobador.nombre + " " + aprobador.apePaterno + " " + aprobador.apeMaterno}
						</option>
					))}
				</select>
			</div>

			{/* Ejecutor */}
			<div>
				<label className="block text-sm font-medium text-gray-600 mb-2">Ejecutor</label>
				<select value={ejecutor} onChange={(e) => setEjecutor(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
					<option value="">Seleccione Ejecutor</option>
					{ejecutoresList.map((usuario) => (
						<option key={usuario.id} value={usuario.id}>
							{usuario.nombre + " " + usuario.apePaterno + " " + usuario.apeMaterno}
						</option>
					))}
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
