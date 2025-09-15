import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { isAuthenticated } from "../utils/auth";

const Dashboard = () => {
    const navigate = useNavigate();
    const { isDarkMode, colors, toggleTheme } = useTheme();
    const [user, setUser] = useState({ email: '' });

    useEffect(() => {
        if(!isAuthenticated()) {
        navigate('/login');
        return;
    }
        const storedUser = localStorage.getItem('user');
        console.log('Stored user from localStorage:', storedUser);
        if(storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log("Parsed user object:", parsedUser);
            const email = parsedUser.email || '';
            const namePart = email.split('@')[0];
            const capitalized =
                namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();

            setUser({ ...parsedUser, name: capitalized });
        }
        else{
            navigate('/login');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div 
            className="min-h-screen p-6 transition-all duration-500"
            style={{ backgroundColor: colors.bg }}
        >
            {/* Theme Toggle */}
            <div
                className="flex items-center gap-3"
                style={{ 
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    zIndex: 20
                }}
            >
                <span 
                    className="text-sm font-medium"
                    style={{ color: colors.paragraph }}
                >
                    Light
                </span>
                
                <button
                    onClick={toggleTheme}
                    className="relative flex items-center"
                    style={{
                        width: '60px',
                        height: '30px',
                        backgroundColor: colors.button,
                        borderRadius: '15px',
                        padding: '3px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <div
                        className="flex items-center justify-center transition-all duration-300 ease-in-out"
                        style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: colors.buttonText,
                            borderRadius: '50%',
                            transform: isDarkMode ? 'translateX(30px)' : 'translateX(0px)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        <span style={{ 
                            fontSize: '12px',
                            color: colors.button
                        }}>
                            {isDarkMode ? '🌙' : '☀️'}
                        </span>
                    </div>
                </button>
                
                <span 
                    className="text-sm font-medium"
                    style={{ color: colors.paragraph }}
                >
                    Dark
                </span>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto pt-16">
                <h1 
                    className="text-4xl font-bold mb-4"
                    style={{ color: colors.headline }}
                >
                    Hi {user.name}! Welcome
                </h1>
                <p 
                    className="text-xl mb-8"
                    style={{ color: colors.paragraph }}
                >
                    This is your personal cloud dashboard.
                </p>

                {/* Dashboard Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Upload Card */}
                    <div 
                        className="p-6 rounded-xl shadow-lg"
                        style={{ backgroundColor: colors.card }}
                    >
                        <h3 
                            className="text-xl font-semibold mb-3"
                            style={{ color: colors.headline }}
                        >
                            📤 Upload Files
                        </h3>
                        <p 
                            className="mb-4"
                            style={{ color: colors.paragraph }}
                        >
                            Upload new documents and files to your personal cloud storage.
                        </p>
                        <button 
                            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                            style={{ 
                                backgroundColor: colors.button,
                                color: colors.buttonText
                            }}
                            onClick={() => navigate('/upload')}
                        >
                            Upload Files
                        </button>
                    </div>

                    {/* My Files Card */}
                    <div 
                        className="p-6 rounded-xl shadow-lg"
                        style={{ backgroundColor: colors.card }}
                    >
                        <h3 
                            className="text-xl font-semibold mb-3"
                            style={{ color: colors.headline }}
                        >
                            📁 My Files
                        </h3>
                        <p 
                            className="mb-4"
                            style={{ color: colors.paragraph }}
                        >
                            View, organize, and manage all your uploaded files in one place.
                        </p>
                        <button 
                            className="px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300"
                            style={{ 
                                backgroundColor: colors.card,
                                color: colors.button,
                                borderColor: colors.button
                            }}
                            onClick={() => navigate('/my-files')}
                        >
                            View Files
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div 
                    className="p-6 rounded-xl shadow-lg"
                    style={{ backgroundColor: colors.card }}
                >
                    <h3 
                        className="text-xl font-semibold mb-4"
                        style={{ color: colors.headline }}
                    >
                        Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <button 
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                            style={{ 
                                backgroundColor: colors.secondary + '20',
                                color: colors.secondary,
                                border: `1px solid ${colors.secondary}`
                            }}
                            onClick={() => navigate('/upload')}
                        >
                            ⬆️ Quick Upload
                        </button>
                        <button 
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                            style={{ 
                                backgroundColor: colors.secondary + '20',
                                color: colors.secondary,
                                border: `1px solid ${colors.secondary}`
                            }}
                            onClick={() => navigate('/my-files')}
                        >
                            📊 Recent Files
                        </button>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="mt-8 text-center">
                    <button 
                        className="px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                        style={{ 
                            backgroundColor: colors.accent,
                            color: colors.buttonText
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;