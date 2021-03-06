/*jshint esversion: 6 */
const User = require('../models/adminUsers');
const path = require('path');
var objDate = new Date();

module.exports = (req, res)=>{
    let user = new User();
    user.username = req.body.email;
    user.password = req.body.password;
    user.name = req.body.name;
    user.lastName = req.body.lastName;
    user.role = "admin";
    user.registerDate = objDate.getDate() + "/" + (objDate.getMonth() + 1) + "/" + objDate.getFullYear();
    user.save( (error, user) =>{
        if (error) {
            console.log(error);
            return res.redirect('/admin/register');
        }
        res.redirect('/');
    });
};