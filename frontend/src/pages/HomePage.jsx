import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-50 p-6">
            <h1 className="text-4xl font-bold mb-4">Welcome to Personal Cloud</h1>
            <p className="text-lg mb-6">Your personal cloud storage solution.</p>

            <div className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                <h2 className="text-2xl mb-4">Get Started</h2>
                <p className="mb-4">Please login to access your personal cloud dashboard.</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => navigate('/login')}>Login</button>

                <p className="mb-4">Please register to to start your cloud storage.</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ml-4"
                onClick={() => navigate('/register')}>Register</button>
            </div>
        </div>
    );
};

export default HomePage;