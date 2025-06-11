import express from 'express';
import { getSalesData } from '../controllers/clientVentasCrud.js'; 
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();
router.use(verifyToken);
router.get('/:idPyme', getSalesData);


export default router;