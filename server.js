import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"; 
import loginRoutes from "./routes/loginRoutes.js"; 
import reporteRoutes from "./routes/reporteRutas.js";  
import path from "path";
import adminCrudRoutes from "./routes/usuarioCRUDRutas.js";  
import pedidosRouter from "./routes/pedidos.js";
import sucursalRouter from "./routes/sucursalRutas.js"
import notifConfigRouter from "./routes/notifConfigRutas.js";
import ticketRoutes from './routes/vendedorRutas.js'; 
import clientVentasRoutes from './routes/clientVentasRutas.js'; 
import pedidosPymeRoutes from './routes/clientPedidosRutas.js';
import notificacionesRoutes from './routes/notificaciones.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


app.use("/users", userRoutes);  
app.use("/login", loginRoutes);  
app.use("/api/usuarios", adminCrudRoutes);  
app.use("/reportes", reporteRoutes);  
app.use("/api/pedidos", pedidosRouter);
app.use("/api/sucursal", sucursalRouter);
app.use("/api/notificaciones", notifConfigRouter);
app.use('/api', ticketRoutes);
app.use('/api/ventasClient', clientVentasRoutes);
app.use('/api/pedidosClient', pedidosPymeRoutes); 
app.use('/notificaciones',notificacionesRoutes);

app.get('/', (req, res) => {
  res.send('¡PYMEX backend está funcionando correctamente!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
