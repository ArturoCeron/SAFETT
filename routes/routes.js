/*jshint esversion: 6 */

//MODULES
const { resolveSoa } = require('dns');
const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const authUser = require('../middleware/authUser');
const authCompany = require('../middleware/authCompany');
const authAccount = require('../middleware/authAccount');
const authAdmin = require('../middleware/authAdmin');
const redirectIfAuth = require('../middleware/redirectIfAuth');
const { isBuffer } = require('util');


//MODELS
const companyUser = require("../models/companyUser");
const companyVacant = require('../models/vacants');
const Company = require('../models/companies');
const postulations = require('../models/postulations');
const usersInfo = require('../models/user');
const adminInfo = require('../models/adminUsers');


//CONTROLLERS
const searchValues = require('../controllers/search');
const logoutController = require('../controllers/logout');
const loginController = require('../controllers/login');
const loginUserController = require('../controllers/loginUser');
const newUser = require('../controllers/newUser');
const newUserAdmin = require('../controllers/newUserAdmin');
const deleteVacant = require('../controllers/deleteVacant');
const {singleFileUpload} = require('../controllers/fileuploaderController');
//const newUserController = require('../controllers/storeUser');
const storeVacantController = require('../controllers/storeVacant');
// const {singleFileUploadCompany} = require('../controllers/storeCompany');
const storeCompanyController = require('../controllers/storeCompany');
const newAdminController = require('../controllers/storeAdmin');
const postulateStudent = require('../controllers/storePostulation');
const userPostulations = require('../controllers/userPostulations');
const searchVacants = require('../controllers/searchVacants');
const searchCompanies = require('../controllers/searchCompanies');
//const getActualDate = require ('../controllers/getDateRegister');
const {upload} = require('../helpers/filehelper');
const { userInfo } = require('os');
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
router.use((req, res, next) => {
    res.locals.loggedIn = req.session.username || null;
    res.locals.companyLogged = req.session.role || null;
    res.locals.userLogged = req.session.logged || null;
    res.locals.adminLogged = req.session.adminrole || null;
    next();
});

//Modificador de datos
router.use(methodOverride('_method'));


// -------------------------------------------------- ROUTER.GET SECTION ------------------------------------------------------------

//Página home
router.get('/', (req, res) => {
    console.log(req.session);
    res.render('home', {vacants: undefined, companies: undefined });
});

//Metodo GET para logout
router.get('/auth/logout', logoutController);

//Página login
router.get('/auth/login', redirectIfAuth, loginController);

//Pagina para registro de usuarios
router.get('/users/register', redirectIfAuth, newUser);

//Pagina para registro de administradores
router.get('/register/Admin', newUserAdmin);

//Nueva Vacante
router.get('/nuevaVacante', (req, res) => {
    res.render('newVacant');
});



//Pagina de información de empresas Administrador
router.get('/mainAdmin/empresas', (req, res) => {
    Company.find({}, (err, companies) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });

        if (!companies) return res.status(404).send({
            message: 'No existen empresas'
        });
        companyVacant.find({ "companyName": companies.companyName }, (err, compVacant) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!compVacant) return res.status(404).send({
                message: `La empresa no existe`
            });
            res.render('adminOptions/companiesAdmin', { companies, compVacant });
        }).lean();
    }).lean();

});

router.get('/mainAdmin/empresa/:companyId', (req, res) => {
    let companyId = req.params.companyId;
    Company.findById(companyId, (err, datosPerfil) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!datosPerfil) return res.status(404).send({
            message: `El la empresa ${companyId} no existe`
        });
        companyVacant.find({ "companyName": datosPerfil.companyName }, (err, vacants) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });

            if (!vacants) return res.status(404).send({
                message: 'No existen empresas'
            });
            companyVacant.find({ "quantityVacants": vacants.quantityVacantsC }, (err, vacantData) => {
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
                if (!vacantData) return res.status(404).send({
                    message: `La empresa ${userData[0].companyName} no existe`
                });
                res.render('adminOptions/companiesEdit', { datosPerfil, vacants, vacantData });
            }).lean();
        }).lean();
    }).lean();
});

//Pagina de información de vacantes Administrador
router.get('/mainAdmin/vacantes', (req, res) => {
    companyVacant.find({}, (err, vacants) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });

        if (!vacants) return res.status(404).send({
            message: 'No existen empresas'
        });
        companyVacant.find({ "companyName": vacants.companyName }, (err, compVacant) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!compVacant) return res.status(404).send({
                message: `La empresa no existe`
            });
            res.render('adminOptions/vacantsAdmin', { vacants, compVacant });
        }).lean();
        //res.render('adminOptions/vacantsAdmin', {vacants: vacants, numVacants: vacants.length});
    }).lean();
});

