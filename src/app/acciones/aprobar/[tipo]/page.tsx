"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Popover from "@/components/Popover";

const AprobarPage = () => {
	const searchParams = useSearchParams();
	// const router = useRouter();
	const token = searchParams.get("token");
	const id = searchParams.get("id");
	const usuario = searchParams.get("bsx");

	const [message, setMessage] = useState("");
	const [type, setType] = useState<"success" | "error">("success");
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (token && id) {
			fetch("/api/solicitudes/alta/aprobar", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id, usuario, token }),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						setMessage(data.message);
						setType("success");
					} else {
						setMessage(data.message);
						setType("error");
					}
					setShow(true);
				})
				.catch((error) => {
					// Obtener el mensaje de error si está disponible
					if (error.message) {
						setMessage(error.message);
					} else {
						setMessage("Ocurrió un error al aprobar la solicitud");
					}
					setType("error");
					setShow(true);
				});
		}
	}, [token, id, usuario]);

	return (
		<div>
			<Popover message={message} type={type} show={show} />
			{/* <button onClick={() => router.push("/login")}>Iniciar sesión para ver más detalles</button> */}
			{/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<button
					onClick={() => router.push("/dashboard")}
					style={{
						padding: "10px 20px",
						fontSize: "18px",
						backgroundColor: "blue",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer",
					}}
				>
					Ir al inicio
				</button>
			</div> */}
		</div>
	);
};

export default AprobarPage;
