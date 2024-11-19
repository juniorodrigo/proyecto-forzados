import { Sequelize } from "sequelize-typescript";
import { Forzado } from "../models/Forzado";
import { Adjunto } from "../models/Adjunto";
import { Usuario } from "../models/Usuario";
import { UsuarioRol } from "../models/UsuarioRol";
import { Rol } from "../models/Rol";
import { MatrizRiesgo } from "../models/MatrizRiesgo";
import { Area } from "../models/Area";

const sequelize = new Sequelize({
	dialect: "mssql",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 1433,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	logging: false,
	dialectOptions: {
		options: {
			encrypt: true,
		},
	},
	define: {
		timestamps: true,
	},
});

sequelize.addModels([Forzado, Adjunto, Usuario, UsuarioRol, Rol, MatrizRiesgo, Area]);

// sequelize.addHook("beforeCreate", (instance: any, options: any) => {
// 	instance.createdBy = options.user || "system";
// });

// sequelize.addHook("beforeUpdate", (instance: any, options: any) => {
// 	instance.updatedBy = options.user || "system";
// });

export default sequelize;
