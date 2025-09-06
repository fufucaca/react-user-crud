import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate() // Hook untuk navigasi

    const handleLogin = async e => {
        e.preventDefault();
        setError(''); // reset pesan error setiap kali mencoba login

        try {
            // ambil data admin dari server 
            const response = await axios.get('http://localhost:3001/admin');
            const adminCredential = response.data;
            // bandingkan input dengan data di server
            if (email === adminCredential.email && password === adminCredential.password) {
                await axios.patch('http://localhost:3001/session', { isLoggedIn: true});
                // arahkan pengguna ke halaman utama (Dashboard)
                navigate('/');
            } else {
                // jika kredensial salah 
                setError('Email atau Password salah.');
            }
        } catch (err) {
            setError('Gagal Menghubungkan ke server.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h1 className="text-2xl font-bold text-center mb-6">Login Admin</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input 
                type="text"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                <input 
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
                />
              </div>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">
                Login
              </button>
            </form>
          </div>
        </div>
    );
}

export default LoginPage;