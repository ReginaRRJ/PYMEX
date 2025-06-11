import express from 'express';
import { getProductsByBranch, createTicket, getTicketsByBranch, getSucursalesByPymeService } from '../controllers/vendedorController.js';
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();
router.use(verifyToken);

router.get('/products/branch/:idSucursal', getProductsByBranch);
router.post('/tickets', createTicket);
router.get('/tickets/branch/:idSucursal', getTicketsByBranch);
router.get("/sucursales/pyme/:idPyme", getSucursalesByPymeService);

export default router;