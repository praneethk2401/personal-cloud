import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyFilesPage = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

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
            setFiles(data);
        }
        catch (error) {
            console.error('Error fetching files:', error);
            setError('Failed to load files. Please try again later.');
        }
    };

    const handleDownload = async (fileName) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/download/${fileName}`, {
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
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
        catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/api/files/${id}`, {
                method: `DELETE`,
                headers: {
                    Authorization: `Baerer ${token}`
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
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-4">My Files</h1>
            {error && <p className="text-red-500">{error}</p>}
            { files.length === 0 ? (
                <p className="text-gray-500">No files uploaded yet.</p>
            ) : (
                <table className="w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2 text-center">File Name</th>
                            <th className="border px-4 py-2 text-center">Size</th>
                            <th className="border px-4 py-2 text-center">Upload Date</th>
                            <th className="border px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map(file => (
                            <tr key={file._id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2 text-center">{file.filename}</td>
                                <td className="border px-4 py-2 text-center">{(file.size / 1024).toFixed(2)} KB</td>
                                <td className="border px-4 py-2 text-center">{new Date(file.uploadDate).toLocaleDateString()}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button 
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                                        onClick={() => handleDownload(file._id)}>Download
                                    </button>
                                    <button 
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleDelete(file._id)}>Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default MyFilesPage;