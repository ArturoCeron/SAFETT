/*jshint esversion: 6 */
const postulations = require('../models/postulations');
const vacants = require('../models/vacants');

module.exports = (req, res)=>{
    postulations.find({ 'studentId': req.session.userId }, (err, postValues)=>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });
        if (!postValues) return res.status(404).send({
            message: `El usuario ${req.session.userId} no existe`
        });
        if(postValues.length == 0){
            res.render('myPostulations', {datos: undefined});
        }else{
            res.render('myPostulations', {datos: postValues});
        }
    }).lean();
};