router.get('/mainAdmin/vacante/:vacantId', (req, res) => {
    let vacantId = req.params.vacantId;
    companyVacant.findById(vacantId, (err, datosVacante) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!datosVacante) return res.status(404).send({
            message: `El la empresa ${companyId} no existe`
        });
        Company.find({ "companyName": datosVacante.companyName }, (err, datosEmpresa) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!datosEmpresa) return res.status(404).send({
                message: `La empresa ${userData[0].companyName} no existe`
            });
            res.render('adminOptions/vacantsEdit', { datosVacante, datosEmpresa });
        }).lean();
    }).lean();
});

//Pagina de información de aspirantes Administrador
router.get('/mainAdmin/aspirantes', (req, res) => {
    usersInfo.find({}, (err, applicants) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });

        if (!applicants) return res.status(404).send({
            message: 'No existe el usuario'
        });
        res.render('adminOptions/applicantsAdmin', { applicants });
    }).lean();

});

router.get('/mainAdmin/aspirante/:userId', (req, res) => {
    let userId = req.params.userId;
    usersInfo.findById(userId, (err, datosAspirante) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!datosAspirante) return res.status(404).send({
            message: `El usuario ${userId} no existe`
        });
        postulations.find({ "studentId": datosAspirante._id }, (err, datosPostulacion) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!datosPostulacion) return res.status(404).send({
                message: `La vacante de ${userData[0].userId} no existe`
            });
            res.render('adminOptions/applicantsEdit', { datosAspirante, datosPostulacion });
        }).lean();
    }).lean();
});

//Vista de registros de la pagina (administrador)
router.get('/mainAdmin/reporte', (req, res) => {

    Company.find({}, (err, companies2) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });

        if (!companies2) return res.status(404).send({
            message: 'No existen empresas'
        });
        Company.find({ "status": "aprobada" }, (err, companies) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });

            if (!companies) return res.status(404).send({
                message: 'No existen empresas'
            });
            usersInfo.find({"role":"user"}, (err, usersData) => {
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
        
                if (!usersData) return res.status(404).send({
                    message: 'No existe usuario'
                });
                usersInfo.find({ "curriculumName":null}, (err, noCV) => {
                    if (err) return res.status(500).send({
                        message: `Error al realizar la petición ${err}`
                    });
        
                    if (!noCV) return res.status(404).send({
                        message: 'No existe usuario'
                    });
                    usersInfo.find({ "campus": "Otay"}, (err, campusOtay) => {
                        if (err) return res.status(500).send({
                            message: `Error al realizar la petición ${err}`
                        });
            
                        if (!campusOtay) return res.status(404).send({
                            message: 'No se encontraron campus'
                        });
                        usersInfo.find({ "campus": "Tomas Aquino"}, (err, campusTA) => {
                            if (err) return res.status(500).send({
                                message: `Error al realizar la petición ${err}`
                            });
                
                            if (!campusTA) return res.status(404).send({
                                message: 'No se encontraron campus'
                            });
                            res.render('adminOptions/reports', { companies, approved: companies.length, companies2, totalComp: companies2.length, usersData, allUsers: usersData.length, noCV, empty: noCV.length, haveCV:(usersData.length - noCV.length), quantityOtay: campusOtay.length, quantityTA: campusTA.length});
                        }).lean();
                    }).lean();
                }).lean();
            }).lean();
        }).lean();
    }).lean();
});


router.get('/', authAdmin, (req, res) => {
    let adminID = req.session;
    adminInfo.find(adminID, (err, userData) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: `El usuario ${idUser} no existe`
        });
        res.render('applicantProfile', { userProfile: userData });
    }).lean();
});
//Perfil de Alumno
router.get('/perfilAspirante', authAccount, (req, res) => {
    let idUser = req.session;
    usersInfo.find(idUser, (err, userData) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: `El usuario ${idUser} no existe`
        });
        res.render('applicantProfile', { userProfile: userData });
    }).lean();
});

//Modificación del perfil del alumno por el alumno

