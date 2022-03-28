const usuarioController = {};
var errorList = "";
var usuarios = []; 
usuarioController.sign_up = (req, res) => {
    const {nombre, email, password, password2} = req.body;
    errorList = "No se ha podido completar el registro: ";
    
    if(!all_data(req.body) || !checkUsername(nombre) || !checkEmail(email) || !checkPassword(password, password2)){
        res.status(450).render('sign-up.ejs', { error: errorList});
        return;
    }
 
    if(usuarios.find(usuario => usuario.correo == email && usuario.contraseya == password) == undefined){
            res.status(451).render('login.ejs', { mensaje: "Se ha registrado con exito" });
            usuarios.push({nombre: nombre, email:email, password:password });
    }else{
        res.status(452).render('sign-up.ejs', { error: "No se ha podido completar el registro: Ya existe una cuenta con dicho correo" });
        
    }

}

usuarioController.sign_up_page = (req, res) => {
    
    res.render('sign-up.ejs');

}

usuarioController.login = (req, res) => {
    const {correo, contraseya} = req.body;

    if((usuarios.find(usuario => usuario.correo == correo && usuario.contraseya == contraseya) )=== undefined){
        res.status(452).render('login.ejs', { error: "No existe el usuario/ contraseña incorrecta" });
    }
    else{
        req.session.correo = usuario[0].correo;
        res.redirect('/');
    }
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

module.exports = usuarioController;