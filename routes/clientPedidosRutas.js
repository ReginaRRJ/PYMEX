import express from 'express';
import { getPedidosByPyme,updatePedidoEstatusCliente } from '../controllers/clientPedidosCrud.js';
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();

router.use(verifyToken);
router.get('/:idPyme', getPedidosByPyme);
router.put('/:idPedido/estatusCliente', updatePedidoEstatusCliente);
export default router;