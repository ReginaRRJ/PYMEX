import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';



function TicketModal({ onClose, onTicketCreated }) {
    const [user, setUser] = useState(null);
    const [productsOptions, setProductsOptions] = useState([]);
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [isAvailable, setIsAvailable] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (!user || !user.idSucursal) return;

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/branch/${user.idSucursal}`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
               
                const options = response.data.map((p) => ({
                    label: p.nombreProductoo, 
                    value: p.idProducto,    
                    idProducto: p.idProducto, 
                    price: p.precioProducto,  
                    quantity: p.availableQuantity, 
                }));
                setProductsOptions(options);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [user]); 

    useEffect(() => {
       
        if (producto && cantidad !== '') {
            getAvailability();
        } else {
            setIsAvailable(null); 
        }
    }, [cantidad, producto]);

    
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    
    const handleProductChange = (selectedOption) => {
        setProducto(selectedOption);
    };

   
    const getAvailability = () => {
        const cant = parseFloat(cantidad);
        if (isNaN(cant) || cant <= 0) {
            setIsAvailable(null); 
        } else if (producto && cant > producto.quantity) {
            setIsAvailable(false);
        } else {
            setIsAvailable(true); 
        }
    };

    
    const getColor = () => {
        if (isAvailable === true) return 'bg-green-300';
        if (isAvailable === false) return 'bg-red-300';
        return 'bg-slate-300';
    };

    
    const getEstadoText = () => {
        if (isAvailable === true) return 'Disponible';
        if (isAvailable === false) return 'No disponible';
        return '';
    };

   
    const handleCreateTicket = async () => {
       
        if (!isAvailable || !producto || !cantidad || !user || !user.idSucursal) {
            
            console.error('Por favor, selecciona un producto y una cantidad válida, y asegúrate de la disponibilidad.');
            return;
        }

        try {
            const ticketData = {
                idSucursal: user.idSucursal,
                product: {
                    idProducto: producto.idProducto,
                    nombreProductoo: producto.label,
                    precio: producto.price 
                },
                cantidad: parseFloat(cantidad)
            };

            const response = await axios.post('http://localhost:3001/api/tickets', ticketData, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
            
            if (onTicketCreated) {
                onTicketCreated();
            }
            onClose(); 
        } catch (error) {
            console.error('Error creando ticket:', error.response ? error.response.data : error.message);
          
            console.error(`Error al crear el ticket: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    className="bg-white rounded-xl w-[50%] h-[60%]"
                    onClick={handleContentClick}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.3 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="h-[5%] w-full bg-white rounded-2xl flex justify-end pr-5 pt-3">
                        <h1 className="cursor-pointer text-[20px]" onClick={onClose}>
                            x
                        </h1>
                    </div>
                    <div className="h-[15%] w-full flex justify-center items-center text-[2rem]">
                        Generar nuevo ticket
                    </div>
                    <div className="h-[80%] w-full flex flex-col">
                        <div className="h-[33%] w-full flex justify-between pl-10 pr-10 pt-3 pb-5">
                            <div className="w-[45%] h-[20%]">
                                <h1>Producto</h1>
                                <Select
                                    options={productsOptions}
                                    placeholder="Selecciona un producto..."
                                    value={producto}
                                    onChange={handleProductChange}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: '#cbd5e1',
                                            borderRadius: '0.75rem',
                                            height: '3rem',
                                            paddingLeft: '0.5rem',
                                            border: 'none',
                                            boxShadow: 'none',
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: '#cbd5e1',
                                            borderRadius: '0.75rem',
                                            marginTop: 4,
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isFocused ? '#94a3b8' : '#cbd5e1',
                                            color: 'black',
                                            cursor: 'pointer',
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: 'black',
                                        }),
                                    }}
                                />
                            </div>
                            <div className="w-[45%] h-[20%]">
                                <h1>Cantidad</h1>
                                <input
                                    type="number"
                                    className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className="h-[33%] w-full flex justify-between pl-10 pr-10 pt-3 pb-5">
                            <div className="w-[45%] h-[20%]">
                                <h1>Importe</h1>
                                <input
                                    type="text"
                                    className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200"
                                    value={
                                        producto && cantidad
                                            ? `$${(producto.price * parseFloat(cantidad || 0)).toFixed(2)} MXN`
                                            : ''
                                    }
                                    disabled
                                />
                            </div>
                            <div className="w-[45%] h-[20%]">
                                <h1>Estado</h1>
                                <input
                                    type="text"
                                    className={`w-full h-[3rem] rounded-xl pl-2 ${getColor()} duration-300`}
                                    value={getEstadoText()}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="h-[34%] w-full flex justify-between pl-10 pr-10 pt-6 pb-5">
                            
                            <button onClick={() => toast.success('Próximamente estará disponible.')} className={`h-[3rem] w-[45%] rounded-2xl text-white ${isAvailable === true ? 'bg-slate-300 cursor-not-allowed duration-300' : isAvailable === false ? 'bg-black duration-300' : 'bg-slate-300 cursor-not-allowed duration-300'}`}>
                                Solicitar producto
                            </button>
                           
                            <button
                                className={`h-[3rem] w-[45%] rounded-2xl text-white ${isAvailable === true ? 'bg-black duration-300' : 'bg-slate-300 cursor-not-allowed duration-300'}`}
                                onClick={handleCreateTicket}
                                disabled={!isAvailable} 
                            >
                                Crear
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default TicketModal;
