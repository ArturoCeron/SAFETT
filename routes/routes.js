/*jshint esversion: 6 */

//Módulos
const { resolveSoa } = require('dns');
const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const authMid = require('../middleware/authMiddleware');
const redirectIfAuth = require('../middleware/redirectIfAuth');

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
    res.render('home');
});

//Metodo GET para logout
const logoutController = require('../controllers/logout');
router.get('/auth/logout', logoutController);

//Página login
const loginController = require('../controllers/login');
router.get('/auth/login', redirectIfAuth, loginController);

const loginUserController = require('../controllers/loginUser');
router.post('/users/login', redirectIfAuth, loginUserController);

//Pagina para registro de usuarios
const newUser = require('../controllers/newUser');
router.get('/users/register', redirectIfAuth, newUser);

//Post para el registro
const newUserController = require('../controllers/storeUser');
const { isBuffer } = require('util');
router.post('/users/register', redirectIfAuth, newUserController);

//Perfil de Alumno
router.get('/perfilAspirante', (req, res) => {
    res.render('applicantProfile');
});

//Perfil de Empresa
const companyUser = require("../models/companyUser");
const companyVacant = require('../models/vacants');
const Company = require('../models/empresas');
router.get('/perfilEmpresa', (req, res) => {
    let idUser = req.session;
    companyUser.find(idUser, (err, userData)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: 'El usuario no existe'
        });
        companyVacant.find({"companyName": userData[0].companyName}, (err, vacantData)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!vacantData) return res.status(404).send({
                message: 'El usuario no existe'
            });
            Company.find({"companyName": userData[0].companyName}, (err, profileData) => {
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
                if (!profileData) return res.status(404).send({
                    message: 'El usuario no existe'
                });
                console.log(vacantData[0]);
                res.render('companyProfile', {datos: vacantData, datosPerfil: profileData});
            }).lean();
        }).lean();
    }).lean();
});

//Vacantes
router.get('/empleos', (req, res) => {
    res.render('vacants');
});

//Vacantes de la compañia
//const companyUser = require("../models/companyUser");
//const companyVacant = require('../models/vacants');
router.get('/misVacantes', (req, res) => {
    let idUser = req.session;
    companyUser.find(idUser, (err, userData)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: 'El usuario no existe'
        });
        companyVacant.find({"companyName": userData[0].companyName}, (err, vacantData)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!vacantData) return res.status(404).send({
                message: 'El usuario no existe'
            });
            console.log(vacantData[0]);
            res.render('myVacants', {datos: vacantData});
        }).lean();
    }).lean();
});

//Vacante Especifica
router.get('/vacante', (req, res) => {
    res.render('job');
});

//Nueva Vacante
router.get('/nuevaVacante', (req, res) => {
    res.render('newVacant');
});

//DELETE VACANT
const deleteVacant = require('../controllers/deleteVacant');
router.delete('/vacants/delete/:vacantId', deleteVacant);

//Registrar Vacante
const storeVacantController = require('../controllers/storeVacant');
router.post('/vacants/register', storeVacantController);


//RENDER TEMPORAL
//REGISTER COMPANY
router.get('/company/register', (req, res) => {
    res.render('companyRegister');
});

//POST REGISTER COMPANY
const newCompanyController = require('../controllers/storeCompany');
router.post('/company/register', redirectIfAuth, newCompanyController);

//Página home
router.use((req,res) =>{
    res.render('notfound');
});