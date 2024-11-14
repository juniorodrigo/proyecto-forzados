import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { UiProvider } from "@/context/SidebarContext";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <UiProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Navbar />
          <main className="flex-1 p-4 overflow-y-auto">{children}</main>
        </div>
      </div>
    </UiProvider>
  );
};

export default Layout;
