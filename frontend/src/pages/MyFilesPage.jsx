import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const MyFilesPage = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isDarkMode, colors, toggleTheme } = useTheme();

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/files', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!res.ok) {
                throw new Error('Failed to fetch files');
            }

            const data = await res.json();
            setFiles(data.data || data);
        }
        catch (error) {
            console.error('Error fetching files:', error);
            setError('Failed to load files. Please try again later.');
        }
    };

    const handleDownload = async (fileId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/download/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!res.ok) {
                throw new Error('Failed to download file');
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/api/files/${id}`, {
                method: `DELETE`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(res.ok) {
                setFiles(files.filter(file => file._id !== id));
            }
            else {
                alert('Failed to delete file');
            }
        }
        catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file');
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

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
            <div className="max-w-6xl mx-auto pt-16">
                <div className="flex items-center justify-between mb-8">
                    <h1 
                        className="text-3xl font-bold"
                        style={{ color: colors.headline }}
                    >
                        📁 My Files
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/upload')}
                            className="px-6 py-2 rounded-lg font-medium transition-all duration-300"
                            style={{ 
                                backgroundColor: colors.button,
                                color: colors.buttonText
                            }}
                        >
                            📤 Upload New
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

                {error && (
                    <div 
                        className="p-4 rounded-lg mb-6"
                        style={{ 
                            backgroundColor: colors.accent + '20',
                            color: colors.accent,
                            border: `1px solid ${colors.accent}`
                        }}
                    >
                        {error}
                    </div>
                )}

                {files.length === 0 ? (
                    <div 
                        className="text-center p-12 rounded-xl"
                        style={{ backgroundColor: colors.card }}
                    >
                        <div className="text-6xl mb-4">📂</div>
                        <h3 
                            className="text-xl font-semibold mb-2"
                            style={{ color: colors.headline }}
                        >
                            No files uploaded yet
                        </h3>
                        <p 
                            className="mb-6"
                            style={{ color: colors.paragraph }}
                        >
                            Start by uploading your first file to your personal cloud
                        </p>
                        <button
                            onClick={() => navigate('/upload')}
                            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                            style={{ 
                                backgroundColor: colors.button,
                                color: colors.buttonText
                            }}
                        >
                            Upload First File
                        </button>
                    </div>
                ) : (
                    <div 
                        className="rounded-xl overflow-hidden shadow-lg"
                        style={{ backgroundColor: colors.card }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ backgroundColor: colors.button + '10' }}>
                                        <th 
                                            className="px-6 py-4 text-left font-semibold"
                                            style={{ color: colors.headline }}
                                        >
                                            📄 File Name
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-center font-semibold"
                                            style={{ color: colors.headline }}
                                        >
                                            📏 Size
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-center font-semibold"
                                            style={{ color: colors.headline }}
                                        >
                                            📅 Upload Date
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-center font-semibold"
                                            style={{ color: colors.headline }}
                                        >
                                            ⚡ Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file, index) => (
                                        <tr 
                                            key={file._id} 
                                            className="border-t transition-all duration-200"
                                            style={{ 
                                                borderColor: colors.paragraph + '20',
                                                backgroundColor: index % 2 === 0 ? colors.card : colors.bg + '50'
                                            }}
                                        >
                                            <td 
                                                className="px-6 py-4"
                                                style={{ color: colors.headline }}
                                            >
                                                <div className="font-medium">
                                                    {file.originalName || file.filename}
                                                </div>
                                            </td>
                                            <td 
                                                className="px-6 py-4 text-center"
                                                style={{ color: colors.paragraph }}
                                            >
                                                {(file.size / 1024).toFixed(2)} KB
                                            </td>
                                            <td 
                                                className="px-6 py-4 text-center"
                                                style={{ color: colors.paragraph }}
                                            >
                                                {new Intl.DateTimeFormat('en-GB').format(new Date(file.uploadDate || file.createdAt))}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                                                        style={{ 
                                                            backgroundColor: colors.button,
                                                            color: colors.buttonText
                                                        }}
                                                        onClick={() => handleDownload(file._id)}
                                                    >
                                                        ⬇️ Download
                                                    </button>
                                                    <button 
                                                        className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                                                        style={{ 
                                                            backgroundColor: colors.accent,
                                                            color: colors.buttonText
                                                        }}
                                                        onClick={() => handleDelete(file._id)}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {files.length > 0 && (
                    <div 
                        className="mt-6 p-4 rounded-lg text-center"
                        style={{ 
                            backgroundColor: colors.secondary + '10',
                            color: colors.secondary,
                            border: `1px solid ${colors.secondary + '30'}`
                        }}
                    >
                        📊 Total Files: {files.length} | Total Size: {(files.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(2)} KB
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyFilesPage;