import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { fetchFiles } from '../services/getFiles';

export default function FileList() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isDarkMode, colors, toggleTheme } = useTheme();

    useEffect(() => {
        fetchFiles()
            .then(data => {
                setFiles(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching files:', error);
                setError('Failed to load files');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div 
                className="min-h-screen p-8 transition-all duration-500"
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

                <div className="text-center py-16">
                    <p style={{ color: colors.paragraph }}>Loading files...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div 
                className="min-h-screen p-8 transition-all duration-500"
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

                <div className="text-center py-16">
                    <p style={{ color: colors.accent }}>{error}</p>
                </div>
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <div className="text-center py-8">
                <p style={{ color: colors.paragraph }}>No files found</p>
            </div>
        );
    }

    return (
        <div>
            {files.map(file => (
                <div 
                    key={file._id}
                    style={{ 
                        backgroundColor: colors.card,
                        padding: '12px',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div>
                        <div style={{ color: colors.headline, fontWeight: '500' }}>
                            {file.filename}
                        </div>
                        <div style={{ color: colors.paragraph, fontSize: '14px' }}>
                            {(file.size / 1024).toFixed(1)} KB
                        </div>
                    </div>
                    
                    <a
                        href={`http://localhost:3000/api/download/${file._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                            backgroundColor: colors.button,
                            color: colors.buttonText,
                            padding: '8px 16px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}
                    >
                        Download
                    </a>
                </div>
            ))}
        </div>
    );
}