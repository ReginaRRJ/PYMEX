// userRoutes.js
import express from "express"; // Import express using ESM syntax
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js"; // Use named imports for controller functions
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();

router.use(verifyToken);

// Obtener todos los usuarios
router.get("/", getUsers);

// Crear un usuario
router.post("/", createUser);

// Actualizar usuario
router.put("/:id", updateUser);


// Eliminar usuario
router.delete("/:id", deleteUser);

export default router; // Use export default for the router
