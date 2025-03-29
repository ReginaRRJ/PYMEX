import { useState } from "react"

const Login = () => {
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")
    
    return (
        <div className="flex h-screen w-screen bg-white">
            <div className="w-3/5 h-full bg-blue-700">
                <h1>Correo: {correo}</h1>
                <h1>Contraseña: {contraseña}</h1>
            </div>
            <div className="w-2/5 h-full bg-white flex items-center justify-center">
                <div className="w-4/5 h-[365px] flex flex-col items-start">
                    <h1 className="text-3xl">Iniciar sesión</h1>
                    <div className="w-4/5 h-[85%] bg-gray-100 rounded-xl pl-6 pt-6">
                        <div className="w-[90%] h-full flex-col">
                            <div className="w-full h-[80px] flex flex-col items-start">
                                <h1>Correo</h1>
                                <input type="text" className="w-full h-3/5 rounded-xl pl-2" onChange={e => setCorreo(e.target.value)}/>
                            </div>
                            <br />
                            <div className="w-full h-[80px] flex flex-col items-start">
                                <h1>Contraseña</h1>
                                <input type="password" className="w-full h-3/5 rounded-xl pl-2" onChange={e => setContraseña(e.target.value)}/>
                            </div>
                            <br />
                            <button className="w-full h-[40px] bg-blue-800 rounded-xl text-white">Iniciar sesión</button>
                        </div>
                    </div>
                    <h1>¿No tienes cuenta? Contactar a ventas</h1>
                </div>
            </div>
        </div>
    )
}

export default Login
