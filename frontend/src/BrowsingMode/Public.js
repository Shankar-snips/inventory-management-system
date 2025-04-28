import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Public() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/api/users/loggedin`, {
                    headers: {
                        'Content-Type': 'application/json',
                        // Include other headers like Authorization if needed
                    },
                    credentials: 'include',
                });
                const status = await response.json();
                setIsLoggedIn(status.success); // 🛠️ FIXED
            } catch (err) {
                console.error("Login check failed:", err);
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, [location.pathname, API_URL]);

    useEffect(() => {
        if (isLoggedIn === true && (location.pathname === '/login' || location.pathname === '/signup')) {
            navigate('/home');
        }
    }, [isLoggedIn, location.pathname, navigate]);

    return null;
}

export default Public;
