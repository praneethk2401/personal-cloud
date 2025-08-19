import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import MyFilesPage from './pages/MyFilesPage';
import { isAuthenticated } from './utils/auth';

// This component wraps the Router and checks authentication status
// It redirects to the login page if the user is not authenticated
function AppWrapper() {
  return (
      <Routes>
        {/* Public Routes, user is first nteracting with these routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* protected routes, only accessible when the user is authenticated (Registered or logged in) */}
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
// Used the AppWrapper component because we can't useEffect directly in the main App component
// This is because the App component is not a child of the Router, so it doesn't have
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
