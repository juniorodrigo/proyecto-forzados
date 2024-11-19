import { Column, DataType } from "sequelize-typescript";

export abstract class AuditColumns {
	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
		comment: "Fecha y hora de creación del registro",
	})
	createdAt!: Date;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
		comment: "Fecha y hora de la última actualización",
	})
	updatedAt!: Date;

	@Column({
		type: DataType.STRING,
		allowNull: true,
		comment: "Usuario que creó el registro",
	})
	createdBy?: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
		comment: "Usuario que actualizó el registro",
	})
	updatedBy?: string;
}
