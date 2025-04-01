import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token
        navigate("/login"); // Redirect to login page
    };

    return (
        <div>
            <h1>Home</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
