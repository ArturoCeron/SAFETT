/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const CompanyUserSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
});

CompanyUserSchema.pre('save', function (next){
    const user = this;

    bcrypt.hash(user.password, 10, (error, hash)=>{
        user.password = hash;
        next();
    });
});

//export model
const User = mongoose.model('CompanyUser', CompanyUserSchema);
module.exports = User;