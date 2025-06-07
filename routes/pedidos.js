import express from 'express';
import connection from '../config/db.js';
import { verifyToken } from '../controllers/authMiddle.js';

const router = express.Router();

router.use(verifyToken);
// VISTA GENERAL DEL PROVEEDOR
router.get('/general', (req, res) => {
  const sql = `
    SELECT 
      p."idPedido" AS "id",
      s."nombreSucursal" AS "Cliente",
      s."ubicacionSucursal" AS "Ubicación",
      CASE p."estatusCliente"
          WHEN 'Pendiente' THEN 'Pendiente'
          WHEN 'Autorizado' THEN 'Autorizado'
          WHEN 'Curso' THEN 'En curso'
          WHEN 'Entregado' THEN 'Entregado'
          ELSE 'Desconocido'
      END AS "Estado"
    FROM 
      "Pedido" p
    JOIN 
      "Sucursal" s ON p."idSucursal" = s."idSucursal"
    WHERE 
      p."idUsuario" = 9
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
      CASE p."estatusProveedor"
          WHEN 'Pendiente' THEN 'Pendiente'
          WHEN 'Autorizado' THEN 'Autorizado'
          WHEN 'Curso' THEN 'En curso'
          WHEN 'Entregado' THEN 'Entregado'
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

// ACTUALIZAR ESTATUS DEL PEDIDO
router.put('/estatus/:idPedido', (req, res) => {
  const { idPedido } = req.params;
  const { estatusPedido } = req.body;

  console.log('Received request body:', req.body); // Log received body for debugging

  // Validate input
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

// import express from 'express';
// import connection from '../config/db.js';

// const router = express.Router();

// // VISTA GENERAL DEL PROVEEDOR
// router.get('/general', (req, res) => {
//   const sql = `
//     SELECT 
//       p."idPedido" AS "id",
//       s."nombreSucursal" AS "Cliente",
//       s."ubicacionSucursal" AS "Ubicación",
//       CASE p."estatusCliente"
//           WHEN 'Pendiente' THEN 'Pendiente'
//           WHEN 'Autorizado' THEN 'Autorizado'
//           WHEN 'Curso' THEN 'En curso'
//           WHEN 'Entregado' THEN 'Entregado'
//           ELSE 'Desconocido'
//       END AS "Estado"
//     FROM 
//       "Pedido" p
//     JOIN 
//       "Sucursal" s ON p."idSucursal" = s."idSucursal"
//     WHERE 
//       p."idUsuario" = 9
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
//       CASE p."estatusProveedor"
//           WHEN 'Pendiente' THEN 'Pendiente'
//           WHEN 'Autorizado' THEN 'Autorizado'
//           WHEN 'Curso' THEN 'En curso'
//           WHEN 'Entregado' THEN 'Entregado'
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

// // ACTUALIZAR ESTATUS DEL PEDIDO
// router.put('/estatus/:idPedido', (req, res) => {
//   const { idPedido } = req.params;
//   const { estatusPedido } = req.body;

//   console.log('Request body:', req.body);

//   // Validate input
//   const validEstados = ['Pendiente', 'Autorizado', 'Curso', 'Entregado'];
//   if (!validEstados.includes(estatusPedido)) {
//     return res.status(400).json({
//       error: 'Estatus inválido.',
//       message: `El estatus '${estatusPedido}' no es válido.`
//     });
//   }

//   const sql = `
//     UPDATE "Pedido"
//     SET "estatusProveedor" = ?, "estatusCliente" = ?
//     WHERE "idPedido" = ?
//   `;

//   connection.exec(sql, [estatusPedido, estatusPedido, idPedido], (err, result) => {
//     if (err) {
//       console.error('Error actualizando estatus:', err);
//       return res.status(500).json({ error: 'Error actualizando el estatus del pedido' });
//     }

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: 'Pedido no encontrado' });
//     }

//     res.json({ success: true, message: 'Estatus actualizado correctamente' });
//   });
// });

// export default router;



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
//       CASE p."estatusProveedor"
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