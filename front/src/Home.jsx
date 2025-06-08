import Circle from "./components/Circle"
import LoginHeader from "./components/LoginHeader"
import sapLogo from './assets/sapLogo.png'

function Home() {
    return (
        <div>
            <Circle/>
            <div className="absolute w-full h-[15%] z-50">
                <LoginHeader />
            </div>
            <div className="h-screen w-screen flex justify-center items-center">
                <div className="w-[40%] h-full flex flex-col justify-center items-center">
                <img src={sapLogo} alt="" className="w-[7rem]"/>
                    <h1 className="text-[10rem] text-blue-600 font-extrabold">PYMEX</h1>
                    <h1 className="text-center">La solución para agilizar y eficientar la cadena de suministro de PYMES de productos no perecederos en México que utiliza la tecnología de SAP</h1>
                    <button className="w-[30%] h-[3rem] bg-blue-700 rounded-3xl mt-10 text-white">Iniciar sesión</button>
                </div>
            </div>
        </div>
    )
}

export default Home
