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
    const registro = await Registro.findById(req.params.id);
    if (!registro) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    registro.pagado = !registro.pagado; // Cambia el estado de pago
    await registro.save();

    res.status(200).json(registro);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar pago", error });
  }
});

module.exports = router;
