import { Table, Column, DataType } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";

@Table({
	tableName: "ROL",
	timestamps: true,
})
export class Rol extends BaseModel<Rol> {
	@Column({ primaryKey: true, autoIncrement: true })
	ID_ROL!: number;

	@Column(DataType.STRING)
	DESCRIPCION!: string;
}
