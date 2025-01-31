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
   where r.fkeyid = object_id('MAE_USUARIO') and o.name = 'FK_MAE_USUA_REFERENCE_MAE_ROL')
alter table MAE_USUARIO
   drop constraint FK_MAE_USUA_REFERENCE_MAE_ROL
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
   where r.fkeyid = object_id('MAE_PUESTO_ROL') and o.name = 'FK_MAE_PUESTO_ROL_PUESTO')
alter table MAE_PUESTO_ROL
   drop constraint FK_MAE_PUESTO_ROL_PUESTO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MAE_PUESTO_ROL') and o.name = 'FK_MAE_PUESTO_ROL_ROL')
alter table MAE_PUESTO_ROL
   drop constraint FK_MAE_PUESTO_ROL_ROL
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
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_MAE_PROYECTO')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_MAE_PROYECTO
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
           where  id = object_id('MAE_PUESTO_ROL')
            and   type = 'U')
   drop table MAE_PUESTO_ROL
go


if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_ROL')
            and   type = 'U')
   drop table MAE_ROL
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MATRIZ_RIESGO')
            and   type = 'U')
   drop table MATRIZ_RIESGO
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
           where  id = object_id('TURNO')
            and   type = 'U')
   drop table TURNO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_PROYECTO')
            and   type = 'U')
   drop table MAE_PROYECTO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('MAE_DATO_ADJUNTO') and o.name = 'FK_MAE_DATO_REFERENCE_TRS_SOLI')
alter table MAE_DATO_ADJUNTO
   drop constraint FK_MAE_DATO_REFERENCE_TRS_SOLI
go

if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_DATO_ADJUNTO')
            and   type = 'U')
   drop table MAE_DATO_ADJUNTO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_MAE_USUA')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_MAE_USUA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_MAE_USUA1')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_MAE_USUA1
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_MAE_USUA2')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_MAE_USUA2
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_MAE_USUA3')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_MAE_USUA3
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_MAE_USUA4')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_MAE_USUA4
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRS_SOLICITUD_FORZADO') and o.name = 'FK_TRS_SOLI_REFERENCE_MAE_USUA5')
alter table TRS_SOLICITUD_FORZADO
   drop constraint FK_TRS_SOLI_REFERENCE_MAE_USUA5
go


if exists (select 1
            from  sysobjects
           where  id = object_id('MAE_USUARIO')
            and   type = 'U')
   drop table MAE_USUARIO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('TRS_SOLICITUD_FORZADO')
            and   type = 'U')
   drop table TRS_SOLICITUD_FORZADO
go


if exists (select 1
            from  sysobjects
           where  id = object_id('PROBABILIDAD')
            and   type = 'U')
   drop table PROBABILIDAD
go
if exists (select 1
            from  sysobjects
           where  id = object_id('MOTIVO_RECHAZO')
            and   type = 'U')
   drop table MOTIVO_RECHAZO
go

/*==============================================================*/

create table DISCIPLINA (
   DISCIPLINA_ID        int                  identity,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_DISCIPLINA primary key (DISCIPLINA_ID)
)
go

create table IMPACTO (
   IMPACTO_ID           int                  identity,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_IMPACTO primary key (IMPACTO_ID)
)
go

create table MAE_PROYECTO (
   PROYECTO_ID          int                  identity,
   DESCRIPCION          varchar(100)         null,
   ESTADO               int                  null,
   USUARIO_CREACION     varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_PROYECTO primary key (PROYECTO_ID)
)
go


create table MAE_AREA (
   AREA_ID              int                  identity,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
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
   NIVEL_RIESGO_APROBACION varchar(50)       null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_MAE_PUESTO primary key (PUESTO_ID)
)
go


create table MAE_RIESGO_A (
   RIESGOA_ID           int                  identity,
   DESCRIPCION          varchar(80)          null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_MAE_RIESGO_A primary key (RIESGOA_ID)
)
go

