const mongoose  = require("mongoose");

let usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellidos: {
        type: String,
        required: true,
    },
    biografia: {
        type: String,
        required: false,
        minLength: 1,
        maxLength: 150
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },


});

let Usuario = mongoose.model("usuarios", usuarioSchema);
module.exports = Usuario;