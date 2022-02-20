/*jshint esversion: 6 */

const path = require('path');
const Vacants = require('../models/vacants');

module.exports = (req, res)=>{
    if(req.body.search.length >= 1){
        Vacants.find({ 'name' : { '$regex' : req.body.search, '$options' : 'i' } }, (err, vacantData)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!vacantData) return res.status(404).send({
                message: `La vacante ${req.body.search} no existe`
            });

            res.render('vacants', {vacantsData: vacantData, numVacants: vacantData.length, search: req.body.search});
        }).lean();
    }
    else {
        res.redirect('empleos');
    }
};

