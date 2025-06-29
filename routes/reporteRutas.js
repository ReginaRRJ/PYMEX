import express from "express";
import { getAllReportes, updateResueltoReporte } from "../controllers/adminReport.js";
import { createReporte } from "../controllers/reporteAdminController.js";
import { verifyToken } from '../controllers/authMiddle.js';
const router = express.Router();
router.use(verifyToken);

//Obtener reportes
router.get("/", async (req, res) => {
  try {
    const reportes = await getAllReportes();
    res.json(reportes);
  } catch (err) {
    console.error("Error en /reportes:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//Crear reporte
router.post("/pedido", async (req, res) => {
  try {
    const datos = req.body;

    if (!datos.titulo || !datos.descripcion || !datos.prioridad) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    if (!datos.fechaReporte) {
      datos.fechaReporte = new Date().toISOString();
    }

    const nuevoReporte = await createReporte(datos);
    res.status(201).json(nuevoReporte);
  } catch (err) {
    console.error("Error al crear reporte:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//Editar reporte
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const reporte = req.body;
    const result = await updateResueltoReporte(id, reporte);
    res.json(result);
  } catch (err) {
    console.error("Error al actualizar reporte:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;