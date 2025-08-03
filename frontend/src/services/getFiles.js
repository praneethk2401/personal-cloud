export async function fetchFiles() {
    const res = await fetch('http://localhost:3000/api/files');
    if(!res.ok) throw new Error('Failed to fetch files');
    return res.json();
}