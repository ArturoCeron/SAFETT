/*jshint esversion: 6 */

const User = require('../models/companyUser');
const Company = require('../models/companies');
const path = require('path');
var objDate = new Date();

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
    user.registerDate = objDate.getDate() + "/" + (objDate.getMonth() + 1) + "/" + objDate.getFullYear();
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
    company.contactLastname = req.body.contactLastname;
    company.contactMail = req.body.contactMail;
    company.contactPhone = req.body.contactPhone;
    company.contactCharge = req.body.contactCharge;
    company.contactExt = req.body.contactExt;
    company.registerDate = objDate.getDate() + "/" + (objDate.getMonth() + 1) + "/" + objDate.getFullYear();
    company.status = req.body.status;
    company.save( (error, company) =>{
        if (error) {
            console.log("Error en empresa")
        }
        res.redirect('/');
    });
};