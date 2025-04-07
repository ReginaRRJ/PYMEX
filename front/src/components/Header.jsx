import sapLogo from "../assets/sapLogo.png"

function Header({rol}) {
    return (
        <div className="h-[10%] w-screen pl-[50px] pr-[50px] flex items-center justify-between">
            <div className="w-[15%] h-full flex items-center justify-start">
                <img className="h-[50%]" src={sapLogo} alt="Example" />
                <h1 className="text-blue-600 font-medium">{rol}</h1>
            </div>
            <button className="w-[10%] h-[50%] bg-red-500 rounded-2xl text-white hover:bg-red-700 duration-300">Cerrar sesión</button>
        </div>
    )
}

export default Header
