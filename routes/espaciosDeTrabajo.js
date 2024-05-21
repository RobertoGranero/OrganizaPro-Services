const express = require('express');
const auth = require(__dirname + '/../auth/auth');

let EspacioDeTrabajo = require(__dirname + '/../models/espacioDeTrabajo.js');
let Tablero = require(__dirname + '/../models/tablero.js');
let Lista = require(__dirname + '/../models/lista.js');

let router = express.Router();

// Obtener todos los tablero
router.get('/', auth.protegerRuta, (req, res) => {
    EspacioDeTrabajo.find().then(resultado => {
        res.status(200)
            .send({ resultado: resultado });
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay tableros registrados" });
    });
});

// Tableros de los espacios de trabajos del creador
router.get('/creador/:idUsuario/tableros' , auth.protegerRuta, (req, res) => {
    EspacioDeTrabajo.find({creadoPor: req.params.idUsuario}).then(resultado => {
        Tablero.find({creadoPor: resultado._id}).then((result) => {
            res.status(200)
            .send(result);
        })  
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay espacios de trabajo registrados" });
    });
});


router.get('/creador/:idUsuario', auth.protegerRuta, (req, res) => {
    EspacioDeTrabajo.find({creadoPor: req.params.idUsuario}).then(resultado => {
        res.status(200)
            .send(resultado);
    
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay espacios de trabajo registrados" });
    });
});

router.get('/miembrosEspacioTrabajo/:idMiembro', auth.protegerRuta, (req, res) => {
    EspacioDeTrabajo.find({ "miembros.usuario": req.params.idMiembro }).then(resultado => {
        res.status(200)
            .send(resultado);
    
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay espacios de trabajo registrados" });
    });
});

router.get('/:id', auth.protegerRuta, (req, res) => {
    EspacioDeTrabajo.findById(req.params.id).then(resultado => {
        res.status(200)
            .send(resultado);
    }).catch(error => {
        res.status(400)
            .send({ error: "No existe el espacio de trabajo" });
    });
});

// Añadir un espacio de trabajo
router.post('/', auth.protegerRuta, (req, res) => {
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
router.post('/miembros/:id', auth.protegerRuta, (req, res) => {
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
router.put('/:id', auth.protegerRuta, (req, res) => {
    EspacioDeTrabajo.findByIdAndUpdate(req.params.id, {
        $set: {
            titulo: req.body.titulo,
        }
    }, { new: true }).then(resultado => {
        if (resultado) {
            res.status(200)
                .send({ resultado: resultado });
        }
        else {
            res.status(400)
                .send({ error: "Error actualizando los datos del espacio de trabajo" });
        }

    }).catch(error => {
        res.status(400)
            .send({ error: "Error actualizando los datos del espacio de trabajo" });
    });
});

// Eliminar un EspacioDeTrabajo
router.delete('/:id', auth.protegerRuta, async (req, res) => {
    
    try {
        const tableros = await Tablero.find({ espacioTrabajo: req.params.id });
        
        const tableroIds = tableros.map(tablero => tablero._id);

        await Lista.deleteMany({ tablero: { $in: tableroIds } });
        await Tablero.deleteMany({ espacioTrabajo: req.params.id });
        const espacioEliminado = await EspacioDeTrabajo.findByIdAndDelete(req.params.id);

        res.status(200).send({ resultado: espacioEliminado });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});




module.exports = router;