create table MAE_ROL (
   ROL_ID               int                  identity,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   USUARIO_CREACION       varchar(20)          null,
   FECHA_CREACION     datetime             null,
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
   PASSWORD             varchar(MAX)         null,
   DNI					char(8)              null,
   NOMBRE               varchar(50)          null,
   APEPATERNO           varchar(50)          null,
   APEMATERNO           varchar(50)          null,
   CORREO               varchar(60)          null,
   FLAG_INGRESO			int		        	 null,
   ROL_ID               int                  null,
   ESTADO               int                  null,
   USUARIO_CREACION     varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_MAE_USUARIO primary key (USUARIO_ID)
)
go
/*
create table MAE_USUARIO_ROL (
   USUARIOROL_ID        int                  identity,
   USUARIO_ID           int                  null,
   ROL_ID               int                  null,
   SOLICITUD_ID         int                  null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_MAE_USUARIO_ROL primary key (USUARIOROL_ID)
)
go
*/
create table MATRIZ_RIESGO (
   MATRIZ_ID            int                  identity,
   IMPACTO_ID           int                  null,
   RIESGO_ID            int                  null,
   PROBABILIDAD_ID      int                  null,
   NIVEL                int                  null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_MATRIZ_RIESGO primary key (MATRIZ_ID)
)
go

create table MOTIVO_RECHAZO (
   MOTIVORECHAZO_ID     int                  identity,
    TIPO                char(1)              null,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_MOTIVO_RECHAZO primary key (MOTIVORECHAZO_ID)
)
go

create table PROBABILIDAD (
   PROBABILIDAD_ID      int                  identity,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_PROBABILIDAD primary key (PROBABILIDAD_ID)
)
go

create table RESPONSABLE (
   RESPONSABLE_ID       int                  identity,
   NOMBRE               varchar(30)          null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_RESPONSABLE primary key (RESPONSABLE_ID)
)
go

create table RIESGO (
   RIESGO_ID            int                  identity,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   constraint PK_RIESGO primary key (RIESGO_ID)
)
go

create table MAE_PARAMETROS_GLOBALES (
   ID            int                  identity,
   CODIGO        varchar(30)          null,  
   VALOR          varchar(30)          null,
   VALOR_BOOLEANO bit                  null,
   ESTADO               int                  null,
   constraint PK_PARAMETROS_GLOBALES primary key (ID)
)
go

create table MAE_TAGS_MATRIZ_RIESGO (
   ID            int                  identity,
   SUB_AREA_ID            int          null,
   TAG_CENTRO_ID          int          null,
   SUFIJO                VARCHAR(50)   null,
   PROBABILIDAD_ID               int            null,
   IMPACTO_ID               int            null,
   ESTADO                  int            null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_TAGS_MATRIZ_RIESGO primary key (ID),

   constraint FK_MAE_TAGS_MATRIZ_RIESGO_SUB_AREA foreign key (SUB_AREA_ID)
      references SUB_AREA (SUBAREA_ID),
   constraint FK_MAE_TAGS_MATRIZ_RIESGO_TAG_CENTRO foreign key (TAG_CENTRO_ID)
      references TAG_CENTRO (TAGCENTRO_ID)

   constraint FK_MAE_TAGS_MATRIZ_RIESGO_PROBABILIDAD foreign key (PROBABILIDAD_ID)
      references PROBABILIDAD (PROBABILIDAD_ID)

   constraint FK_MAE_TAGS_MATRIZ_RIESGO_IMPACTO foreign key (IMPACTO_ID)
      references IMPACTO (IMPACTO_ID)
)
go

create table SUB_AREA (
   SUBAREA_ID           int                  identity,
   CODIGO               varchar(30)         null,
   DESCRIPCION          varchar(100)         null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_SUB_AREA primary key (SUBAREA_ID)
)
go

create table TAG_CENTRO (
   TAGCENTRO_ID         int                  identity,
   CODIGO               varchar(30)         null,
   DESCRIPCION          varchar(100)         null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_TAG_CENTRO primary key (TAGCENTRO_ID)
)
go

