import express from "express";
import { getAllReportes } from "../controllers/adminReport.js";

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

export default router;