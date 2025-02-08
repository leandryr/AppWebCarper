const Registro = require("../models/Registro");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configurar el transporte de correo con Yahoo
const transporter = nodemailer.createTransport({
  service: "yahoo",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para enviar el correo
const enviarCorreo = async (destinatario, registro) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario, // El correo del usuario
    cc: "jdsm74@gmail.com",
    subject: "Confirmación de Registro - Campamento",
    html: `
      <h2>Gracias por registrarte!</h2>
      <p><strong>Celular:</strong> ${registro.contacto.celular}</p>
      <p><strong>Email:</strong> ${registro.contacto.email}</p>
      <h3>Detalles de asistentes:</h3>
      <ul>
        ${registro.asistentes
          .map(
            (asistente) => `
          <li>
            <strong>Nombre:</strong> ${asistente.nombre} <br/>
            <strong>Edad:</strong> ${asistente.edad} <br/>
            <strong>Fecha:</strong> ${asistente.fecha} <br/>
            <strong>Transporte:</strong> ${asistente.transporte} <br/>
            <strong>Cena:</strong> ${asistente.cena ? "Sí" : "No"} <br/>
            <strong>Almuerzo:</strong> ${asistente.almuerzo ? "Sí" : "No"} <br/>
            <strong>Subtotal:</strong> S/ ${asistente.subtotal} <br/>
          </li>
        `
          )
          .join("")}
      </ul>
      <h3>Total a pagar: S/ ${registro.total}</h3>
            <strong>IMPORTANTE:</strong>
        <p>
          Para finalizar el registro debes realizar lo siguiente:
          <br />1. Yapea al 9421-06453 o transfiere el monto a la cuenta BCP:
          193-344-23-002-008, ambos a nombre de Juan D. Shimabukuro.
          <br />2. Enviar por Whatsapp al mismo número un pantallazo del Yape o Transferencia y esperar
          la confirmación.
        </p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado con éxito a:", destinatario);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

// Crear un nuevo registro y enviar correo
exports.crearRegistro = async (req, res) => {
  try {
    const nuevoRegistro = new Registro(req.body);
    await nuevoRegistro.save();

    // Enviar correo al usuario registrado
    await enviarCorreo(nuevoRegistro.contacto.email, nuevoRegistro);

    res.status(201).json({ message: "Registro creado con éxito", data: nuevoRegistro });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el registro", error });
  }
};

// Obtener todos los registros
exports.obtenerRegistros = async (req, res) => {
  try {
    const registros = await Registro.find();
    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los registros", error });
  }
};
