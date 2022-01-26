/*jshint esversion: 6 */

const path = require('path');
const Companies = require('../models/empresas');
const Vacants = require('../models/vacants');

module.exports = (req, res)=>{
    if(req.body.search.length >= 1){
        Vacants.find({ 'name' : { '$regex' : req.body.search, '$options' : 'i' } }, (err, vacantData)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!vacantData) return res.status(404).send({
                message: 'El usuario no existe'
            });
            Companies.find({ 'companyName' : { '$regex' : req.body.search, '$options' : 'i' } }, (err, companyData)=>{
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
                if (!companyData) return res.status(404).send({
                    message: 'El usuario no existe'
                });
                res.render('home', {vacants: vacantData, companies: companyData});
            }).lean();
        }).lean();
    }
    else {
        res.render('home', {vacants: undefined, companies: undefined});
    }
};

