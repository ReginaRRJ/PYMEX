import express from "express";
import { getSucPedidos } from "../controllers/sucursalCrud.js"; 

const router = express.Router();

router.get("/usuario/:idUsuario", getSucPedidos);

export default router;