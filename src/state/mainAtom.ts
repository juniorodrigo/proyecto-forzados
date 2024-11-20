// state/atoms.ts
import { atom } from "jotai";

export interface Row {
	id: number;
	nombre: string;
	area: string;
	solicitante: string;
	estado: string;
	fecha: string;
}

export const rowsAtom = atom<Row[]>([
	{
		id: 1,
		nombre: "Solicitud 1",
		area: "Productividad",
		solicitante: "Juan Carlos Carranza",
		estado: "aprobado",
		fecha: "2024-11-14",
	},
	{
		id: 2,
		nombre: "Solicitud 12",
		area: "Planta",
		solicitante: "Ana Karina Rodriguez",
		estado: "pendiente",
		fecha: "2024-11-15",
	},
	{
		id: 3,
		nombre: "Solicitud 111",
		area: "Metalurgia",
		solicitante: "Carlos Frank Ventura",
		estado: "rechazado",
		fecha: "2024-11-16",
	},
	{
		id: 4,
		nombre: "Solicitud final",
		area: "Metalurgia",
		solicitante: "Laura Cárdenas Loyola",
		estado: "ejecutado",
		fecha: "2024-11-17",
	},
	{
		id: 5,
		nombre: "Proyecto 3",
		area: "Productividad",
		solicitante: "Pedro Fernández",
		estado: "finalizado",
		fecha: "2024-11-18",
	},
	{
		id: 6,
		nombre: "Proyecto Final",
		area: "Planta",
		solicitante: "María Ramírez",
		estado: "pendiente",
		fecha: "2024-11-19",
	},
]);
