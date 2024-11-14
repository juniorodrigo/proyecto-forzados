"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPopover, setShowPopover] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    const newErrors = { email: "", password: "" };

    // Validación de correo
    if (!email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!validateEmail(email)) {
      newErrors.email = "El correo no es válido";
    }

    // Validación de contraseña
    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    // Verificar credenciales
    if (email === "admin@gmail.com" && password === "admin") {
      setErrors({ email: "", password: "" });
      setShowPopover(true); // Mostrar el popover

      // Redirigir después de 2 segundos
      setTimeout(() => {
        setShowPopover(false);
        router.push("/dashboard");
      }, 2000);
    } else if (!newErrors.email && !newErrors.password) {
      newErrors.password = "Credenciales incorrectas";
    }

    setErrors(newErrors);
    // Limpiar mensaje de éxito o error después de 2 segundos
    if (newErrors.password || newErrors.email) {
      setTimeout(() => {
        setErrors({ email: "", password: "" });
      }, 2000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sección de Imagen */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/login.png")' }}
      ></div>

      {/* Sección del Formulario */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-6 relative">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Bienvenido al <br />
            <span className="text-sky-800 text-4xl">Sistema Forzado</span>
          </h2>

          <div className="space-y-6">
            {/* Campo de Correo */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-5 text-gray-400" />
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                required
                autoComplete="false"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
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
                autoComplete="false"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Checkbox de Recordar sesión */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-gray-600">Recordar sesión</label>
            </div>

            {/* Popover de éxito */}
            {showPopover && (
              <div
                className="fixed top-10 inset-x-0 flex justify-center transition-transform transform translate-x-full"
                style={{
                  transition: "transform 0.5s ease-out",
                  transform: "translateX(0)",
                }}
              >
                <div className="bg-green-500 text-white text-center py-2 px-4 rounded-lg shadow-lg">
                  Inicio de sesión exitoso. Redirigiendo...
                </div>
              </div>
            )}

            {/* Botón de Iniciar Sesión */}
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center px-4 py-4 text-white bg-sky-950 hover:bg-sky-800 rounded-lg transition duration-200 focus:outline-none"
            >
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
