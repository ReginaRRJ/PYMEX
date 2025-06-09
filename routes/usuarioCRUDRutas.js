import express from "express";
import { createUsuario, getUsuarios, updateUsuario, deleteUsuario } from "../controllers/adminCrud.js"; 
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();
router.use(verifyToken);

//Obtener usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await getUsuarios(); 
    res.json(usuarios);  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Crear nuevo usuario
router.post("/admin", async (req, res) => {
  try {
    const usuario = req.body;
    const result = await createUsuario(usuario);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Actualizar usuario
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

//Eliminar usuario
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