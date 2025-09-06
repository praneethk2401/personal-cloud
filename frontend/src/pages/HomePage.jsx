import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { isAuthenticated } from "../utils/auth";

const HomePage = () => {
    const navigate = useNavigate();
    const { isDarkMode, colors, toggleTheme } = useTheme();
    
    useEffect(() => {
        if(isAuthenticated()) {
            navigate('/dashboard');
        }
    }, []);

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-6 transition-all duration-500"
            style={{ backgroundColor: colors.bg }}
        >
            {/* Smooth Toggle Switch - Fixed positioning */}
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

            <div className="text-center max-w-4xl mx-auto">
                {/* Main heading */}
                <h1 
                    className="text-5xl md:text-6xl font-bold mb-6"
                    style={{ color: colors.headline }}
                >
                    Personal Cloud
                </h1>
                
                <p 
                    className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
                    style={{ color: colors.paragraph }}
                >
                    Your secure, intelligent document storage solution. Upload, organize, and access your files anywhere.
                </p>

                {/* CTA Section */}
                <div 
                    className="rounded-2xl p-8 shadow-xl max-w-md mx-auto"
                    style={{ backgroundColor: colors.card }}
                >
                    <h2 
                        className="text-2xl font-bold mb-6"
                        style={{ color: colors.headline }}
                    >
                        Get Started Today
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <p 
                                className="mb-3"
                                style={{ color: colors.paragraph }}
                            >
                                Already have an account?
                            </p>
                            <button 
                                className="w-full font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                                style={{ 
                                    backgroundColor: colors.button,
                                    color: colors.buttonText
                                }}
                                onClick={() => navigate('/login')}
                            >
                                Sign In to Your Cloud
                            </button>
                        </div>

                        <div className="my-4">
                            <div 
                                className="h-px w-full"
                                style={{ backgroundColor: colors.paragraph + '30' }}
                            ></div>
                            <div className="text-center -mt-3">
                                <span 
                                    className="px-4 text-sm"
                                    style={{ 
                                        backgroundColor: colors.card,
                                        color: colors.paragraph
                                    }}
                                >
                                    or
                                </span>
                            </div>
                        </div>

                        <div>
                            <p 
                                className="mb-3"
                                style={{ color: colors.paragraph }}
                            >
                                New to Personal Cloud?
                            </p>
                            <button 
                                className="w-full font-semibold py-3 px-6 rounded-xl border-2 transition-all duration-300"
                                style={{ 
                                    backgroundColor: colors.card,
                                    color: colors.button,
                                    borderColor: colors.button
                                }}
                                onClick={() => navigate('/register')}
                            >
                                Create Free Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer text */}
                <p 
                    className="text-sm mt-8"
                    style={{ color: colors.paragraph }}
                >
                    Join thousands of users who trust Personal Cloud with their important files
                </p>
            </div>
        </div>
    );
};

export default HomePage;