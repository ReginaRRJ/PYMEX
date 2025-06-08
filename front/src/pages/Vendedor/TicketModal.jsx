import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
const token = localStorage.getItem('token');
function TicketModal({ onClose, onTicketCreated }) {
    const [user, setUser] = useState(null);
    const [productsOptions, setProductsOptions] = useState([]);
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [isAvailable, setIsAvailable] = useState(null);

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
                // Fetch products available for the current branch
                const response = await axios.get(`http://localhost:3001/api/products/branch/${user.idSucursal}`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
                // Map the fetched data to options suitable for the react-select component
                const options = response.data.map((p) => ({
                    label: p.nombreProductoo, // Display product name
                    value: p.idProducto,     // Use idProducto as the value
                    idProducto: p.idProducto, // Store idProducto explicitly
                    price: p.precioProducto,  // Use precioProducto from the backend
                    quantity: p.availableQuantity, // Store available quantity
                }));
                setProductsOptions(options);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [user]); // Re-fetch products when user changes

    useEffect(() => {
        // Recalculate availability whenever quantity or selected product changes
        if (producto && cantidad !== '') {
            getAvailability();
        } else {
            setIsAvailable(null); // Reset availability if no product or quantity
        }
    }, [cantidad, producto]);

    // Prevents the modal from closing when clicking inside its content
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    // Handles product selection from the dropdown
    const handleProductChange = (selectedOption) => {
        setProducto(selectedOption);
    };

    // Determines if the requested quantity is available
    const getAvailability = () => {
        const cant = parseFloat(cantidad);
        if (isNaN(cant) || cant <= 0) {
            setIsAvailable(null); // Invalid quantity
        } else if (producto && cant > producto.quantity) {
            setIsAvailable(false); // Not enough stock
        } else {
            setIsAvailable(true); // Available
        }
    };

    // Returns the CSS class for the availability input background color
    const getColor = () => {
        if (isAvailable === true) return 'bg-green-300';
        if (isAvailable === false) return 'bg-red-300';
        return 'bg-slate-300';
    };

    // Returns the text for the availability status
    const getEstadoText = () => {
        if (isAvailable === true) return 'Disponible';
        if (isAvailable === false) return 'No disponible';
        return '';
    };

    // Handles the creation of a new ticket
    const handleCreateTicket = async () => {
        // Validate inputs before creating a ticket
        if (!isAvailable || !producto || !cantidad || !user || !user.idSucursal) {
            // Using a custom modal/message box instead of alert()
            // For simplicity, I'm using a console log here. In a real app, you'd show a UI message.
            console.error('Por favor, selecciona un producto y una cantidad válida, y asegúrate de la disponibilidad.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const ticketData = {
                idSucursal: user.idSucursal,
                product: {
                    idProducto: producto.idProducto,
                    nombreProductoo: producto.label, // Send the product name
                    precio: producto.price // Send the product price
                },
                cantidad: parseFloat(cantidad)
            };

            const response = await axios.post('http://localhost:3001/api/tickets', ticketData, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
            console.log('Ticket created successfully:', response.data);
            // Using a console log instead of alert()
            console.log('Ticket creado exitosamente!');

            // Call the callback function to refresh tickets in the parent component
            if (onTicketCreated) {
                onTicketCreated();
            }
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error creating ticket:', error.response ? error.response.data : error.message);
            // Using a console log instead of alert()
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
                            {/* The "Solicitar producto" button is currently disabled and styled based on availability */}
                            <button onClick={() => toast.success('Próximamente estará disponible.')} className={`h-[3rem] w-[45%] rounded-2xl text-white ${isAvailable === true ? 'bg-slate-300 cursor-not-allowed duration-300' : isAvailable === false ? 'bg-black duration-300' : 'bg-slate-300 cursor-not-allowed duration-300'}`}>
                                Solicitar producto
                            </button>
                            {/* The "Crear" button is enabled only when the product is available */}
                            <button
                                className={`h-[3rem] w-[45%] rounded-2xl text-white ${isAvailable === true ? 'bg-black duration-300' : 'bg-slate-300 cursor-not-allowed duration-300'}`}
                                onClick={handleCreateTicket}
                                disabled={!isAvailable} // Disable if not available
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
// import { motion, AnimatePresence } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import Select from 'react-select';
// import axios from 'axios';

// function TicketModal({ onClose, onTicketCreated }) {
//     const [user, setUser] = useState(null);
//     const [productsOptions, setProductsOptions] = useState([]);
//     const [producto, setProducto] = useState(null);
//     const [cantidad, setCantidad] = useState('');
//     const [isAvailable, setIsAvailable] = useState(null);

//     useEffect(() => {
//         const storedUser = localStorage.getItem("usuario");
//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//     }, []);

//     useEffect(() => {
//         if (!user || !user.idSucursal) return;

//         const fetchProducts = async () => {
//             try {
//                 // Fetch products available for the current branch
//                 const response = await axios.get(`http://localhost:3001/api/products/branch/${user.idSucursal}`);
//                 // Map the fetched data to options suitable for the react-select component
//                 const options = response.data.map((p) => ({
//                     label: p.nombreProductoo, // Display product name
//                     value: p.idProducto,     // Use idProducto as the value
//                     idProducto: p.idProducto, // Store idProducto explicitly
//                     price: p.precioProducto,  // Use precioProducto from the backend
//                     quantity: p.availableQuantity, // Store available quantity
//                 }));
//                 setProductsOptions(options);
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//             }
//         };

//         fetchProducts();
//     }, [user]); // Re-fetch products when user changes

//     useEffect(() => {
//         // Recalculate availability whenever quantity or selected product changes
//         if (producto && cantidad !== '') {
//             getAvailability();
//         } else {
//             setIsAvailable(null); // Reset availability if no product or quantity
//         }
//     }, [cantidad, producto]);

//     // Prevents the modal from closing when clicking inside its content
//     const handleContentClick = (e) => {
//         e.stopPropagation();
//     };

//     // Handles product selection from the dropdown
//     const handleProductChange = (selectedOption) => {
//         setProducto(selectedOption);
//     };

//     // Determines if the requested quantity is available
//     const getAvailability = () => {
//         const cant = parseFloat(cantidad);
//         if (isNaN(cant) || cant <= 0) {
//             setIsAvailable(null); // Invalid quantity
//         } else if (producto && cant > producto.quantity) {
//             setIsAvailable(false); // Not enough stock
//         } else {
//             setIsAvailable(true); // Available
//         }
//     };

//     // Returns the CSS class for the availability input background color
//     const getColor = () => {
//         if (isAvailable === true) return 'bg-green-300';
//         if (isAvailable === false) return 'bg-red-300';
//         return 'bg-slate-300';
//     };

//     // Returns the text for the availability status
//     const getEstadoText = () => {
//         if (isAvailable === true) return 'Disponible';
//         if (isAvailable === false) return 'No disponible';
//         return '';
//     };

//     // Handles the creation of a new ticket
//     const handleCreateTicket = async () => {
//         // Validate inputs before creating a ticket
//         if (!isAvailable || !producto || !cantidad || !user || !user.idSucursal) {
//             // Using a custom modal/message box instead of alert()
//             // For simplicity, I'm using a console log here. In a real app, you'd show a UI message.
//             console.error('Por favor, selecciona un producto y una cantidad válida, y asegúrate de la disponibilidad.');
//             return;
//         }

//         try {
//             const ticketData = {
//                 idSucursal: user.idSucursal,
//                 product: {
//                     idProducto: producto.idProducto,
//                     nombreProductoo: producto.label, // Send the product name
//                     precio: producto.price // Send the product price
//                 },
//                 cantidad: parseFloat(cantidad)
//             };

//             const response = await axios.post('http://localhost:3001/api/tickets', ticketData);
//             console.log('Ticket created successfully:', response.data);
//             // Using a console log instead of alert()
//             console.log('Ticket creado exitosamente!');

//             // Call the callback function to refresh tickets in the parent component
//             if (onTicketCreated) {
//                 onTicketCreated();
//             }
//             onClose(); // Close the modal
//         } catch (error) {
//             console.error('Error creating ticket:', error.response ? error.response.data : error.message);
//             // Using a console log instead of alert()
//             console.error(`Error al crear el ticket: ${error.response?.data?.error || error.message}`);
//         }
//     };

//     return (
//         <AnimatePresence>
//             <motion.div
//                 className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
//                 onClick={onClose}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//             >
//                 <motion.div
//                     className="bg-white rounded-xl w-[50%] h-[60%]"
//                     onClick={handleContentClick}
//                     initial={{ opacity: 0, scale: 0.3 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.3 }}
//                     transition={{ duration: 0.2 }}
//                 >
//                     <div className="h-[5%] w-full bg-white rounded-2xl flex justify-end pr-5 pt-3">
//                         <h1 className="cursor-pointer text-[20px]" onClick={onClose}>
//                             x
//                         </h1>
//                     </div>
//                     <div className="h-[15%] w-full flex justify-center items-center text-[2rem]">
//                         Generar nuevo ticket
//                     </div>
//                     <div className="h-[80%] w-full flex flex-col">
//                         <div className="h-[33%] w-full flex justify-between pl-10 pr-10 pt-3 pb-5">
//                             <div className="w-[45%] h-[20%]">
//                                 <h1>Producto</h1>
//                                 <Select
//                                     options={productsOptions}
//                                     placeholder="Selecciona un producto..."
//                                     value={producto}
//                                     onChange={handleProductChange}
//                                     styles={{
//                                         control: (base) => ({
//                                             ...base,
//                                             backgroundColor: '#cbd5e1',
//                                             borderRadius: '0.75rem',
//                                             height: '3rem',
//                                             paddingLeft: '0.5rem',
//                                             border: 'none',
//                                             boxShadow: 'none',
//                                         }),
//                                         menu: (base) => ({
//                                             ...base,
//                                             backgroundColor: '#cbd5e1',
//                                             borderRadius: '0.75rem',
//                                             marginTop: 4,
//                                         }),
//                                         option: (base, state) => ({
//                                             ...base,
//                                             backgroundColor: state.isFocused ? '#94a3b8' : '#cbd5e1',
//                                             color: 'black',
//                                             cursor: 'pointer',
//                                         }),
//                                         singleValue: (base) => ({
//                                             ...base,
//                                             color: 'black',
//                                         }),
//                                     }}
//                                 />
//                             </div>
//                             <div className="w-[45%] h-[20%]">
//                                 <h1>Cantidad</h1>
//                                 <input
//                                     type="number"
//                                     className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200"
//                                     value={cantidad}
//                                     onChange={(e) => setCantidad(e.target.value)}
//                                     min="0"
//                                 />
//                             </div>
//                         </div>
//                         <div className="h-[33%] w-full flex justify-between pl-10 pr-10 pt-3 pb-5">
//                             <div className="w-[45%] h-[20%]">
//                                 <h1>Importe</h1>
//                                 <input
//                                     type="text"
//                                     className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200"
//                                     value={
//                                         producto && cantidad
//                                             ? `$${(producto.price * parseFloat(cantidad || 0)).toFixed(2)} MXN`
//                                             : ''
//                                     }
//                                     disabled
//                                 />
//                             </div>
//                             <div className="w-[45%] h-[20%]">
//                                 <h1>Estado</h1>
//                                 <input
//                                     type="text"
//                                     className={`w-full h-[3rem] rounded-xl pl-2 ${getColor()} duration-300`}
//                                     value={getEstadoText()}
//                                     disabled
//                                 />
//                             </div>
//                         </div>
//                         <div className="h-[34%] w-full flex justify-between pl-10 pr-10 pt-6 pb-5">
//                             {/* The "Solicitar producto" button is currently disabled and styled based on availability */}
//                             <button className={`h-[3rem] w-[45%] rounded-2xl text-white ${isAvailable === true ? 'bg-slate-300 cursor-not-allowed duration-300' : isAvailable === false ? 'bg-black duration-300' : 'bg-slate-300 cursor-not-allowed duration-300'}`}>
//                                 Solicitar producto
//                             </button>
//                             {/* The "Crear" button is enabled only when the product is available */}
//                             <button
//                                 className={`h-[3rem] w-[45%] rounded-2xl text-white ${isAvailable === true ? 'bg-black duration-300' : 'bg-slate-300 cursor-not-allowed duration-300'}`}
//                                 onClick={handleCreateTicket}
//                                 disabled={!isAvailable} // Disable if not available
//                             >
//                                 Crear
//                             </button>
//                         </div>
//                     </div>
//                 </motion.div>
//             </motion.div>
//         </AnimatePresence>
//     );
// }

// export default TicketModal;

