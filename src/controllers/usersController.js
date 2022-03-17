const usuarioController = {};
//const dbUser = require(../integracion/dbUser)

usuarioController.sign_up = (req, res) => {
    const {username, email, password} = req.body;

    //Comprobar entrada

    //Buscar Usuario: dbUser.find({email})

    if(user){ //Si existe
        return res.status(400).json({error: "El email ya esta siendo usado por una cuenta activa"})
    }

    //Crear usuario en la BD.

    if(err){
        res.json(err);
    }
    
    console.log(persona);
    res.redirect('/'); //Posibles cambios

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
            else if(!usuario){
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

module.exports = usuarioController;