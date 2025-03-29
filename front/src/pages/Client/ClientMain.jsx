import { useState, useEffect } from "react";
import PedidosDist from "./PedidosDist";

function ClientMain() {
  const [activeScreenClient, setActiveScreenClient] = useState("pedidosDist");
  
  const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if no token is available
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/protectedRoute", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Protected data:", data);
      } else {
        console.error("Failed to fetch protected data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  const renderScreen = () => {
    switch (activeScreenClient) {
      case "pedidosDist":
        return <PedidosDist />;
      default:
        return <h2>Screen not found</h2>;
    }
  };

  return (
    <div>
      {renderScreen()}
    </div>
  );
}

export default ClientMain;
