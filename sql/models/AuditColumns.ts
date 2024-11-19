import { Column, DataType } from "sequelize-typescript";

export abstract class AuditColumns {
	// Usuario que creó el registro
	@Column({
		type: DataType.STRING,
		allowNull: true,
		comment: "Usuario que creó el registro",
	})
	createdBy?: string;

	// Usuario que actualizó el registro
	@Column({
		type: DataType.STRING,
		allowNull: true,
		comment: "Usuario que actualizó el registro",
	})
	updatedBy?: string;
}
