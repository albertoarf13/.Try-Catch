const usuarioController = {};
var errorList = "";

usuarioController.sign_up = (req, res) => {
    const {nombre, email, password, password2} = req.body;
    errorList = "No se ha podido completar el registro: ";

    if(!all_data(req.body) || !checkUsername(nombre) || !checkEmail(email) || !checkPassword(password, password2)){
        res.status(401).render('sign-up.ejs', { error: errorList});
        return;
    }
    req.getConnection((err, conn)=>{
        conn.query("SELECT * FROM usuario WHERE correo = ?", [email], (err, usuario)=>{
            if(err){
                res.json(err);
            }
            else if(usuario.length == 0){
                conn.query("INSERT INTO usuario(nombre, correo, contraseya) VALUES (?,?,?)", [nombre, email, password], (err, usuario)=>{
                    if(err){
                        res.json(err);
                    }else{
                        console.log(usuario);
                        res.status(451).render('login.ejs', { mensaje: "Se ha registrado con exito" });
                    }
                });
            }else{
                res.status(402).render('sign-up.ejs', { error: "No se ha podido completar el registro: Ya existe una cuenta con dicho correo" });
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
            console.log(usuario);
            if(err){
                res.status(402).json(err);
            }
            else if(usuario.length == 0){
                res.status(402).render('login.ejs', { error: "No existe el usuario/ contraseña incorrecta" });
            }
            else{
                req.session.correo = usuario[0].correo;

                //aqui esta el problema, devuelve 302 porque esta siendo redireccionada O_o
                res.redirect('/');
                //res.sendStatus(201).render('index.ejs');
                // pero no se puede devolver 200 no se por que
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


function all_data(datos){//Comprueba que todas las entradas reciben datos
    for(var key in datos){
        if(!datos[key])
            return false;
    }
    return true;
}

function checkEmail(email){
    var StrObj = email;
    var emailsArray = StrObj.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    if (emailsArray != null && emailsArray.length) {
        return true;
    }

    errorList += "El correo no cumple los requisitos";
    return false;
}

function checkPassword(password, password2){
    var StrObj = password;

    if(password == password2){
        if(password.length > 7){ //Contraseña de más de 7 caracteres
            nums = (StrObj.match(/[0-9]/g)||[]).length;  //Cuento cuantos numeros tiene la contraseña
            mayus = (StrObj.match(/[A-Z]/g)||[]).length; //Cuento cuantas mayusculas tiene la contraseña
            minus = (StrObj.match(/[a-z]/g)||[]).length; //Cuento cuantas minusculas tiene la contraseña
            
            if(nums >= 1 && mayus >= 1 && minus >= 1){
                return true;
            }
    
            errorList += "La contraseña no cumple los requisitos";
        }else{
            errorList += "La contraseña no cumple los requisitos";
        }
    }else{
        errorList += "Las contraseñas no coinciden";
    }

    return false;
}


function checkUsername(nombre){
    if(nombre.length < 3 ){
        errorList += "El nombre de usuario debe contener al menos 3 caracteres";
    }

    return nombre.length >= 3;
}

//Test


usuarioController.deleteUsuarioTest = (req, res) =>{

    req.getConnection((err, conn)=>{

        conn.query('delete from usuario where correo = ?', [req.body.email], (err, usuario)=>{
            
            if(err){
                res.json(err);
            }
            console.log(usuario);
        })
    });

}

module.exports = usuarioController;