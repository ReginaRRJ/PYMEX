import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const token = localStorage.getItem('token');
function AddOrder({onClose}) {
    const [nombre, setNombre] = useState("");
    const [producto, setProducto] = useState("");
    const [pieces, setPieces] = useState();
    const [telefono, setTelefono] = useState("");
    const [tipoPedido, setTipoPedido] = useState("");
    const [correo, setCorreo] = useState("");
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const nombreSucursal = localStorage.getItem("nombreSucursal");
    const [sucursales, setSucursales] = useState([]);
    const [idSucursal, setIdSucursal] = useState(null);




    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    // Handle change event to update the selected role
    const handleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleCrearPedido = async () => {
        console.log("handleCrearPedido ejecutado");
        try {
            if (!nombre || !producto || !pieces || !telefono || !tipoPedido || !correo) {
                toast.error("Por favor completa todos los campos.");
                return;
            }
            const usuarioStr = localStorage.getItem("usuario");
            const usuario = JSON.parse(usuarioStr);
            const idSucursal = Number(usuario.idSucursal);
            
            const nuevoPedido = {
                tipoPedido: tipoPedido,
                cantidad: pieces,
                fechaCreacion: new Date().toISOString(),
                fechaEntregaEstimada: new Date("2025-06-01").toISOString(),
                fechaEntrega: new Date("2025-06-03").toISOString(),
                idProveedor: proveedores.find(p => p.nombreProveedor === nombre).idProveedor,
                idProducto: productos.find(p => p.nombreProductoo === producto).idProducto,
                idSucursal: idSucursal,
                idUsuario: localStorage.getItem("idUsuario"),
                estatusProveedor: "Pendiente",
                estatusCliente: "Por aprobar"
            };

            const res = await axios.post("http://localhost:3001/api/sucursal/pedidos", nuevoPedido,{
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
            toast.success("Pedido creado correctamente");

            onClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al crear pedido:", error);
            toast.error("Error al crear el pedido");
        }
    };



    useEffect(() => {
        console.log("Fetching proveedores...");
        const fetchProveedores = async () => {
            console.log("Fetching proveedores from API...");
            try {
                const res = await axios.get("http://localhost:3001/api/sucursal/proveedores",{
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
                console.log("Proveedores:", res.data);
                console.log("Proveedores length:", res.data.length);
                setProveedores(res.data); // Guarda arreglo completo
                toast.success("Proveedores cargados correctamente");
            } catch (error) {
                console.error("Error al cargar proveedores:", error);
                toast.error("Error al cargar proveedores");
            }
        };

        fetchProveedores();
    }, []);

    useEffect(() => {
        const proveedorSeleccionado = proveedores.find(p => p.nombreProveedor === nombre);
        if (!proveedorSeleccionado) return;

        const fetchProductos = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/sucursal/productos/${proveedorSeleccionado.idProveedor}`,{
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
                setProductos(res.data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
                toast.error("Error al cargar productos");
            }
        };

        fetchProductos();
    }, [nombre, proveedores]);


    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}
            initial={{ opacity: 0}}
            animate={{opacity: 1}}
            transition={{ duration: 0.2 }}>
                <motion.div className="bg-white rounded-xl w-[50%] h-[70%]" onClick={handleContentClick}
                initial={{ opacity: 0, scale: 0.3}}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, size: 0}}
                transition={{ duration: 0.2 }}>
                    <div className='h-[5%] w-full bg-white rounded-2xl flex justify-end pr-5 pt-3'>
                        <h1 className='cursor-pointer text-[20px]' onClick={onClose}>x</h1>
                    </div>
                    <div className='h-[15%] w-full flex justify-center items-center text-[2rem]'>Crear nuevo pedido</div>
                    <div className='h-[60%] w-full flex'>
                        <div className='h-full w-[50%] flex flex-col justify-between pl-14 pr-5 pt-3 pb-5'>
                            <div className='h-20%'>
                                <h1>Nombre del Proveedor</h1>
                                <select 
                                    className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)}
                                >
                                    <option value="">Selecciona un proveedor</option>
                                    {proveedores.map((prov, idx) => (
                                        <option key={idx} value={prov.nombreProveedor}>
                                            {prov.nombreProveedor}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='h-20%'>
                                <h1>Numero de piezas</h1>
                                <input type="number" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={pieces} onChange={(e) => setPieces(e.target.value)}/>
                            </div>
                            <div className='h-20%'>
                                <h1>Tipo pedido</h1>
                                <select className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={tipoPedido} onChange={(e) => setTipoPedido(e.target.value)}> 
                                    <option value="">Selecciona una categoría</option>
                                    <option value="Electrónica">Electrónica</option>
                                    <option value="Telefonía">Telefonía</option>
                                    <option value="Accesorios">Accesorios</option>
                                    <option value="Computo">Computo</option>
                                    <option value="Gadgets inteligentes">Gadgets inteligentes</option>
                                </select>
                            </div>
                        </div>
                        <div className='h-full w-[50%] flex flex-col justify-between pl-5 pr-14 pt-3 pb-5'>
                            <div className='h-20%'>
                                <h1>Producto</h1>
                                <select className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={producto} onChange={(e) => setProducto(e.target.value)}>
                                    <option value="">Selecciona un producto</option>
                                    {productos.map((prod, idx) => (
                                        <option key={idx} value={prod.nombreProductoo}>{prod.nombreProductoo}</option>
                                    ))}
                                </select>

                            </div>
                            <div className='h-20%'>
                                <h1>Teléfono</h1>
                                <input type="text" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={telefono} onChange={(e) => setTelefono(e.target.value)}/>
                            </div>
                            <div className='h-20% relative'>
                                <h1>Correo</h1>
                                <input type="text" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={correo} onChange={(e) => setCorreo(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className='h-[15%] w-full flex justify-center items-center'>
                        <button className='h-[40px] w-[100px] rounded-2xl text-white bg-black hover:bg' onClick={handleCrearPedido} >Crear</button>
                    </div>
                
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default AddOrder