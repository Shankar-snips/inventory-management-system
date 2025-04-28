import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../Utils/utils';
import './EditProfile.css'

function EditProfile() {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUser = async () => {

            const res = await fetch(`${API_URL}/api/users/getuser`, {

                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            setFormData(data);
        };

        fetchUser();
    }, [API_URL]);

    const handleChange = e => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${API_URL}/api/users/updateuser`, {

            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        const { success, message, error } = result;
        if (success) {
            handleSuccess(message);
            setTimeout(() => {
                navigate('/profile');
            }, 1000);
        } else {
            handleError(error);
        }
    };

    return (
        <>
            <form className="edit-profile-form" onSubmit={handleSubmit}>
                <h2>Edit Profile</h2>
                <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" />
                <input name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Phone" />
                <input name="dob" type="date" value={formData.dob || ''} onChange={handleChange} />
                <input name="designation" value={formData.designation || ''} onChange={handleChange} placeholder="Designation" />
                <button type="submit">Save Changes</button>
            </form>
        </>
    );
}

export default EditProfile;
