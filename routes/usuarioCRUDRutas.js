import express from "express";
import { createUsuario, getUsuarios, updateUsuario, deleteUsuario } from "../controllers/adminCrud.js"; 

const router = express.Router();

// Get all Usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await getUsuarios(); // Fetch all users
    res.json(usuarios);  // Return the list of users
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Usuario
router.post("/admin", async (req, res) => {
  try {
    const usuario = req.body;
    const result = await createUsuario(usuario);
    res.status(201).json(result);
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

export default router;
