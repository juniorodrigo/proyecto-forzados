import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
	tableName: "MATRIZ_RIESGO",
	timestamps: true,
})
export class MatrizRiesgo extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	ID_MR!: number;

	@Column(DataType.INTEGER)
	IMPACTO!: number;

	@Column(DataType.INTEGER)
	PROBABILIDAD!: number;

	@Column(DataType.INTEGER)
	NIVEL!: number;

	@Column(DataType.STRING)
	RIESGO!: string;
}
