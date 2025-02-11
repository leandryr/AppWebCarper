const express = require("express");
const { crearRegistro, obtenerRegistros } = require("../controllers/registroController");
const Registro = require("../models/Registro");

const router = express.Router();

// GET /api/registros - Obtener registros
router.get("/", obtenerRegistros);

// POST /api/registros - Crear un nuevo registro
router.post("/", crearRegistro);

// PUT /api/registros/:id/pago - Actualizar estado de pago
router.put("/:id/pago", async (req, res) => {
  try {
    const { asistenteIndex } = req.body; // Obtén el índice del asistente desde el cuerpo de la solicitud

    const registro = await Registro.findById(req.params.id);
    if (!registro) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    // Asegúrate de que el índice esté dentro del rango de asistentes
    if (asistenteIndex < 0 || asistenteIndex >= registro.asistentes.length) {
      return res.status(400).json({ message: "Índice de asistente no válido" });
    }

    // Cambia el estado de pago del asistente específico
    const asistente = registro.asistentes[asistenteIndex];
    asistente.pagado = !asistente.pagado; // Invertir el estado de pagado

    await registro.save(); // Guarda el registro con el estado actualizado

    res.status(200).json(registro);
  } catch (error) {
    console.error("Error al actualizar pago:", error);
    res.status(500).json({ message: "Error al actualizar pago", error });
  }
});


module.exports = router;
