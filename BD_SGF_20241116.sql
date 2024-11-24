/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2005                    */
/* Created on:     16/11/2024 11:45:24                          */
/*==============================================================*/


if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MAE_PERMISO') and o.name = 'FK_MAE_PERM_REFERENCE_MAE_ROL')
alter table MAE_PERMISO
   drop constraint FK_MAE_PERM_REFERENCE_MAE_ROL
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MAE_PERMISO') and o.name = 'FK_MAE_PERM_REFERENCE_MAE_OPCI')
alter table MAE_PERMISO
   drop constraint FK_MAE_PERM_REFERENCE_MAE_OPCI
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MAE_USUARIO') and o.name = 'FK_MAE_USUA_REFERENCE_MAE_PUES')
alter table MAE_USUARIO
   drop constraint FK_MAE_USUA_REFERENCE_MAE_PUES
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MAE_USUARIO') and o.name = 'FK_MAE_USUA_REFERENCE_MAE_AREA')
alter table MAE_USUARIO
   drop constraint FK_MAE_USUA_REFERENCE_MAE_AREA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MAE_USUARIO_ROL') and o.name = 'FK_MAE_USUA_REFERENCE_TRS_SOLI')
alter table MAE_USUARIO_ROL
   drop constraint FK_MAE_USUA_REFERENCE_TRS_SOLI
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MAE_USUARIO_ROL') and o.name = 'FK_MAE_USUA_REFERENCE_MAE_USUA')
alter table MAE_USUARIO_ROL
   drop constraint FK_MAE_USUA_REFERENCE_MAE_USUA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MAE_USUARIO_ROL') and o.name = 'FK_MAE_USUA_REFERENCE_MAE_ROL')
alter table MAE_USUARIO_ROL
   drop constraint FK_MAE_USUA_REFERENCE_MAE_ROL
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MATRIZ_RIESGO') and o.name = 'FK_MATRIZ_R_REFERENCE_IMPACTO')
alter table MATRIZ_RIESGO
   drop constraint FK_MATRIZ_R_REFERENCE_IMPACTO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MATRIZ_RIESGO') and o.name = 'FK_MATRIZ_R_REFERENCE_PROBABIL')
alter table MATRIZ_RIESGO
   drop constraint FK_MATRIZ_R_REFERENCE_PROBABIL
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MATRIZ_RIESGO') and o.name = 'FK_MATRIZ_R_REFERENCE_RIESGO')
alter table MATRIZ_RIESGO
   drop constraint FK_MATRIZ_R_REFERENCE_RIESGO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_SUB_AREA')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_SUB_AREA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_DISCIPLI')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_DISCIPLI
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_TURNO')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_TURNO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_TAG_CENTRO')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_TAG_CENTRO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_TIPO_FOR')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_TIPO_FOR
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'SOLFROZA_MOTIVO_RECHAZO2')
alter table TRS_SOLICITUD_FORZADO
   drop constraint SOLFROZA_MOTIVO_RECHAZO2
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_RESPONSABLE')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_RESPONSABLE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_MAE_RIES')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_MAE_RIES
go

if exists (select 1
            from  sysobjects
           where  id = object_id('DISCIPLINA')
            and   type = 'U')
   drop table DISCIPLINA
go

if exists (select 1
            from  sysobjects
           where  id = object_id('IMPACTO')
            and   type = 'U')
   drop table IMPACTO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_AREA')
            and   type = 'U')
   drop table MAE_AREA
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_OPCIONES')
            and   type = 'U')
   drop table MAE_OPCIONES
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_PERMISO')
            and   type = 'U')
   drop table MAE_PERMISO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_PUESTO')
            and   type = 'U')
   drop table MAE_PUESTO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_RIESGO_A')
            and   type = 'U')
   drop table MAE_RIESGO_A
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_ROL')
            and   type = 'U')
   drop table MAE_ROL
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_USUARIO')
            and   type = 'U')
   drop table MAE_USUARIO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_USUARIO_ROL')
            and   type = 'U')
   drop table MAE_USUARIO_ROL
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MATRIZ_RIESGO')
            and   type = 'U')
   drop table MATRIZ_RIESGO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MOTIVO_RECHAZO')
            and   type = 'U')
   drop table MOTIVO_RECHAZO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PROBABILIDAD')
            and   type = 'U')
   drop table PROBABILIDAD
go

if exists (select 1
            from  sysobjects
           where  id = object_id('RESPONSABLE')
            and   type = 'U')
   drop table RESPONSABLE
