import { Table, Column, ForeignKey, DataType } from "sequelize-typescript";
import { Forzado } from "./Forzado";
import { BaseModel } from "./BaseModel";

@Table({
	tableName: "ADJUNTO",
	timestamps: true,
})
export class Adjunto extends BaseModel<Adjunto> {
	@Column({ primaryKey: true, autoIncrement: true })
	ID_ADJUNTO!: number;

	@ForeignKey(() => Forzado)
	@Column(DataType.INTEGER)
	ID_FORZADO!: number;

	@Column(DataType.STRING)
	ADJUNTO!: string;
}
