const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API con Node.js y SAP HANA",
      version: "1.0.0",
      description: "API para la gestión de usuarios con autenticación, creado por Carolina de los Santos Resendiz (A01174992)",
    },
    servers: [
        {
          url: "http://localhost:3000",
          description: "Servidor local",
        },
    ],
    tags: [
        {
          name: "users",
          description: "Operaciones relacionadas con los usuarios",
        },
        {
          name: "login",
          description: "Autenticación y gestión de sesiones",
        },
        ],
  },
  apis: ["./routes/userRoutes.js", "./routes/loginRoutes.js"],
};

module.exports = swaggerJsDoc(options);