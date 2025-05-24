import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react';
import axios from 'axios';

function AddOrder({onClose}) {
    const [nombre, setNombre] = useState("");
    const [producto, setProducto] = useState("");
    const [pieces, setPieces] = useState();
    const [telefono, setTelefono] = useState("");
    const [tipoPedido, setTipoPedido] = useState("");
    const [correo, setCorreo] = useState("");

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    // Handle change event to update the selected role
    const handleChange = (e) => {
        setSelectedRole(e.target.value);
    };


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
                                <select type="text" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                            </div>
                            <div className='h-20%'>
                                <h1>Numero de piezas</h1>
                                <input type="number" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={pieces} onChange={(e) => setPieces(e.target.value)}/>
                            </div>
                            <div className='h-20%'>
                                <h1>Tipo pedido</h1>
                                <select type="text" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={tipoPedido} onChange={(e) => setTipoPedido(e.target.value)}/>
                            </div>
                        </div>
                        <div className='h-full w-[50%] flex flex-col justify-between pl-5 pr-14 pt-3 pb-5'>
                            <div className='h-20%'>
                                <h1>Producto</h1>
                                <select type="text" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={producto} onChange={(e) => setProducto(e.target.value)}/>
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
                        <button className='h-[40px] w-[100px] rounded-2xl text-white bg-black hover:bg' >Crear</button>
                    </div>
                
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default AddOrder