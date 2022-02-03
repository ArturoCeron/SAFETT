/*jshint esversion: 6 */

const companyVacant = require('../models/vacants');
const postulation = require('../models/postulations');
const users = require('../models/user');
const path = require('path');

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
        users.findOne(idUser, (err, userData)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!userData) return res.status(404).send({
                message: `El usuario ${idUser} no existe`
            });
            postVacant.studentId = userData._id;
            postVacant.studentName = userData.name;
            postVacant.studentEmail = userData.username;
            console.log("Postulacion: ", postVacant);
            postVacant.save( (err, postVacant) =>{
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
                res.redirect('/');
            });
        }).lean();
    }).lean();
};