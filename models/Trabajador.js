// models/Trabajador.js
const mongoose = require('mongoose');

const TrabajadorSchema = new mongoose.Schema({
    nombreDeUsuario: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
});

module.exports = mongoose.model('Trabajador', TrabajadorSchema);