go

if exists (select 1
            from  sysobjects
           where  id = object_id('RIESGO')
            and   type = 'U')
   drop table RIESGO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('SUB_AREA')
            and   type = 'U')
   drop table SUB_AREA
go

if exists (select 1
            from  sysobjects
           where  id = object_id('TAG_CENTRO')
            and   type = 'U')
   drop table TAG_CENTRO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('TIPO_FORZADO')
            and   type = 'U')
   drop table TIPO_FORZADO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('TRS_SOLICITUD_FORZADO')
            and   type = 'U')
   drop table TRS_SOLICITUD_FORZADO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('TURNO')
            and   type = 'U')
   drop table TURNO
go

/*==============================================================*/


create table DISCIPLINA (
   DISCIPLINA_ID        int                  identity,
   DESCRIPCION          varchar(30)          null,
   constraint PK_DISCIPLINA primary key (DISCIPLINA_ID)
)
go

create table IMPACTO (
   IMPACTO_ID           int                  identity,
   DESCRIPCION          varchar(30)          null,
   constraint PK_IMPACTO primary key (IMPACTO_ID)
)
go

create table MAE_AREA (
   AREA_ID              int                  identity,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   USUARIO__CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_MAE_AREA primary key (AREA_ID)
)
go

create table MAE_OPCIONES (
   OPCIONES_ID          int                  identity,
   DESCRIPCION          varchar(80)          null,
   ESTADO               int                  null,
   constraint PK_MAE_OPCIONES primary key (OPCIONES_ID)
)
go

create table MAE_PERMISO (
   PERMISO_ID           int                  identity,
   ROL_ID               int                  null,
   OPCIONES_ID          int                  null,
   CREAR                int                  null,
   EDITAR               int                  null,
   CONSULTAR            int                  null,
   ESTADO               int                  null,
   constraint PK_MAE_PERMISO primary key (PERMISO_ID)
)
go

create table MAE_PUESTO (
   PUESTO_ID            int                  identity,
   DESCRIPCION          varchar(50)          null,
   constraint PK_MAE_PUESTO primary key (PUESTO_ID)
)
go

create table MAE_RIESGO_A (
   RIESGOA_ID           int                  identity,
   DESCRIPCION          varchar(80)          null,
   constraint PK_MAE_RIESGO_A primary key (RIESGOA_ID)
)
go

create table MAE_ROL (
   ROL_ID               int                  identity,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   FECHA_CREACION       varchar(20)          null,
   USUARIO_CREACION     datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA__MODIFICACION  datetime             null,
   constraint PK_MAE_ROL primary key (ROL_ID)
)
go

create table MAE_USUARIO (
   USUARIO_ID           int                  identity,
   AREA_ID              int                  null,
   PUESTO_ID            int                  null,
   USUARIO              varchar(15)          null,
   PASSWORD             char(8)              null,
   NOMBRE               varchar(50)          null,
   APEPATERNO           varchar(50)          null,
   APEMATERNO           varchar(50)          null,
   CORREO               varchar(30)          null,
   ESTADO               int                  null,
   USUARIO_CREACION     varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_MAE_USUARIO primary key (USUARIO_ID)
)
go

create table MAE_USUARIO_ROL (
   USUARIOROL_ID        int                  identity,
   USUARIO_ID           int                  null,
   ROL_ID               int                  null,
   SOLICITUD_ID         int                  null,
   constraint PK_MAE_USUARIO_ROL primary key (USUARIOROL_ID)
)
go

create table MATRIZ_RIESGO (
   MATRIZ_ID            int                  identity,
   IMPACTO_ID           int                  null,
   RIESGO_ID            int                  null,
   PROBABILIDAD_ID      int                  null,
   NIVEL                int                  null,
   constraint PK_MATRIZ_RIESGO primary key (MATRIZ_ID)
)
go

create table MOTIVO_RECHAZO (
   MOTIVORECHAZO_ID     int                  identity,
   DESCRIPCION          varchar(30)          null,
   constraint PK_MOTIVO_RECHAZO primary key (MOTIVORECHAZO_ID)
)
go

create table PROBABILIDAD (
   PROBABILIDAD_ID      int                  identity,
   DESCRIPCION          varchar(30)          null,
   constraint PK_PROBABILIDAD primary key (PROBABILIDAD_ID)
)
go

