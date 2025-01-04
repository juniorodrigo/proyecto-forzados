import React, { Suspense } from "react";
import ForcedRegistration from "./ForcedRegistration"; // Asegúrate de ajustar la ruta según tu estructura de archivos.

const ForcedRegistrationWrapper: React.FC = () => {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<ForcedRegistration />
		</Suspense>
	);
};

export default ForcedRegistrationWrapper;
