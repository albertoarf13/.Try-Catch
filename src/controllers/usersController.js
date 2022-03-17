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