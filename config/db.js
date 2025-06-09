import hana from "@sap/hana-client";
import dotenv from "dotenv";


dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD,
  encrypt: "true", 
  sslValidateCertificate: "false", 
};

const connection = hana.createConnection();

connection.connect(connParams, (err) => {
  if (err) {
    console.error("Error de conexión a SAP HANA:", err);
  } else {
    console.log("Conectado a SAP HANA Cloud");
  }
});

export default connection;
