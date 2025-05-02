const pedidos = [
    {
      "id": 647241,
      "cliente": "Tech Solutions S.A. de C.V.",
      "producto": "Laptop Dell XPS 13",
      "fecha_de_solicitud": "2025-04-10",
      "fecha_de_entrega": "2025-04-15",
      "telefono": "+52 55 1234 5678",
      "correo": "contacto@techsolutions.com",
      "ubicacion": "Ciudad de México",
      "estatus": "Pendiente"
    },
    {
      "id": 647242,
      "cliente": "Impresiones Rápidas MX",
      "producto": "Impresora HP LaserJet Pro M404",
      "fecha_de_solicitud": "2025-04-11",
      "fecha_de_entrega": "2025-04-17",
      "telefono": "+52 33 9876 5432",
      "correo": "ventas@impresionesmx.com",
      "ubicacion": "Guadalajara, Jalisco",
      "estatus": "En proceso"
    },
    {
      "id": 647243,
      "cliente": "Innovatech Group",
      "producto": "Monitor Samsung 27 Curvo",
      "fecha_de_solicitud": "2025-04-12",
      "fecha_de_entrega": "2025-04-18",
      "telefono": "+52 81 1122 3344",
      "correo": "soporte@innovatech.com",
      "ubicacion": "Monterrey, Nuevo León",
      "estatus": "Entregado"
    },
    {
      "id": 647244,
      "cliente": "Soluciones Empresariales SA",
      "producto": "Teclado Mecánico Logitech MX Keys",
      "fecha_de_solicitud": "2025-04-13",
      "fecha_de_entrega": "2025-04-20",
      "telefono": "+52 55 4433 2211",
      "correo": "contacto@solucionesempresariales.com",
      "ubicacion": "Toluca, Estado de México",
      "estatus": "Pendiente"
    },
    {
      "id": 647245,
      "cliente": "Grupo Digital QRO",
      "producto": "Tablet iPad Air 64GB",
      "fecha_de_solicitud": "2025-04-14",
      "fecha_de_entrega": "2025-04-21",
      "telefono": "+52 55 6677 8899",
      "correo": "info@digitalqro.mx",
      "ubicacion": "Querétaro, Querétaro",
      "estatus": "Cancelado"
    },
    {
      "id": 647246,
      "cliente": "Data Solutions Puebla",
      "producto": "Disco Duro Externo Seagate 2TB",
      "fecha_de_solicitud": "2025-04-15",
      "fecha_de_entrega": "2025-04-22",
      "telefono": "+52 33 5566 7788",
      "correo": "ventas@datasolutionspuebla.com",
      "ubicacion": "Puebla, Puebla",
      "estatus": "Entregado"
    },
    {
      "id": 647242,
      "cliente": "Impresiones Rápidas MX",
      "producto": "Impresora HP LaserJet Pro M404",
      "fecha_de_solicitud": "2025-04-11",
      "fecha_de_entrega": "2025-04-17",
      "telefono": "+52 33 9876 5432",
      "correo": "ventas@impresionesmx.com",
      "ubicacion": "Guadalajara, Jalisco",
      "estatus": "En proceso"
    },
    {
      "id": 647243,
      "cliente": "Innovatech Group",
      "producto": "Monitor Samsung 27 Curvo",
      "fecha_de_solicitud": "2025-04-12",
      "fecha_de_entrega": "2025-04-18",
      "telefono": "+52 81 1122 3344",
      "correo": "soporte@innovatech.com",
      "ubicacion": "Monterrey, Nuevo León",
      "estatus": "Entregado"
    },
    {
      "id": 647244,
      "cliente": "Soluciones Empresariales SA",
      "producto": "Teclado Mecánico Logitech MX Keys",
      "fecha_de_solicitud": "2025-04-13",
      "fecha_de_entrega": "2025-04-20",
      "telefono": "+52 55 4433 2211",
      "correo": "contacto@solucionesempresariales.com",
      "ubicacion": "Toluca, Estado de México",
      "estatus": "Pendiente"
    },
    {
      "id": 647245,
      "cliente": "Grupo Digital QRO",
      "producto": "Tablet iPad Air 64GB",
      "fecha_de_solicitud": "2025-04-14",
      "fecha_de_entrega": "2025-04-21",
      "telefono": "+52 55 6677 8899",
      "correo": "info@digitalqro.mx",
      "ubicacion": "Querétaro, Querétaro",
      "estatus": "Cancelado"
    },
    {
      "id": 647246,
      "cliente": "Data Solutions Puebla",
      "producto": "Disco Duro Externo Seagate 2TB",
      "fecha_de_solicitud": "2025-04-15",
      "fecha_de_entrega": "2025-04-22",
      "telefono": "+52 33 5566 7788",
      "correo": "ventas@datasolutionspuebla.com",
      "ubicacion": "Puebla, Puebla",
      "estatus": "Entregado"
    },
    {
      "id": 647244,
      "cliente": "Soluciones Empresariales SA",
      "producto": "Teclado Mecánico Logitech MX Keys",
      "fecha_de_solicitud": "2025-04-13",
      "fecha_de_entrega": "2025-04-20",
      "telefono": "+52 55 4433 2211",
      "correo": "contacto@solucionesempresariales.com",
      "ubicacion": "Toluca, Estado de México",
      "estatus": "Pendiente"
    },
    {
      "id": 647245,
      "cliente": "Grupo Digital QRO",
      "producto": "Tablet iPad Air 64GB",
      "fecha_de_solicitud": "2025-04-14",
      "fecha_de_entrega": "2025-04-21",
      "telefono": "+52 55 6677 8899",
      "correo": "info@digitalqro.mx",
      "ubicacion": "Querétaro, Querétaro",
      "estatus": "Cancelado"
    },
    {
      "id": 647246,
      "cliente": "Data Solutions Puebla",
      "producto": "Disco Duro Externo Seagate 2TB",
      "fecha_de_solicitud": "2025-04-15",
      "fecha_de_entrega": "2025-04-22",
      "telefono": "+52 33 5566 7788",
      "correo": "ventas@datasolutionspuebla.com",
      "ubicacion": "Puebla, Puebla",
      "estatus": "Entregado"
    }
]
  
export default pedidos