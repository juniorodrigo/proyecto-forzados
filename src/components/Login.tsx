"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import Popover from "@/components/Popover";
import useUserSession from "@/hooks/useSession";

const Login = () => {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({ username: "", password: "" });
	const [showPopover, setShowPopover] = useState(false);
	const { fetchUserFromServer } = useUserSession(); // Obtener la función del hook

	// Validaciones
	const validateUsername = (username: string) => {
		const usernameRegex = /^[A-ZÑ]{10,15}$/;
		return usernameRegex.test(username);
	};
	const validatePassword = (password: string) => {
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
		return passwordRegex.test(password);
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		const upperUsername = username.toUpperCase();
		const newErrors = { username: "", password: "" };

		// Validación de usuario
		if (!upperUsername) {
			newErrors.username = "El usuario es obligatorio";
		} else if (!validateUsername(upperUsername)) {
			newErrors.username = "El usuario debe tener entre 10 y 15 letras mayúsculas";
		}

		// Validación de contraseña
		if (!password) {
			newErrors.password = "La contraseña es obligatoria";
		} else if (!validatePassword(password)) {
			newErrors.password = "La contraseña debe tener al menos 8 caracteres alfanuméricos";
		}

		if (newErrors.username || newErrors.password) {
			setErrors(newErrors);

			setTimeout(() => {
				setErrors({ username: "", password: "" });
			}, 2000);
			return;
		}
		const result = await signIn("credentials", {
			redirect: false,
			username: upperUsername,
			password,
			callbackUrl: "/dashboard",
		});

		if (result?.error) {
			setErrors({ ...newErrors, password: "Credenciales incorrectas" });

			setTimeout(() => {
				setErrors({ username: "", password: "" });
			}, 2000);
			return;
		}

		const result2 = await fetchUserFromServer(upperUsername);

		if (!result2) {
			setErrors({ ...newErrors, password: "Credenciales incorrectas" });

			setTimeout(() => {
				setErrors({ username: "", password: "" });
			}, 2000);
			return;
		}

		// Si la autenticación fue exitosa
		setErrors({ username: "", password: "" });
		setShowPopover(true);

		setTimeout(() => {
			setShowPopover(false);
			router.push("/dashboard/consultas");
		}, 2000);
	};

	return (
		<div className="flex h-screen w-full bg-gray-100">
			{/* Sección de Imagen */}
			<div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url("/images/login.png")' }}></div>

			{/* Sección del Formulario */}
			<div className="flex w-full md:w-1/2 items-center justify-center p-6 bg-white">
				<div className="w-full max-w-md space-y-6 relative">
					<h2 className="text-2xl font-semibold text-center text-gray-800">
						Bienvenido al <br />
						<span className="text-sky-800 text-4xl">Sistema de control de Forzados</span>
					</h2>

					<div className="space-y-6">
						{/* Campo de Usuario */}
						<div className="relative">
							<FaUser className="absolute left-4 top-5 text-gray-400" />
							<input
								type="text"
								placeholder="Usuario"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="w-full pl-10 pr-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
								required
							/>
							{errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
						</div>

						{/* Campo de Contraseña */}
						<div className="relative">
							<FaLock className="absolute left-4 top-5 text-gray-400" />
							<input
								type="password"
								placeholder="Contraseña"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full pl-10 pr-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
								required
							/>
							{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
						</div>

						{/* Popover de éxito */}
						<Popover message="Inicio de sesión exitoso. Redirigiendo..." type="success" show={showPopover} />

						{/* Botón de Iniciar Sesión */}
						<button onClick={handleLogin} className="w-full flex items-center justify-center px-4 py-4 text-white bg-sky-950 hover:bg-sky-800 rounded-lg transition duration-200 focus:outline-none">
							<FaSignInAlt className="mr-2" />
							Iniciar sesión
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