router.put('/perfilAspirante/:userID', (req, res) => {
    let userID = req.params.userID;
    let update = req.body;
    usersInfo.findByIdAndUpdate(userID, update, (err, users) => {
        if (err) return res.status(500).send({
            message: `Error al actualizar el usuario ${err}`
        });

        if (!users) return res.status(404).send({
            message: 'El usuario no existe'
        });

        res.redirect('/perfilAspirante');
    });
});

//Modificación del perfil del alumno (Administrador)
router.put('/mainAdmin/aspirante/:userID', (req, res) => {
    let userID = req.params.userID;
    let update = req.body;
    usersInfo.findByIdAndUpdate(userID, update, (err, users) => {
        if (err) return res.status(500).send({
            message: `Error al actualizar el usuario ${err}`
        });

        if (!users) return res.status(404).send({
            message: 'El usuario no existe'
        });

        res.redirect('/mainAdmin/aspirantes');
    });
});

//Modificación del perfil de la empresa por la empresa

router.put('/perfilEmpresa/:companyID', (req, res) => {
    let companyID = req.params.companyID;
    let update = req.body;
    Company.findByIdAndUpdate(companyID, update, (err, company) => {
        if (err) return res.status(500).send({
            message: `Error al actualizar el usuario ${err}`
        });

        if (!company) return res.status(404).send({
            message: 'El usuario no existe'
        });

        res.redirect('/perfilEmpresa');
    });
});

//Modificación de datos de la empresa (administrador)
router.put('/mainAdmin/empresa/:companyID', (req, res) => {
    let companyID = req.params.companyID;
    let update = req.body;
    Company.findByIdAndUpdate(companyID, update, (err, company) => {
        if (err) return res.status(500).send({
            message: `Error al actualizar la empresa ${err}`
        });

        if (!company) return res.status(404).send({
            message: 'La empresa no existe'
        });

        res.redirect('/mainAdmin/empresas');
    });
});

//Modificación de datos de la vacante (Administrador)
router.put('/mainAdmin/vacante/:vacantID', (req, res) => {
    let vacantID = req.params.vacantID;
    let update = req.body;
    companyVacant.findByIdAndUpdate(vacantID, update, (err, vacant) => {
        if (err) return res.status(500).send({
            message: `Error al actualizar la vacante ${err}`
        });

        if (!vacant) return res.status(404).send({
            message: 'La vacante no existe'
        });

        res.redirect('/mainAdmin/vacantes');
    });
});


//Perfil de Empresa visto desde alumno
router.get('/empresa/:companyId', authAccount, (req, res) => {
    let companyId = req.params.companyId;
    Company.findById(companyId, (err, datosPerfil) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!datosPerfil) return res.status(404).send({
            message: `El la empresa ${companyId} no existe`
        });
        companyVacant.find({ "companyName": datosPerfil.companyName }, (err, vacantData) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!vacantData) return res.status(404).send({
                message: `La empresa ${userData[0].companyName} no existe`
            });
            res.render('companyProfile', { datosPerfil, vacantData });
        }).lean();
    }).lean();
});


//Perfil del alumno visto desde la empresa
router.get('/perfilAspirante/:userID', authCompany, (req, res) => {
    let userID = req.params.userID;
    usersInfo.findById(userID, (err, userData) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: `El aspirante ${userID} no existe`
        });
            res.render('applicantProfile-CompanyView', { userProfile: userData });
    }).lean();
});

//Perfil de Empresa

router.get('/perfilEmpresa', authAccount, (req, res) => {
    let idUser = req.session;
    companyUser.find(idUser, (err, userData) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: `El usuario ${idUser} no existe`
        });
        companyVacant.find({ "companyName": userData[0].companyName }, (err, vacantData) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!vacantData) return res.status(404).send({
                message: `La empresa ${userData[0].companyName} no existe`
            });
            Company.find({ "companyName": userData[0].companyName }, (err, profileData) => {
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
                if (!profileData) return res.status(404).send({
                    message: `La empresa ${userData[0].companyName} no existe`
                });
                //console.log(vacantData);
                res.render('companyProfile', { datos: vacantData, datosPerfil: profileData });
            }).lean();
        }).lean();
    }).lean();
});

//Vacantes
router.get('/empleos', (req, res) => {
    companyVacant.find({}, (err, vacantsData) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!vacantsData) return res.status(404).send({
            message: `La vacante no existe`
        });
        console.log(vacantsData.length);
        res.render('vacants', { vacantsData: vacantsData, numVacants: vacantsData.length, search: undefined });
    }).lean();
});

