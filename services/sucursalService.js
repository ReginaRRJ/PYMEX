// backend/services/sucursalService.js
import dbClient from '../dbClient.js';

export async function getSucursalesPorPyme(idPyme) {
  const query = `
    SELECT "idSucursal", "nombreSucursal", "ubicacionSucursal"
    FROM "Sucursal"
    WHERE "idPyme" = ?
  `;
  return await dbClient.exec(query, [idPyme]);
}

export const getSucursalesByPymeService = async (req, res) => {
  const resultado = await getSucursalesPorPyme(req.params.idPyme);
  res.json(resultado);
};