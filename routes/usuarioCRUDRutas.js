// adminCrudRoutes.js
import express from "express"; // Use ES Module import syntax
import { createUsuario, getUsuario, updateUsuario, deleteUsuario } from "../controllers/adminCrud.js"; // Update path to use ESM style imports

const router = express.Router();

// Create a new Usuario
router.post("/", async (req, res) => {
  try {
    const usuario = req.body;
    const result = await createUsuario(usuario);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Usuario by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await getUsuario(id);
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Usuario by ID
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = req.body;
    const result = await updateUsuario(id, usuario);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Usuario by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteUsuario(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; // Use export default to export the router
