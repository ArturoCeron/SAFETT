/*jshint esversion: 6 */

const User = require('../models/user');
const path = require('path');

module.exports = (req, res)=>{
    let user = new User();
    user.username = req.body.email;
    user.password = req.body.password;
    user.name = req.body.name;
    user.lastName = req.body.lastName;
    user.save( (error, user) =>{
        if (error) {
            return res.redirect('/users/register');
        }
        res.redirect('/');
    });
};