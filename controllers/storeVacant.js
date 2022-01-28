/*jshint esversion: 6 */

const companyVacant = require('../models/vacants');
const companyUser = require('../models/companyUser');
const path = require('path');


module.exports = (req, res)=>{
    let vacante = new companyVacant();
    vacante.name = req.body.name;
    vacante.details = req.body.description;
    vacante.requirements = req.body.requirements;
    vacante.quantityVacants = req.body.numberVacants;
    vacante.area = req.body.area;
    vacante.salary = req.body.salary;
    vacante.typeContract = req.body.contract;
    vacante.schedule = req.body.schedule;
    let idUser = req.session;
    companyUser.find(idUser, (err, userData)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: `El usuario ${idUser} no existe`
        });
        vacante.companyName = userData[0].companyName;
        vacante.save( (error, vacante) =>{
            if (error) return res.status(404).send({
                message: `El usuario ${idUser} no existe`
            });
            res.redirect('/');
        });
    }).lean();
};