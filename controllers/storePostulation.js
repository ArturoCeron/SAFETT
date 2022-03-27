/*jshint esversion: 6 */

const companyVacant = require('../models/vacants');
const postulation = require('../models/postulations');
const users = require('../models/user');
const path = require('path');
var objDate = new Date();

module.exports = (req, res)=>{
    let postVacant = new postulation();
    let idUser = req.session;
    let vacantId = req.params.vacantId;
    companyVacant.findById(vacantId, (err, vacantData)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!vacantData) return res.status(404).send({
            message: `Vacante ${vacantId} no existe`
        });
        postVacant.idVacant = vacantData._id;
        postVacant.vacantName = vacantData.name;
        postVacant.companyName = vacantData.companyName;
        postVacant.registerDate = objDate.getDate() + "/" + (objDate.getMonth() + 1) + "/" + objDate.getFullYear();
        users.findOne(idUser, (err, userData)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!userData) return res.status(404).send({
                message: `El usuario ${idUser} no existe`
            });
            postulation.find({"idVacant": vacantId, "studentEmail": req.session.username}, (err, postData)=>{
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
                if (!postData) return res.status(404).send({
                    message: `El usuario ${idUser} no existe`
                });
                if(postData.length >= 1){
                    res.redirect("/");
                }
                else{
                    postVacant.studentId = userData._id;
                    postVacant.studentName = userData.name;
                    postVacant.studentEmail = userData.username;
                    console.log("Postulacion: ", postVacant);
                    postVacant.save( (err, postVacant) =>{
                        if (err) return res.status(500).send({
                            message: `Error al realizar la petición ${err}`
                        });
                        res.redirect("/");
                    });
                }
            }).lean();
        }).lean();
    }).lean();
};