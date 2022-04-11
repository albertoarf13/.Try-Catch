CREATE TABLE usuario (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  contraseya VARCHAR(50) NOT NULL,
  bio TEXT
);

CREATE TABLE pregunta(
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100),
  descripcion text,
  imagen LONGTEXT,
  correo VARCHAR(100) NOT NULL REFERENCES usuario(correo)  
);

CREATE TABLE respuesta(
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	descripcion text,
  imagen LONGTEXT,
	idPregunta INT(6) NOT NULL REFERENCES pregunta(id),
  correo VARCHAR(100) NOT NULL REFERENCES usuario(correo) 
);

CREATE TABLE respuesta_a_respuesta(
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	descripcion text,
	idRespuesta INT(6) NOT NULL REFERENCES respuesta(id),
	correo VARCHAR(100) NOT NULL REFERENCES usuario(correo) 
);

CREATE TABLE etiqueta(
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(100) UNIQUE
);

CREATE TABLE etiqueta_pregunta(
	id_etiqueta INT(6) UNSIGNED REFERENCES etiqueta(id),
	id_pregunta INT(6) UNSIGNED REFERENCES pregunta(id),
    PRIMARY KEY(id_etiqueta, id_pregunta)
);
CREATE TABLE `valorar` (
  `correo` varchar(100) NOT NULL,
  `idRespuesta` int(6) unsigned NOT NULL,
  `dislikes` int(6) NOT NULL DEFAULT '0',
  `likes` int(6) NOT NULL DEFAULT '0',
  PRIMARY KEY (`correo`,`idRespuesta`),
  KEY `idRespuesta` (`idRespuesta`),
  CONSTRAINT `valorar_ibfk_1` FOREIGN KEY (`correo`) REFERENCES `usuario` (`correo`),
  CONSTRAINT `valorar_ibfk_2` FOREIGN KEY (`idRespuesta`) REFERENCES `respuesta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
CREATE TABLE `valorar_aclaracion` (
  `correo` varchar(100) NOT NULL,
  `idAclaracion` int(6) unsigned NOT NULL,
  `dislikes` int(6) NOT NULL DEFAULT '0',
  `likes` int(6) NOT NULL DEFAULT '0',
  PRIMARY KEY (`correo`,`idAclaracion`),
  KEY `idAclaracion` (`idAclaracion`),
  CONSTRAINT `valorar_aclaracion_ibfk_1` FOREIGN KEY (`correo`) REFERENCES `usuario` (`correo`),
  CONSTRAINT `valorar_aclaracion_ibfk_2` FOREIGN KEY (`idAclaracion`) REFERENCES `respuesta_a_respuesta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1