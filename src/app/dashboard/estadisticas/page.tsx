"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaTimesCircle, FaPlayCircle } from "react-icons/fa";

const Estadisticas: React.FC = () => {
	const [stats, setStats] = useState({
		aprobadas: 0,
		pendientes: 0,
		rechazadas: 0,
		ejecutadas: 0,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await fetch("/api/solicitudes/estadisticas");
				const result = await response.json();
				if (result.success) {
					setStats(result.data);
				}
			} catch {
				console.error("Error al cargar las estadísticas");
			}
		};

		fetchStats();
	}, []);

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<h1 className="text-2xl font-bold mb-6">Estadísticas de Solicitudes</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white p-4 rounded-lg shadow flex items-center">
					<FaCheckCircle className="text-green-500 w-10 h-10 mr-4" />
					<div>
						<h2 className="text-lg font-semibold">Aprobadas</h2>
						<p className="text-2xl">{stats.aprobadas}</p>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg shadow flex items-center">
					<FaClock className="text-yellow-500 w-10 h-10 mr-4" />
					<div>
						<h2 className="text-lg font-semibold">Pendientes</h2>
						<p className="text-2xl">{stats.pendientes}</p>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg shadow flex items-center">
					<FaTimesCircle className="text-red-500 w-10 h-10 mr-4" />
					<div>
						<h2 className="text-lg font-semibold">Rechazadas</h2>
						<p className="text-2xl">{stats.rechazadas}</p>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg shadow flex items-center">
					<FaPlayCircle className="text-blue-500 w-10 h-10 mr-4" />
					<div>
						<h2 className="text-lg font-semibold">Ejecutadas</h2>
						<p className="text-2xl">{stats.ejecutadas}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Estadisticas;
