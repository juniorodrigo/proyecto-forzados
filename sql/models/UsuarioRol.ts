import { Table, Column, Model, ForeignKey, DataType } from "sequelize-typescript";
import { Usuario } from "./Usuario";
import { Rol } from "./Rol";

@Table({
	tableName: "USUARIO_ROL",
	timestamps: false,
})
export class UsuarioRol extends Model {
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
