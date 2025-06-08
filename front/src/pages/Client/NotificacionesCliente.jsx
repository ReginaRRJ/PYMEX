import { motion } from 'framer-motion';
import { useState, useEffect } from "react";

import Switch from '@mui/material/Switch';
const token = localStorage.getItem('token');
function NotificacionesCliente() {
    const [user, setUser] = useState(null);
    const [anticipacion, setAnticipacion] = useState(false);
    const [automatizacion, setAutomatizacion] = useState(false);
    const [estatus, setEstatus] = useState(false);
    const [solicitudes, setSolicitududes] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log("User loaded from localStorage:", parsedUser);
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
                localStorage.removeItem("usuario");
            }
        }
    }, []);

    useEffect(() => {
        if (!user || !user.idUsuario) {
            console.warn("User or idUsuario not available. Skipping notification config fetch.");
            setAnticipacion(false);
            setAutomatizacion(false);
            setEstatus(false);
            setSolicitududes(false);
            return;
        }

        const fetchNotificationConfig = async () => {
            console.log(`Attempting to fetch notification config for idUsuario: ${user.idUsuario}`);
            try {
                const response = await fetch(`http://localhost:3001/api/notificaciones/configuracion-notificaciones/${user.idUsuario}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
                const contentType = response.headers.get("content-type");

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`HTTP error fetching config! Status: ${response.status}, Message: ${errorText}`);
                    return;
                }

                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    console.error('Expected JSON response for config, but received:', text);
                    return;
                }

                const data = await response.json();
                console.log("Successfully fetched notification config data (raw):", data);

                if (!Array.isArray(data)) {
                    console.error("Fetched data for config is not an array:", data);
                    return;
                }

                data.forEach(config => {
                    // --- Using config.activo directly, assuming it's now a strict boolean ---
                    // This will only work correctly if your backend's GET endpoint
                    // for these specific IDs (7, 8, 9, 10) returns `activo` as `true` or `false`
                    // and not as 0/1 or "true"/"false" strings.
                    console.log(`Processing config: idNotificacion=${config.idNotificacion}, activo_value_from_backend=${config.activo}`);

                    switch (config.idNotificacion) {
                        case 7:
                            setAnticipacion(config.activo);
                            break;
                        case 8:
                            setAutomatizacion(config.activo);
                            break;
                        case 9:
                            setEstatus(config.activo);
                            break;
                        case 10:
                            setSolicitududes(config.activo);
                            break;
                        default:
                            console.warn(`Unknown idNotificacion in fetched config: ${config.idNotificacion}`);
                            break;
                    }
                });
            } catch (error) {
                console.error("Error fetching notification configuration:", error);
            }
        };

        fetchNotificationConfig();
    }, [user]);

    const handleSwitchChange = async (idNotificacion, value) => {
        if (!user || !user.idUsuario) {
            console.error("User or idUsuario not available. Cannot update notification.");
            alert("User data not loaded. Please log in again.");
            return;
        }

        const newValue = value; // `value` from e.target.checked is already a boolean

        if (idNotificacion === 7) setAnticipacion(newValue);
        else if (idNotificacion === 8) setAutomatizacion(newValue);
        else if (idNotificacion === 9) setEstatus(newValue);
        else if (idNotificacion === 10) setSolicitududes(newValue);

        console.log(`Sending PUT for idNotificacion: ${idNotificacion}, activo: ${newValue}`);

        try {
            const response = await fetch(`http://localhost:3001/api/notificaciones/configuracion-notificaciones/${user.idUsuario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idNotificacion: idNotificacion,
                    activo: newValue, // Send the boolean value to the backend
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            console.log("Notification update successful.");

        } catch (error) {
            console.error("Error updating notification:", error);
            if (idNotificacion === 7) setAnticipacion(!newValue);
            else if (idNotificacion === 8) setAutomatizacion(!newValue);
            else if (idNotificacion === 9) setEstatus(!newValue);
            else if (idNotificacion === 10) setSolicitududes(!newValue);
            alert("Failed to update notification. Please try again.");
        }
    };

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <motion.div className="h-full w-full flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className='h-[20%] w-full'>
                <h1 className="text-[40px]">Notificaciones</h1>
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Activa notificaciones para facilitar la gestión</h1>
                </div>
            </div>
            <div className="w-full h-[75%]">
                {/* Anticipacion de pedidos a distribuidor (ID 7) */}
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch inputProps={{ 'data-testid': 'switchAnticipación' }} size='large' checked={anticipacion} onChange={(e) => handleSwitchChange(7, e.target.checked)} />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Anticipación de pedidos a distribuidor</h1>
                        <h1 className='text-[12px]'>Alerta de notificación en momento calculado para evitar desabasto.</h1>
                    </div>
                </div>
                <br />
                {/* Automatización de pedidos (ID 8) */}
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch inputProps={{ 'data-testid': 'switchAutomatización' }} size='large' checked={automatizacion} onChange={(e) => handleSwitchChange(8, e.target.checked)} />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Automatización de pedidos</h1>
                        <h1 className='text-[12px]'>Automatización en momento calculado para evitar desabasto.</h1>
                    </div>
                </div>
                <br />
                {/* Estatus del pedido (ID 9) */}
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch inputProps={{ 'data-testid': 'switchEstatus' }} size='large' checked={estatus} onChange={(e) => handleSwitchChange(9, e.target.checked)} />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Estatus del pedido</h1>
                        <h1 className='text-[12px]'>Alerta de notificación cada vez que se actualiza el estado de pedidos a distribuidor.</h1>
                    </div>
                </div>
                <br />
                {/* Solicitudes de autorización (ID 10) */}
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch inputProps={{ 'data-testid': 'switchSolicitudes' }} size='large' checked={solicitudes} onChange={(e) => handleSwitchChange(10, e.target.checked)} />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Solicitudes de autorización</h1>
                        <h1 className='text-[12px]'>Alerta de notificación para las solicitudes de autorización.</h1>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default NotificacionesCliente;