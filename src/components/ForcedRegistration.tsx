"use client";
import StepOne from "@/components/StepOne";
import StepThree from "@/components/StepThree";
import StepTwo from "@/components/StepTwo";
import React, { useState, useEffect, Suspense } from "react";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import Popover from "@/components/Popover";
import useUserSession from "@/hooks/useSession";

const ForcedRegistration: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(1);

	// Estados para cada paso
	const [tagPrefijo, setTagPrefijo] = useState("");
	const [tagCentro, setTagCentro] = useState("");
	const [tagSubfijo, setTagSubfijo] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [disciplina, setDisciplina] = useState("");
	const [turno, setTurno] = useState("");
	const [proyecto, setProyecto] = useState("");

	const [interlockSeguridad, setInterlockSeguridad] = useState("");
	const [responsable, setResponsable] = useState("");
	const [riesgo, setRiesgo] = useState("");
	const [probabilidad, setProbabilidad] = useState("");
	const [impacto, setImpacto] = useState("");
	const [solicitante, setSolicitante] = useState("");
	const [nivelRiesgo, setNivelRiesgo] = useState("");

	const [aprobador, setAprobador] = useState("");
	const [ejecutor, setEjecutor] = useState("");
	const [tipoForzado, setTipoForzado] = useState("");

	const [popoverMessage, setPopoverMessage] = useState("");
	const [popoverType, setPopoverType] = useState<"success" | "error">("success");
	const [showPopover, setShowPopover] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { user } = useUserSession();

	const router = useRouter();
	const searchParams = useSearchParams();
	const id = searchParams.get("id");

	const steps = [
		{ id: 1, title: "Paso 1" },
		{ id: 2, title: "Paso 2" },
		{ id: 3, title: "Paso 3" },
	];

	useEffect(() => {
		const fetchSolicitudData = async () => {
			if (id) {
				try {
					const response = await fetch(`/api/solicitudes/alta/${id}`);
					const result = await response.json();

					if (result.success && result.data.length > 0) {
						const solicitud = result.data[0];

						setInterlockSeguridad(String(solicitud.interlockSeguridad)); // Convertimos a string porque el value del select es string
						setResponsable(String(solicitud.responsable));
						setRiesgo(String(solicitud.riesgo));
						setProbabilidad(String(solicitud.probabilidad));
						setImpacto(String(solicitud.impacto));
						setSolicitante(String(solicitud.solicitante));
						setNivelRiesgo(String(solicitud.nivelRiesgo) || "DESCONOCIDO");
					} else {
						console.error("No se encontraron datos para la solicitud.");
					}
				} catch (error) {
					console.error("Error fetching solicitud data:", error);
				}
			}
		};
		fetchSolicitudData();
	}, [setInterlockSeguridad, setResponsable, setRiesgo, setProbabilidad, setImpacto, setSolicitante, setNivelRiesgo, id]);

	const nextStep = () => {
		if (currentStep < steps.length) setCurrentStep(currentStep + 1);
		else {
			if (confirm("¿Está seguro de que desea enviar la solicitud?")) {
				setIsSubmitting(true);
				const method = id ? "PUT" : "POST";
				const body: {
					usuario: number;
					tagPrefijo: string;
					tagCentro: string;
					tagSubfijo: string;
					descripcion: string;
					disciplina: string;
					turno: string;
					interlockSeguridad: string;
					responsable: string;
					riesgo: string;
					probabilidad: string;
					impacto: string;
					solicitante: string;
					aprobador: string;
					ejecutor: string;
					tipoForzado: string;
					proyecto: string;
					id?: string | null;
				} = {
					usuario: user?.id ?? 0,
					tagPrefijo,
					tagCentro,
					tagSubfijo: tagSubfijo.toUpperCase(),
					descripcion: descripcion.toUpperCase(),
					disciplina,
					turno,
					interlockSeguridad,
					responsable,
					riesgo,
					probabilidad,
					impacto,
					solicitante,
					aprobador,
					ejecutor,
					tipoForzado,
					proyecto,
					id,
				};
				fetch("/api/solicitudes/alta", {
					method,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(body),
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.success) {
							setPopoverMessage("Solicitud de forzado enviada exitosamente");
							setPopoverType("success");
							setShowPopover(true);
							setTimeout(() => {
								router.push("/dashboard/consultas");
							}, 2000); // Espera de 2 segundos antes de redirigir
						} else {
							setPopoverMessage("Error al enviar la solicitud");
							setPopoverType("error");
							setShowPopover(true);
						}
					})
					.catch((error) => {
						console.error("Error:", error);
						setPopoverMessage("Error al enviar la solicitud");
						setPopoverType("error");
						setShowPopover(true);
					});
			}
		}
	};

	const prevStep = () => {
		if (currentStep > 1) setCurrentStep(currentStep - 1);
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<StepOne
						tagPrefijo={tagPrefijo}
						setTagPrefijo={setTagPrefijo}
						tagCentro={tagCentro}
						setTagCentro={setTagCentro}
						tagSubfijo={tagSubfijo}
						setTagSubfijo={setTagSubfijo}
						descripcion={descripcion}
						setDescripcion={setDescripcion}
						disciplina={disciplina}
						setDisciplina={setDisciplina}
						turno={turno}
						setTurno={setTurno}
						proyecto={proyecto}
						setProyecto={setProyecto}
					/>
				);
			case 2:
				return (
					<StepTwo
						interlockSeguridad={interlockSeguridad}
						setInterlockSeguridad={setInterlockSeguridad}
						responsable={responsable}
						setResponsable={setResponsable}
						riesgo={riesgo}
						setRiesgo={setRiesgo}
						probabilidad={probabilidad}
						setProbabilidad={setProbabilidad}
						impacto={impacto}
						setImpacto={setImpacto}
						solicitante={solicitante}
						setSolicitante={setSolicitante}
						nivelRiesgo={nivelRiesgo}
						setNivelRiesgo={setNivelRiesgo}
					/>
				);
			case 3:
				return (
					<StepThree
						aprobador={aprobador}
						setAprobador={setAprobador}
						ejecutor={ejecutor}
						setEjecutor={setEjecutor}
						tipoForzado={tipoForzado}
						setTipoForzado={setTipoForzado}
						interlockSeguridad={interlockSeguridad} // Nuevo prop añadido
						nivelRiesgo={nivelRiesgo}
					/>
				);
			default:
				return null;
		}
	};

	const isStepValid = (step: number) => {
		switch (step) {
			case 1:
				return tagPrefijo && tagCentro && tagSubfijo && descripcion && disciplina && turno && proyecto;
			case 2:
				return interlockSeguridad && responsable && riesgo && probabilidad && impacto && solicitante;
			case 3:
				return aprobador && ejecutor && tipoForzado;
			default:
				return false;
		}
	};

	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
				<h1 className="text-3xl font-bold text-center text-gray-900 mb-4">{!id ? "Alta de Forzado" : "Modificación de Alta"}</h1>

				<div className="flex items-center justify-between mb-8">
					<div className="relative flex-1 flex justify-center items-center">
						<button onClick={prevStep} disabled={currentStep === 1} className={`absolute left-[-1px] transform ${currentStep === 1 ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}>
							<FaArrowLeft className="text-blue-500 text-2xl" />
						</button>

						{steps.map((step, index) => (
							<div key={step.id} className="flex items-center justify-center relative">
								<div
									className={`flex items-center justify-center w-14 h-14 rounded-full border-4 transition-all duration-300 ${
										step.id < currentStep ? "bg-blue-600 text-white border-blue-600" : step.id === currentStep ? "bg-blue-500 text-white border-blue-500" : "bg-gray-200 text-gray-400 border-gray-300"
									}`}
								>
									<span>{step.id}</span>
								</div>
								{index < steps.length - 1 && <div className={`w-20 h-1 rounded-full ${step.id < currentStep ? "bg-blue-600" : "bg-gray-300"}`}></div>}
							</div>
						))}
					</div>
				</div>

				<div>{renderStep()}</div>

				<div className="flex justify-center mt-10 space-x-6">
					<button
						onClick={nextStep}
						disabled={!isStepValid(currentStep) || isSubmitting}
						className={`px-6 py-3 text-white rounded-md flex items-center gap-2 ${!isStepValid(currentStep) || isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
					>
						{isSubmitting ? (
							<>
								<FaSpinner className="animate-spin" />
								<span>Enviando...</span>
							</>
						) : currentStep === steps.length ? (
							<span>Realizar Solicitud</span>
						) : (
							<>
								Continuar
								<span className="ml-2 text-lg">→</span>
							</>
						)}
					</button>
				</div>
				<Popover message={popoverMessage} type={popoverType} show={showPopover} className="z-50" />
			</div>
		</Suspense>
	);
};
export const dynamic = "force-dynamic";
export default ForcedRegistration;
