'use strict'

const express = require('express')
const mongoose = require('mongoose')
const config = require('./config')
const path = require('path');
const hbs = require('express-handlebars')
const router = require('./routes/routes')
const multer = require("multer")
const cors = require('cors')
const {
    GridFsStorage
  } = require("multer-gridfs-storage")
  require("dotenv")
  .config();
const Grid = require('gridfs-stream')
const {User} = require('./models/user')
const app = express()
//const fileRoutes = require('./routes/file-upload-routes');
// method-override
const methodOverride = require('method-override');
app.use(methodOverride('_method'))

//Body Parser
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json())
//Motor de Vistas
app.engine('.hbs', hbs({
    defaultLayout: 'index',
    extname: '.hbs'
}))
app.set('view engine', '.hbs')
//Recursos Estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'))

//Router app
app.use('/', router)

mongoose.connect(config.db, config.urlParser, (err, res) =>{
    if(err){
        return console.log(`Error al conectar en la BD ${err}`)
    }
    console.log('Conexión a la BD exitosa')
    app.listen(config.port, ()=>{
        console.log(`Ejecutando en http://localhost:${config.port}`)
    })
})
////////////////////
//app.use('/', fileRoutes.routes);