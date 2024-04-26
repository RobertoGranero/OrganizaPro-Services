const mongoose  = require("mongoose");


let tableroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },

    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
    },
    espacioTrabajo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'espaciodetrabajo',
    },
    colorTablero: {
        type: String,
        required: false
    }

});

let Tablero = mongoose.model("tableros", tableroSchema);
module.exports = Tablero;