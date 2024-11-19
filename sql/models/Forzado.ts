import { Table, Column, Model, ForeignKey, DataType } from "sequelize-typescript";
import { Usuario } from "./Usuario";
// import { Adjunto } from "./Adjunto";

@Table({
	tableName: "FORZADO",
	timestamps: true,
})
export class Forzado extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	ID_FORZADO!: number;

	@Column(DataType.INTEGER)
	ID_SUBAREA!: number;

	@Column(DataType.INTEGER)
	ID_ACTIVO!: number;

	@Column(DataType.STRING)
	DESCRIPCION!: string;

	@Column(DataType.INTEGER)
	ID_DISCIPLINA!: number;

	@Column(DataType.INTEGER)
	ID_TURNO!: number;

	@Column(DataType.INTEGER)
	INTERLOCK!: number;

	@ForeignKey(() => Usuario)
	@Column(DataType.INTEGER)
	ID_RESPONSABLE!: number;

	@Column(DataType.INTEGER)
	ID_RIESGO!: number;

	@Column(DataType.INTEGER)
	ID_PROBABILIDAD!: number;

	@Column(DataType.INTEGER)
	ID_IMPACTO!: number;

	@ForeignKey(() => Usuario)
	@Column(DataType.INTEGER)
	ID_SOLICITANTE!: number;

	@ForeignKey(() => Usuario)
	@Column(DataType.INTEGER)
	ID_APROBADOR!: number;

	@ForeignKey(() => Usuario)
	@Column(DataType.INTEGER)
	ID_EJECUTOR!: number;

	@Column(DataType.STRING)
	AUTORIZACION!: string;

	@Column(DataType.INTEGER)
	ID_TIPO!: number;

	@Column(DataType.DATE)
	FECHA_REALIZACION!: Date;

	@ForeignKey(() => Usuario)
	@Column(DataType.INTEGER)
	ID_SOLICITANTE_R!: number;

	@ForeignKey(() => Usuario)
	@Column(DataType.INTEGER)
	ID_APROBADOR_R!: number;

	@ForeignKey(() => Usuario)
	@Column(DataType.INTEGER)
	ID_EJECUTOR_R!: number;

	@Column(DataType.STRING)
	AUTORIZACION_R!: string;

	@Column(DataType.DATE)
	FECHA_CIERRE!: Date;

	@Column(DataType.STRING)
	OBSERVACION!: string;

	@ForeignKey(() => Usuario)
	@Column(DataType.INTEGER)
	ID_CREADOR!: number;
}
