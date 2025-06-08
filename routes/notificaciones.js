import express from "express";
import { notificacionesByUser,notifyClients} from "../controllers/notificacionesController.js"; // Importing the controller function
import {actualizarEstatusPedidoProveedor} from "../controllers/Notificaciones/notifChangeControllers.js"
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();
router.use(verifyToken);
// ruta para mostrar notificaciones
router.get("/alertas/:idUsuario", notificacionesByUser);
router.post("/actualizar/:idPedido",notifyClients);
router.post("/actualizarProveedor/:idPedido", notifyClients);

export default router; 