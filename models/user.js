/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({

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
    age: {
        type: Number,
        required: true
    },
    career:{
        type: String,
        required: true
    },
    lvlStudy: {
        type:String,
        required: true
    },
    presentation: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    registerDate: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    imageName: {
        type:String
    },
    sex: {
        type: String,
        possibleValues: ['hombre', 'mujer']
    },
    lvlEnglish: {
        type: String,
        possibleValues: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    },
    campus:{
        type: String,
        possibleValues: ['Tomás Aquino', 'Otay']
    },
    birthday:{
        type: Date,
        required: true
    },
    curriculum: {
        data: Buffer,
        contentType: String
    },
    curriculumName:{
        type:String
    }
});

UserSchema.pre('save', function (next){
    const user = this;

    bcrypt.hash(user.password, 10, (error, hash)=>{
        user.password = hash;
        next();
    });
});

//export model
const User = mongoose.model('User', UserSchema);
module.exports = User;
//module.exports = UserSchema;