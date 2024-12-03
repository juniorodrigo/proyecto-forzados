"use client";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { RiDashboardLine, RiArrowRightUpLine, RiProductHuntLine, RiSettings2Line, RiArchiveDrawerLine, RiBarChartFill } from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UiContext } from "@/context/SidebarContext";
import { UiContextType } from "@/types/SidebarOpen";
import Image from "next/image";
import useUserSession from "@/hooks/useSession";

const Sidebar: React.FC = () => {
	const context = useContext(UiContext) as UiContextType;

	if (!context) {
		throw new Error("useAppContext debe ser usado dentro de un UiProvider");
	}

	const { open } = context;
	const { user } = useUserSession();

	const [activeToggle, setActiveToggle] = useState<string | null>(null);
	const pathname = usePathname();
	console.log(pathname.split("/")[2]);

	//TODO: añadir los roles verdaderos

	useEffect(() => {
		setActiveToggle(pathname.split("/")[2] || null);
	}, [pathname]);

	// Para modificar rol, debe de agregarse el id del rol en la tabla de la db al arreglo
	const menuItems = useMemo(
		() => [
			{
				id: "consultas",
				label: "Consultas",
				icon: <RiArchiveDrawerLine className="text-xl mr-3" />,
				href: "/dashboard/consultas",
				roles: ["admin", 2],
			},
			{
				id: "generar-alta",
				label: "Generar Alta",
				icon: <RiArrowRightUpLine className="text-xl mr-3" />,
				href: "/dashboard/generar-alta",
				roles: ["admin", 2],
			},
			{
				id: "administrar-usuario",
				label: "Administrar Usuarios",
				icon: <RiDashboardLine className="text-xl mr-3" />,
				href: "/dashboard/administrar-usuario",
				roles: ["admin"],
			},
			{
				id: "administrar-parametros",
				label: "Administrar Parametros",
				icon: <RiProductHuntLine className="text-xl mr-3" />,
				href: "/dashboard/administrar-parametros",
				roles: ["admin"],
			},
			{
				id: "ajustes",
				label: "Ajustes",
				icon: <RiSettings2Line className="text-xl mr-3" />,
				href: "/dashboard/ajustes",
				roles: ["admin", 2], // Roles permitidos
			},
			{
				id: "estadisticas",
				label: "Estadísticas",
				icon: <RiBarChartFill className="text-xl mr-3" />,
				href: "/dashboard/ajustes",
				roles: ["admin", 2], // Roles permitidos
			},
		],
		[]
	);

	console.log(user);

	return (
		<div
			className={`bg-[#ededed] border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0 w-64 block" : "-translate-x-full w-64 hidden"}`}
			style={{ maxWidth: "16rem", minWidth: "16rem" }}
		>
			<div className="p-6 text-center border-b border-gray-300">
				<div className="text-2xl font-bold flex items-center justify-center space-x-2">
					<Image src={"/images/icon.png"} height={24} width={24} alt="Icono" />
					<span>Gest. Forzados</span>
				</div>
			</div>
			<nav className="flex-1">
				<ul>
					{menuItems
						.filter((item) => user && item.roles.includes(user.role)) // Filtrar por rol
						.map((item) => (
							<li key={item.id} className="relative group">
								<Link href={item.href}>
									<div className={`flex items-center p-4 cursor-pointer text-gray-600 ${activeToggle === item.id ? "bg-gray-300 text-gray-400" : "hover:bg-gray-200"}`}>
										{item.icon}
										{item.label}
									</div>
								</Link>
							</li>
						))}
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;
