import express from 'express';
import { getSalesData } from '../controllers/clientVentasCrud.js'; 


const router = express.Router();

router.get('/:idPyme', getSalesData);


export default router;