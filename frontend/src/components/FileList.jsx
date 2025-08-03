import { useEffect, useState } from 'react';
import { fetchFiles } from '../services/getFiles';

export default function FileList() {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFiles()
            .then(setFiles)
            .catch(() => setError('Failed to load files'));
    }, []);

    if(error) return <p>{error}</p>;
    return (
        <ul>
            {files.map(f => (
                <li key={f._id}>
                    {f.filename} ({(f.size / 1024).toFixed(1)} KB)
                </li>
            ))}
        </ul>
    );
}