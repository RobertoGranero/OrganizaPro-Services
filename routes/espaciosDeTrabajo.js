const express = require('express');
//const auth = require(__dirname + '/../auth/auth');

let EspacioDeTrabajo = require(__dirname + '/../models/espacioDeTrabajo.js');

let router = express.Router();

// Obtener todos los tablero
router.get('/', (req, res) => {
    EspacioDeTrabajo.find().then(resultado => {
        res.status(200)
            .send({ resultado: resultado });
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay tableros registrados" });
    });
});

router.get('/creador/:idUsuario', (req, res) => {
    EspacioDeTrabajo.find({creadoPor: req.params.idUsuario}).then(resultado => {
        res.status(200)
            .send(resultado);
    
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay espacios de trabajo registrados" });
    });
});

router.get('/miembrosEspacioTrabajo/:idMiembro', (req, res) => {
    EspacioDeTrabajo.find({ "miembros.usuario": req.params.idMiembro }).then(resultado => {
        res.status(200)
            .send(resultado);
    
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay espacios de trabajo registrados" });
    });
});

router.get('/:id', (req, res) => {
    EspacioDeTrabajo.findById(req.params.id).then(resultado => {
        res.status(200)
            .send(resultado);
    }).catch(error => {
        res.status(400)
            .send({ error: "No existe el tablero" });
    });
});

// Añadir un tablero
router.post('/',  (req, res) => {
    let nuevoEspacioDeTrabajo = new EspacioDeTrabajo({
        titulo: req.body.titulo,
        creadoPor: req.body.creadoPor
    });

    nuevoEspacioDeTrabajo.save().then(resultado => {
        res.status(200)
            .send(resultado );
    }).catch(error => {
        res.status(400)
            .send({ error: error });
    });
});

// Añadir un miembro al espacio de trabajo
router.post('/miembros/:id',  (req, res) => {
    let miembroNuevo = {
        "usuario": req.body.usuario,
    }
    EspacioDeTrabajo.findById(req.params.id).then((resultado) => {

        resultado.miembros.push(miembroNuevo);

        resultado.save().then((result) => {
            res.status(200).send(result);

        }).catch((err) => {
            res.status(400).send(err);
        });

    }).catch((error) => {
        res.status(400).send(err);
    })

});

// Actualizar los datos de un tablero
router.put('/:id', (req, res) => {
    EspacioDeTrabajo.findByIdAndUpdate(req.params.id, {
        $set: {
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
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

// Eliminar un EspacioDeTrabajo
router.delete('/:id', (req, res) => {
    EspacioDeTrabajo.findByIdAndDelete(req.params.id)
        .then(resultado => {
            res.status(200)
                .send({ resultado: resultado });
            
        }).catch(error => {
            res.status(400)
                .send({ error: error });
        });
});

module.exports = router;