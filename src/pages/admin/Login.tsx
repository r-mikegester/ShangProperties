// src/pages/Login.tsx

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase/firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => { 
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/messages');
        } catch (err) {
            alert('Login failed. Check your credentials.');
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
                required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Login
            </button>
        </form>
    );
};

export default Login;
