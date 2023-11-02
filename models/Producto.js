'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    titulo: { type: String, required: true },
    slug: { type: String, required: true },
    portada: { type: String, required: true },
    precio_antes_soles: { type: Number, default: 0, required: true },
    precio_antes_dolares: { type: Number, default: 0, required: true },
    precio: { type: Number, required: true },
    precio_dolar: { type: Number, required: false },
    sku: { type: String, required: false },
    descripcion: { type: String, required: true },
    contenido: { type: String, required: true },
    nventas: { type: Number, default: 0, required: true },
    variedades: [{type: Object, require:false}],
    categoria: { type: String, required: true },
    titulo_variedad: {type: String, required: false},
    visibilidad: { type: String, required: false },

    stock: { type: Number, default: 0, required: false },
    galeria: [{ type: Object, required: false }],
    peso: { type: String, required: false },

    estado: { type: String, default: 'Edicion', required: true },
    createdAt: { type: Date, default: Date.now, require: true }
});

module.exports = mongoose.model('producto', ProductoSchema);