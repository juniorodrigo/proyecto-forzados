import type { Metadata } from "next";
import "../globals.css";
import { UiProvider } from "@/context/SidebarContext";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Sistema Forzado",
  description: "Sistema Forzado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
}
