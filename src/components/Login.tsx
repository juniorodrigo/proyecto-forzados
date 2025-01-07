"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import useUserSession from "@/hooks/useSession";
import Image from "next/image";

const Login = () => {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({ username: "", password: "" });
	const { fetchUserFromServer } = useUserSession();
	const [showPassword, setShowPassword] = useState(false);

	// Validaciones
	const validateUsername = (username: string) => {
		const usernameRegex = /^[A-ZÑ]{5,20}$/;
		return usernameRegex.test(username);
	};
	const validatePassword = (password: string) => {
		const errors = [];
		if (!/.{8,}/.test(password)) errors.push("al menos 8 caracteres");
		return errors;
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		const upperUsername = username.toUpperCase();
		const newErrors = { username: "", password: "" };

		// Validación de usuario
		if (!upperUsername) {
			newErrors.username = "El usuario es obligatorio";
		} else if (!validateUsername(upperUsername)) {
			newErrors.username = "El usuario debe tener entre 5 y 20 letras mayúsculas";
		}

		// Validación de contraseña
		const passwordErrors = validatePassword(password);
		if (!password) {
			newErrors.password = "La contraseña es obligatoria";
		} else if (passwordErrors.length > 0) {
			newErrors.password = `La contraseña debe tener ${passwordErrors.join(", ")}`;
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

		setTimeout(() => {
			router.push("/dashboard/consultas");
		}, 0);
	};

	return (
		<div className="flex h-screen w-full bg-gray-100 relative">
			{/* Imagen de fondo */}
			<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/login.jpg")', filter: "brightness(0.5)" }}></div>

			{/* Sección del Formulario */}
			<div className="relative z-10 flex w-full items-center justify-center p-6">
				<div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
					{/* Logo */}
					<div className="flex justify-center">
						<Image src="/images/logo.png" alt="Logo" width={150} height={85} />
					</div>

					<h2 className="text-2xl font-semibold text-center text-gray-800">
						Bienvenido al <br />
						<span className="text-[#001D39] text-3xl">Sistema de gestión de forzados</span>
					</h2>

					<form className="space-y-6" onSubmit={handleLogin}>
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
								type={showPassword ? "text" : "password"}
								placeholder="Contraseña"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full pl-10 pr-10 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
								required
							/>
							<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-5 text-gray-400">
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</button>
							{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
						</div>
						{/* Botón de Iniciar Sesión */}
						<button type="submit" className="w-full flex items-center justify-center px-4 py-4 text-white bg-sky-950 hover:bg-sky-800 rounded-lg transition duration-200 focus:outline-none">
							<FaSignInAlt className="mr-2" />
							Iniciar sesión
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
