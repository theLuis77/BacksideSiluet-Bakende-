const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombreDeUsuario: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  numeroDeCliente: { type: String, required: true },
  turno: { type: String, required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  fechaDeNacimiento: { type: Date, required: true },
  edad: { type: Number, required: true },
  numeroTelefonico: { type: String, required: true },
  correoElectronico: { type: String, required: true },
  ocupacion: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
