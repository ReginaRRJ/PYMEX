import express from "express";
import { login, loginNotificacion } from "../controllers/loginController.js"; 

const router = express.Router();


router.post("/", login); 
router.post("/notificacion", loginNotificacion)
export default router; 