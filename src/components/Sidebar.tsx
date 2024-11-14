"use client";
import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  RiDashboardLine,
  RiProductHuntLine,
  RiSettings2Line,
  RiBriefcaseLine,
  RiBuildingLine,
} from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UiContext } from "@/context/SidebarContext";
import { UiContextType } from "@/types/SidebarOpen";

const Sidebar: React.FC = () => {
  const context = useContext(UiContext) as UiContextType;

  if (!context) {
    throw new Error("useAppContext debe ser usado dentro de un UiProvider");
  }

  const { open } = context;

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
        icon: <RiBuildingLine className="text-xl mr-3" />,
        href: "/dashboard/consultas",
      },
      {
        id: "generar alta",
        label: "Generar Alta",
        icon: <RiBriefcaseLine className="text-xl mr-3" />,
        href: "/dashboard/generar-alta",
      },
      {
        id: "administrar usuario",
        label: "Administrar Usuario",
        icon: <RiDashboardLine className="text-xl mr-3" />,
        href: "/dashboard/administrar-usuario",
      },
      {
        id: "administrar parametros",
        label: "Administrar Parametros",
        icon: <RiProductHuntLine className="text-xl mr-3" />,
        href: "/dashboard/administrar-parametros",
      },
      {
        id: "ajustes",
        label: "Ajustes",
        icon: <RiSettings2Line className="text-xl mr-3" />,
        href: "/dashboard/ajustes",
      },
    ],
    []
  );

  return (
    <div
      className={`bg-[#ededed] border-r border-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0 w-64 block" : "-translate-x-full w-64 hidden"
      }`}
      style={{ maxWidth: "16rem", minWidth: "16rem" }}
    >
      <div className="p-6 text-center border-b border-gray-300">
        <div className="text-2xl font-bold">Sis. Forzado</div>
      </div>
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="relative group">
              <Link href={item.href}>
                <div
                  className={`flex items-center p-4 cursor-pointer ${
                    activeToggle === item.id
                      ? "bg-gray-300"
                      : "hover:bg-gray-200"
                  }`}
                >
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
