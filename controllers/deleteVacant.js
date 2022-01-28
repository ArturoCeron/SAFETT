/*jshint esversion: 6 */

const vacant = require('../models/vacants');

module.exports = (req, res) => {

    let datoBusqueda = req.params.vacantId;
    vacant.findById(datoBusqueda, (err, deleteVacants) => {
        if (err) return res.status(500).send({
            message: `Error al borrar vacante ${err}`
        });

        deleteVacants.remove(err => {
            if (err) return res.status(500).send({
                message: `Error al borrar vacante ${err}`
            });
            res.redirect('/misVacantes');
        });
    });
};