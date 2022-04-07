const tagsController = {};


tagsController.buscarTags = (req, res) => {
    const arg = req.params.sarg;

    req.getConnection((err, conn)=>{
        conn.query("SELECT * FROM etiqueta WHERE nombre like *?*", [arg], (err, tags)=>{
            socket.emit('buscarTags', tags);
        });
    });
}