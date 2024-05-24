const express = require('express');
const multer = require('multer');
const auth = require(__dirname + '/../auth/auth.js');
const handleBcrypt = require(__dirname + '/../auth/handleBcrypt.js');
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '918915279081-4vdi1aklj6567m4qjt1is4c6opfjchm3.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

let Usuario = require(__dirname + '/../models/usuario.js');
let Tablero = require(__dirname + '/../models/tablero.js');
let EspacioDeTrabajo = require(__dirname + '/../models/espacioDeTrabajo.js');
let Lista = require(__dirname + '/../models/lista.js');

let router = express.Router();
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/avatarUsuarios')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })

let upload = multer({storage: storage});

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    Usuario.findOne({email: email}).then(async (usuario) => {
        if(!usuario || !usuario.password || !usuario._id){
            res.status(401).send({ error: "Login incorrecto" });
        }
        if(usuario){
            const usuarioInfo = {
                _id: usuario._id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                biografia: usuario.biografia
                
            }
            const checkPassword = await handleBcrypt.compare(password, usuario.password)
            const token = auth.generarToken(usuarioInfo);

            if(checkPassword){
                res.status(200).send({ accessToken: token });
            }
    
        }




    });
});

router.post('/register', async (req, res) => {
    const passwordHash = await handleBcrypt.encrypt(req.body.password)

    let nuevoUsuario = new Usuario({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        password: passwordHash,
    });
    if(req.file) nuevoUsuario.avatar = req.file.filename;
    
    nuevoUsuario.save().then(resultado => {
        res.status(200)
            .send({ resultado: resultado });
    }).catch(error => {
        res.status(400)
            .send({ error: error });
    });
});


router.get('/me', (req, res) => {
    let token = req.headers['authorization'];
    if (token && token.startsWith("Bearer "))
        token = token.slice(7);
    const contenidoToken = auth.validarToken(token);
    if (contenidoToken) {
        res.status(200).send(contenidoToken.usuario);
    } else {
        res.status(403).send({ error: "Acceso no autorizado" });
    }
});

router.get('/validate', (req, res) => {
    let token = req.headers['authorization'];
    if (token && token.startsWith("Bearer "))
        token = token.slice(7);
    const contenidoToken = auth.validarToken(token);

    if (contenidoToken) {
        res.status(200).send(true);
    } else {
        res.status(403).send(false);
    }
});

router.post('/google', async (req, res) => {
    const token = req.body.token;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const userEmail = payload.email;

        let usuarioGoogleLogin = await Usuario.findOne({ email: userEmail });

        if (!usuarioGoogleLogin) {
            const passwordHash = await handleBcrypt.encrypt(payload.email)

            const usuarioGoogle = new Usuario({
                nombre: payload.given_name,
                apellidos: payload.family_name,
                email: payload.email,
                password: passwordHash,
            });

            usuarioGoogle.save().then(() => {

                const tokenUsuario = auth.generarToken(usuarioGoogle);
                res.status(200).send({ accessToken: tokenUsuario });
            });

        }
        else{
            const tokenUsuario = auth.generarToken(usuarioGoogleLogin);
    
            res.status(200).send({ accessToken: tokenUsuario });
        }
    

    } catch (error) {
        res.status(401).send({error: error});
    }
});

router.get('/usuarios', auth.protegerRuta, (req, res) => {
    Usuario.find().then(resultado => {
        res.status(200)
            .send(resultado);
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay usuarios registrados" });
    });
});

router.get('/:id', (req, res) => {
    Usuario.findById({_id: req.params.id}).then(resultado => {

        res.status(200)
            .send(resultado);
    }).catch(error => {
        res.status(500)
            .send({ error: "No hay tableros registrados" });
    });
});

router.put('/profile/:id', auth.protegerRuta, (req, res) => {
    Usuario.findByIdAndUpdate(req.params.id, {
        $set: {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            email: req.body.email,
            biografia: req.body.biografia,
        }
    }, { new: true }).then(resultado => {
        if (resultado) {
            res.status(200)
                .send(resultado);
        }
        else {
            res.status(400)
                .send({ error: "Error actualizando los datos del usuario" });
        }

    }).catch(error => {
        res.status(400)
            .send({ error: "Error actualizando los datos del usuario" });
    });
});

router.put('/password/:id', auth.protegerRuta, async (req, res) => {
    const passwordHash = await handleBcrypt.encrypt(req.body.password)

    Usuario.findByIdAndUpdate(req.params.id, {
        $set: {
            password: passwordHash,
        }
    }, { new: true }).then(resultado => {
        if (resultado) {
            res.status(200)
                .send(resultado);
        }
        else {
            res.status(400)
                .send({ error: "Error actualizando los datos del usuario" });
        }

    }).catch(error => {
        res.status(400)
            .send({ error: "Error actualizando los datos del usuario" });
    });
});


router.post('/avatar/:id', auth.protegerRuta, (req, res) => {

    Usuario.findById(req.params.id).then((resultado) => {

        if(req.body.avatar) resultado.avatar = req.body.avatar;

        resultado.save().then((result) => {
            res.status(200).send(result);

        }).catch((err) => {
            res.status(400).send(err);
        });

    }).catch((error) => {
        res.status(400).send(err);
    })
});

router.delete('/:id', auth.protegerRuta, async (req, res) => {

    const espaciosTrabajo = await EspacioDeTrabajo.find({creadoPor: req.params.id});
    await EspacioDeTrabajo.findOneAndDelete({creadoPor: req.params.id});
    const espaciosTrabajoIds = espaciosTrabajo.map(espacioTrabajo => espacioTrabajo._id);

    const tableros = await Tablero.find({ espacioTrabajo: espaciosTrabajoIds });
    const tableroIds = tableros.map(tablero => tablero._id);

    await Tablero.deleteMany({ espacioTrabajo: espaciosTrabajoIds });
    await Lista.deleteMany({ tablero: { $in: tableroIds } });

    Usuario.findByIdAndDelete(req.params.id)
    .then(resultado => {

        res.status(200)
            .send({ resultado: resultado });
        
    }).catch(error => {
        res.status(400)
            .send({ error: error });
    });

});

module.exports = router;