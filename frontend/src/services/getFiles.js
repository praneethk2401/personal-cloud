export async function fetchFiles() {
  const token = localStorage.getItem('token');
  
  const res = await fetch('http://localhost:3000/api/files', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch files');
  }

  return await res.json();
}
