import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import About from "./About";
import ClientMain from "./pages/Client/ClientMain";
import AdminMain from "./pages/Admin/AdminMain";
import SucursalMain from "./pages/Sucursal/SucursalMain";
import VendedorMain from "./pages/Vendedor/VendedorMain";
import DistribuidorMain from "./pages/Distribuidor/DistribuidorMain";
import ProtectedRoute from "../PrivateRoute"; // Import the ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminMain />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Cliente']} />}>
          <Route path="/client" element={<ClientMain />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Sucursal']} />}>
          <Route path="/sucursal" element={<SucursalMain />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Proveedor']} />}>
          <Route path="/dist" element={<DistribuidorMain />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Vendedor']} />}>
          <Route path="/vendedor" element={<VendedorMain />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./Login";
// import Home from "./Home";
// import About from "./About";
// import ClientMain from "./pages/Client/ClientMain";
// import AdminMain from "./pages/Admin/AdminMain";
// import SucursalMain from "./pages/Sucursal/SucursalMain";

// import VendedorMain from "./pages/Vendedor/VendedorMain";
// import DistribuidorMain from "./pages/Distribuidor/DistribuidorMain"

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} />

//         <Route path="/about" element={<About />} />
//         <Route path="/client" element={<ClientMain />} />
//        <Route path="/admin" element={<AdminMain />} />
//         <Route path="/sucursal" element={<SucursalMain />} /> 
//         <Route path="/vendedor" element={<VendedorMain />} />
//         <Route path="/dist" element={<DistribuidorMain />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
