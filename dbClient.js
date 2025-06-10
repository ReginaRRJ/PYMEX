// backend/dbClient.js
import hana from '@sap/hana-client';
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

export default {
  exec: async (sql, params = []) => {
    const conn = hana.createConnection();

    return new Promise((resolve, reject) => {
      conn.connect(connParams, (err) => {
        if (err) return reject(err);

        conn.prepare(sql, (err, statement) => {
          if (err) {
            conn.disconnect();
            return reject(err);
          }

          statement.exec(params, (err, result) => {
            statement.drop();
            conn.disconnect();

            if (err) return reject(err);
            resolve(result);
          });
        });
      });
    });
  }
};