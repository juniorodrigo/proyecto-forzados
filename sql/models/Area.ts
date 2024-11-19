import { Table, Column, DataType } from "sequelize-typescript";
import { BaseModel } from "./BaseModel";

@Table({
	tableName: "AREA",
	timestamps: true,
})
export class Area extends BaseModel<Area> {
	@Column({ primaryKey: true, autoIncrement: true })
	ID_AREA!: number;

	@Column(DataType.STRING)
	AREA!: string;
}
