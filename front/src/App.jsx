import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import About from "./About";
import ClientMain from "./pages/Client/ClientMain";
import PrivateRoute from "../PrivateRoute"; // Corrected the import path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Wrap protected routes with PrivateRoute */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/client"
          element={
            <PrivateRoute>
              <ClientMain />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
