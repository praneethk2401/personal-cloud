import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadPage from "./UploadPage";

const DashboardPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ email: '' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if(storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const email = parsedUser.email || '';
            const namePart = email.split('@')[0]; // get 'vine' from vine@example.com
            const capitalized =
                namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase(); // 'Vine'

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
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Hi {user.name}! Welcome</h1>
            <p className="text-lg mb-6">This is your personal cloud dashboard.</p>

            <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">View your files</li>
                <li className="mb-2">Upload new files
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2"
                        onClick={() => navigate('/upload')}>Upload
                    </button>
                </li>
                <li className="mb-2">My Files
                    <button 
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-2"
                        onClick={() => navigate('/my-files')}>View Files
                    </button>
                </li>
            </ul>
            {/* ⬇️ Upload section embedded here ⬇️ */}
            <button 
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default DashboardPage;