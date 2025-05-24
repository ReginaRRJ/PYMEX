import express from "express"; 
import { getSucPedidos, getVentasAnualesPorSucursal, getVentasMensualesPorSucursal, getVentasSemanalesPorSucursal, getStockPorProducto } from "../controllers/sucursalCrud.js";

const router = express.Router();

router.get("/usuario/:idUsuario", getSucPedidos);

router.get("/ventas-anuales/:idUsuario", getVentasAnualesPorSucursal); 

router.get("/ventas-mensuales/:idUsuario", getVentasMensualesPorSucursal);

router.get("/ventas-semanales/:idUsuario", getVentasSemanalesPorSucursal);

router.get("/stock/:idPyme/:idProducto", getStockPorProducto);

export default router;