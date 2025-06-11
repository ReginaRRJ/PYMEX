import express from "express";
import { notificacionesByUser,notifyClients,actualizarPedidoCliente,notificacionLeida} from "../controllers/notificacionesController.js"; // Importing the controller function
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();
router.use(verifyToken);

router.get("/alertas/:idUsuario", notificacionesByUser);
router.post("/actualizar/:idPedido",notifyClients);
router.post("/actualizarProveedor/:idPedido", notifyClients);
router.post("/actualizarCliente/:idPedido", actualizarPedidoCliente);
router.put("/notificacionLeida/:idMensaje",verifyToken, notificacionLeida);

export default router; 