import express from "express"; 
import { getSucPedidos, getVentasAnualesPorSucursal, getVentasMensualesPorSucursal, getVentasSemanalesPorSucursal, getStockPorProducto } from "../controllers/sucursalCrud.js";
import { getProveedores, getProductos, postCrearPedido, actualizarEstadoPedido, getProductoss } from "../controllers/sucursalCrud.js";
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();

router.use(verifyToken);


router.get('/productos', getProductoss);

router.put('/pedido/:idPedido/estado', actualizarEstadoPedido);

router.get("/proveedores", getProveedores);

router.get("/productos/:idProveedor", getProductos);

router.post("/pedidos", postCrearPedido);

router.get("/usuario/:idUsuario", getSucPedidos);

router.get("/ventas-anuales/:idUsuario", getVentasAnualesPorSucursal); 

router.get("/ventas-mensuales/:idUsuario", getVentasMensualesPorSucursal);

router.get("/ventas-semanales/:idUsuario", getVentasSemanalesPorSucursal);

router.get("/stock/:idPyme/:idProducto", getStockPorProducto);

export default router;