//Empresas
router.get('/empresas', (req, res) => {
    Company.find({}, (err, companiesData) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!companiesData) return res.status(404).send({
            message: `La vacante no existe`
        });
        res.render('companies', { companiesData: companiesData, numCompanies: companiesData.length, search: undefined });
    }).lean();
});

//Vacantes de la compañia
router.get('/misVacantes', authCompany, (req, res) => {
    let idUser = req.session;
    companyUser.find(idUser, (err, userData) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!userData) return res.status(404).send({
            message: `El usuario ${idUser} no existe`
        });
        companyVacant.find({ "companyName": userData[0].companyName }, (err, vacantData) => {
            if (err) return res.status(500).send({
                message: `Error al realizar la petición ${err}`
            });
            if (!vacantData) return res.status(404).send({
                message: `La empresa ${userData[0].companyName} no existe`
            });
            //console.log(vacantData);
            res.render('myVacants', { datos: vacantData });
        }).lean();
    }).lean();
});


//Vacante Especifica
router.get('/vacante/:vacantId', authAccount, (req, res) => {
    let vacantId = req.params.vacantId;
    companyVacant.findById(vacantId, (err, vacantValues) => {
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!vacantValues) return res.status(404).send({
            message: `La vacante ${vacantId} no existe`
        });
        console.log(vacantValues);
        if (res.locals.companyLogged) {
            companyUser.findOne({ "username": req.session.username }, (err, email) => {
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
                if (!email) return res.status(404).send({
                    message: `La vacante ${vacantId} no existe`
                });
                console.log(email);
                if (email.companyName == vacantValues.companyName) {
                    postulations.find({ "idVacant": vacantId }, (err, postValues) => {
                        if (err) return res.status(500).send({
                            message: `Error al realizar la petición ${err}`
                        });
                        if (!postValues) return res.status(404).send({
                            message: `La vacante ${vacantId} no existe`
                        });
                        console.log("Posts: ", postValues);
                        res.render('job', { vacantVals: vacantValues, postVals: postValues, post: undefined });
                    }).lean();
                }
                else {
                    console.log("company view");
                    res.render('job', { vacantVals: vacantValues, postVals: undefined, post: undefined });
                }
            }).lean();
        }
        else {
            postulations.find({ "idVacant": vacantId, "studentEmail": req.session.username }, (err, postData) => {
                if (err) return res.status(500).send({
                    message: `Error al realizar la petición ${err}`
                });
                if (!postData) return res.status(404).send({
                    message: `El usuario ${idUser} no existe`
                });
                if (postData.length >= 1) {
                    res.render("job", { vacantVals: vacantValues, postVals: undefined, post: false });
                }
                else {
                    res.render('job', { vacantVals: vacantValues, postVals: undefined, post: true });
                }
            }).lean();
        }
    }).lean();
});

//RENDER TEMPORAL
//REGISTER COMPANY
router.get('/company/register', (req, res) => {
    res.render('companyRegister');
});

router.get('/myPosts', authUser, userPostulations);

//Contacto
router.get('/contacto', (req, res) => {
    res.render('contact');
});

//register admin
router.get('/admin/register', (req, res) => {
    res.render('adminRegister');
});

// -------------------------------------------------- ROUTER.POST SECTION ------------------------------------------------------------

//POST SEARCH BAR
router.post('/home', searchValues);

//Pagina de inicio de usuarios
router.post('/users/login', redirectIfAuth, loginUserController);

//Post para el registro
//router.post('/users/register', redirectIfAuth, newUserController);
//router.post('/users/register', redirectIfAuth);
router.post('/users/register', redirectIfAuth, upload.fields([{name:'image', maxCount: 1}, {name:'curriculum', maxCount: 1}]), singleFileUpload);

router.post('/vacants/postulate/:vacantId', authAccount, postulateStudent);

router.post('/empleos', searchVacants);

router.post('/empresas', searchCompanies);

//post register admin
router.post('/admin/register', authAdmin, newAdminController);

//Registrar Vacante
router.post('/vacants/register', authCompany, storeVacantController);

//POST REGISTER COMPANY
router.post('/company/register', redirectIfAuth, storeCompanyController);

// -------------------------------------------------- ROUTER.DELETE SECTION ------------------------------------------------------------

//DELETE VACANT
router.delete('/vacants/delete/:vacantId', authCompany, deleteVacant);

//Página home
router.use((req, res) => {
    res.render('notfound');
});