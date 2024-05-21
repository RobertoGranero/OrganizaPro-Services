const mongoose = require('mongoose');
const express = require('express');

const Lista = require(__dirname + "/models/lista");
const Tablero = require(__dirname + "/models/tablero");
const Usuario = require(__dirname + "/models/usuario");
const EspacioDeTrabajo = require(__dirname + "/models/espacioDeTrabajo");


mongoose.connect('mongodb://127.0.0.1:27017/organizapro');
let app = express();

app.use('/espacioDeTrabajo', EspacioDeTrabajo);
app.use('/listas', Lista);
app.use('/auth', Usuario);
app.use('/tableros', Tablero);