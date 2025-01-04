"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import { RiDashboardLine, RiArrowRightUpLine, RiProductHuntLine, RiArchiveDrawerLine, RiBarChartFill } from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UiContext } from "@/context/SidebarContext";
import { UiContextType } from "@/types/SidebarOpen";
import Image from "next/image";
import useUserSession from "@/hooks/useSession";
import { solicitantes, aprobadores, ejecutores, administradores } from "@/hooks/rolesPermitidos";

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

	const menuItems = useMemo(
		() => [
			{
				id: "consultas",
				label: "Consultas",
				icon: <RiArchiveDrawerLine className="text-xl" />,
				href: "/dashboard/consultas",
				roles: [...administradores, ...solicitantes, ...aprobadores, ...ejecutores],
			},
			{
				id: "generar-alta",
				label: "Generar Alta",
				icon: <RiArrowRightUpLine className="text-xl" />,
				href: "/dashboard/generar-alta",
				roles: [...solicitantes, ...administradores],
			},
			{
				id: "administrar-usuario",
				label: "Administrar Usuarios",
				icon: <RiDashboardLine className="text-xl" />,
				href: "/dashboard/administrar-usuario",
				roles: [...administradores],
			},
			{
				id: "administrar-parametros",
				label: "Administrar Parametros",
				icon: <RiProductHuntLine className="text-xl" />,
				href: "/dashboard/administrar-parametros",
				roles: [...administradores],
			},
			{
				id: "administrar-puestos",
				label: "Administrar Puestos",
				icon: <RiProductHuntLine className="text-xl" />,
				href: "/dashboard/administrar-puestos",
				roles: [...administradores],
			},
			{
				id: "estadisticas",
				label: "Estadísticas",
				icon: <RiBarChartFill className="text-xl" />,
				href: "/dashboard/estadisticas",
				roles: [...administradores, ...solicitantes, ...aprobadores, ...ejecutores],
			},
		],
		[]
	);

	const itemRolesIncludesUserRoles = (itemRoles: number[], userRoles: number[]) => {
		return itemRoles.some((itemRole) => userRoles.includes(itemRole));
	};

	return (
		<div className={`bg-[#001d39] border-r border-gray-300 flex flex-col transition-all duration-300 ease-in-out ${open ? "w-64" : "w-16"} h-screen z-40`}>
			<div className={`p-1 text-center bg-white ${open ? "" : "px-2"}`}>
				<div className="text-2xl font-bold flex items-center justify-center space-x-2">
					{open ? (
						<Image src="/images/logo2.png" height={120} width={180} alt="Logo" className="object-contain h-auto max-h-[60px]" priority />
					) : (
						<div className="w-8 h-8 bg-[#001d39] rounded-full flex items-center justify-center">
							<span className="text-white text-xs font-bold">GF</span>
						</div>
					)}
				</div>
			</div>
			<nav className="flex-1 overflow-y-auto overflow-x-hidden">
				<ul>
					{menuItems
						.filter((item) => user && itemRolesIncludesUserRoles(item.roles, Object.keys(user.roles).map(Number)))
						.map((item) => (
							<li key={item.id} className="relative group">
								<Link href={item.href}>
									<div
										className={`flex items-center p-4 cursor-pointer text-white ${activeToggle === item.id ? "bg-[#133e6a] text-gray-100" : "hover:bg-[#00264d] hover:text-gray-200"} ${
											open ? "" : "justify-center"
										}`}
									>
										<span className="text-[#c8a064] transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
										{open && <span className="ml-3 text-sm font-medium whitespace-nowrap">{item.label}</span>}
									</div>
								</Link>
								{!open && (
									<div className="fixed left-16 top-auto mt-[-1.25rem] px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
										{item.label}
									</div>
								)}
							</li>
						))}
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;
