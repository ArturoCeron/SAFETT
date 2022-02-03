const companyUser = require("../models/companyUser");

module.exports = (req, res, next) =>{
    companyUser.findById(req.session.userId, (error, user) =>{
        if(error || !user){
            return res.redirect('/');
        }
        next();
    });
};