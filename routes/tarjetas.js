const express = require('express');
const auth = require(__dirname + '/../auth/auth');

let Lista = require(__dirname + '/../models/lista.js');

let router = express.Router();

// Añadir una tarjeta a una lista
router.post('/:id/tarjetas', auth.protegerRuta, (req, res) => {
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

router.delete('/:id/tarjeta/:idTarjeta/deleteTarjeta', auth.protegerRuta, (req, res) => {

    Lista.findById(req.params.id).then((resultado) => {
        const indexTarjeta = resultado.tarjetas.findIndex((resp) => resp._id == req.params.idTarjeta);
        resultado.tarjetas.splice(indexTarjeta,1)
        resultado.save().then(() => {
            res.status(200).send(String(indexTarjeta));

        }).catch((err) => {
            res.status(400).send(err);
        });

    }).catch((error) => {
        res.status(400).send(error);
    })
});

// GET checkLists
router.get('/checkList/:idUsuario', (req, res) => {
    Lista.find().then((resultado) => {
        if(resultado){
            resultado.forEach((lista) => {
                lista.tarjetas.forEach((tarjeta) => {
                    res.status(200).send(tarjeta.checkList.filter((resp) => resp.usuario == req.params.idUsuario))
                })
            });
    
        }

    }).catch((error) => {
        res.status(400).send(error);
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

// Crear tarea
router.post('/:idLista/checkList/:idTarjeta', auth.protegerRuta, (req, res) => {
    Lista.findById(req.params.idLista).then((resultado) => {

        resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id == req.params.idTarjeta).checkList.push(req.body);

        resultado.save().then((result) => {
            res.status(200).send(result.tarjetas.find((tarjetaResp) => tarjetaResp._id == req.params.idTarjeta));

        }).catch((error) => {
            res.status(400).send({error: error});
        });

    }).catch((error) => {
        res.status(400).send({error: error});
    })
});

// Borrar tarea
router.delete('/:idLista/checkList/:idTarjeta/:idCheck', auth.protegerRuta, (req, res) => {
    Lista.findById(req.params.idLista).then((resultado) => {

        const indexCheckList = resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id == req.params.idTarjeta).checkList.findIndex((result) => result._id == req.params.idCheck);
        resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id == req.params.idTarjeta).checkList.splice(indexCheckList, 1)
        resultado.save().then((result) => {
            res.status(200).send(String(indexCheckList));

        }).catch((error) => {
            res.status(400).send({error: error});
        });

    }).catch((error) => {
        res.status(400).send({error: error});
    })
});


router.post('/:idLista/check/:idTarjeta/:idCheck/addCheck', auth.protegerRuta, (req, res) => {
    Lista.findById(req.params.idLista).then((resultado) => {

        resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id == req.params.idTarjeta).checkList.find((check) => check._id == req.params.idCheck).estaHecho = req.body.check;
        resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id == req.params.idTarjeta).lengthEstaHecho++;

        resultado.save().then((result) => {

            res.status(200).send(result.tarjetas);

        }).catch((error) => {
            res.status(400).send({error: error});
        });

    }).catch((error) => {
        res.status(400).send({error: error});
    })
});

router.delete('/:idLista/check/:idTarjeta/:idCheck/deleteCheck', auth.protegerRuta, (req, res) => {
    Lista.findById(req.params.idLista).then((resultado) => {

        resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id == req.params.idTarjeta).checkList.find((check) => check._id == req.params.idCheck).estaHecho = false;
        resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id == req.params.idTarjeta).lengthEstaHecho--;

        resultado.save().then((result) => {
            res.status(200).send(result.tarjetas);

        }).catch((error) => {
            res.status(400).send({error: error});
        });

    }).catch((error) => {
        res.status(400).send({error: error});
    })
});


router.put('/:idLista/edit/:idTarjeta' , auth.protegerRuta, (req, res) => {
    Lista.findById(req.params.idLista).then((resultado) => {
        resultado.tarjetas.find(tarjeta => tarjeta._id == req.params.idTarjeta).descripcion = req.body.descripcion;
        resultado.tarjetas.find(tarjeta => tarjeta._id == req.params.idTarjeta).titulo = req.body.titulo;
        resultado.tarjetas.find(tarjeta => tarjeta._id == req.params.idTarjeta).prioridad = req.body.prioridad;

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

// Comentarios

 router.get('/:idLista/getComentarios/:idTarjeta', auth.protegerRuta, (req, res) => {
    Lista.findById(req.params.idLista).then(async (resultado) => {

        res.status(200).send(resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id ==req.params.idTarjeta).comentarios);
    }).catch((error) => {
        res.status(400).send({error: error});
    })
});

router.post('/:idLista/comentarios/:idTarjeta', auth.protegerRuta, (req, res) => {
    Lista.findById(req.params.idLista).then((resultado) => {

        resultado.tarjetas.find((tarjetaResp) => tarjetaResp._id == req.params.idTarjeta).comentarios.push(req.body);

        resultado.save().then((result) => {
            res.status(200).send({resultado: result});

        }).catch((error) => {
            res.status(400).send({error: error});
        });

    }).catch((error) => {
        res.status(400).send({error: error});
    })
});

module.exports = router;