import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
	tableName: "AREA",
	timestamps: false,
})
export class Area extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	ID_AREA!: number;

	@Column(DataType.STRING)
	AREA!: string;
}
