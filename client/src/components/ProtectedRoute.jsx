import { useState, useEffect, Children } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3001/session');
                setIsLoggedIn(response.data.isLoggedIn);
            } catch (error) {
                console.error('Gagal memeriksa status login', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    if (loading) {
        return <div>Memeriksa otentikasi...</div>
    }

    // jika sudah login tampilkan halaman yang diminta (children)
    // jika tidak, arahkan ke halaman login
    return isLoggedIn ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;