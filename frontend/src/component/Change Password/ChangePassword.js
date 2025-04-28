import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../Utils/utils';
import './ChangePassword.css'

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/users/changepassword`, {

            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ oldPassword, password })
        });

        const result = await response.json();
        console.log("Result from API:", result);
        const { success, message, error } = result;
        if (success) {
            handleSuccess(message); // Should trigger toast
            setTimeout(() => {
                navigate('/profile');
            }, 1000); // Let the toast show before redirect
        } else {
            handleError(error);
        }
    };

    return (
        <>
            <form className="change-password-form" onSubmit={handleSubmit}>
                <h2>Change Password</h2>
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Old Password" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" />
                <button type="submit">Change Password</button>
            </form>
        </>
    );
}

export default ChangePassword;
