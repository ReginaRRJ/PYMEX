import { motion, AnimatePresence } from 'framer-motion'

function ActualizarPedido({onClose}) {
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
                <motion.div className="bg-white rounded-xl w-[50%] h-[30%] relative text-center" onClick={handleContentClick}
                initial={{ opacity: 0, scale: 0.3}}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, size: 0}}
                transition={{ duration: 0.2 }}>
                    <div className='w-full h-full flex flex-col justify-around'>
                        <h1 className='cursor-pointer text-[20px] absolute top-2 right-3' onClick={onClose}>x</h1>
                        <h1 className='text-[2rem]  font-bold'>Actualiza el pedido</h1>
                        <h1 className=''>¿Estas segur@ que quieres actualizar el estado del pedido a “Entregado” ?”</h1>
                        <div className='h-[15%] w-full flex justify-center items-center gap-4'>
                            <button className='h-[40px] w-[150px] rounded-2xl text-white bg-red-500 hover:bg-red-700'
                            >Eliminar</button>
                            <button className='h-[40px] w-[150px] rounded-2xl text-white bg-black hover:bg'
                            >Actualizar</button>
                        </div>
                    </div>
                
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ActualizarPedido