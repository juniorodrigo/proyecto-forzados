import { QueryInterface, DataTypes } from "sequelize";

const migration = {
	async up(queryInterface: QueryInterface) {
		// Crear tabla Area
		await queryInterface.createTable("Area", {
			id_area: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			area: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
		});

		// Crear tabla Usuario
		await queryInterface.createTable("Usuario", {
			id_usuario: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			nombres: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			nro_documento: {
				type: DataTypes.STRING(20),
				allowNull: false,
				unique: true,
			},
			correo: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true,
			},
			username: {
				type: DataTypes.STRING(50),
				allowNull: false,
				unique: true,
			},
			contrasena: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			id_area: {
				type: DataTypes.INTEGER,
				references: {
					model: "Area",
					key: "id_area",
				},
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		});

		// Crear tabla Rol
		await queryInterface.createTable("Rol", {
			id_rol: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			descripcion: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
		});

		// Crear tabla UsuarioRol
		await queryInterface.createTable("UsuarioRol", {
			id_urole: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			id_usuario: {
				type: DataTypes.INTEGER,
				references: {
					model: "Usuario",
					key: "id_usuario",
				},
				allowNull: false,
			},
			id_rol: {
				type: DataTypes.INTEGER,
				references: {
					model: "Rol",
					key: "id_rol",
				},
				allowNull: false,
			},
			id_mr: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "MatrizRiesgo",
					key: "id_mr",
				},
			},
		});

		// Crear tabla MatrizRiesgo
		await queryInterface.createTable("MatrizRiesgo", {
			id_mr: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			impacto: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			probabilidad: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			nivel: {
				type: DataTypes.STRING(20),
				allowNull: false,
			},
			riesgo: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
		});

		// Crear tabla Forzado
		await queryInterface.createTable("Forzado", {
			id_forzado: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			id_subarea: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			id_activo: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			descripcion: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			id_disciplina: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			id_turno: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			interlock: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			id_responsable: {
				type: DataTypes.INTEGER,
				references: {
					model: "Usuario",
					key: "id_usuario",
				},
				allowNull: false,
			},
			id_riesgo: {
				type: DataTypes.INTEGER,
				references: {
					model: "MatrizRiesgo",
					key: "id_mr",
				},
				allowNull: false,
			},
			autorizacion: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			id_tipo: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			fecha_realizacion: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			fecha_cierre: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			observacion: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			id_creador: {
				type: DataTypes.INTEGER,
				references: {
					model: "Usuario",
					key: "id_usuario",
				},
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		});

		// Crear tabla Adjunto
		await queryInterface.createTable("Adjunto", {
			id_adjunto: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			id_forzado: {
				type: DataTypes.INTEGER,
				references: {
					model: "Forzado",
					key: "id_forzado",
				},
				allowNull: false,
			},
			adjunto: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		});

		// Crear tabla HistoricoEstados
		await queryInterface.createTable("HistoricoEstados", {
			id_historico: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			id_forzado: {
				type: DataTypes.INTEGER,
				references: {
					model: "Forzado",
					key: "id_forzado",
				},
				allowNull: false,
			},
			estado: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			id_usuario: {
				type: DataTypes.INTEGER,
				references: {
					model: "Usuario",
					key: "id_usuario",
				},
				allowNull: false,
			},
			fecha_cambio: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		});
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.dropTable("HistoricoEstados");
		await queryInterface.dropTable("Adjunto");
		await queryInterface.dropTable("Forzado");
		await queryInterface.dropTable("MatrizRiesgo");
		await queryInterface.dropTable("UsuarioRol");
		await queryInterface.dropTable("Rol");
		await queryInterface.dropTable("Usuario");
		await queryInterface.dropTable("Area");
	},
};

export default migration;
