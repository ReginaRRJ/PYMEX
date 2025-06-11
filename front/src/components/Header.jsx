import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import sapLogo from "../assets/sapLogo.png";
import bellIcon from "/assets/bell.png";

function Header({ rol, bell, notificaciones, setNotificationsModal }) {
    console.log("Header received notificaciones:", notificaciones);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        window.location.href = "/";
    };

    const hasUnread = notificaciones?.some(notif => notif.read === false);

    return (
        <div className="h-[10%] w-screen pl-[50px] pr-[50px] flex items-center justify-between relative">
            <div className="w-[15%] h-full flex items-center justify-start">
                <img className="h-[50%]" src={sapLogo} alt="Example" />
                <h1 className="text-blue-600 font-medium">{rol}</h1>
            </div>

            {bell === true ? (
                <div className="w-[15%] h-full flex items-center justify-between">
                    <div className="w-[20%] h-[50%] flex justify-center items-center relative"
                    onClick={() => setNotificationsModal(true)}>
                        <img
                            src={bellIcon}
                            alt=""
                            className="h-full cursor-pointer"
                            onClick={() => {}}
                            />
                        {hasUnread && (
                            <span className="absolute top-1.5 right-1.5 h-[0.7rem] w-[0.7rem] rounded-full bg-red-500 border-1 pointer-events-none"></span>
                        )}
                        </div>
                    <button
                        onClick={handleLogout}
                        className="w-[70%] h-[50%] bg-red-500 rounded-2xl text-white hover:bg-red-700 duration-300"
                    >
                        Cerrar sesión
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleLogout}
                    className="w-[11%] h-[50%] bg-red-500 rounded-2xl text-white hover:bg-red-700 duration-300"
                    >
                    Cerrar sesión
                </button>
            )}
        </div>
    );
}

export default Header;
