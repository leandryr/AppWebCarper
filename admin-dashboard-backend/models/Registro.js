const mongoose = require("mongoose");

const RegistroSchema = new mongoose.Schema({
  contacto: {
    celular: { type: String, required: true },
    email: { type: String, required: true },
  },
  asistentes: [
    {
      nombre: { type: String, required: true },
      edad: { type: Number, required: true },
      fecha: { type: String, required: true },
      transporte: { type: String, required: true },
      cena: { type: Boolean, required: true },
      almuerzo: { type: Boolean, required: true },
      subtotal: { type: Number, required: true },
      pagado: { type: Boolean, default: false },
    },
  ],
  total: { type: Number, required: true },

});

module.exports = mongoose.model("Registro", RegistroSchema);
