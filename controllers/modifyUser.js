/*jshint esversion: 6*/
const user = require("../models/user");

module.exports = (req, res) => {
    let datoModificar = req.params._id;
    let update = req.body;
    user.findByIdAndUpdate(datoModificar, update, (err, users) => {
        if(err) return res.status(500).send({
            message: `Error al actualizar el usuario ${err}`
        });

        if(!users) return res.status(404).send({
            message: 'El usuario no existe'
        });

        //res.status(200).send({products});

        res.redirect('/perfilAspirante');
    });
}