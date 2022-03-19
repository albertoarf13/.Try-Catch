const connection = require("express-myconnection");

const controllerUser = {};

controllerUser.isUser = (req, res) => {
    req.getConnection((err, connection) => {
        if (err) {
            callback(new Error("Error pool"));
        } else {
            connection.query("SELECT * FROM usuario WHERE correo = ? AND contraseña = ?", [email, password], (err, rows) => {
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                } else {
                    if (rows.length === 0) {
                        res = false;
                    } else {
                        res = rows;
                        /*
                        h
                        */
                    }
                }

            })
        }
    });
}
