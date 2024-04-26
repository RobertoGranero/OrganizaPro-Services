const express = require('express');
//const auth = require(__dirname + '/../auth/auth');

let Lista = require(__dirname + '/../models/lista.js');

let router = express.Router();

// Añadir una tarjeta a una lista
router.post('/:id/tarjetas', (req, res) => {
    let tarjetaNueva = {
        "titulo": req.body.titulo,
    }
    Lista.findById(req.params.id).then((resultado) => {
        resultado.tarjetas.push(tarjetaNueva);
        resultado.save().then((result) => {
            res.status(200).send(result.tarjetas[result.tarjetas.length-1]);

        }).catch((err) => {
            res.status(400).send(err);
        });

    }).catch((error) => {
        res.status(400).send(err);
    })
});



// Cambiar tarjeta de lista
router.post('/:id/nuevaTarjetaLista', (req, res) => {
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
router.delete('/:id/tarjetaDelete/:indice', (req, res) => {
    Lista.findById(req.params.id).then(resultado => {
            resultado.tarjetas.splice(req.params.indice, 1);
            resultado.save().then((result) => {
                console.log(result.tarjetas)
                res.status(200).send(result.tarjetas);

            }).catch((err) => {
                res.status(400).send(err);
            });

        }).catch(error => {
            res.status(400)
                .send({ error: "Error eliminando la tarjeta" });
        });
});

router.post('/:idLista/checkList/:idTarjeta', (req, res) => {
    Lista.findById(req.params.idLista).then((resultado) => {

        resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id = req.params.idTarjeta).checkList.push(req.body);

        resultado.save().then((result) => {
            res.status(200).send({ resultado: result });

        }).catch((error) => {
            res.status(400).send({error: error});
        });

    }).catch((error) => {
        res.status(400).send({error: error});
    })
});

router.put('/:idLista/descripcion/:idTarjeta', (req, res) => {
    Lista.findById(req.params.idLista).then((resultado) => {
        console.log(req.body)
        resultado.tarjetas.find(tarjeta => tarjeta._id == req.params.idTarjeta).descripcion = req.body.descripcion;

        resultado.save().then(resultado => {
                res.status(200).send(resultado.tarjetas.find(tarjeta => tarjeta._id == req.params.idTarjeta));
            })
            .catch(error => {
                res.status(400).send({ error: "Error actualizando la descripción de la tarjeta" });
            });
    })
    .catch(error => {
        res.status(400).send({ error: "Error buscando la lista" });
    });
});

/* router.post('/:idLista/checkList/:idTarjeta/estaHecho/:idCheckList', (req, res) => {
    Lista.findById(req.params.idLista).then((resultado) => {
        console.log(req.body.check)
        resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id = req.params.idTarjeta).checkList.find((check) => check._id = req.params.idCheckList).estaHecho = req.body.check;

        resultado.save().then((resultado) => {
            res.status(200).send(resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id = req.params.idTarjeta).checkList.find((check) => check._id = req.params.idCheckList).estaHecho);

        }).catch((error) => {
            res.status(400).send({error: error});
        });

    }).catch((error) => {
        res.status(400).send({error: error});
    })
}); */

module.exports = router;