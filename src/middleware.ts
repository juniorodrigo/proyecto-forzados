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
	response.headers.append("Access-Control-Allow-Credentials", "true");
	response.headers.append("Access-Control-Allow-Origin", "");
	response.headers.append("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
	response.headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
	response.headers.set("Access-Control-Allow-Origin", "*");
	response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	response.headers.set("Access-Control-Allow-Credentials", "true");
	if (req.method === "OPTIONS") {
		return new NextResponse(null, { headers: response.headers });
	}
	return response;
}
export const config = {
	matcher: ["/", "/api/:path*"],
};
