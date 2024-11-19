import { Table, Column, Model, ForeignKey, DataType } from "sequelize-typescript";
import { Forzado } from "./Forzado";

@Table({
	tableName: "ADJUNTO",
	timestamps: false,
})
export class Adjunto extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	ID_ADJUNTO!: number;

	@ForeignKey(() => Forzado)
	@Column(DataType.INTEGER)
	ID_FORZADO!: number;

	@Column(DataType.STRING)
	ADJUNTO!: string;
}
