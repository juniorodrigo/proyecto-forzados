import { NextRequest, NextResponse } from "next/server";
import { pagesOptions } from "@/app/api/auth/[...nextauth]/pages-options";
import withAuth from "next-auth/middleware";

// Middleware con autenticación
export default withAuth({
	pages: {
		...pagesOptions,
	},
});

// Middleware para habilitar CORS a todos los orígenes
export async function middleware(req: NextRequest) {
	const response = NextResponse.next();
	response.headers.set("Access-Control-Allow-Origin", "*"); // Permitir todos los orígenes
	response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Métodos permitidos
	response.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, X-Requested-With" // Cabeceras personalizadas permitidas
	);
	response.headers.set("Access-Control-Allow-Credentials", "true"); // Si necesitas credenciales compartidas
	// Si es una solicitud OPTIONS (preflight), responde directamente
	if (req.method === "OPTIONS") {
		return new NextResponse(null, { headers: response.headers });
	}
	return response;
}
export const config = {
	matcher: [
		"/", // Aplica a todas las rutas, puedes agregar más según lo necesites
		// "/dashboard/:path*",
		// "/financial",
		// "/analytics",
		// "/logistics/:path*",
		// ...
	],
};
