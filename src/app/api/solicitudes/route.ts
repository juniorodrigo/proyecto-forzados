import { NextResponse } from "next/server";

// Manejo del método GET
export async function GET() {
	// Obtener todas las solicitudes de alta o baja
	return NextResponse.json({ message: "GET request successful" });
}
