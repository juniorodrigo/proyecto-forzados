import sql from "mssql";

const config: sql.config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER || "",
	database: process.env.DB_NAME,
	options: {
		encrypt: true, // Usar `true` si estás en Azure, `false` para servidores locales
		trustServerCertificate: true, // Solo para desarrollo local
	},
};

export const poolPromise = new sql.ConnectionPool(config)
	.connect()
	.then((pool) => {
		console.log("Connected to SQL Server");
		return pool;
	})
	.catch((err) => {
		console.error("Database Connection Failed!", err);
		throw err;
	});
