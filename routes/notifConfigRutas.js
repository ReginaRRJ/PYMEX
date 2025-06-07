import express from "express";
import { getNotificationConfig, updateNotificationConfig } from "../controllers/notifConfigController.js";
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();

router.use(verifyToken);
router.get("/configuracion-notificaciones/:idUsuario", getNotificationConfig);

router.put("/configuracion-notificaciones/:idUsuario", updateNotificationConfig);

export default router;