/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const empresasSchema = new Schema({

    companyName: {
        type: String,
        required: true
    },
    companyBusiness: {
        type: String,
        required: true
    },
    quantityEmployees: {
        type: Number,
        required: true
    },
    mainRole: {
        type: String,
        required: true
    },
    webPage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    branchName: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    streetNumber: {
        type: Number,
        required: true
    },
    suburb: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    contactMail: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
});


//export model
const Empresas = mongoose.model('Empresas', empresasSchema);
module.exports = Empresas;