create table RESPONSABLE (
   RESPONSABLE_ID       int                  identity,
   NOMBRE               varchar(30)          null,
   constraint PK_RESPONSABLE primary key (RESPONSABLE_ID)
)
go

create table RIESGO_A (
   RIESGO_ID            int                  identity,
   DESCRIPCION          varchar(30)          null,
   constraint PK_RIESGO_A primary key (RIESGO_ID)
)
go

create table SUB_AREA (
   SUBAREA_ID           int                  identity,
   CODIGO               varchar(30)         null,
   DESCRIPCION          varchar(30)         null,
   constraint PK_SUB_AREA primary key (SUBAREA_ID)
)
go

create table TAG_CENTRO (
   TAGCENTRO_ID         int                  identity,
   CODIGO               varchar(30)         null,
   DESCRIPCION          varchar(30)         null,
   constraint PK_TAG_CENTRO primary key (TAGCENTRO_ID)
)
go

create table TIPO_FORZADO (
   TIPOFORZADO_ID       int                  identity,
   DESCRIPCION          varchar(30)          null,
   constraint PK_TIPO_FORZADO primary key (TIPOFORZADO_ID)
)
go

create table TRS_SOLICITUD_FORZADO (
   SOLICITUD_ID         int                  identity,
   SUBAREA_ID           int                  null,
   DISCIPLINA_ID        int                  null,
   TURNO_ID             int                  null,
   MOTIVORECHAZO_ID     int                  null,
   TIPOFORZADO_ID       int                  null,
   TAGCENTRO_ID         int                  null,
   RESPONSABLE_ID       int                  null,
   RIESGOA_ID           int                  null,
   TIPOSOLICITUD        int                  null,
   INTERLOCK            int                  null,
   DESCRIPCIONFORZADO   varchar(100)         null,
   ESTADOSOLICITUD      int                  null,
   FECHAREALIZACION     datetime             null,
   FECHACIERRE          datetime             null,
   USUARIO_CREACION     varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_TRS_SOLICITUD_FORZADO primary key (SOLICITUD_ID)
)
go

create table TURNO (
   TURNO_ID             int                  identity,
   DESCRIPCION          varchar(30)          null,
   constraint PK_TURNO primary key (TURNO_ID)
)
go

/*==============================================================*/
-- INSERCIÓN DE DATOS

insert into DISCIPLINA (DESCRIPCION) values ('comisionamiento'),
('dcs'),
('eléctrica'),
('instrumentación'),
('mantenimiento'),
('mecánica'),
('metalurgia'),
('operaciones')
go

insert into IMPACTO (DESCRIPCION) values ('insignificante'),('menor'),('moderado'),('mayor'), ('extremo')
go

insert into MAE_AREA (DESCRIPCION, ESTADO, USUARIO__CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION)
values ('Area 1', 1, 'user1', getdate(), 'user2', getdate())
go

insert into MAE_OPCIONES (DESCRIPCION, ESTADO) values ('Opcion 1', 1)
go

insert into MAE_PERMISO (ROL_ID, OPCIONES_ID, CREAR, EDITAR, CONSULTAR, ESTADO)
values (1, 1, 1, 1, 1, 1)
go

insert into MAE_PUESTO (DESCRIPCION) values ('Puesto 1')
go

insert into MAE_RIESGO_A (DESCRIPCION) values ('Riesgo A 1')
go

insert into MAE_ROL (DESCRIPCION, ESTADO, FECHA_CREACION, USUARIO_CREACION, USUARIO_MODIFICACION, FECHA__MODIFICACION)
values ('Rol 1', 1, getdate(), 'user1', 'user2', getdate())
go

insert into MAE_USUARIO (AREA_ID, PUESTO_ID, USUARIO, PASSWORD, NOMBRE, APEPATERNO, APEMATERNO, CORREO, ESTADO, USUARIO_CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION)
values (1, 1, 'usuario1', 'pass1234', 'Nombre 1', 'Apellido Paterno', 'Apellido Materno', 'correo@example.com', 1, 'user1', getdate(), 'user2', getdate())
go

insert into MAE_USUARIO_ROL (USUARIO_ID, ROL_ID, SOLICITUD_ID)
values (1, 1, 1)
go

insert into MATRIZ_RIESGO (IMPACTO_ID, RIESGO_ID, PROBABILIDAD_ID, NIVEL)
values (1, 1, 1, 1)
go

insert into MOTIVO_RECHAZO (DESCRIPCION) values ('Motivo Rechazo 1')
go

