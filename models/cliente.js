'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ClienteSchema = Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    pais: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    perfil: { type: String, default: 'perfil.png', required: true },
    telefono: { type: String, required: false },
    f_nacimiento: { type: String, required: true },
    tipoDni: { type: String, required: true },
    dni: { type: String, required: true },
    genero: { type: String, required: true },
    //fecha y hora de creacion en formato date(pasarlo a timestamp)
    createdAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('cliente', ClienteSchema);