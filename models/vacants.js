/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vacantes = new Schema({

    companyName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    quantityVacants: {
        type: Number,
        default: 1
    },
    area:{
        type: String,
        required: true
    },
    salary: {
        type: Number, 
        default: 0
    },
    typeContract: {
        type: String,
        required: true
    },
    schedule: {
        type: String,
        required: true
    },
    registerDate: {
        type: String,
        required: true
    },
});


//export model
const vacantesEmpresa = mongoose.model('vacantesEmpresa', vacantes);
module.exports = vacantesEmpresa;