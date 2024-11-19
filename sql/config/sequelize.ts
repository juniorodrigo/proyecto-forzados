import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
	dialect: "mssql",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 1433,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	logging: false, // Cambia a true si necesitas logs de SQL
	dialectOptions: {
		options: {
			encrypt: true, // Requerido para conexiones seguras a Azure MSSQL
		},
	},
	define: {
		timestamps: true, // Incluye createdAt y updatedAt por defecto
	},
});

// Opcional: Exporta Sequelize para usar en otros módulos
export default sequelize;
