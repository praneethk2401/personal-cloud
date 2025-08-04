import { useEffect, useState } from 'react';
import { fetchFiles } from '../services/getFiles';

export default function FileList() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);   // Add loading state
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFiles()
            .then(data => {
                setFiles(data);
                setLoading(false); // Hide loading after data is fetched
            })
            .catch(error => {
                console.error('Error fetching files:', error);
                setError('Failed to load files');
                setLoading(false);  // Hide loading even on error
            });
    }, []);

    if(loading) return <p>Loading files...</p> // Show loading state
    if(error) return <p style={{ color: 'red'}}>error</p>;

    if(error) return <p>{error}</p>;
    return (
        <ul className='file-list'>
            {files.map(f => (
                <li key={f._id} className='file-item'>
                    <span>{f.filename}</span>
                    <span>{(f.size / 1024).toFixed(1)} KB
                        {' '}

                        <a
                            href = {`http://localhost:3000/api/download/${f._id}`} // This points to the download route
                            traget="_blank" // This open the file in a new tab so that browsers can handle the file download
                            rel="noopener noreferrer" // This is a security best practice
                        >
                            <button className='download-btn'>Download</button>
                        </a>
                    </span>
                </li>
            ))}
        </ul>
    );
}