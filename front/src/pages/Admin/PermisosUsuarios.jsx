import Navbar from "../../components/Navbar"
let rol = "ADMINISTRADOR"

function PermisosUsuarios() {
    return (
        <div className="h-screen w-screen flex flex-col items-center">
            <Navbar rol={rol} />
            <hr className="w-[95%]"/>
            <div className="h-[90%] w-screen">

            </div>
        </div>
    )
}

export default PermisosUsuarios
