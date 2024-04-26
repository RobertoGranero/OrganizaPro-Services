// Librerías externas
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Enrutadores
//const EspacioDeTrabajo = require(__dirname + "/models/espacioDeTrabajo");
const Lista = require(__dirname + "/routes/listas");
const Tarjeta = require(__dirname + "/routes/tarjetas");
const EspacioDeTrabajo = require(__dirname + "/routes/espaciosDeTrabajo");
const Usuario = require(__dirname + "/routes/auth");
const tablero = require(__dirname + "/routes/tableros");


// Conexión con la BD
mongoose.connect('mongodb://127.0.0.1:27017/organizapro');

let app = express();

// Carga de middleware y enrutadores
// A cada enrutador se le indica una ruta base
app.use(cors());
app.use(express.json());
app.use('/espacioDeTrabajo', EspacioDeTrabajo);
app.use('/listas', Lista);
app.use('/tarjetas', Tarjeta);
app.use('/auth', Usuario);
app.use('/tableros', tablero);

// Puesta en marcha del servidor
app.listen(8080);
