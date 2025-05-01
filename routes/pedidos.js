import express from 'express';
import connection from '../config/db.js';

const router = express.Router();

// VISTA GENERAL DEL PROVEEDOR
router.get('/general', (req, res) => {
  const sql = `
    SELECT 
      p."idPedido" AS "id",  --  ID incluido aquí
      s."nombreSucursal" AS "Cliente",
      s."ubicacionSucursal" AS "Ubicación",
      CASE p."estatusPedido"
          WHEN 1 THEN 'Pendiente'
          WHEN 2 THEN 'Autorizado'
          WHEN 3 THEN 'Curso'
          WHEN 4 THEN 'Entregado'
          ELSE 'Desconocido'
      END AS "Estado"
    FROM 
      "Pedido" p
    JOIN 
      "Sucursal" s ON p."idSucursal" = s."idSucursal"
    WHERE 
      p."idUsuario" = 9  -- Cambia esto si quieres hacerlo dinámico
    ORDER BY 
      p."fechaCreacion" DESC
  `;

  connection.exec(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching general pedidos:', err);
      return res.status(500).json({ error: 'Error fetching general pedidos' });
    }

    res.json(rows);
  });
});

// VISTA DETALLADA DE UN SOLO PEDIDO
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
      CASE p."estatusPedido"
          WHEN 1 THEN 'Pendiente'
          WHEN 2 THEN 'Autorizado'
          WHEN 3 THEN 'Curso'
          WHEN 4 THEN 'Entregado'
          ELSE 'Desconocido'
      END AS "Estado"
    FROM 
      "Pedido" p
    JOIN 
      "Producto" pr ON p."idProducto" = pr."idProducto"
    JOIN 
      "Sucursal" s ON p."idSucursal" = s."idSucursal"
    JOIN 
      "Usuario" u ON p."idUsuario" = u."idUsuario"
    WHERE 
      p."idPedido" = ?
    ORDER BY 
      p."fechaCreacion" DESC
  `;

  connection.exec(sql, [idPedido], (err, rows) => {
    if (err) {
      console.error('Error fetching detailed pedido:', err);
      return res.status(500).json({ error: 'Error fetching detailed pedido' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido not found' });
    }

    res.json(rows[0]);
  });
});

// Correcting the backend to expect `estatusPedido`
router.put('/estatus/:idPedido', (req, res) => {
  const { idPedido } = req.params; // Get the order ID from the URL
  const { estatusPedido } = req.body; // Expect `estatusPedido` here

  // Log to check if we are receiving the estatus value
  console.log('Request body:', req.body);
  console.log('Valor recibido para estatus:', estatusPedido);

  // Validate the estatus to ensure it's a valid number (1, 2, 3, or 4)
  if (![1, 2, 3, 4].includes(estatusPedido)) {
    return res.status(400).json({
      error: 'Estatus inválido.',
      message: `El valor recibido para el estatus es '${estatusPedido}', pero debe ser 1, 2, 3 o 4.`
    });
  }

  // SQL query to update the status of the order
  const sql = `
    UPDATE "Pedido"
    SET "estatusPedido" = ?
    WHERE "idPedido" = ?
  `;

  // Execute the query to update the order status
  connection.exec(sql, [estatusPedido, idPedido], (err, result) => {
    if (err) {
      console.error('Error actualizando el estatus:', err);
      return res.status(500).json({ error: 'Error actualizando el estatus del pedido' });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ success: true, message: 'Estatus actualizado correctamente' });
  });
});

export default router;

// import express from 'express';
// import connection from '../config/db.js';

// const router = express.Router();

// // VISTA GENERAL DEL PROVEEDOR
// router.get('/general', (req, res) => {
//   const sql = `
//     SELECT 
//       p."idPedido" AS "id",  -- 👈 ID incluido aquí
//       s."nombreSucursal" AS "Cliente",
//       s."ubicacionSucursal" AS "Ubicación",
//       CASE p."estatusPedido"
//           WHEN 1 THEN 'Pendiente'
//           WHEN 2 THEN 'Autorizado'
//           WHEN 3 THEN 'Curso'
//           WHEN 4 THEN 'Entregado'
//           ELSE 'Desconocido'
//       END AS "Estado"
//     FROM 
//       "Pedido" p
//     JOIN 
//       "Sucursal" s ON p."idSucursal" = s."idSucursal"
//     WHERE 
//       p."idUsuario" = 9  -- Cambia esto si quieres hacerlo dinámico
//     ORDER BY 
//       p."fechaCreacion" DESC
//   `;

//   connection.exec(sql, (err, rows) => {
//     if (err) {
//       console.error('Error fetching general pedidos:', err);
//       return res.status(500).json({ error: 'Error fetching general pedidos' });
//     }

//     res.json(rows);
//   });
// });

// // VISTA DETALLADA DE UN SOLO PEDIDO
// router.get('/detalle/:idPedido', (req, res) => {
//   const { idPedido } = req.params;

//   const sql = `
//     SELECT 
//       p."idPedido" AS "ID",
//       pr."nombreProductoo" || ' – ' || p."cantidad" || ' piezas' AS "Producto",
//       TO_VARCHAR(p."fechaCreacion", 'YYYY-MM-DD') AS "Fecha de Solicitud",
//       TO_VARCHAR(p."fechaEntrega", 'YYYY-MM-DD') AS "Fecha de Entrega",
//       s."nombreSucursal" AS "Cliente",
//       s."ubicacionSucursal" AS "Ubicación",
//       s."telefonoSucursal" AS "Teléfono",
//       u."correo" AS "Correo",
//       CASE p."estatusPedido"
//           WHEN 1 THEN 'Pendiente'
//           WHEN 2 THEN 'Autorizado'
//           WHEN 3 THEN 'Curso'
//           WHEN 4 THEN 'Entregado'
//           ELSE 'Desconocido'
//       END AS "Estado"
//     FROM 
//       "Pedido" p
//     JOIN 
//       "Producto" pr ON p."idProducto" = pr."idProducto"
//     JOIN 
//       "Sucursal" s ON p."idSucursal" = s."idSucursal"
//     JOIN 
//       "Usuario" u ON p."idUsuario" = u."idUsuario"
//     WHERE 
//       p."idPedido" = ?
//     ORDER BY 
//       p."fechaCreacion" DESC
//   `;

//   connection.exec(sql, [idPedido], (err, rows) => {
//     if (err) {
//       console.error('Error fetching detailed pedido:', err);
//       return res.status(500).json({ error: 'Error fetching detailed pedido' });
//     }

//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'Pedido not found' });
//     }

//     res.json(rows[0]);
//   });
// });

// export default router;