import type { Metadata } from "next";
import "../globals.css";
import { UiProvider } from "@/context/SidebarContext";
export const metadata: Metadata = {
	title: "Sistema de  Forzados",
	description: "Sistema de Forzados",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<UiProvider>
			<div className="flex h-screen bg-gray-100 overflow-hidden">
				<div className="flex-1 flex flex-col overflow-y-auto">
					<main className="flex-1 p-4 overflow-y-auto">{children}</main>
				</div>
			</div>
		</UiProvider>
	);
}
