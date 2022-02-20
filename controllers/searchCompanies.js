/*jshint esversion: 6 */

const path = require('path');
const Companies = require('../models/companies');

module.exports = (req, res)=>{
    if(req.body.search.length >= 1){
        Companies.find({ 'companyName' : { '$regex' : req.body.search, '$options' : 'i' } }, (err, companyData)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!companyData) return res.status(404).send({
                message: `La empresa ${req.body.search} no existe`
            });
            res.render('companies', {companiesData: companyData, numCompanies: companyData.length, search: req.body.search});
        }).lean();
    }
    else {
        res.redirect('empresas');
    }
};

