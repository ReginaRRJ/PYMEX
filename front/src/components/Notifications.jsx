import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react';
import axios from 'axios';
import Notification from '../components/Notification'

function Notificaciones({onClose, notificaciones}) {
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
                <motion.div className="bg-white rounded-xl w-[60%] h-[80%]" onClick={handleContentClick}
                initial={{ opacity: 0, scale: 0.3}}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, size: 0}}
                transition={{ duration: 0.2 }}>
                    <div className='h-[5%] w-full bg-white rounded-2xl flex justify-end pr-5 pt-3'>
                        <h1 className='cursor-pointer text-[20px]' onClick={onClose}>x</h1>
                    </div>
                    <div className='h-[15%] w-full flex justify-center items-center text-[2rem]'>Notificaciones</div>
                    <div className='h-[75%] w-full px-10'>
                        <div className="h-full overflow-y-auto">
                            {notificaciones.map((notification, index) => (
                            <Notification key={index} notification={notification} />
                            ))}
                        </div>
                        </div>
                
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default Notificaciones
