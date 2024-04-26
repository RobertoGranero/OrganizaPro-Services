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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios'
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
    comentarios: [comentarioSchema],
    checkList: [checkList],
    checkListLength: {
        type: Number,
        required: false,
        dafeult: 0
    }

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
