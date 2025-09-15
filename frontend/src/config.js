const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://personal-cloud-backend-6u3e.onrender.com' 
  : 'http://localhost:3000';

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
