// For debugging
console.log('Current NODE_ENV:', process.env.NODE_ENV);

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'  // Local development
  : 'https://personal-cloud-backend.onrender.com'; // Production

console.log('Using API Base URL:', API_BASE_URL);

export const API_URLS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  FILES: {
    UPLOAD: `${API_BASE_URL}/api/upload`,
    LIST: `${API_BASE_URL}/api/files`,
  }
};
