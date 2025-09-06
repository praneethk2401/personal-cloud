import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import MyFilesPage from './pages/MyFilesPage';
import { isAuthenticated } from './utils/auth';
import './index.css';

// This component wraps the Router and checks authentication status
function AppWrapper() {
  return (
      <Routes>
        {/* Public Routes, user is first interacting with these routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* protected routes, only accessible when the user is authenticated */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/upload" 
          element={isAuthenticated() ? <UploadPage /> : <Navigate to="/login" replace />} 
        />
        <Route
          path="/my-files" 
          element={isAuthenticated() ? <MyFilesPage /> : <Navigate to="/login" replace />} 
        />

        {/* Catch all unknown routes and navigate back to Homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppWrapper />
      </Router>
    </ThemeProvider>
  );
}

export default App;