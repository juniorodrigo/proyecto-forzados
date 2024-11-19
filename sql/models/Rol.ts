import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
	tableName: "ROL",
	timestamps: false,
})
export class Rol extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	ID_ROL!: number;

	@Column(DataType.STRING)
	DESCRIPCION!: string;
}
