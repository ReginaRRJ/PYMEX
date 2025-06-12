import { motion } from 'framer-motion'
import { useState, useEffect } from "react"
import Switch from '@mui/material/Switch';



function NotificacionesSucursal() {
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
                const response = await fetch(`http://localhost:3001/api/notificaciones/configuracion-notificaciones/${user.idUsuario}`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
                const contentType = response.headers.get("content-type");
        
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    console.error('Expected JSON, but received:', text);
                    return;
                }
        
                const data = await response.json();
        
                
                data.forEach(config => {
                    switch (config.idNotificacion) {
                        case 1:
                            setPedidoAutorizado(config.activo);
                            break;
                        case 2:
                            setAutomatizacionPedidos(config.activo);
                            break;
                        case 3:
                            setEstatusPedido(config.activo);
                            break;
                        default:
                            break;
                    }
                });
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        
    
        fetchNotificationConfig();
    }, [user]);

    const handleSwitchChange = async (idNotificacion, value) => {
       
        if (idNotificacion === 1) setPedidoAutorizado(value);
        if (idNotificacion === 2) setAutomatizacionPedidos(value);
        if (idNotificacion === 3) setEstatusPedido(value);
    
        try {
            await fetch(`http://localhost:3001/api/notificaciones/configuracion-notificaciones/${user.idUsuario}`, {
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
            console.error("Error actualizando notifiación:", error);
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
               
                <div 
                data-testid="notificacionAutorizado-container"
                className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>

                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch 
                        size='large' 
                        checked={pedidoAutorizado} 
                        onChange={(e) => handleSwitchChange(1, e.target.checked)}
                        inputProps={{ 'data-testid': 'switchNotificacionPedidoAutorizado' }}
                        />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Pedido autorizado</h1>
                        <h1 className='text-[12px]'>Estado de autorización de los pedidos de la sucursal</h1>
                    </div>
                </div>
                <br />
            
                <div 
                data-testid="notificacionAutorizacion-container"
                className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch 
                        size='large' 
                        checked={automatizacionPedidos} 
                        onChange={(e) => handleSwitchChange(2, e.target.checked)}
                        inputProps={{ 'data-testid': 'switchNotificacionAutorizacion' }}
                        />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Automatización de pedidos</h1>
                        <h1 className='text-[12px]'>Automatización en momento calculado para evitar desabasto.</h1>
                    </div>
                </div>
                <br />
              
                <div 
                data-testid="notificacionEstatus-container"
                className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch 
                        size='large' 
                        checked={estatusPedido} 
                        onChange={(e) => handleSwitchChange(3, e.target.checked)}
                        inputProps={{ 'data-testid': 'switchNotificacionEstatus' }}
                        />    
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

export default NotificacionesSucursal