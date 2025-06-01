import express from 'express';
import { getPedidosByPyme } from '../controllers/clientPedidosCrud.js';

const router = express.Router();

router.get('/:idPyme', getPedidosByPyme);

export default router;