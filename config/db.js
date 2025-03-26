const hana = require("@sap/hana-client");
require("dotenv").config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD,
  encrypt: "true", // Importante para conexiones en la nube
  sslValidateCertificate: "false", // Evita problemas de certificados
};

const connection = hana.createConnection();

connection.connect(connParams, (err) => {
  if (err) {
    console.error("Error de conexión a SAP HANA:", err);
  } else {
    console.log("Conectado a SAP HANA Cloud");
  }
});

module.exports = connection;