const mongoose  = require("mongoose");

let checkList = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: false,

    },
    estaHecho: {
        type: Boolean,
        required: false,
        default: false
    },

    fechaInicio: {
        type: Date,
        required: false,

    },
    fechaFin: {
        type: Date,
        required: false,

    },
    
})

let comentarioSchema = new mongoose.Schema({
    contenido: {
        type: String,
        required: true,
    },
    usuario: {
        nombre: String,
        apellidos: String,
        email: String,
        avatar: String

    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
})

let tarjetaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    descripcion: {
        type: String,
        required: false,
        default: ""
    },
    lengthEstaHecho: {
        type: Number,
        required: false,
        default: 0
    },
    prioridad: {
        type: String,
        enum: ['Urgente', 'Alta', 'Normal', 'Baja', 'Ninguna'],
        default: 'Normal'
    },
    comentarios: [comentarioSchema],
    checkList: [checkList],


});

let listaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    tablero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tableros'
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    tarjetas: [tarjetaSchema],

});

let Lista = mongoose.model("listas", listaSchema);
module.exports = Lista;
