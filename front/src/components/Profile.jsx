import React, { useEffect, useState } from "react";
//import { getUsuario } from "../../../controllers/adminCrud";  
import axios from "axios";
import pic from '../assets/user.png';
import process from 'process';

function Profile() {
    const [user, setUser] = useState(null); // State to store the fetched user data

    // Fetch user when the component mounts
    // useEffect(() => {
    //     const storedUser = localStorage.getItem("usuario");
    //      if (storedUser) {
    //     setUser(JSON.parse(storedUser));
    // }
    // }, []);
    useEffect(()=> {
        const storedUser=localStorage.getItem("usuario");
        if (storedUser){
            setUser(JSON.parse(storedUser));
        }
    },[]);
    if (!user){
        return <div>Loading...</div>
    }
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const userId = 1; // Replace with the actual user ID (for example, from session or state)
    //             const fetchedUser = await getUsuario(userId);
    //             setUser(fetchedUser); // Set the user data in state
    //         } catch (error) {
    //             console.error("Error fetching user:", error);
    //         }
    //     };

    //     fetchUser();
    // }, []); // Empty dependency array ensures this runs once when the component mounts

    // if (!user) {
    //     return <div>Loading...</div>; // Display a loading message while fetching the user
    // }

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
                    <div className='w-full h-[50%]'>
                        <h1 className='text-[15px]'>{user.correo}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
/*<h1 className='text-[15px]'>{user.nombreUsuario} {user.apellidoUsuario}</h1>
<h1 className='text-[15px]'>ID Pyme: {user.idPyme}</h1>
*/