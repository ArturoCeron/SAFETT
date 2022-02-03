const companyUser = require("../models/companyUser");
const User = require("../models/user");

module.exports = (req, res, next) =>{
    User.findById(req.session.userId, (error, user) =>{
        if(error || !user){
            companyUser.findById(req.session.userId, (error, companyUser) =>{
                if(error || !companyUser){
                    return res.redirect('/');
                }
                next();
            });
        }
        else{
            next();
        } 
    });
};