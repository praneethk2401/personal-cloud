import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch ('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if(res.ok) {
                setMessage('Registration successful! You can now log in.');
                navigate('/login'); // Redirect to login page after successful registration
            }
            else {
                setMessage(`Registration failed: ${data.message}`);
            }
        }
        catch (error) {
            console.error('Registration error:', error);
            setMessage('Registration failed due to an error');
        }
    };

    return (
        <div className="container">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Register</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default RegisterPage;