create table TIPO_FORZADO (
   TIPOFORZADO_ID       int                  identity,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   constraint PK_TIPO_FORZADO primary key (TIPOFORZADO_ID)
)
create table TRS_SOLICITUD_FORZADO (
   SOLICITUD_ID         int                  identity,
   SUBAREA_ID           int                  null,
   PROYECTO_ID          int                  null,
   DISCIPLINA_ID        int                  null,
   TURNO_ID             int                  null,
   MOTIVORECHAZO_A_ID     int                null,
   MOTIVORECHAZO_B_ID     int                null,
   TIPOFORZADO_ID       int                  null,
   TAGCENTRO_ID         int                  null,
   TAGSUFIJO            varchar(100)         null,
   RESPONSABLE_ID       int                  null,
   RIESGOA_ID           int                  null,
   PROBABILIDAD_RIESGO  int                  null,
   TIPOSOLICITUD        int                  null,
   INTERLOCK            int                  null,
   URGENCIA             int                  null,
   DESCRIPCIONFORZADO   varchar(100)         null,
   ESTADOSOLICITUD      varchar(100)         null,
   FECHAEJECUCION_A     datetime             null,
   FECHAEJECUCION_B     datetime             null,
   FECHACIERRE          datetime             null,
   SOLICITANTE_A_ID     int                  null,
   APROBADOR_A_ID       int                  null,
   EJECUTOR_A_ID        int                  null,
   SOLICITANTE_B_ID     int                  null,
   APROBADOR_B_ID       int                  null,
   EJECUTOR_B_ID        int                  null,
   USUARIO_CREACION     varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   OBSERVACIONES_B      varchar(2000)        null,
   ACTION_TOKEN         varchar(100)         null,
   OBSERVADO_A            bit              null,
   OBSERVACION_RECHAZO_A      varchar(2000)        null,
   OBSERVADO_B            bit              null,
   OBSERVACION_RECHAZO_B      varchar(2000)        null,

   constraint PK_TRS_SOLICITUD_FORZADO primary key (SOLICITUD_ID)
)
go

create table TURNO (
   TURNO_ID             int                  identity,
   DESCRIPCION          varchar(30)          null,
   ESTADO               int                  null,
   USUARIO_CREACION    varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_TURNO primary key (TURNO_ID)
)
go

create table MAE_DATO_ADJUNTO (
   DATOADJUNTO_ID       int                  identity,
   SOLICITUD_ID         int                  null,
   NOMBRE_ARCHIVO       varchar(100)         null,
   ARCHIVO              VARBINARY(max)         null,
   ESTADO               int                  null,
   USUARIO_CREACION     varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_MAE_DATO_ADJUNTO primary key (DATOADJUNTO_ID)
)
go


create table MAE_PUESTO_ROL (
   PUESTO_ID            int                  not null,
   ROL_ID               int                  not null,
   USUARIO_CREACION     varchar(20)          null,
   FECHA_CREACION       datetime             null,
   USUARIO_MODIFICACION varchar(20)          null,
   FECHA_MODIFICACION   datetime             null,
   constraint PK_MAE_PUESTO_ROL primary key (PUESTO_ID, ROL_ID),
   constraint FK_MAE_PUESTO_ROL_PUESTO foreign key (PUESTO_ID)
      references MAE_PUESTO (PUESTO_ID),
   constraint FK_MAE_PUESTO_ROL_ROL foreign key (ROL_ID)
      references MAE_ROL (ROL_ID)
)
go



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
   add constraint FK_MAE_USUA_REFERENCE_MAE_ROL foreign key (ROL_ID)
      references MAE_ROL (ROL_ID)
go


alter table MAE_USUARIO
   add constraint FK_MAE_USUA_REFERENCE_MAE_AREA foreign key (AREA_ID)
      references MAE_AREA (AREA_ID)
go

/*
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
*/
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
   add constraint FK_TRS_SOLI_REFERENCE_MAE_PROYECTO foreign key (PROYECTO_ID)
      references MAE_PROYECTO (PROYECTO_ID)
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
   add constraint SOLFROZA_MOTIVO_RECHAZO2 foreign key (MOTIVORECHAZO_A_ID)
      references MOTIVO_RECHAZO (MOTIVORECHAZO_ID)
go

alter table TRS_SOLICITUD_FORZADO
    add constraint SOLFROZA_MOTIVO_RECHAZO3 foreign key (MOTIVORECHAZO_B_ID)
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

