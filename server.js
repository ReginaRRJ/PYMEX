// Importing necessary modules using ES Modules syntax
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";  // Importing the user routes
import loginRoutes from "./routes/loginRoutes.js";  // Importing the login routes
{/*import swaggerUI from "swagger-ui-express";*/}
{/*import swaggerDocs from "./docs/swagger.js";*/}
import reporteRoutes from "./routes/reporteRutas.js";  // Importing the reporte routes
import path from "path";
import adminCrudRoutes from "./routes/usuarioCRUDRutas.js";  // Import the admin routes to handle users
import pedidosRouter from "./routes/pedidos.js";
import usuarioRouter from "./routes/usuarioCRUDRutas.js"; 
// Initialize dotenv configuration
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Set up routes
app.use("/users", userRoutes);  // Existing user routes
app.use("/login", loginRoutes);  // Existing login routes
app.use("/api/usuarios", adminCrudRoutes);  // New admin route to manage users
app.use("/reportes", reporteRoutes);  // Existing report routes
app.use("/api/pedidos", pedidosRouter);
app.use('/api/usuarios', usuarioRouter);

// Swagger Documentation
{/*app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));*/}

// Serve the React app in production mode
// if (process.env.NODE_ENV === "production") {
//   // Serve static files from the React app's build folder
//   app.use(express.static(path.join(process.cwd(), "front", "build")));
  
//   // For all routes not part of the API, send back the React app's index.html
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(process.cwd(), "front", "build", "index.html"));
//   });
// } else {
//   // If in development mode, just provide a simple message
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(process.cwd(), "front", "build", "index.html"));
//   });
// }

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
