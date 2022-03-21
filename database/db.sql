CREATE TABLE usuario (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  contraseya VARCHAR(50) NOT NULL
);

CREATE TABLE pregunta(
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100),
  descripcion VARCHAR(100),
  imagen LONGTEXT,
  correo VARCHAR(100) NOT NULL REFERENCES usuario(correo)  
);

CREATE TABLE respuesta(
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	descripcion VARCHAR(100),
  imagen LONGTEXT,
	idPregunta INT(6) NOT NULL REFERENCES pregunta(id),
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