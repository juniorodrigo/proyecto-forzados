import { NextResponse } from "next/server";

// Manejo del método GET
export async function GET() {
	return NextResponse.json({ message: "GET request successful" });
}

// Manejo del método POST
export async function POST(request: Request) {
	try {
		const data = await request.json();
		return NextResponse.json({ message: "POST request successful", data });
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
	}
}
