import React, { useEffect, useState } from "react";  
import axios from "axios";
import pic from '../assets/user.png';
import process from 'process';

function Profile() {
    const [user, setUser] = useState(null); 

    useEffect(()=> {
        const storedUser=localStorage.getItem("usuario");
        if (storedUser){
            setUser(JSON.parse(storedUser));
        }
    },[]);
    if (!user){
        return <div>Loading...</div>
    }
   
    return (
        <div className="w-full h-full flex justify-center pt-[20px]">
            <div className="w-[80%] h-[50%] flex bg-slate-200 rounded-2xl">
                <div className="w-[20%] h-full flex justify-center items-center">
                    <img src={pic} alt="User" className='w-[60%]' />
                </div>
                <div className="w-[80%] h-full">
                    <div className='w-full h-[50%] flex flex-col justify-end'>
                        <h1 className='text-[15px]'>{user.nombreCompleto}</h1>
                    </div>
                    
                    <div id="perfil-info" className='w-full h-[50%]'> 
                        <h1 className='text-[15px]'>{user.correo}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
