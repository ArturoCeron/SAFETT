
const User = require('../models/user');
const path = require('path');
var objDate = new Date();
const singleFileUpload = async (req, res, next) => {
        const user = new User();            
            user.username = req.body.email;
            user.password = req.body.password;
            user.name = req.body.name;
            user.lastName = req.body.lastName;
            user.age = req.body.age;
            user.image = req.body.image;
            user.imageName = req.file.filename;
            user.sex = req.body.sex;
            user.career = req.body.career;
            user.lvlStudy = req.body.lvlStudy;
            user.presentation = req.body.presentation;
            user.email = req.body.emailContact;
            user.phone = req.body.phone;
            user.role = "user";
            user.registerDate = objDate.getDate() + "/" + (objDate.getMonth() + 1) + "/" + objDate.getFullYear();
            user.sex = req.body.sex;
            user.lvlEnglish = req.body.lvlEnglish;
            user.campus = req.body.campus;
            user.birthday = req.body.birthday;
            user.save( (error, user) =>{
                if (error) {
                    console.log(error);
                    return res.redirect('/users/register');
                }
                res.redirect('/');
            });
}

// const multiFileUpload = async (req, res, next) => {

// };
module.exports = {
    singleFileUpload
}