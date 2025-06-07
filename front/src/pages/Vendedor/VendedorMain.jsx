import { useState, useEffect } from "react"
import VentasVendedor from "./VentasVendedor";
import Header from "../../components/Header";
import NavbarIcon from "../../components/NavbarIcon";
import Profile from "../../components/Profile";
import TicketModal from "./TicketModal";

import sell from '/assets/sell.png'

let rol = "VENDEDOR";

function VendedorMain() {
    const [activeScreenVendedor, setActiveScreenVendedor] = useState("ventasVendedor");
    const [ventaModal, setVentaModal] = useState(false);
    // State to trigger a refresh of tickets in VentasVendedor
    const [refreshTickets, setRefreshTickets] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Callback function to be passed to TicketModal,
    // which will be called when a ticket is successfully created.
    const handleTicketCreated = () => {
        setVentaModal(false); // Close the modal
        setRefreshTickets(prev => !prev); // Toggle state to trigger re-fetch in VentasVendedor
    };

    const renderScreen = () => {
        switch (activeScreenVendedor) {
            case "ventasVendedor":
                return (
                    <VentasVendedor
                        ventaModal={ventaModal}
                        setVentaModal={setVentaModal}
                        refreshTickets={refreshTickets} // Pass refreshTickets state
                    />
                );
            default:
                return <h2>Screen not found</h2>;
        }
    }

    return (
        <>
            {/* Render TicketModal only if ventaModal is true and user data is available */}
            {ventaModal && user && (
                <TicketModal
                    onClose={() => setVentaModal(false)}
                    onTicketCreated={handleTicketCreated} // Pass the callback function
                />
            )}

            <div className="w-screen h-screen flex flex-col items-center">
                <Header rol={rol} />
                <hr className="w-[95%]" />
                <div className="w-full h-[90%] flex">
                <div className="w-[25%] h-full">
                    <div className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
                        <NavbarIcon
                            icon={sell}
                            text={"Ventas"}
                            onClick={() => setActiveScreenVendedor("ventasVendedor")}
                            selected={activeScreenVendedor === "ventasVendedor"}
                        />
                    </div>
                    <div className="w-full h-[20%]">
                    <Profile />
                    </div>
                </div>
                {renderScreen()}
                </div>
            </div>
        </>
    )
}

export default VendedorMain;
