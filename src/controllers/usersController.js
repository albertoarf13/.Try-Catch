const usuarioController = {};
//const dbUser = require(../integracion/dbUser)

usuarioController.sign_up = (req, res) => {
    const {nombre, email, password} = req.body;

    if(nombre.length < 3 || !checkEmail(email) || !checkPassword(password)){
        res.render('sign-up.ejs', { error: "No se ha podido completar el registro: entrada no válida" });
    }

    req.getConnection((err, conn)=>{
        
        conn.query("SELECT * FROM usuario WHERE correo = ?", [email], (err, usuario)=>{
            console.log("Aqui llego")
            if(err){
                res.json(err);
            }
            else if(usuario.length == 0){
                conn.query("INSERT INTO usuario(nombre, correo, contraseya) VALUES (?,?,?)", [nombre, email, password], (err, usuario)=>{
                    if(err){
                        res.json(err);
                    }else{
                        console.log(usuario);
                        res.render('login.ejs', { mensaje: "Se ha registrado con exito" });
                    }
                });
            }else{
                res.render('sign-up.ejs', { error: "No se ha podido completar el registro: Ya existe una cuenta con dicho correo" });
            }

        });
    });
}

usuarioController.sign_up_page = (req, res) => {
    
    res.render('sign-up.ejs');

}

usuarioController.login = (req, res) => {
    const {correo, contraseya} = req.body;

    req.getConnection((err, conn)=>{
        conn.query("SELECT * FROM usuario WHERE correo = ? AND contraseya = ?", [correo, contraseya], (err, usuario)=>{
            
            if(err){
                res.json(err);
            }
            else if(usuario.length == 0){
                res.render('login.ejs', { error: "No existe el usuario/ contraseña incorrecta" });
            }
            else{
                console.log(usuario);

                req.session.correo = usuario[0].correo;
                console.log(req.session);

                res.redirect('/');
            }

        });
    });
}

usuarioController.login_page = (req, res) => {
    
    res.render('login.ejs');
}

usuarioController.logout = (req, res) => {
    
    req.session.destroy();
    res.redirect('/');
}


function checkEmail(email){
    var StrObj = email;
    var emailsArray = StrObj.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    if (emailsArray != null && emailsArray.length) {
        return true;
    }
}

function checkPassword(password){
    var StrObj = password;
    
    if(password.length > 7){ //Contraseña de más de 7 caracteres
        nums = (StrObj.match(/[0-9]/g)||[]).length;  //Cuento cuantos numeros tiene la contraseña
        mayus = (StrObj.match(/[A-Z]/g)||[]).length; //Cuento cuantas mayusculas tiene la contraseña
        minus = (StrObj.match(/[a-a]/g)||[]).length; //Cuento cuantas minusculas tiene la contraseña

        return nums >= 1 && mayus >= 1 && minus >= 1;
    }

    return false;
}

module.exports = usuarioController;