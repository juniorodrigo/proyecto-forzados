import { Table, Column, ForeignKey, DataType } from "sequelize-typescript";
import { Usuario } from "./Usuario";
import { Rol } from "./Rol";
import { BaseModel } from "./BaseModel";

@Table({
	tableName: "USUARIO_ROL",
	timestamps: true,
})
export class UsuarioRol extends BaseModel<UsuarioRol> {
	@Column({ primaryKey: true, autoIncrement: true })
	ID_UROL!: number;

	@ForeignKey(() => Usuario)
	@Column(DataType.INTEGER)
	ID_USUARIO!: number;

	@ForeignKey(() => Rol)
	@Column(DataType.INTEGER)
	ID_ROL!: number;

	@Column(DataType.INTEGER)
	ID_MR!: number;
}
