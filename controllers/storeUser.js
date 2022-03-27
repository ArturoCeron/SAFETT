/*jshint esversion: 6 */

const User = require('../models/user');
const path = require('path');
var objDate = new Date();

module.exports = (req, res)=>{
    let user = new User();
    user.username = req.body.email;
    user.password = req.body.password;
    user.name = req.body.name;
    user.lastName = req.body.lastName;
    user.role = "user";
    user.registerDate = objDate.getDate() + "/" + (objDate.getMonth() + 1) + "/" + objDate.getFullYear();
    user.save( (error, user) =>{
        if (error) {
            console.log(error);
            return res.redirect('/users/register');
        }
        res.redirect('/');
    });
};