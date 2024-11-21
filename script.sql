
-- 1. CREACIÓN DE DATABASE FORZADOS
BEGIN
CREATE DATABASE forzados;
END;

-- 2. CREACIÓN DE TABLAS EN DATABASE FORZADOS
IF OBJECT_ID('ADJUNTO', 'U') IS NOT NULL DROP TABLE ADJUNTO;
    IF OBJECT_ID('FORZADO', 'U') IS NOT NULL DROP TABLE FORZADO;
    IF OBJECT_ID('USUARIO_ROL', 'U') IS NOT NULL DROP TABLE USUARIO_ROL;
    IF OBJECT_ID('ROL', 'U') IS NOT NULL DROP TABLE ROL;
    IF OBJECT_ID('USUARIO', 'U') IS NOT NULL DROP TABLE USUARIO;
    IF OBJECT_ID('AREA', 'U') IS NOT NULL DROP TABLE AREA;
    IF OBJECT_ID('MATRIZ_RIESGO', 'U') IS NOT NULL DROP TABLE MATRIZ_RIESGO;
    IF OBJECT_ID('MAESTRAS', 'U') IS NOT NULL DROP TABLE MAESTRAS;

    -- Crear tabla MAESTRAS
CREATE TABLE MAESTRAS (
    ID_MAESTRA INT PRIMARY KEY IDENTITY(1,1),
    CATEGORIA NVARCHAR(50) NOT NULL, -- Ejemplo: "SUBAREA", "ACTIVO", "DISCIPLINA", etc.
    DESCRIPCION NVARCHAR(255) NOT NULL
);

-- Crear tabla MATRIZ_RIESGO
CREATE TABLE MATRIZ_RIESGO (
    ID_MR INT PRIMARY KEY IDENTITY(1,1),
    IMPACTO NVARCHAR(50) NOT NULL,
    PROBABILIDAD NVARCHAR(50) NOT NULL,
    NIVEL NVARCHAR(50) NOT NULL,
    RIESGO NVARCHAR(50) NOT NULL
);

-- Crear tabla AREA
CREATE TABLE AREA (
    ID_AREA INT PRIMARY KEY IDENTITY(1,1),
    AREA NVARCHAR(100) NOT NULL
);

-- Crear tabla USUARIO
CREATE TABLE USUARIO (
    ID_USUARIO INT PRIMARY KEY IDENTITY(1,1),
    NOMBRES NVARCHAR(100) NOT NULL,
    NRO_DOCUMENTO NVARCHAR(20) NOT NULL UNIQUE,
    CORREO NVARCHAR(100) NOT NULL,
    ID_AREA INT NOT NULL,
    SOLICITANTE BIT DEFAULT 0,
    APROBADOR BIT DEFAULT 0,
    EJECUTOR BIT DEFAULT 0,
    SOLICITANTE_RETIRO BIT DEFAULT 0,
    APROBADOR_RETIRO BIT DEFAULT 0,
    EJECUTOR_RETIRO BIT DEFAULT 0,
    USERNAME NVARCHAR(50) NOT NULL,
    CONTRASENAHASH NVARCHAR(100) NOT NULL,
    FOREIGN KEY (ID_AREA) REFERENCES AREA(ID_AREA)
);

-- Crear tabla ROL
CREATE TABLE ROL (
    ID_ROL INT PRIMARY KEY IDENTITY(1,1),
    DESCRIPCION NVARCHAR(100) NOT NULL
);

-- Crear tabla USUARIO_ROL
CREATE TABLE USUARIO_ROL (
    ID_UROL INT PRIMARY KEY IDENTITY(1,1),
    ID_USUARIO INT NOT NULL,
    ID_ROL INT NOT NULL,
    ID_MR INT NOT NULL,
    FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO),
    FOREIGN KEY (ID_ROL) REFERENCES ROL(ID_ROL),
    FOREIGN KEY (ID_MR) REFERENCES MATRIZ_RIESGO(ID_MR)
);

