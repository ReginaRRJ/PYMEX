import express from "express";
import { getNotificationConfig, updateNotificationConfig } from "../controllers/notifConfigController.js";

const router = express.Router();


router.get("/configuracion-notificaciones/:idUsuario", getNotificationConfig);

router.put("/configuracion-notificaciones/:idUsuario", updateNotificationConfig);

export default router;