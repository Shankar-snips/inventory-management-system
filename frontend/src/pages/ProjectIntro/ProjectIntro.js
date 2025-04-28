import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ProjectIntro.module.css'; // 👈 importing CSS module

const ProjectIntro = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const checkLoggedInStatus = async () => {
            try {
                const res = await fetch(`${API_URL}/api/users/loggedin`, {
                    credentials: 'include',
                });
                const data = await res.json();
                console.log(data); // will show { success: true/false }

                if (data.success) {  // <-- Check `success`
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                toast.error('Failed to verify login status');
                setIsLoggedIn(false);
            }
        };

        checkLoggedInStatus();
    }, [API_URL]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <>
            <div className={styles.container}>
                <h1>🚀 Welcome to Inventory Management System</h1>
                <p className={styles.subheading}>
                    <strong>Smart. Organized. Efficient.</strong>
                </p>
                <p className={styles.description}>
                    This platform streamlines inventory control, departmental coordination, and supplier management —
                    designed to help your organization stay organized and efficient every day.
                </p>
                <p className={styles.motto}>
                    Stay in control. Stay ahead.
                </p>

                <div className={styles.buttonContainer}>
                    {isLoggedIn === null ? (
                        <p>Checking login status...</p>
                    ) : isLoggedIn ? (
                        <button onClick={() => handleNavigation('/home')} className={styles.button}>
                            Go to Home
                        </button>
                    ) : (
                        <>
                            <button onClick={() => handleNavigation('/login')} className={styles.button}>
                                Login
                            </button>
                            <button onClick={() => handleNavigation('/signup')} className={styles.button}>
                                Signup
                            </button>
                        </>
                    )}
                </div>

            </div>
        </>
    );
};

export default ProjectIntro;
