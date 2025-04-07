const express = require("express");
const { createReporte, getReporte, updateReporte, deleteReporte } = require("../controllers/adminReport");

const router = express.Router();

// Create a new Reporte
router.post("/", async (req, res) => {
  try {
    const reporte = req.body;
    const result = await createReporte(reporte);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Reporte by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const reporte = await getReporte(id);
    res.json(reporte);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Reporte by ID
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const reporte = req.body;
    const result = await updateReporte(id, reporte);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Reporte by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteReporte(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
