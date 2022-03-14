/*jshint esversion: 6 */

const adminUser = require("../models/adminUsers");

module.exports = (req, res, next) =>{
    adminUser.findById(req.session.userId, (error, user) =>{
        if(error || !user){
            return res.redirect('/');
        }
        next();
    });
};