import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function Private() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {

                const response = await fetch(`${API_URL}/api/users/loggedin`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include other headers like Authorization if needed
                    },
                    credentials: 'include',
                });
                const status = await response.json();
                console.log(status)
                setIsLoggedIn(status.success); // 🛠️ FIXED
            } catch (error) {
                console.error('Login check failed', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, [API_URL]);

    if (loading) return <p>Loading...</p>;

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default Private;
