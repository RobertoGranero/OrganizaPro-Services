const express = require('express');
const auth = require(__dirname + '/../auth/auth');

let Lista = require(__dirname + '/../models/lista.js');

let router = express.Router();

// Obtener todas las listas
router.get('/', auth.protegerRuta, (req, res) => {
    Lista.find().then(resultado => {
        res.status(200)
            .send({ resultado: resultado });
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay listas registradas" });
    });
});


//Obtener listas del tablero
router.get('/:idTablero', auth.protegerRuta, (req, res) => {
    Lista.find({tablero: req.params.idTablero}).then(resultado => {
        res.status(200)
            .send(resultado);
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay listas registradas" });
    });
});

// Añadir una lista
router.post('/', auth.protegerRuta, (req, res) => {
    let nuevaLista = new Lista({
        titulo: req.body.titulo,
        tablero: req.body.tablero,
        fecha: req.body.fecha,
        tarjetas: req.body.tarjetas
    });

    nuevaLista.save().then(resultado => {
        res.status(200)
            .send(resultado);
    }).catch(error => {
        res.status(400)
            .send({ error: "Error insertando la lista" });
    });
});

// Añadir una tarjeta a una lista
router.post('/:id/tarjetas', auth.protegerRuta, (req, res) => {
    let tarjetaNueva = {
        "titulo": req.body.titulo,
    }
    Lista.findById(req.params.id).then((resultado) => {
        resultado.tarjetas.push(tarjetaNueva);
        resultado.save().then((result) => {
            res.status(200).send({ resultado: result });

        }).catch((err) => {
            res.status(400).send(err);
        });

    }).catch((error) => {
        res.status(400).send(err);
    })
});



// Cambiar tarjeta de lista
router.post('/:id/nuevaTarjetaLista', auth.protegerRuta, (req, res) => {
    Lista.findById(req.params.id).then((resultado) => {
        resultado.tarjetas.push(req.body);
        resultado.save().then((result) => {
            res.status(200).send({ resultado: result });

        }).catch((err) => {
            res.status(400).send(err);
        });

    }).catch((error) => {
        res.status(400).send(err);
    })
});

// Eliminar una tarjeta de la lista
router.delete('/:id/tarjetaDelete/:indice', auth.protegerRuta, (req, res) => {
    Lista.findById(req.params.id).then(resultado => {
            resultado.tarjetas.splice(req.params.indice, 1);
            resultado.save().then((result) => {
                res.status(200).send(result.tarjetas);

            }).catch((err) => {
                res.status(400).send(err);
            });

        }).catch(error => {
            res.status(400)
                .send({ error: "Error eliminando la tarjeta" });
        });
});

// Editar titulo lista
router.put('/:id/tituloLista', auth.protegerRuta, (req, res) => {
    Lista.findByIdAndUpdate(req.params.id, {
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
                .send({ error: "Error actualizando los datos de la lista" });
        }

    }).catch(error => {
        res.status(400)
            .send({ error: "Error actualizando los datos del tablero" });
    });
});

// Eliminar una lista
router.delete('/:id', auth.protegerRuta, (req, res) => {
    Lista.findByIdAndDelete(req.params.id)
        .then(resultado => {
            if (resultado) {
                res.status(200)
                    .send(resultado);
            }
            else {
                res.status(400)
                    .send({ error: "Error eliminando la lista" });
            }

        }).catch(error => {
            res.status(400)
                .send({ error: "Error eliminando la lista" });
        });
});




module.exports = router;