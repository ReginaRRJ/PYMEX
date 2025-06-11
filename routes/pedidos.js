import express from 'express';
import connection from '../config/db.js';
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();

router.use(verifyToken);

//Obtener pedidos
router.get('/general', (req, res) => {
  const sql = `
    SELECT 
    p."idPedido" AS "id",
    s."nombreSucursal" AS "Cliente",
    s."ubicacionSucursal" AS "Ubicación",
    CASE p."estatusProveedor"
        WHEN 'Pendiente' THEN 'Pendiente'
        WHEN 'Autorizado' THEN 'Autorizado'
        WHEN 'Curso' THEN 'En curso'
        WHEN 'Entregado' THEN 'Entregado'
        ELSE 'Desconocido'
    END AS "Estado"
FROM 
    "BACKPYMEX"."Pedido" p
JOIN 
    "BACKPYMEX"."Sucursal" s ON p."idSucursal" = s."idSucursal"
JOIN 
    "BACKPYMEX"."Proveedor" prov ON p."idProveedor" = prov."idProveedor"
WHERE 
    prov."nombreProveedor" = 'Proveedor Uno'
ORDER BY 
    p."fechaCreacion" DESC;
  `;

  connection.exec(sql, (err, rows) => {
    if (err) {
      console.error('Error obteniendo pedidos:', err);
      return res.status(500).json({ error: 'Error obteniendo pedidos' });
    }

    res.json(rows);
  });
});

//Ver detalles de un pedido
router.get('/detalle/:idPedido', (req, res) => {
  const { idPedido } = req.params;

  const sql = `
   SELECT 
  p."idPedido" AS "ID",
  pr."nombreProductoo" || ' – ' || p."cantidad" || ' piezas' AS "Producto",
  TO_VARCHAR(p."fechaCreacion", 'YYYY-MM-DD') AS "Fecha de Solicitud",
  TO_VARCHAR(p."fechaEntrega", 'YYYY-MM-DD') AS "Fecha de Entrega",
  s."nombreSucursal" AS "Cliente",
  s."ubicacionSucursal" AS "Ubicación",
  s."telefonoSucursal" AS "Teléfono",
  u."correo" AS "Correo",
  CASE p."estatusProveedor"
    WHEN 'Pendiente' THEN 'Pendiente'
    WHEN 'Autorizado' THEN 'Autorizado'
    WHEN 'Curso' THEN 'En curso'
    WHEN 'Entregado' THEN 'Entregado'
    ELSE 'Desconocido'
  END AS "Estado"
FROM 
  "BACKPYMEX"."Pedido" p
LEFT JOIN 
  "BACKPYMEX"."Producto" pr ON p."idProducto" = pr."idProducto"
LEFT JOIN 
  "BACKPYMEX"."Sucursal" s ON p."idSucursal" = s."idSucursal"
LEFT JOIN 
  "BACKPYMEX"."Usuario" u ON p."idUsuario" = u."idUsuario"
WHERE 
  p."idPedido" = ?
ORDER BY 
  p."fechaCreacion" DESC;

  `;

  connection.exec(sql, [idPedido], (err, rows) => {
    if (err) {
      console.error('Error obteniendo detalles del pedido:', err);
      return res.status(500).json({ error: 'Error obteniendo detalles del pedido' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(rows[0]);
  });
});

//Cambiar estado del pedido
router.put('/estatus/:idPedido', (req, res) => {
  const { idPedido } = req.params;
  const { estatusPedido } = req.body;

  const validEstados = ['Pendiente', 'Autorizado', 'Curso', 'Entregado'];
  if (!validEstados.includes(estatusPedido)) {
    return res.status(400).json({
      error: 'Estatus inválido.',
      message: `El estatus '${estatusPedido}' no es válido.`
    });
  }

  const sql = `
    UPDATE "Pedido"
    SET "estatusProveedor" = ?, "estatusCliente" = ?
    WHERE "idPedido" = ?
  `;

  connection.exec(sql, [estatusPedido, estatusPedido, idPedido], (err, result) => {
    if (err) {
      console.error('Error actualizando estatus:', err);
      return res.status(500).json({ error: 'Error actualizando el estatus del pedido' });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ success: true, message: 'Estatus actualizado correctamente' });
  });
});

export default router;

