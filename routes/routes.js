/*jshint esversion: 6 */

//MODULES
const { resolveSoa } = require('dns');
const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const authMid = require('../middleware/authMiddleware');
const redirectIfAuth = require('../middleware/redirectIfAuth');

//MODELS
const companyUser = require("../models/companyUser");
const companyVacant = require('../models/vacants');
const Company = require('../models/empresas');
const postulations = require('../models/postulations');
const usersInfo = require('../models/user');

//CONTROLLERS
const searchValues = require('../controllers/search');
const logoutController = require('../controllers/logout');
const loginController = require('../controllers/login');
const loginUserController = require('../controllers/loginUser');
const newUser = require('../controllers/newUser');
const deleteVacant = require('../controllers/deleteVacant');
const newUserController = require('../controllers/storeUser');
const storeVacantController = require('../controllers/storeVacant');
const newCompanyController = require('../controllers/storeCompany');
const postulateStudent = require('../controllers/storePostulation');
//Crear objeto router
const router = express.Router();

//Exportar router
module.exports = router;

//Activación de las sesiones (cookies)
router.use(expressSession({
    secret: 'safettProject',
    resave: true,
    saveUninitialized: true
}));

// Variables Globales
router.use((req, res, next) =>{
    res.locals.loggedIn = req.session.username || null;
    next();
});

//Página home
router.get('/', (req,res) =>{
    console.log(req.session);
    res.render('home', {vacants: undefined, companies: undefined});
});

//POST SEARCH BAR
router.post('/home', searchValues);

//Metodo GET para logout
router.get('/auth/logout', logoutController);

//Página login
router.get('/auth/login', redirectIfAuth, loginController);

//Pagina de inicio de usuarios
router.post('/users/login', redirectIfAuth, loginUserController);

//Pagina para registro de usuarios
router.get('/users/register', redirectIfAuth, newUser);

//Post para el registro
const { isBuffer } = require('util');
router.post('/users/register', redirectIfAuth, newUserController);

//Perfil de Alumno
router.get('/perfilAspirante', (req, res) => {
    let idUser = req.session;
    usersInfo.find(idUser, (err, userData)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: `El usuario ${idUser} no existe`
        });
        res.render('applicantProfile', {userProfile: userData});
    }).lean();
});

//Perfil de Empresa

router.get('/perfilEmpresa', (req, res) => {
    let idUser = req.session;
    companyUser.find(idUser, (err, userData)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: `El usuario ${idUser} no existe`
        });
        companyVacant.find({"companyName": userData[0].companyName}, (err, vacantData)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!vacantData) return res.status(404).send({
                message: `La empresa ${userData[0].companyName} no existe`
            });
            Company.find({"companyName": userData[0].companyName}, (err, profileData) => {
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
                if (!profileData) return res.status(404).send({
                    message: `La empresa ${userData[0].companyName} no existe`
                });
                console.log(vacantData[0]);
                res.render('companyProfile', {datos: vacantData, datosPerfil: profileData});
            }).lean();
        }).lean();
    }).lean();
});

//Vacantes
router.get('/empleos', (req, res) => {
    companyVacant.find({}, (err, vacantsData)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!vacantsData) return res.status(404).send({
            message: `La vacante no existe`
        });
        res.render('vacants', {vacantsData: vacantsData});
    }).lean();
});

//Vacantes de la compañia
router.get('/misVacantes', (req, res) => {
    let idUser = req.session;
    companyUser.find(idUser, (err, userData)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: `El usuario ${idUser} no existe`
        });
        companyVacant.find({"companyName": userData[0].companyName}, (err, vacantData)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!vacantData) return res.status(404).send({
                message: `La empresa ${userData[0].companyName} no existe`
            });
            console.log(vacantData[0]);
            res.render('myVacants', {datos: vacantData});
        }).lean();
    }).lean();
});

//Vacante Especifica
router.get('/vacante/:vacantId', (req, res) => {
    let vacantId = req.params.vacantId;
    companyVacant.findById(vacantId, (err, vacantValues)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!vacantValues) return res.status(404).send({
            message: `La vacante ${vacantId} no existe`
        });
        postulations.find({"idVacant": vacantId}, (err, postValues)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!postValues) return res.status(404).send({
                message: `La vacante ${vacantId} no existe`
            });
            res.render('job', {vacantVals: vacantValues, postVals: postValues});
        }).lean();
    }).lean();
});

router.post('/vacants/postulate/:vacantId', postulateStudent);

//Nueva Vacante
router.get('/nuevaVacante', (req, res) => {
    res.render('newVacant');
});

//DELETE VACANT
router.delete('/vacants/delete/:vacantId', deleteVacant);

//Registrar Vacante
router.post('/vacants/register', storeVacantController);

//RENDER TEMPORAL
//REGISTER COMPANY
router.get('/company/register', (req, res) => {
    res.render('companyRegister');
});

//POST REGISTER COMPANY
router.post('/company/register', redirectIfAuth, newCompanyController);

//Página home
router.use((req,res) =>{
    res.render('notfound');
});