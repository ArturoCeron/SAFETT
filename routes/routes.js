/*jshint esversion: 6 */

//MODULES
const { resolveSoa } = require('dns');
const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const authUser = require('../middleware/authUser');
const authCompany = require('../middleware/authCompany');
const authAccount = require('../middleware/authAccount');
const redirectIfAuth = require('../middleware/redirectIfAuth');

//MODELS
const companyUser = require("../models/companyUser");
const companyVacant = require('../models/vacants');
const Company = require('../models/companies');
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
const userPostulations = require('../controllers/userPostulations');
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
    res.locals.companyLogged = req.session.role || null;
    res.locals.userLogged = req.session.logged || null;
    res.locals.adminLogged = true;
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
router.get('/perfilAspirante', authAccount, (req, res) => {
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

//Prefil de Empresa visto desde alumno
router.get('/empresa/:companyId', authAccount, (req, res) => {
    let companyId = req.params.companyId;
    Company.findById(companyId, (err, datosPerfil)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!datosPerfil) return res.status(404).send({
            message: `El la empresa ${companyId} no existe`
        });
        companyVacant.find({"companyName": datosPerfil.companyName}, (err, vacantData)=>{
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!vacantData) return res.status(404).send({
                message: `La empresa ${userData[0].companyName} no existe`
            });
            res.render('companyProfile', {datosPerfil, vacantData});
        }).lean();
    }).lean();
});

//Perfil de Empresa

router.get('/perfilEmpresa', authAccount, (req, res) => {
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
                //console.log(vacantData);
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

//Empresas
router.get('/empresas', (req, res) => {
    Company.find({}, (err, companiesData)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!companiesData) return res.status(404).send({
            message: `La vacante no existe`
        });
        res.render('companies', {companiesData});
    }).lean();
});

//Vacantes de la compañia
router.get('/misVacantes', authCompany, (req, res) => {
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
            //console.log(vacantData);
            res.render('myVacants', {datos: vacantData});
        }).lean();
    }).lean();
});

//Vacante Especifica
router.get('/vacante/:vacantId', authAccount, (req, res) => {
    let vacantId = req.params.vacantId;
    companyVacant.find({"_id": vacantId}, (err, vacantValues)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!vacantValues) return res.status(404).send({
            message: `La vacante ${vacantId} no existe`
        });
        if(res.locals.companyLogged){
            companyUser.find({"username" : req.session.username}, (err, email) => {
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
                if (!email) return res.status(404).send({
                    message: `La vacante ${vacantId} no existe`
                });
                if(email[0].companyName == vacantValues[0].companyName){
                    postulations.find({"idVacant": vacantId}, (err, postValues)=>{
                        if (err) return res.status(500).send({
                            message: `Error al realizar la petición ${err}`
                        });
                        if (!postValues) return res.status(404).send({
                            message: `La vacante ${vacantId} no existe`
                        });
                        console.log("Posts: ", postValues);
                        res.render('job', {vacantVals: vacantValues, postVals: postValues});
                    }).lean();
                }
                else{
                    console.log("company view");
                    res.render('job', {vacantVals: vacantValues, postVals: undefined});
                }
            }).lean();
        }
        else{
            console.log("user view");
            res.render('job', {vacantVals: vacantValues, postVals: undefined});
        }
    }).lean();
});

router.post('/vacants/postulate/:vacantId', authAccount, postulateStudent);

//Nueva Vacante
router.get('/nuevaVacante', (req, res) => {
    res.render('newVacant');
});

//DELETE VACANT
router.delete('/vacants/delete/:vacantId', authCompany, deleteVacant);

//Registrar Vacante
router.post('/vacants/register', authCompany, storeVacantController);

//RENDER TEMPORAL
//REGISTER COMPANY
router.get('/company/register', (req, res) => {
    res.render('companyRegister');
});

//POST REGISTER COMPANY
router.post('/company/register', redirectIfAuth, newCompanyController);

router.get('/myPosts', authUser, userPostulations);

//Contacto
router.get('/contacto',(req, res) => {
    res.render('contact');
});

//Página home
router.use((req,res) =>{
    res.render('notfound');
});