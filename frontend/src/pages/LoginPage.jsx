import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/Login', {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if(res.ok) {
                console.log("res.ok:", res.ok);
                console.log("data:", data);
                localStorage.setItem('token', data.token); // Store the JWT token in local storage
                console.log("Storing user data in local storage");
                localStorage.setItem('user', JSON.stringify(data.user)); // Store the JWT token in local storage
                setMessage('Login successful! Redirecting to home page...');
                console.log('Navigating to dashboard');
                window.location.replace('/dashboard'); // Redirect to home page after successful login
            }
            else {
                setMessage(`Login failed: ${data.message}`);
            }
        }
        catch (error) {
            console.error('Login error:', error);
            setMessage('Login failed due to an error');
        }
    };

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    )
}

export default LoginPage;