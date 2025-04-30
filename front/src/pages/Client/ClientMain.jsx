import React from "react";
import { useState, useEffect } from "react";
import PedidosDist from "./PedidosDist";

function ClientMain() {
  const [activeScreenClient, setActiveScreenClient] = useState("pedidosDist");

  const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/"; // Redirect if no token
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/protectedRoute", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    window.location.href = "/"; // Redirect to login page
  };

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
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: "10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
       Cerrar sesión
      </button>
      {renderScreen()}
    </div>
  );
}

export default ClientMain;
