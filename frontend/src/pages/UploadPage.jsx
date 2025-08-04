import { useState } from 'react';
import FileList from '../components/FileList';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [messsage, setMessage] = useState('');

    // TODO: Handle File change, handle submit
    function handleFileChange(event) {
        console.log('File selected:', event.target.files[0]);
        setFile(event.target.files[0]);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log('Submitting file:', file);
        if(!file) return setMessage('Please select a file first to uplaod');

        const formData = new FormData();
        formData.append('file', file);

        try{
            const res = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if(res.ok) setMessage('Upload successful');
            else setMessage(`Upload failed: ${data.message}`);
        }
        catch(error) {
            console.error('Upload error:', error);
            setMessage('Upload failed due to an error');
        }
    }


    return (
        <div className='container'>
            <h1>Upload a File</h1>
            <form className='upload-form' onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {messsage && <p className='message'>{messsage}</p>}
            {/* Display the list of uploaded files */}
            <FileList />
        </div>
    );
}