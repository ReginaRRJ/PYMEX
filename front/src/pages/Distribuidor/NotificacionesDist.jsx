
import { motion } from 'framer-motion'
import { useState, useEffect } from "react"
import Switch from '@mui/material/Switch';



function NotificacionesDist() {
    const [user, setUser] = useState(null);
    const [pedidoAutorizado, setPedidoAutorizado] = useState(false);
    const [automatizacionPedidos, setAutomatizacionPedidos] = useState(false);
    const [estatusPedido, setEstatusPedido] = useState(false);
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            setUser(JSON.parse(storedUser));  
        }
    }, []);

    useEffect(() => {
        if (!user) return;
    
        const fetchNotificationConfig = async () => {
            try {
                const response = await fetch(`https://pymex-production.up.railway.app/api/notificaciones/configuracion-notificaciones/${user.idUsuario}`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
                const contentType = response.headers.get("content-type");
        
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    console.error('Esperando archivo JSON. Se recibió:', text);
                    return;
                }
        
                const data = await response.json();
        
            
                data.forEach(config => {
                    switch (config.idNotificacion) {
                        case 4:
                            setPedidoAutorizado(config.activo);
                            break;
                        case 5:
                            setAutomatizacionPedidos(config.activo);
                            break;
                        case 6:
                            setEstatusPedido(config.activo);
                            break;
                        default:
                            break;
                    }
                });
            } catch (error) {
                console.error("Error obteniendo notificaciones:", error);
            }
        };
        
    
        fetchNotificationConfig();
    }, [user]);

    const handleSwitchChange = async (idNotificacion, value) => {
        
        if (idNotificacion === 4) setPedidoAutorizado(value);
        if (idNotificacion === 5) setAutomatizacionPedidos(value);
        if (idNotificacion === 6) setEstatusPedido(value);
    
        try {
            await fetch(`https://pymex-production.up.railway.app/api/notificaciones/configuracion-notificaciones/${user.idUsuario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idNotificacion,
                    activo: value,
                }),
            });
        } catch (error) {
            console.error("Error updating notification:", error);
        }
    };
    

    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
            <div className='h-[20%] w-full'>
                <h1 className="text-[40px]">Notificaciones</h1> 
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Activa notificaciones para facilitar la gestión</h1>  
                </div>
            </div>

            <div className="w-full h-[75%]">
              
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'
                data-testid="notificacionEntrega-container">

                    <div className='w-[80px] h-full flex flex-col justify-center'>

                        <Switch size='large' checked={pedidoAutorizado} onChange={(e) => handleSwitchChange(4, e.target.checked)} inputProps={{ 'data-testid': 'switchNotificacionEntrega' }}/>

                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Pedido autorizado</h1>
                        <h1 className='text-[12px]'>Estado de autorización de los pedidos de la sucursal</h1>
                    </div>
                </div>
                <br />
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={automatizacionPedidos} onChange={(e) => handleSwitchChange(5, e.target.checked)} inputProps={{ 'data-testid': 'switchNotificacionAutomatizacion' }} />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Automatización de pedidos</h1>
                        <h1 className='text-[12px]'>Automatización en momento calculado para evitar desabasto.</h1>

                    </div>
                </div>
                <br />
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={estatusPedido} onChange={(e) => handleSwitchChange(6, e.target.checked)}/>    
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Estatus del pedido</h1>
                        <h1 className='text-[12px]'>Alerta de notificación en cada actualización del proceso de envio</h1>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default NotificacionesDist
