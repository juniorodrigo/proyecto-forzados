import { Model } from "sequelize-typescript";
import { AuditColumns } from "./AuditColumns";

export class BaseModel<T extends object> extends Model<T> implements AuditColumns {
	createdAt!: Date;
	updatedAt!: Date;
	createdBy?: string;
	updatedBy?: string;
}
