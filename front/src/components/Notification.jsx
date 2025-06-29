import { useState } from 'react';
import axios from 'axios';

function Notification({ notification, onMarkedRead }) {
  const [checked, setChecked] = useState(notification.leida);
  const token = localStorage.getItem('token');

  const handleCheckboxChange = async () => {
    if (!checked) {
      try {
        if (!token) {
          console.error("Error: No se encontró el token de autenticación.");
          return;
        }

        const res = await axios.put(
          `http://localhost:3001/notificaciones/notificacionLeida/${notification.idMensaje}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.leida) {
          setChecked(true);
        
          if (onMarkedRead) {
            onMarkedRead();
          }
        } else {
          console.warn("No se pudo marcar como leída:", res.data);
        }
      } catch (err) {
        console.error("Error al marcar notificación como leída:", err);
      }
    }
  };

  return (
    <div
      className={`w-full h-auto p-5 rounded-md ${
        checked ? 'bg-slate-100' : 'bg-red-200'
      } duration-200 mb-[10px] flex items-stretch`}
    >
      <div
        className={`${checked ? 'w-[0%]' : 'w-[10%]'} duration-300 flex justify-center items-center`}
      >
        <label className="group flex items-center cursor-pointer">
          <input
            className="hidden peer"
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            disabled={checked}
          />
          {!checked && (
            <span className="relative w-8 h-8 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md shadow-md transition-all duration-500 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-hover:scale-105">
              <span className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 opacity-0 peer-checked:opacity-100 rounded-md transition-all duration-500 peer-checked:animate-pulse"></span>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                className="hidden w-3 h-3 text-white peer-checked:block transition-transform duration-500 transform scale-50 peer-checked:scale-100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  fillRule="evenodd"
                />
              </svg>
            </span>
          )}
        </label>
      </div>

      <div className={`${checked ? 'w-full' : 'w-[90%]'} duration-300`}>
        <p className="font-bold">{notification.tipoNotificacion}</p>
        <p>{notification.mensaje}</p>
        <br />
        <p className="text-slate-500 text-[0.8rem]">
          {notification.fecha || 'Sin fecha'}
        </p>
      </div>
    </div>
  );
}

export default Notification;