alter table MAE_DATO_ADJUNTO
   add constraint FK_MAE_DATO_REFERENCE_TRS_SOLI foreign key (SOLICITUD_ID)
      references TRS_SOLICITUD_FORZADO (SOLICITUD_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_MAE_USUA foreign key (SOLICITANTE_A_ID)
      references MAE_USUARIO (USUARIO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_MAE_USUA1 foreign key (APROBADOR_A_ID)
      references MAE_USUARIO (USUARIO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_MAE_USUA2 foreign key (EJECUTOR_A_ID)
      references MAE_USUARIO (USUARIO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_MAE_USUA3 foreign key (SOLICITANTE_B_ID)
      references MAE_USUARIO (USUARIO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_MAE_USUA4 foreign key (APROBADOR_B_ID)
      references MAE_USUARIO (USUARIO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_MAE_USUA5 foreign key (EJECUTOR_B_ID)
      references MAE_USUARIO (USUARIO_ID)
go

alter table TRS_SOLICITUD_FORZADO
   add constraint FK_TRS_SOLI_REFERENCE_PROBABILIDAD foreign key (PROBABILIDAD_RIESGO)
      references PROBABILIDAD (PROBABILIDAD_ID)
go


/*==============================================================*/
-- INSERCIÓN DE DATOS

insert into DISCIPLINA (DESCRIPCION, ESTADO) values 
('COMISIONAMIENTO', 1),
('DCS', 1),
('ELECTRICA', 1),
('INSTRUMENTACION', 1),
('MANTENIMIENTO', 1),
('MECANICA', 1),
('METALURGIA', 1),
('OPERACIONES', 1)
go

insert into IMPACTO (DESCRIPCION, ESTADO) values 
('INSIGNIFICANTE', 1),
('MENOR', 1),
('MODERADO', 1),
('MAYOR', 1),
('EXTREMO', 1)
go

insert into MAE_AREA (DESCRIPCION, ESTADO, USUARIO_CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION)
values ('AREA 1', 1, 'user1', getdate(), 'user2', getdate())
go

insert into MAE_OPCIONES (DESCRIPCION, ESTADO) values ('Opcion 1', 1)
go


insert into RIESGO (DESCRIPCION, ESTADO) values 
('ALTO', 1),
('MODERADO', 1),
('BAJO', 1)
go
--





insert into MOTIVO_RECHAZO (DESCRIPCION,TIPO,ESTADO,USUARIO_CREACION,FECHA_CREACION) values ('NO SE REQUIERE LA ALTA','A',1,'ADMIN',GETDATE())
insert into MOTIVO_RECHAZO (DESCRIPCION,TIPO,ESTADO,USUARIO_CREACION,FECHA_CREACION) values ('NO CUMPLE CON REQUISITOS','A',1,'ADMIN',GETDATE())
insert into MOTIVO_RECHAZO (DESCRIPCION,TIPO,ESTADO,USUARIO_CREACION,FECHA_CREACION) values ('ERROR DE INGRESO','A',1,'ADMIN',GETDATE())
insert into MOTIVO_RECHAZO (DESCRIPCION,TIPO,ESTADO,USUARIO_CREACION,FECHA_CREACION) values ('YA NO SERA NECEZARIO','B',1,'ADMIN',GETDATE())
insert into MOTIVO_RECHAZO (DESCRIPCION,TIPO,ESTADO,USUARIO_CREACION,FECHA_CREACION) values ('FECHA DE BAJA NO CORRECTA','B',1,'ADMIN',GETDATE())
insert into MOTIVO_RECHAZO (DESCRIPCION,TIPO,ESTADO,USUARIO_CREACION,FECHA_CREACION) values ('NO SE REQUIERE LA BAJA','B',1,'ADMIN',GETDATE())

go

insert into PROBABILIDAD (DESCRIPCION, ESTADO) values ('RARO', 1), ('IMPROBABLE', 1), ('POSIBLE', 1), ('PROBABLE', 1), ('CASI SEGURO', 1)
go

insert into RESPONSABLE (NOMBRE, ESTADO) values ('GERENCIA ASSET. PERFOMANCE', 1), ('GERENCIA PLANTA', 1)
go

insert into MAE_RIESGO_A(DESCRIPCION, ESTADO) values ('EQUIPOS', 1), ('PERSONAS', 1), ('PROCESOS', 1)
go

insert into SUB_AREA (DESCRIPCION, ESTADO) values ('Sub Area 1', 1)
go
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('2110','CHANCADOR PRINCIPAL',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('2120','CORREA ALIMENTACION ACOPIO GRUESOS',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('2210','ACOPIO DE GRUESOS Y SISTEMA DE RECUPERACION',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3110','MOLINO SAG',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3120','MOLINO BOLAS',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3150','AUXILIARES DE MOLIENDA',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3210','ESPESADOR LIXIVIACION',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3220','LIXIVIACION',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3300','RECUPERACION METALES PRECIOSOS',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3310','CCD',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3320','CIP',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3330','MERRIL CROWE',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3410','LAVADO ACIDO',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3420','ELUCION',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3450','REGENERACION DE CARBON',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3500','REFINERIA',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3610','DETOXIFICAICON',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3620','ESPESAMIENTO DE RELAVE',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3630','FILTRADO DE RELAVES',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3700','AGUAS PROCESOS ',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3810','CAL',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3820','CIANURO',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3830','FLOCULANTE',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3840','REACTIVOS DE DETOXIFICACION',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3850','OXIGENO',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('3910','MANEJO DE AGUA CONTACTADA',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('4100','AGUAS FRESCA Y POTABLE',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('4110','AGUA FRESCA',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('4300','AIRE COMPRIMIDO',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('4500','SISTEMA COMBUSTIBLE',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('4710','SISTEMA PROTECCION CONTRA INCENDIO',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('7200','POZOS DE AGUA Y CAÑERIAS DE IMPULSION',1,'ADMIN',GETDATE())
INSERT INTO SUB_AREA (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('7210','POZOS DE AGUA',1,'ADMIN',GETDATE())


insert into TAG_CENTRO (DESCRIPCION, ESTADO) values ('TAG CENTRO 1', 1)
go

INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('AG','AGITADOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('AI','INDICADOR DE ANALIZADOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('AIC','CONTROL DE ANALIZADOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('AV','VALVULA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('BL','SOPLADOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('CQ','VENTILADOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('CR','CHANCADOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('CV','CORREA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('DC','DUST COLLECTOR (colector de polvo)',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('DI','INDICADOR DENSIDAD',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('DIC','CONTROL DE DENSIDAD',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FA','VENTILADOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FAL','BAJO FLUJO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FE','ALIMENTADOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FI','INDICADOR DE FLUJO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FIC','CONTROL DE FLUJO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FL','FILTRO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FSL','SWITCHE BAJO FLUJO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FQ','TOTALIZADOR DE FLUJO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FQI','INDICADOR DE TOTALIZADOR FLUJO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FV','VALVULA DE FLUJO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FWI','FLUJO SOLIDO o FLUJO MASICO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FWY','FLUJO SOLIDO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('FY','FLUJO  MASICO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('HE','CALEFACTOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('HS','HAND SWITCH',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('HSA','PULLCORD',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('HSS','HAND SWITCH (INTERRUPTOR MANUAL)',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('HSZ','HAND SWITCH (INTERRUPTOR MANUAL)',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('HV','VALVULA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('HY','UNIDAD HIDRAULICA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('JI','POTENCIA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('KIC','CARGA PEGADA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('LAH','NIVEL ALARMA ALTA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('LAL','NIVEL ALARMA BAJA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('LALL','NIVEL ALARMA BAJA BAJA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('LI','INDICADOR DE NIVEL',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('LIC','CONTROL DE NIVEL',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('LIT','TRANSMISOR DE NIVEL',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('LSL','NIVEL SWITCH BAJO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('MA','ELECTROIMÁN',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('ME','MOTOR GIRO LENTO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('MI','MOTOR PRINCIPAL',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('OAHH','ALARMA ALTO TORQUE',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('OI','TORQUE',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('OSHH','TORQUE ALTO ALTO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('PAH','ALARMA PRESION ALTA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('PAL','ALARMA PRESION BAJA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('PDH','PRESION DIFERENCIAL ALTA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('PDI','INDICADOR PRESION DIFERENCIAL ',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('PI','INDICADOR PRESION',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('PIC','CONTROL DE PRESION',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('PIT','INDICADOR DE PRESION',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('PSL','SWITCH PRESION BAJA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('PU','BOMBA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('PV','VALVULA DE PRESION',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('RV','VALVULA ROTATORIA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('SA','MUESTREADOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('SAH','VELOCIDAD ALTA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('SAL','VELOCIDAD CERO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('SI','VELOCIDAD',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('SN','HARNERO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('TE','TEMPERATURA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('TI','TEMPERATURA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('TS','SWITCH TEMPERATURA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('TSL','SWITCH TEMPERATURA BAJA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('TV','VALVULA DE TEMPERATURA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('UI','INTERFAZ DE USUARIO (SIST. LRS)',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('VB','VIBRADOR',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('VI','VIBRACION',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('VLV','VALVULA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('VV','VALVULA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('WI','INDICADOR DE PESO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('WIC','CONTROL DE PESO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('WIT','TRANSMISOR DE PESO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('WQI','TOTALIZADOR DE PESO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('WQIT','TOTALIZADOR PESOMETRO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('XA','SEÑAL DIGITAL ALARMA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('XL','SEÑAL DIGITAL INDICACION',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('XP','HIDROPACK',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('XS','INTERRUTOR ',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('XV','VALVULA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('YC','VALVULA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('ZAH','ALARMA DESALINEAMIENTO ALTO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('ZAHH','ALARMA DESALINEAMIENTO ALTO ALTO',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('ZAL','POSICION ALARMA BAJA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('ZI','POSICION',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('ZS','SWITCHE POSICION',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('ZSC','SWITCHE POSICION ABIERTA',1,'ADMIN',GETDATE())
INSERT INTO TAG_CENTRO (CODIGO,DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES('ZSO','SWITCHE POSICION CERRADA',1,'ADMIN',GETDATE())


insert into TIPO_FORZADO (DESCRIPCION, ESTADO) values ('HARDWARE',1 ), ('LOGICO',1)
go

insert into TURNO (DESCRIPCION, ESTADO) values ('A',1), ('B',1)
go

insert into MATRIZ_RIESGO (IMPACTO_ID, RIESGO_ID, PROBABILIDAD_ID, NIVEL)
values (1, 1, 1, 1)
go

INSERT INTO MAE_ROL (DESCRIPCION,ESTADO,FECHA__MODIFICACION,USUARIO_CREACION) VALUES('SOLICITANTE',1,GETDATE(),'ADMIN')
INSERT INTO MAE_ROL (DESCRIPCION,ESTADO,FECHA__MODIFICACION,USUARIO_CREACION) VALUES('APROBADOR',1,GETDATE(),'ADMIN')
INSERT INTO MAE_ROL (DESCRIPCION,ESTADO,FECHA__MODIFICACION,USUARIO_CREACION) VALUES('EJECUTOR',1,GETDATE(),'ADMIN')
INSERT INTO MAE_ROL (DESCRIPCION,ESTADO,FECHA__MODIFICACION,USUARIO_CREACION) VALUES('APROBADOR INTERLOCK',1,GETDATE(),'ADMIN')
INSERT INTO MAE_ROL (DESCRIPCION,ESTADO,FECHA__MODIFICACION,USUARIO_CREACION) VALUES('ADMINISTRADOR',1,GETDATE(),'ADMIN')

insert into MAE_PERMISO (ROL_ID, OPCIONES_ID, CREAR, EDITAR, CONSULTAR, ESTADO)
values (2, 1, 1, 1, 1, 1)
go

INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('ADMINISTRADOR',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('GERENTE PLANTA PROCESO',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('GERENTE SEGURIDAD, SALUD Y MEDIO AMBIENTE',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('SUPERINTENDENTE MANTENIMIENTO, METALURGIA Y PRODUC',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('JEFE MANTENIMIENTO ELECTRICO E INSTRUMENTACION',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('JEFE PROCESO',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('JEFE SALA ORO',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('JEFE TURNO MANTENIMIENTO',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('INGENIERO SISTEMA CONTROL',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('OPERADOR SALA DE CONTROL',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('MANTENEDOR',1,'ADMIN',GETDATE())
INSERT INTO MAE_PUESTO (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('CONTROL DOCUMENTOS',1,'ADMIN',GETDATE())


INSERT INTO MAE_AREA (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('COMISIONAMIENTO',1,'ADMIN',GETDATE())
INSERT INTO MAE_AREA (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('MANTENIMIENTO',1,'ADMIN',GETDATE())
INSERT INTO MAE_AREA (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('METALURGIA',1,'ADMIN',GETDATE())
INSERT INTO MAE_AREA (DESCRIPCION,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES ('OPERACIONES',1,'ADMIN',GETDATE())


insert into MAE_USUARIO (AREA_ID, PUESTO_ID,DNI, USUARIO, PASSWORD, NOMBRE, APEPATERNO, APEMATERNO, CORREO, FLAG_INGRESO, ESTADO, USUARIO_CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION, ROL_ID)
values (1, 1,'41526352', 'USERUSERUSER', '$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm', 'ADMIN', 'ADMIN', 'ADMIN', 'correo@example.com','1', 1, 'user1', getdate(), 'user2', getdate(), 5)
go

INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(3,8,'41526325','JORGEAPARICIO','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Jorge','Aparicio','','jvniorrodrigo@gmail.com','1',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(3,5,'41536325','RICARDOARAYA','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Ricardo','Araya','','Ricardo.Araya@gmail.com','1',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(2,3,'41546325','CRISTIANCARRILL','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Cristian','Carrillo','','jvniorrodrigo@gmail.com','1',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(3,10,'41556325','CRISTIANDÍAZ','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Cristian','Díaz','','Cristian.diaz@gmail.com','1',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(5,6,'41566325','LUISGALVES','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Luis','Galves','','Luis.Galvez@gmail.com','1',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(3,11,'41576325','EDGARDGONZÁLEZ','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Edgard','González','','Edgard.Gonzalez@gmail.com','1',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(3,11,'41586325','JORGEGUERRERO','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Jorge','Guerrero','','Jorge.Guerrero@gmail.com','1',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(4,11,'41596325','OSCARHERRERA','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Oscar','Herrera','','Oscar.Herrera@gmail.com','1',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(5,8,'41606325','NELSONLILLO','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Nelson','Lillo','','Nelson.Lillo@gmail.com','1',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(3,10,'41616325','EDGARDOLOYOLA','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Edgardo','Loyola','','Edgardo.Loyola@gmail.com','1',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(5,10,'41626325','MARCOMACHUCA','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Marco','Machuca','','Marco.Machuca@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(5,11,'41636325','MIGUELMONTECINO','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Miguel','Montecinos','','Miguel.Montecinos@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(2,6,'41646325','GONZALOMUÑOZ','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Gonzalo','Muñoz','','Gonzalo.MunozDiaz@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(2,7,'41656325','JONATHANNAVARRE','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Jonathan','Navarrete','','Jonathan.Navarrete@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(3,11,'41666325','ALDONUÑEZZ','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Aldo','NUñez','','Aldo.Nunez@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(3,11,'41676325','HÉCTORPAVEZ','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Héctor','Pavez','','Hector.Pavez@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(5,10,'41686325','CARLOPEREZ','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Carlo','Perez','','Carlo.Perez@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(5,11,'41696325','MIGUELPIZARRO','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Miguel','Pizarro','','Miguel.Pizarro@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(2,6,'41706325','ERWINREYES','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Erwin','Reyes','','Miguel.Pizarro@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(3,10,'41716325','MARCOSROJAS','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Marcos','Rojas','','erwin.reyes@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(2,7,'41726325','ALEXSAEZZZ','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Alex','Saez','','saez.alex@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(2,6,'41736325','JUANSALINAS','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Juan','Salinas','','Juan.Salinas@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(5,10,'41746325','MARCELOVERGARA','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Marcelo','Vergara','','Marcelo.Vergara@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(5,11,'41756325','WALTERWILLIAMS','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Walter','Williams','','Walter.Williams@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(5,10,'41766325','BORISZAVALA','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Boris','Zavala','','Boris.Zavala@gmail.com','0',1,'ADMIN',GETDATE())
INSERT INTO MAE_USUARIO (AREA_ID,PUESTO_ID,DNI,USUARIO,PASSWORD,NOMBRE,APEPATERNO,APEMATERNO,CORREO,FLAG_INGRESO,ESTADO,USUARIO_CREACION,FECHA_CREACION) VALUES(4,11,'41776325','JORGEZÚÑIGA','$2b$10$leMLTPRtiKiqtZRCjBnAy.BiFmuB362GGfk8zKwM4ccuNP83akFIm','Jorge','Zúñiga','','Jorge.Zuniga@gmail.com','0',1,'ADMIN',GETDATE())


INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (1,2,5,11,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (1,3,4,7,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (1,3,3,4,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (1,3,2,2,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (1,3,1,1,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (2,2,5,16,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (2,2,4,12,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (2,2,3,8,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (2,3,2,5,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (2,3,1,3,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (3,1,5,20,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (3,2,4,15,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (3,2,3,13,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (3,2,2,9,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (3,3,1,6,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (4,1,5,24,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (4,1,4,22,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (4,2,3,17,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (4,2,2,14,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (4,2,1,10,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (5,1,5,25,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (5,1,4,23,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (5,1,3,21,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (5,1,2,19,1,'ADM',GETDATE())
INSERT INTO MATRIZ_RIESGO (IMPACTO_ID,  RIESGO_ID,PROBABILIDAD_ID, NIVEL, ESTADO, USUARIO_CREACION,FECHA_CREACION) VALUES (5,1,1,18,1,'ADM',GETDATE())

