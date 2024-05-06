const express = require('express');
//const auth = require(__dirname + '/../auth/auth');

let Tablero = require(__dirname + '/../models/tablero.js');
let Usuario = require(__dirname + '/../models/usuario.js');

let router = express.Router();



// Obtener todos los tablero
router.get('/', (req, res) => {
    Tablero.find().then(resultado => {
        res.status(200)
            .send({ resultado: resultado });
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay tableros registrados" });
    });
});



router.get('/tablerosEspacioTrabajo/:idEspacioTrabajo', (req, res) => {
    Tablero.find({espacioTrabajo: req.params.idEspacioTrabajo}).then(resultado => {
        res.status(200)
            .send(resultado);
    
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay tableros registrados" });
    });
});

router.get('/:id', (req, res) => {
    Tablero.findById(req.params.id).then(resultado => {
        res.status(200)
            .send(resultado);
    }).catch(error => {
        res.status(400)
            .send({ error: "No existe el tablero" });
    });
});

// Añadir un tablero
router.post('/',  (req, res) => {
    let nuevoTablero = new Tablero({
        titulo: req.body.titulo,
        usuario: req.body.usuario,
        espacioTrabajo: req.body.espacioTrabajo,
        colorTablero: req.body.colorTablero
    });

    nuevoTablero.save().then(resultado => {
        res.status(200)
            .send(resultado);
    }).catch(error => {
        res.status(400)
            .send({ error: error });
    });
});

// Actualizar los datos de un tablero
router.post('/insertarUsuario/:id', (req, res) => {
    let insertarUsuarioEnTablero = {
        "usuario": req.body.id,
        "estado": req.body.estado,
        "rol": req.body.rol
    }
    

    Tablero.findById(req.params.id).then((resultado) => {
        resultado.miembros.push(insertarUsuarioEnTablero);

        resultado.save().then((result) => {
            res.status(200)
            .send({ resultado: resultado });
        }).catch((err) => {
            res.status(400)
            .send({ error: error });        
        });

    }).catch((error) => {
        res.render('error', { error: 'No existe el numero de habitacion' });
    })

});

// Actualizar los datos de un tablero
router.put('/:id', (req, res) => {
    Tablero.findByIdAndUpdate(req.params.id, {
        $set: {
            titulo: req.body.titulo,
            colorTablero: req.body.colorTablero,
        }
    }, { new: true }).then(resultado => {
        if (resultado) {
            res.status(200)
                .send({ resultado: resultado });
        }
        else {
            res.status(400)
                .send({ error: "Error actualizando los datos del tablero" });
        }

    }).catch(error => {
        res.status(400)
            .send({ error: "Error actualizando los datos del tablero" });
    });
});

// Eliminar un tablero
router.delete('/:id', (req, res) => {
    Tablero.findByIdAndDelete(req.params.id)
        .then(resultado => {
            if (resultado) {
                res.status(200)
                    .send(resultado);
            }
            else {
                res.status(400)
                    .send({ error: "Error eliminando el tablero" });
            }

        }).catch(error => {
            res.status(400)
                .send({ error: "Error eliminando el tablero" });
        });
});

module.exports = router;