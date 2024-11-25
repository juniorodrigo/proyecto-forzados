"use client";
import StepOne from "@/components/StepOne";
import StepThree from "@/components/StepThree";
import StepTwo from "@/components/StepTwo";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ForcedRegistration: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(1);

	// Estados para cada paso
	const [tagPrefijo, setTagPrefijo] = useState("");
	const [tagCentro, setTagCentro] = useState("");
	const [tagSubfijo, setTagSubfijo] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [disciplina, setDisciplina] = useState("");
	const [turno, setTurno] = useState("");

	const [interlockSeguridad, setInterlockSeguridad] = useState("");
	const [responsable, setResponsable] = useState("");
	const [riesgo, setRiesgo] = useState("");
	const [probabilidad, setProbabilidad] = useState("");
	const [impacto, setImpacto] = useState("");
	const [solicitante, setSolicitante] = useState("");

	const [aprobador, setAprobador] = useState("");
	const [ejecutor, setEjecutor] = useState("");
	const [autorizacion, setAutorizacion] = useState("");
	const [tipoForzado, setTipoForzado] = useState("");

	const router = useRouter();

	const steps = [
		{ id: 1, title: "Paso 1" },
		{ id: 2, title: "Paso 2" },
		{ id: 3, title: "Paso 3" },
	];

	const nextStep = () => {
		if (currentStep < steps.length) setCurrentStep(currentStep + 1);
		else {
			console.log("ETAPA FINAL");

			console.log({
				tagPrefijo,
				tagCentro,
				tagSubfijo,
				descripcion,
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
				autorizacion,
				tipoForzado,
			});

			fetch("/api/solicitudes/alta", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					tagPrefijo,
					tagCentro,
					tagSubfijo,
					descripcion,
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
					autorizacion,
					tipoForzado,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						alert("Solicitud enviada exitosamente");
						router.push("/dashboard/consultas");
					} else {
						alert("Error al enviar la solicitud");
					}
				})
				.catch((error) => {
					console.error("Error:", error);
					alert("Error al enviar la solicitud");
				});
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
					/>
				);
			case 3:
				return (
					<StepThree
						aprobador={aprobador}
						setAprobador={setAprobador}
						ejecutor={ejecutor}
						setEjecutor={setEjecutor}
						autorizacion={autorizacion}
						setAutorizacion={setAutorizacion}
						tipoForzado={tipoForzado}
						setTipoForzado={setTipoForzado}
					/>
				);
			default:
				return null;
		}
	};

	const isStepValid = (step: number) => {
		switch (step) {
			case 1:
				return tagPrefijo && tagCentro && tagSubfijo && descripcion && disciplina && turno;
			case 2:
				return interlockSeguridad && responsable && riesgo && probabilidad && impacto && solicitante;
			case 3:
				return aprobador && ejecutor && autorizacion && tipoForzado;
			default:
				return false;
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
			<h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Alta Forzado</h1>

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
					disabled={!isStepValid(currentStep)}
					className={`px-6 py-3 text-white rounded-md flex items-center gap-2 ${!isStepValid(currentStep) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
				>
					{currentStep === steps.length ? (
						<span>Aprobar</span>
					) : (
						<>
							Continuar
							<span className="ml-2 text-lg">→</span>
						</>
					)}
				</button>
			</div>
		</div>
	);
};

export default ForcedRegistration;
