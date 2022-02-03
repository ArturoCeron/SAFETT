/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postulaciones = new Schema({
    idVacant: {
        type: String,
        required: true,
    },
    vacantName: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    }
});

//export model
const postulacionEstudiante = mongoose.model('postulacionEstudiante', postulaciones);
module.exports = postulacionEstudiante;