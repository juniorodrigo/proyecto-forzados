"use client";

import React, { useState, useContext } from "react";
import { FiSearch, FiChevronDown, FiUser, FiSettings, FiLogOut, FiChevronsLeft } from "react-icons/fi";
import SearchModal from "./SearchModal";
import Link from "next/link";
import { UiContext } from "@/context/SidebarContext";
import { UiContextType } from "@/types/SidebarOpen";
import Image from "next/image";
import { signOut } from "next-auth/react";
import useUserSession from "@/hooks/useSession";

const Navbar: React.FC = () => {
	const context = useContext(UiContext) as UiContextType;
	const { user } = useUserSession();
	const [modalOpen, setModalOpen] = useState(false);
	const { open, setOpen } = context;
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	const toggleSidebar = () => {
		setOpen(!open);
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	return (
		<nav className="bg-[#ededed] border-b border-gray-300">
			<div className="max-h-[80px] min-h-[80px] flex items-center justify-between px-4 mx-auto">
				<button className={`text-3xl text-gray-400 focus:outline-none transition-transform duration-300 ${open ? "rotate-0" : "rotate-180"}`} onClick={toggleSidebar} aria-label="Toggle Sidebar">
					<FiChevronsLeft />
				</button>

				<div className="flex items-center flex-grow px-4">
					<button className="text-gray-300 hover:text-white md:hidden text-2xl" onClick={toggleModal} aria-label="Open Search">
						<FiSearch />
					</button>
					<div className="relative hidden md:flex w-96">
						<input type="text" placeholder="Buscar..." className="w-full bg-slate-50 rounded-md py-2 px-4 focus:outline-none focus:ring-0 placeholder-gray-400 border border-gray-400" />
						<div className="absolute inset-y-0 right-0 flex items-center pr-3">
							<FiSearch className="text-gray-400 text-xl" />
						</div>
					</div>

					<SearchModal isOpen={modalOpen} onClose={toggleModal} />
				</div>

				<div className="flex items-center space-x-4 relative">
					<button type="button" className="flex items-center focus:outline-none space-x-2" onClick={toggleDropdown} aria-haspopup="true" aria-expanded={dropdownOpen}>
						<div className="text-left">
							<p className="text-base font-medium">{user?.name || "Usuario"}</p>
							<p className="text-sm text-gray-400 text-right">{user?.area || "Área desconocida"}</p>
						</div>
						<Image src="/images/login.png" alt="Profile" className="w-10 h-10 rounded-full" height={40} width={40} />
						<FiChevronDown className={`text-xl ml-1 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
					</button>

					{dropdownOpen && (
						<div className="absolute right-0 mt-52 w-48 bg-[#ededed] shadow-lg z-10">
							<ul>
								<li className="hover:bg-gray-300">
									<Link href="#" className="flex items-center p-3">
										<FiUser className="mr-2 text-xl" />
										Perfil
									</Link>
								</li>
								<li className="hover:bg-gray-300">
									<Link href="#" className="flex items-center p-3">
										<FiSettings className="mr-2 text-xl" />
										Configuraciones
									</Link>
								</li>
								<li className="hover:bg-gray-300">
									<button onClick={() => signOut({ callbackUrl: "/auth/ingresar" })} className="flex items-center p-3 w-full text-left">
										<FiLogOut className="mr-2 text-xl" />
										Salir
									</button>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
