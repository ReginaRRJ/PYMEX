import express from 'express';
import { getPedidosByPyme,updatePedidoEstatusCliente } from '../controllers/clientPedidosCrud.js';

const router = express.Router();

router.get('/:idPyme', getPedidosByPyme);
router.put('/:idPedido/estatusCliente', updatePedidoEstatusCliente);
export default router;