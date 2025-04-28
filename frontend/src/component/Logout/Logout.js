import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../Utils/utils';
import { FiLogOut } from 'react-icons/fi'; // 👈 Importing a logout icon
import styles from './Logout.module.css';

function Logout() {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleLogout = async () => {
        try {
            const url = `${API_URL}/api/users/logout`;
            const response = await fetch(url, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.removeItem('token');
                localStorage.removeItem('loggedInUser');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else if (error) {
                handleError(error);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <>
            <div>
                <button className={styles['logout-button']} onClick={handleLogout}>
                    <FiLogOut size={20} /> {/* 👈 Logout icon instead of text */}
                </button>
            </div>
        </>
    );
}

export default Logout;
