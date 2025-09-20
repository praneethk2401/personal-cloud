import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { API_URLS } from '../config';

// Password Input Component with Toggle (same as LoginPage)
const PasswordInput = ({ value, onChange, placeholder, colors, required = false }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full p-4 pr-12 rounded-lg border transition-all duration-300"
                style={{ 
                    backgroundColor: colors.bg,
                    borderColor: colors.paragraph + '40',
                    color: colors.headline
                }}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg transition-all duration-300 hover:opacity-70"
                style={{ 
                    color: colors.paragraph,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? '🙈' : '👁️'}
            </button>
        </div>
    );
};

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { isDarkMode, colors, toggleTheme } = useTheme();

    const handleRegister = async (event) => {
        event.preventDefault();
        
        // Password confirmation validation
        if (password !== confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }

        // Basic password strength validation
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        try {
            const res = await fetch(API_URLS.AUTH.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if(res.ok) {
                setMessage('Registration successful! You can now log in.');
                setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
            }
            else {
                setMessage(`Registration failed: ${data.message}`);
            }
        }
        catch (error) {
            console.error('Registration error:', error);
            setMessage('Registration failed due to an error');
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

            {/* Register Form */}
            <div 
                className="w-full max-w-md p-8 rounded-2xl shadow-xl"
                style={{ backgroundColor: colors.card }}
            >
                <div className="text-center mb-8">
                    <h1 
                        className="text-3xl font-bold mb-2"
                        style={{ color: colors.headline }}
                    >
                        Join Personal Cloud
                    </h1>
                    <p 
                        className="text-sm"
                        style={{ color: colors.paragraph }}
                    >
                        Create your account to get started with secure file storage
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
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
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create Password"
                            colors={colors}
                            required={true}
                        />
                    </div>

                    <div>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            colors={colors}
                            required={true}
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
                        Create Account
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
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="font-semibold underline transition-all duration-300"
                            style={{ color: colors.button }}
                        >
                            Sign in here
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

                {/* Terms notice */}
                <div className="mt-6 text-center">
                    <p 
                        className="text-xs"
                        style={{ color: colors.paragraph + '80' }}
                    >
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;