import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { setToken, setUser } from '../utils/auth';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { isDarkMode, colors, toggleTheme } = useTheme();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if(res.ok) {
                console.log("res.ok:", res.ok);
                console.log("data:", data);
                setToken(data.token);
                setUser(data.user);
                setMessage('Login successful! Redirecting to dashboard...');
                console.log('Navigating to dashboard');
                navigate('/dashboard');
            }
            else {
                setMessage(`Login failed: ${data.message || data.error}`);
            }
        }
        catch (error) {
            console.error('Login error:', error);
            setMessage('Login failed due to an error');
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-6 transition-all duration-500"
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

            {/* Login Form */}
            <div 
                className="w-full max-w-md p-8 rounded-2xl shadow-xl"
                style={{ backgroundColor: colors.card }}
            >
                <div className="text-center mb-8">
                    <h1 
                        className="text-3xl font-bold mb-2"
                        style={{ color: colors.headline }}
                    >
                        Welcome Back
                    </h1>
                    <p 
                        className="text-sm"
                        style={{ color: colors.paragraph }}
                    >
                        Sign in to access your personal cloud
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-4 rounded-lg border transition-all duration-300"
                            style={{ 
                                backgroundColor: colors.bg,
                                borderColor: colors.paragraph + '40',
                                color: colors.headline
                            }}
                        />
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-4 rounded-lg border transition-all duration-300"
                            style={{ 
                                backgroundColor: colors.bg,
                                borderColor: colors.paragraph + '40',
                                color: colors.headline
                            }}
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300"
                        style={{ 
                            backgroundColor: colors.button,
                            color: colors.buttonText
                        }}
                    >
                        Sign In
                    </button>
                </form>

                {message && (
                    <div 
                        className="mt-4 p-3 rounded-lg text-center text-sm"
                        style={{ 
                            backgroundColor: message.includes('successful') ? colors.secondary + '20' : colors.accent + '20',
                            color: message.includes('successful') ? colors.secondary : colors.accent,
                            border: `1px solid ${message.includes('successful') ? colors.secondary : colors.accent}`
                        }}
                    >
                        {message}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <p 
                        className="text-sm"
                        style={{ color: colors.paragraph }}
                    >
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="font-semibold underline transition-all duration-300"
                            style={{ color: colors.button }}
                        >
                            Sign up here
                        </button>
                    </p>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 text-sm underline transition-all duration-300"
                        style={{ color: colors.paragraph }}
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;