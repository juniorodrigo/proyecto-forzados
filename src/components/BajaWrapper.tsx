import React, { Suspense } from "react";
import Baja from "./Baja"; // Asegúrate de ajustar la ruta según tu estructura de archivos.

const BajaWrapper: React.FC = () => {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<Baja />
		</Suspense>
	);
};

export default BajaWrapper;
