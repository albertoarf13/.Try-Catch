CREATE TABLE usuario (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  contraseya VARCHAR(50) NOT NULL
);

CREATE TABLE preguntas (
  idpregunta int(100) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  idusuario int(100) NOT NULL,
  titulo varchar(200) NOT NULL,
  cuerpo varchar(2000) NOT NULL,
  fecha date NOT NULL
);

CREATE TABLE respuestas (
  idrespuesta int(100) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  respuesta varchar(1000) NOT NULL,
  idusuario int(100) NOT NULL,
  idpregunta int(100) NOT NULL,
  fecha date NOT NULL
);

CREATE TABLE tags (
  idtag int(100) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  texto varchar(20) NOT NULL
);

CREATE TABLE tagpreg (
  idpregunta int(100) NOT NULL PRIMARY KEY,
  idtag int(100) NOT NULL
)
