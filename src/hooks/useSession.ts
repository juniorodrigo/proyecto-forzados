import { useState, useEffect } from "react";

interface UserSession {
	name: string;
	id: number;
	area: string;
	roleName: string;
	role: number;
	roles: { [key: number]: string };
	jwt: string;
	flagNuevoIngreso: string;
}

export default function useUserSession() {
	const [user, setUser] = useState<UserSession | null>(null);

	// Recuperar datos de localStorage al montar el componente
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUser = localStorage.getItem("user");
			if (storedUser) {
				setUser(JSON.parse(storedUser));
			}
		}
	}, []);

	const saveUser = (userData: UserSession) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData));
	};

	// Eliminar datos de localStorage
	const clearUser = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	// Obtener datos del usuario desde el servidor
	const fetchUserFromServer = async (id: string) => {
		try {
			const response = await fetch(`/api/usuarios/${id}`);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const userData: UserSession = await response.json();
			saveUser(userData);
			return true;
		} catch (error) {
			console.error("Error fetching user data:", error);
			return false;
		}
	};

	const disableFlagNuevoIngreso = async () => {
		if (user) {
			const updatedUser = { ...user, flagNuevoIngreso: "0" };
			setUser(updatedUser);
			localStorage.setItem("user", JSON.stringify(updatedUser));
		}
	};

	const validateUserSession = (): boolean => {
		if (typeof window !== "undefined") {
			const storedUser = localStorage.getItem("user");
			return !!storedUser;
		}
		return false;
	};

	const doLogout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return { user, saveUser, clearUser, fetchUserFromServer, disableFlagNuevoIngreso, validateUserSession, doLogout };
}
