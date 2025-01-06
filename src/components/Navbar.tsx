"use client";

import { FC, useState, useRef, useEffect } from "react";
import { RiMenuFoldLine, RiLogoutBoxLine } from "react-icons/ri";
import { UiContext } from "@/context/SidebarContext";
import { UiContextType } from "@/types/SidebarOpen";
import { useContext } from "react";
import useUserSession from "@/hooks/useSession";
import { signOut } from "next-auth/react";

const Navbar: FC = () => {
	const context = useContext(UiContext) as UiContextType;
	const { user } = useUserSession();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	if (!context) {
		throw new Error("useAppContext debe ser usado dentro de un UiProvider");
	}

	const { open, setOpen } = context;

	useEffect(() => {
		setOpen(false);
	}, [setOpen]);

	const toggleSidebar = () => {
		setOpen(!open);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = async () => {
		await signOut({ callbackUrl: "/auth/ingresar" });
	};

	return (
		<nav className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-gray-200 bg-gray-50 px-4 shadow-sm">
			<div className="flex items-center gap-4">
				<button onClick={toggleSidebar} className="flex h-8 w-8 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-200" aria-label="Toggle Sidebar">
					<RiMenuFoldLine className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
				</button>
				<h1 className="text-base font-medium text-gray-700">Sistema de Gestión de Forzados</h1>
			</div>

			<div className="relative" ref={dropdownRef}>
				<button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex h-8 items-center gap-2 rounded-md px-2 text-gray-700 transition-colors hover:bg-gray-200">
					<span className="text-sm font-medium">
						{user?.name || "ADMIN"}
						<span className="ml-1 text-xs text-gray-500">{user?.roleName || "ADMINISTRADOR"}</span>
					</span>
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#001d39] text-xs text-white">{user?.name?.charAt(0) || "A"}</div>
				</button>

				{isDropdownOpen && (
					<div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
						<button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
							<RiLogoutBoxLine className="h-4 w-4" />
							Cerrar Sesión
						</button>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
