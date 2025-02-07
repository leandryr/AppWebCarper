const express = require("express");
const cors = require("cors");
const registroRoutes = require("./routes/registroRoutes");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/registros", registroRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// controllers/registroController.js
const Registro = require("./models/Registro");

// Create a new record
exports.crearRegistro = async (req, res) => {
  try {
    const nuevoRegistro = new Registro(req.body);
    await nuevoRegistro.save();
    res.status(201).json({ message: "Registro creado con éxito", data: nuevoRegistro });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el registro", error });
  }
};