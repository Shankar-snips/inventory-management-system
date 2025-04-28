import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../Utils/utils';
import styles from './Signup.module.css'; // Notice!!

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        dob: '',
        designation: ''
    });

    const API_URL = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            const { success, message, error } = result;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                handleError(error);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message || 'Signup failed');
        }
    };

    return (
        <>
            <div className={styles.signupContainer}>
                <h1 className={styles.signupTitle}>Signup</h1>
                <form onSubmit={handleSignup}>
                    <div className={styles.signupFormGroup}>
                        <label className={styles.signupLabel}>Name</label>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className={styles.signupInput}
                            required
                        />
                    </div>
                    <div className={styles.signupFormGroup}>
                        <label className={styles.signupLabel}>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={styles.signupInput}
                            required
                        />
                    </div>
                    <div className={styles.signupFormGroup}>
                        <label className={styles.signupLabel}>Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className={styles.signupInput}
                            required
                        />
                    </div>
                    <div className={styles.signupFormGroup}>
                        <label className={styles.signupLabel}>Phone</label>
                        <input
                            name="phone"
                            type="text"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className={styles.signupInput}
                            required
                        />
                    </div>
                    <div className={styles.signupFormGroup}>
                        <label className={styles.signupLabel}>Date of Birth</label>
                        <input
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            className={styles.signupInput}
                            required
                        />
                    </div>
                    <div className={styles.signupFormGroup}>
                        <label className={styles.signupLabel}>Designation</label>
                        <input
                            name="designation"
                            type="text"
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="Enter your designation"
                            className={styles.signupInput}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.signupButton}>Signup</button>
                    <span className={styles.signupSpan}>
                        Already have an account? <Link to="/login" className={styles.signupLink}>Login</Link>
                    </span>
                </form>
            </div>
        </>
    );
}

export default Signup;
