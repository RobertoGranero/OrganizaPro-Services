const mongoose  = require("mongoose");
const miembroSchema = new mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usuarios' 
    },

});

let espacioTrabajoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },

    miembros: [miembroSchema],
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
    },
    fecha: {
        type: Date,
        required: false,
        default: Date.now()
    },

});

let espacioDetrabajo = mongoose.model("espaciodetrabajo", espacioTrabajoSchema);
module.exports = espacioDetrabajo;