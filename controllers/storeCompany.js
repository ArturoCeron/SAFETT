/*jshint esversion: 6 */

const User = require('../models/companyUser');
const Company = require('../models/empresas');
const path = require('path');

module.exports = (req, res)=>{
    let user = new User();
    user.companyName = req.body.companyName;
    user.username = req.body.email;
    user.password = req.body.password;
    user.name = req.body.name;
    user.lastName = req.body.lastName;
    user.phoneNumber = req.body.phoneNumber;
    user.title = req.body.title;
    user.role = "company";
    user.save( (error, user) =>{
        if (error) {
            console.log("Error en usuario")
        }
    });

    
    let company = new Company();
    company.companyName = req.body.companyName;
    company.companyBusiness = req.body.companyBusiness;
    company.quantityEmployees = req.body.quantityEmployees;
    company.mainRole = req.body.mainRole;
    company.webPage = req.body.webPage;
    company.description = req.body.description;
    company.branchName = req.body.branchName;
    company.state = req.body.state;
    company.city = req.body.city;
    company.street = req.body.street;
    company.streetNumber = req.body.streetNumber;
    company.suburb = req.body.suburb;
    company.zip = req.body.zip;
    company.contactName = req.body.contactName;
    company.contactMail = req.body.contactMail;
    company.contactPhone = req.body.contactPhone;
    company.save( (error, company) =>{
        if (error) {
            console.log("Error en empresa")
        }
        res.redirect('/');
    });
};