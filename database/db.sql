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
  imagen varbinary(8000),
  correo VARCHAR(100) NOT NULL REFERENCES usuario(correo)  
);

CREATE TABLE respuesta(
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	descripcion VARCHAR(100),
  imagen varbinary(8000),
	idPregunta INT(6) NOT NULL REFERENCES pregunta(id),
  correo VARCHAR(100) NOT NULL REFERENCES usuario(correo) 
);