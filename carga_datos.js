const mongoose = require('mongoose');

const Tarjeta = require(__dirname + "/models/tarjeta");
const Lista = require(__dirname + "/models/lista");
const Tablero = require(__dirname + "/models/tablero");
const Usuario = require(__dirname + "/models/usuario");


mongoose.connect('mongodb://127.0.0.1:27017/organizapro');


 let usuarios = [
    new Usuario({
        login: "user1",
        email: "user1@user1.com",
        password: "user1user1",

    }),
    new Usuario({
        login: "user2",
        email: "user2@user2.com",
        password: "user2user2",
    }),
    
] 

/* let tableros = [
    new Tablero({
        titulo: "tablero1",
        descripcion: "descripcion tablero1",
        usuario: "65d65197642e55c10d7f2641",

    }),
] */

/*  let tarjetas = [
    new Tarjeta({
        titulo: "Tarjeta1",
        lista: "65d652c4118679de6a42924d",
        usuario: "65d65197642e55c10d7f2641",
        posicion: 1,
        comentarios: [{
                contenido: "Hola",
                usuario: "65d65197642e55c10d7f2641",
                fechaCreacion: Date.now()
            }
        ]
    }),

    
] */
/* let listas = [
    new Lista({
        titulo: "lista1",
        tablero: "65d652242111cba4670279f1",
        fecha: Date.now(),

    }),
] */


usuarios.forEach(h => h.save());
//tarjetas.forEach(h => h.save());
//listas.forEach(h => h.save());
//tableros.forEach(h => h.save());