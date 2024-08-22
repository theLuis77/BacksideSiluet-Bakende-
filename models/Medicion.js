const mongoose = require('mongoose');

const MedicionSchema = new mongoose.Schema({
    numeroDeCliente: { type: Number, required: true },
    estatura: { type: Number, required: true },
    peso: { type: Number, required: true },
    porcentajeDeGrasa: { type: Number, required: true },
    imc: { type: Number, required: true },
    fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Medicion', MedicionSchema);
