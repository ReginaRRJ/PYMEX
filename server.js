const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const swaggerUI = require("swagger-ui-express");
const swaggerDocs = require("./docs/swagger");

const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/users", userRoutes);
app.use("/login", loginRoutes);

// Swagger Documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Serve the React app in production mode
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app's build folder
  app.use(express.static(path.join(__dirname, "client", "build")));
  
  // For all routes not part of the API, send back the React app's index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
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
