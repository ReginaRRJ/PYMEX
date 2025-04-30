import express from "express";
import { getAllReportes } from "../controllers/adminReport.js";
import { updateReporte } from "../controllers/adminReport.js"; // Importa la función de actualización

const router = express.Router();

// Obtener todos los reportes
router.get("/", async (req, res) => {
  try {
    const reportes = await getAllReportes();
    res.json(reportes);
  } catch (err) {
    console.error("Error en /reportes:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un reporte
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const reporte = req.body;

  try {
    await updateReporte(id, reporte);
    res.status(200).json({ message: "Reporte actualizado correctamente" });
  } catch (err) {
    console.error("Error en PUT /reportes/:id:", err.message);
    res.status(500).json({ error: err.message });
  }
});
export default router;