insert into PROBABILIDAD (DESCRIPCION) values ('raro'), ('improbable'), ('posible'), ('probable'), ('casi seguro')
go

insert into RESPONSABLE (NOMBRE) values ('gerencia asset. performance'), ('gerencia planta')
go

insert into RIESGO (DESCRIPCION) values ('equipos'), ('personas'), ('procesos')
go

insert into SUB_AREA (DESCRIPCION) values ('Sub Area 1')
go

insert into TAG_CENTRO (DESCRIPCION) values ('Tag Centro 1')
go

insert into TIPO_FORZADO (DESCRIPCION) values ('hardware'), ('logico')
go

insert into TRS_SOLICITUD_FORZADO (SUBAREA_ID, DISCIPLINA_ID, TURNO_ID, MOTIVORECHAZO_ID, TIPOFORZADO_ID, TAGCENTRO_ID, RESPONSABLE_ID, RIESGOA_ID, TIPOSOLICITUD, INTERLOCK, DESCRIPCIONFORZADO, ESTADOSOLICITUD, FECHAREALIZACION, FECHACIERRE, USUARIO_CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION)
values (1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Descripcion Forzado 1', 1, getdate(), getdate(), 'user1', getdate(), 'user2', getdate())
go

insert into TURNO (DESCRIPCION) values ('a'), ('b')
go

/*==============================================================*/


alter table MAE_PERMISO
   add constraint FK_MAE_PERM_REFERENCE_MAE_ROL foreign key (ROL_ID)
      references MAE_ROL (ROL_ID)
go

alter table MAE_PERMISO
   add constraint FK_MAE_PERM_REFERENCE_MAE_OPCI foreign key (OPCIONES_ID)
      references MAE_OPCIONES (OPCIONES_ID)
go

alter table MAE_USUARIO
   add constraint FK_MAE_USUA_REFERENCE_MAE_PUES foreign key (PUESTO_ID)
      references MAE_PUESTO (PUESTO_ID)
go

alter table MAE_USUARIO
   add constraint FK_MAE_USUA_REFERENCE_MAE_AREA foreign key (AREA_ID)
      references MAE_AREA (AREA_ID)
go

alter table MAE_USUARIO_ROL
   add constraint FK_MAE_USUA_REFERENCE_TRS_SOLI foreign key (SOLICITUD_ID)
      references TRS_SOLICITUD_FORZADO (SOLICITUD_ID)
go

alter table MAE_USUARIO_ROL
   add constraint FK_MAE_USUA_REFERENCE_MAE_USUA foreign key (USUARIO_ID)
      references MAE_USUARIO (USUARIO_ID)
go

alter table MAE_USUARIO_ROL
   add constraint FK_MAE_USUA_REFERENCE_MAE_ROL foreign key (ROL_ID)
      references MAE_ROL (ROL_ID)
go

alter table MATRIZ_RIESGO
   add constraint FK_MATRIZ_R_REFERENCE_IMPACTO foreign key (IMPACTO_ID)
      references IMPACTO (IMPACTO_ID)
go

alter table MATRIZ_RIESGO
   add constraint FK_MATRIZ_R_REFERENCE_PROBABIL foreign key (PROBABILIDAD_ID)
      references PROBABILIDAD (PROBABILIDAD_ID)
go

alter table MATRIZ_RIESGO
   add constraint FK_MATRIZ_R_REFERENCE_RIESGO foreign key (RIESGO_ID)
      references RIESGO (RIESGO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_SUB_AREA foreign key (SUBAREA_ID)
      references SUB_AREA (SUBAREA_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_DISCIPLI foreign key (DISCIPLINA_ID)
      references DISCIPLINA (DISCIPLINA_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_TURNO foreign key (TURNO_ID)
      references TURNO (TURNO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_TAG_CENTRO foreign key (TAGCENTRO_ID)
      references TAG_CENTRO (TAGCENTRO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_TIPO_FOR foreign key (TIPOFORZADO_ID)
      references TIPO_FORZADO (TIPOFORZADO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint SOLFROZA_MOTIVO_RECHAZO2 foreign key (MOTIVORECHAZO_ID)
      references MOTIVO_RECHAZO (MOTIVORECHAZO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_RESPONSABLE foreign key (RESPONSABLE_ID)
      references RESPONSABLE (RESPONSABLE_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_MAE_RIES foreign key (RIESGOA_ID)
      references MAE_RIESGO_A (RIESGOA_ID)
go

