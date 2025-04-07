// Importing necessary modules using ES Modules syntax
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
{/*import swaggerUI from "swagger-ui-express";*/}
{/*import swaggerDocs from "./docs/swagger.js";*/}
import reporteRoutes from "./routes/reporteRutas.js";
import path from "path";

// Initialize dotenv configuration
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Set up routes
app.use("/users", userRoutes);
app.use("/login", loginRoutes);
app.use("/usersAdmin", userRoutes);
app.use("/reportes", reporteRoutes);

// Swagger Documentation
{/*app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));*/}

// Serve the React app in production mode
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app's build folder
  app.use(express.static(path.join(process.cwd(), "client", "build")));
  
  // For all routes not part of the API, send back the React app's index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
  });
} else {
  // If in development mode, just provide a simple message
  app.get("*", (req, res) => {
    res.send("React app is running, but in dev mode.");
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
