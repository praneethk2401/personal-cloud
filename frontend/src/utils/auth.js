export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if(!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        return Date.now() < expiry; // Check if the token is still valid
    }
    catch (error) {
        console.error('Error parsing token:', error);
        return false; // If there's an error, treat as not authenticated
    }
};