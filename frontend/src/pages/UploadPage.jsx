import { useState, useEffect } from 'react';
import FileList from '../components/FileList';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { isAuthenticated } from '../utils/auth';
import { API_URLS } from '../config';

export default function UploadPage() {
    const navigate = useNavigate();
    const { isDarkMode, colors, toggleTheme } = useTheme();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if(!isAuthenticated()) {
            navigate('/login');
        }
    }, []);

    function handleFileChange(event) {
        console.log('File selected:', event.target.files[0]);
        setFile(event.target.files[0]);
        setMessage(''); // Clear previous messages
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log('Submitting file:', file);
        if(!file) return setMessage('Please select a file first to upload');

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try{
            const res = await fetch(API_URLS.FILES.UPLOAD, {
                method: 'POST',
headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                },
                body: formData,
            });
            const data = await res.json();
            if(res.ok) {
                setMessage('Upload successful!');
                setFile(null);
                // Reset file input
                const fileInput = document.querySelector('input[type="file"]');
                if(fileInput) fileInput.value = '';
            }
            else setMessage(`Upload failed: ${data.message}`);
        }
        catch(error) {
            console.error('Upload error:', error);
            setMessage('Upload failed due to an error');
        } finally {
            setIsUploading(false);
        }
    }

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

            {/* Main Content */}
            <div className="max-w-4xl mx-auto pt-16">
                <div className="flex items-center justify-between mb-8">
                    <h1 
                        className="text-3xl font-bold"
                        style={{ color: colors.headline }}
                    >
                        📤 Upload Files
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/my-files')}
                            className="px-6 py-2 rounded-lg font-medium transition-all duration-300"
                            style={{ 
                                backgroundColor: colors.button,
                                color: colors.buttonText
                            }}
                        >
                            📁 My Files
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 rounded-lg border-2 font-medium transition-all duration-300"
                            style={{ 
                                backgroundColor: colors.card,
                                color: colors.button,
                                borderColor: colors.button
                            }}
                        >
                            ← Dashboard
                        </button>
                    </div>
                </div>

                {/* Upload Card */}
                <div 
                    className="p-8 rounded-xl shadow-lg mb-8"
                    style={{ backgroundColor: colors.card }}
                >
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">☁️</div>
                        <h2 
                            className="text-2xl font-bold mb-2"
                            style={{ color: colors.headline }}
                        >
                            Upload Your Files
                        </h2>
                        <p 
                            style={{ color: colors.paragraph }}
                        >
                            Choose a file from your device to upload to your personal cloud
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center">
                            <input 
                                type="file" 
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                                disabled={isUploading}
                            />
                            <label 
                                htmlFor="file-upload"
                                className="cursor-pointer p-8 border-2 border-dashed rounded-xl w-full text-center transition-all duration-300"
                                style={{ 
                                    borderColor: file ? colors.button : colors.paragraph + '40',
                                    backgroundColor: file ? colors.button + '10' : colors.bg,
                                    color: file ? colors.button : colors.paragraph
                                }}
                            >
                                {file ? (
                                    <div>
                                        <div className="text-2xl mb-2">✅</div>
                                        <div className="font-semibold">{file.name}</div>
                                        <div className="text-sm mt-1">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-2xl mb-2">📁</div>
                                        <div className="font-semibold">Click to select a file</div>
                                        <div className="text-sm mt-1">or drag and drop here</div>
                                    </div>
                                )}
                            </label>
                        </div>

                        <button 
                            type="submit"
                            disabled={!file || isUploading}
                            className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300"
                            style={{ 
                                backgroundColor: (!file || isUploading) ? colors.paragraph + '40' : colors.button,
                                color: colors.buttonText,
                                cursor: (!file || isUploading) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isUploading ? '⏳ Uploading...' : '🚀 Upload File'}
                        </button>
                    </form>

                    {message && (
                        <div 
                            className="mt-6 p-4 rounded-lg text-center"
                            style={{ 
                                backgroundColor: message.includes('successful') ? colors.secondary + '20' : colors.accent + '20',
                                color: message.includes('successful') ? colors.secondary : colors.accent,
                                border: `1px solid ${message.includes('successful') ? colors.secondary : colors.accent}`
                            }}
                        >
                            {message}
                        </div>
                    )}
                </div>

                {/* FileList Component */}
                <div 
                    className="rounded-xl shadow-lg overflow-hidden"
                    style={{ backgroundColor: colors.card }}
                >
                    <div 
                        className="p-6 border-b"
                        style={{ borderColor: colors.paragraph + '20' }}
                    >
                        <h3 
                            className="text-xl font-bold"
                            style={{ color: colors.headline }}
                        >
                            📋 Recent Uploads
                        </h3>
                    </div>
                    <div className="p-6">
                        <FileList />
                    </div>
                </div>
            </div>
        </div>
    );
}