-- Crear tabla FORZADO
CREATE TABLE FORZADO (
    ID_FORZADO INT PRIMARY KEY IDENTITY(1,1),
    ID_SUBAREA INT NOT NULL,
    ID_ACTIVO INT NOT NULL,
    ID_DISCIPLINA INT NOT NULL,
    ID_TURNO INT NOT NULL,
    ID_RESPONSABLE INT NOT NULL,
    ID_RIESGO INT NOT NULL,
    ID_PROBABILIDAD INT NOT NULL,
    ID_IMPACTO INT NOT NULL,
    ID_SOLICITANTE INT NOT NULL,
    ID_APROBADOR INT NOT NULL,
    ID_EJECUTOR INT NOT NULL,
    ID_TIPO INT NOT NULL,
    DESCRIPCION NVARCHAR(255),
    INTERLOCK NVARCHAR(50),
    AUTORIZACION NVARCHAR(50),
    FECHA_REALIZACION DATETIME,
    ID_SOLICITANTE_R INT,
    ID_APROBADOR_R INT,
    ID_EJECUTOR_R INT,
    AUTORIZACION_R NVARCHAR(50),
    FECHA_CIERRE DATETIME,
    ID_CREATOR INT NOT NULL,
    ID_MR INT,
    FOREIGN KEY (ID_SUBAREA) REFERENCES MAESTRAS(ID_MAESTRA),
    FOREIGN KEY (ID_ACTIVO) REFERENCES MAESTRAS(ID_MAESTRA),
    FOREIGN KEY (ID_DISCIPLINA) REFERENCES MAESTRAS(ID_MAESTRA),
    FOREIGN KEY (ID_TURNO) REFERENCES MAESTRAS(ID_MAESTRA),
    FOREIGN KEY (ID_RIESGO) REFERENCES MAESTRAS(ID_MAESTRA),
    FOREIGN KEY (ID_PROBABILIDAD) REFERENCES MAESTRAS(ID_MAESTRA),
    FOREIGN KEY (ID_IMPACTO) REFERENCES MAESTRAS(ID_MAESTRA),
    FOREIGN KEY (ID_TIPO) REFERENCES MAESTRAS(ID_MAESTRA),
    FOREIGN KEY (ID_SOLICITANTE) REFERENCES USUARIO(ID_USUARIO),
    FOREIGN KEY (ID_APROBADOR) REFERENCES USUARIO(ID_USUARIO),
    FOREIGN KEY (ID_EJECUTOR) REFERENCES USUARIO(ID_USUARIO),
    FOREIGN KEY (ID_SOLICITANTE_R) REFERENCES USUARIO(ID_USUARIO),
    FOREIGN KEY (ID_APROBADOR_R) REFERENCES USUARIO(ID_USUARIO),
    FOREIGN KEY (ID_EJECUTOR_R) REFERENCES USUARIO(ID_USUARIO),
    FOREIGN KEY (ID_CREATOR) REFERENCES USUARIO(ID_USUARIO),
    FOREIGN KEY (ID_MR) REFERENCES MATRIZ_RIESGO(ID_MR)
);

CREATE TABLE ADJUNTO (
    ID_ADJUNTO INT PRIMARY KEY IDENTITY(1,1),
    ID_FORZADO INT NOT NULL,
    ADJUNTO NVARCHAR(255),
    FOREIGN KEY (ID_FORZADO) REFERENCES FORZADO(ID_FORZADO));

-- 3. Inserción de datos de prueba

    -- Tabla AREA
    INSERT INTO AREA (AREA)
    VALUES
    ('Procesos'),
    ('Metalurgia'),
    ('Producción');

    -- Tabla MATRIZ_RIESGO
    INSERT INTO MATRIZ_RIESGO (IMPACTO, PROBABILIDAD, NIVEL, RIESGO)
    VALUES
    ('Bajo', 'Baja', 'Bajo', 'Aceptable'),
    ('Medio', 'Media', 'Moderado', 'Evaluar'),
    ('Alto', 'Alta', 'Crítico', 'Mitigar');

    -- Tabla USUARIO
    INSERT INTO USUARIO (NOMBRES, NRO_DOCUMENTO, CORREO, ID_AREA, SOLICITANTE, APROBADOR, EJECUTOR, USERNAME, CONTRASENAHASH)
    VALUES
    ('Juan Pérez', '12345678', 'juan.perez@empresa.com', 1, 0, 0, 0, 'ADMINADMIN', '$2b$10$MoiKjG/VfINA0E2FxJhN7u8f/GlBAEqy.JiN0LZ7oLgNECPFokAn2');

    -- Tabla ROL
    INSERT INTO ROL (DESCRIPCION)
    VALUES
    ('Solicitante Alta'),
    ('Aprobador Alta'),
    ('Ejecutor Alta'),
    ('Solicitante Baja'),
    ('Aprobador Baja'),
    ('Ejecutor Baja');

    -- Tabla USUARIO_ROL
    INSERT INTO USUARIO_ROL (ID_USUARIO, ID_ROL, ID_MR)
    VALUES
    (1, 1, 1);


-- 4. Consulta de prueba
SELECT u.*, A.AREA FROM USUARIO as u
         INNER JOIN AREA A on u.ID_AREA = A.ID_AREA
         WHERE USERNAME = 'ADMINADMIN'
