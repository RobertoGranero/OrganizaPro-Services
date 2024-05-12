const jwt = require('jsonwebtoken');

// Podríamos cargarlo de un fichero aparte

let generarToken = (usuario) => jwt.sign({usuario: usuario}, 'secretoNode');

let validarToken = token => {
    try {
        let resultado = jwt.verify(token, 'secretoNode');
        return resultado;
    } catch (e) {}
}

let protegerRuta = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token && token.startsWith("Bearer "))
        token = token.slice(7);

    if (validarToken(token))
        next();
    else
        res.status(403)
            .send({error: "Acceso no autorizado"});
}
    
module.exports = {
    generarToken: generarToken,
    validarToken: validarToken,
    protegerRuta: protegerRuta,
};