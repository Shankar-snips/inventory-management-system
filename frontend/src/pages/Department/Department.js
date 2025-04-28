import React, { useCallback, useEffect, useState } from 'react';
import { handleError, handleSuccess } from '../../Utils/utils';
import Navbar from '../../component/navbar/Navbar';
import styles from './Department.module.css';

function Department() {
    const [departments, setDepartments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [originalDepartmentId, setOriginalDepartmentId] = useState(null);
    const [inputData, setInputData] = useState({
        departmentId: '',
        departmentName: ''
    });
    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchDepartments = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/department/read`);
            const data = await res.json();
            setDepartments(data?.data || []);
            console.log(data)
        } catch (err) {
            handleError("Failed to fetch departments");
        }
    }, [API_URL]);

    const handleEdit = (dept) => {
        setIsEditing(true);
        setOriginalDepartmentId(dept.departmentId);
        setInputData({
            departmentId: dept.departmentId,
            departmentName: dept.departmentName
        });
    };

    const handleDelete = async (departmentId) => {
        try {
            const res = await fetch(`${API_URL}/api/department/delete/${departmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ departmentId })
            });

            const result = await res.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                fetchDepartments();
            } else {
                handleError(error);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isEditing
            ? `${API_URL}/api/department/update/${originalDepartmentId}`
            : `${API_URL}/api/department/create`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputData)
            });

            const result = await res.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(isEditing ? message : message);
                setInputData({ departmentId: '', departmentName: '' });
                setIsEditing(false);
                setOriginalDepartmentId(null);
                fetchDepartments();
            } else {
                handleError(error)
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    return (
        <>
            <Navbar />

            <form className={styles.formContainer} onSubmit={handleSubmit}>
                {[
                    { label: 'Department ID', name: 'departmentId', type: 'text', placeholder: 'Enter Department ID' },
                    { label: 'Department Name', name: 'departmentName', type: 'text', placeholder: 'Enter Department Name' }
                ].map((field, index) => (
                    <div key={index} className={styles.formGroup}>
                        <label className={styles.label}>{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={inputData[field.name]}
                            onChange={handleChange}
                            className={styles.inputBox}
                        />
                    </div>
                ))}

                <button type="submit" className={styles.submitButton}>
                    {isEditing ? 'Update' : 'Submit'}
                </button>

            </form>

            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Department ID</th>
                        <th>Department Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((dept) => (
                        <tr key={dept._id}>
                            <td>{dept.departmentId}</td>
                            <td>{dept.departmentName}</td>
                            <td>
                                <button onClick={() => handleEdit(dept)} className={styles.editButton}>Edit</button>
                                <button onClick={() => handleDelete(dept.departmentId)} className={styles.deleteButton}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );

}

export default Department;
