// Import necessary modules using ES Module syntax
import hana from "@sap/hana-client";
import dotenv from "dotenv";

// Configure dotenv to load environment variables
dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD,
  encrypt: "true", // Important for cloud connections
  sslValidateCertificate: "false", // Avoid certificate issues
};

const connection = hana.createConnection();

connection.connect(connParams, (err) => {
  if (err) {
    console.error("Error de conexión a SAP HANA:", err);
  } else {
    console.log("Conectado a SAP HANA Cloud");
  }
});

// Export the connection object
export default connection;
