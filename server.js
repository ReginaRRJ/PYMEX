const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerDocs = require("./docs/swagger");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/users", userRoutes);
app.use("/login", loginRoutes);

// Documentación con Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});