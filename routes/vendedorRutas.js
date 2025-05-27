import express from 'express';
import { getProductsByBranch, createTicket, getTicketsByBranch } from '../controllers/vendedorController.js';

const router = express.Router();

router.get('/products/branch/:idSucursal', getProductsByBranch);
router.post('/tickets', createTicket);
router.get('/tickets/branch/:idSucursal', getTicketsByBranch);

export default router;