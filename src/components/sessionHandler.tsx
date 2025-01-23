"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import useUserSession from "@/hooks/useSession";

interface SessionHandlerProps {
	children: ReactNode;
}

const SessionHandler: React.FC<SessionHandlerProps> = ({ children }) => {
	const router = useRouter();
	const { validateUserSession } = useUserSession();
	const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

	useEffect(() => {
		const isValid = validateUserSession();
		if (!isValid) {
			router.push("/auth/ingresar");
		} else {
			setIsValidSession(true);
		}
	}, [validateUserSession, router]);

	// Mientras validamos la sesión, no renderizamos nada.
	if (isValidSession === null) {
		return <div className="flex items-center justify-center h-screen">Cargando...</div>;
	}

	// Una vez validada la sesión, renderizamos a los hijos.
	return <>{children}</>;
};

export default SessionHandler;
