import { Table, Column, Model, ForeignKey, DataType } from "sequelize-typescript";
import { Area } from "./Area";

@Table({
	tableName: "USUARIO",
	timestamps: false,
})
export class Usuario extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	ID_USUARIO!: number;

	@Column(DataType.STRING)
	NOMBRES!: string;

	@Column(DataType.STRING)
	NRO_DOCUMENTO!: string;

	@Column(DataType.STRING)
	CORREO!: string;

	@ForeignKey(() => Area)
	@Column(DataType.INTEGER)
	ID_AREA!: number;

	@Column(DataType.STRING)
	USER!: string;

	@Column(DataType.STRING)
	CONTRASENA!: string;
}
