"use client";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { RiDashboardLine, RiArrowRightUpLine, RiProductHuntLine, RiArchiveDrawerLine, RiBarChartFill } from "react-icons/ri";
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

	useEffect(() => {
		setActiveToggle(pathname.split("/")[2] || null);
	}, [pathname]);

	const solicitantes = useMemo(() => [1], []);
	const aprobadores = useMemo(() => [2, 4], []);
	const ejecutores = useMemo(() => [3], []);
	const administradores = useMemo(() => [5], []);

	const menuItems = useMemo(
		() => [
			{
				id: "consultas",
				label: "Consultas",
				icon: <RiArchiveDrawerLine className="text-xl mr-3" />,
				href: "/dashboard/consultas",
				roles: [...administradores, ...solicitantes, ...aprobadores, ...ejecutores],
			},
			{
				id: "generar-alta",
				label: "Generar Alta",
				icon: <RiArrowRightUpLine className="text-xl mr-3" />,
				href: "/dashboard/generar-alta",
				roles: [...solicitantes, ...administradores], // Cambiar a solicitantes
			},
			{
				id: "administrar-usuario",
				label: "Administrar Usuarios",
				icon: <RiDashboardLine className="text-xl mr-3" />,
				href: "/dashboard/administrar-usuario",
				roles: [...administradores],
			},
			{
				id: "administrar-parametros",
				label: "Administrar Parametros",
				icon: <RiProductHuntLine className="text-xl mr-3" />,
				href: "/dashboard/administrar-parametros",
				roles: [...administradores],
			},
			{
				id: "administrar-puestos",
				label: "Administrar Puestos",
				icon: <RiProductHuntLine className="text-xl mr-3" />,
				href: "/dashboard/administrar-puestos",
				roles: [...administradores],
			},
			{
				id: "estadisticas",
				label: "Estadísticas",
				icon: <RiBarChartFill className="text-xl mr-3" />,
				href: "/dashboard/estadisticas",
				roles: [...administradores, ...solicitantes, ...aprobadores, ...ejecutores],
			},
		],
		[administradores, aprobadores, ejecutores, solicitantes]
	);

	const itemRolesIncludesUserRoles = (itemRoles: number[], userRoles: number[]) => {
		return itemRoles.some((itemRole) => userRoles.includes(itemRole));
	};

	console.log(user);

	return (
		<div
			className={`bg-[#001d39] border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0 w-64 block" : "-translate-x-full w-64 hidden"}`}
			style={{ maxWidth: "16rem", minWidth: "16rem" }}
		>
			<div className="p-1 text-center bg-white ">
				<div className="text-2xl font-bold flex items-center justify-center space-x-2">
					<Image src={"/images/logo2.png"} height={120} width={180} alt="Logo" style={{ height: "auto" }} />
				</div>
			</div>
			<nav className="flex-1">
				<ul>
					{menuItems
						.filter((item) => user && itemRolesIncludesUserRoles(item.roles, Object.keys(user.roles).map(Number))) // Filtrar por rol
						.map((item) => (
							<li key={item.id} className="relative group">
								<Link href={item.href}>
									<div className={`flex items-center p-4 cursor-pointer text-white ${activeToggle === item.id ? "bg-[#133e6a] text-gray-400" : "hover:bg-[#00264d]"}`}>
										<span className="text-[#c8a064]">{item.icon}</span>
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
