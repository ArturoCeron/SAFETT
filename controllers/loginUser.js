/*jshint esversion: 6 */

const bcrypt = require('bcrypt');
const User = require('../models/user');
const CompanyUser = require('../models/companyUser');

module.exports = (req, res)=>{
    const {username, password} = req.body;

    User.findOne({username: username}, (error, user) =>{
        if (user){
            bcrypt.compare(password,user.password, (error, same) =>{
                if (same){
                    req.session.username = user.username;
                    res.redirect('/');
                }
                else{
                    res.redirect('/auth/login');
                    console.log("Salida 1");
                }
            });
        }
        else{
            CompanyUser.findOne({username: username}, (error, companyUser) =>{
                if (companyUser){
                    bcrypt.compare(password,companyUser.password, (error, same) =>{
                        if (same){
                            req.session.username = companyUser.username;
                            res.redirect('/');
                        }
                        else{
                            res.redirect('/auth/login');
                            console.log("Salida 2");
                        }
                    });
                }
                else{
                    res.redirect('/auth/login');
                    console.log("Salida 3");
                }
            });
        }
    });
};