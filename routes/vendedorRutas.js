import express from 'express';
import { getProductsByBranch, createTicket, getTicketsByBranch, getSucursalesByPymeService } from '../controllers/vendedorController.js';


const router = express.Router();

router.get('/products/branch/:idSucursal', getProductsByBranch);
router.post('/tickets', createTicket);
router.get('/tickets/branch/:idSucursal', getTicketsByBranch);
router.get("/sucursales/pyme/:idPyme", getSucursalesByPymeService);

export default router;