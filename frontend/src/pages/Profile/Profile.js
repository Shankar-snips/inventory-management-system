import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../component/navbar/Navbar';
import styles from './Profile.module.css'; // Assuming you import the CSS module

function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`${API_URL}/api/users/getuser`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            setUser(data);
        };

        fetchUser();
    }, [API_URL]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <Navbar />
            <div className={styles.profileContainer}>
                <h2 className={styles.profileTitle}>User Profile</h2>
                {user && (
                    <div className={styles.profileInfo}>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>DOB:</strong> {formatDate(user.dob)}</p>
                        <p><strong>Designation:</strong> {user.designation}</p>
                    </div>
                )}
                <div className={styles.profileActions}>
                    <button onClick={() => navigate('/editprofile')}>Edit Profile</button>
                    <button onClick={() => navigate('/changepassword')}>Change Password</button>
                </div>
            </div>
        </>
    );
}

export default Profile;
