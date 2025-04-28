import React, { useCallback, useEffect, useState } from 'react';
import { handleError, handleSuccess } from '../../Utils/utils';
import Navbar from '../../component/navbar/Navbar';
import styles from './Item.module.css'

function Items() {
    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [originalItemId, setOriginalItemId] = useState(null);
    const [formData, setFormData] = useState({
        item_id: '',
        item_name: '',
        item_type: '',
        department_id: ''
    });
    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchItems = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/items/read`);
            const data = await res.json();
            setItems(data?.data || []);
        } catch (err) {
            handleError("Failed to fetch items");
        }
    }, [API_URL]);

    const handleEdit = (item) => {
        setIsEditing(true);
        setOriginalItemId(item._id);
        setFormData({
            item_id: item.item_id,
            item_name: item.item_name,
            item_type: item.item_type,
            department_id: item.department_id
        });
    };

    const handleDelete = async (_id) => {
        try {
            const res = await fetch(`${API_URL}/api/items/delete/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _id })
            });

            const result = await res.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                fetchItems();
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
            ? `${API_URL}/api/items/update/${originalItemId}`
            : `${API_URL}/api/items/create`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(isEditing ? message : message);
                setFormData({
                    item_id: '',
                    item_name: '',
                    item_type: '',
                    department_id: ''
                });
                setIsEditing(false);
                setOriginalItemId(null);
                fetchItems();
            } else {
                handleError(error);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return (
        <>
            <Navbar />
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                {[
                    { label: 'Item ID', name: 'item_id', type: 'text', placeholder: 'Enter Item ID' },
                    { label: 'Item Name', name: 'item_name', type: 'text', placeholder: 'Enter Item Name' },
                    { label: 'Department ID', name: 'department_id', type: 'text', placeholder: 'Enter Department ID' },
                ].map((field, index) => (
                    <div key={index} className={styles.formGroup}>
                        <label htmlFor={field.name} className={styles.label}>{field.label}</label>
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className={styles.inputBox}
                        />
                    </div>
                ))}

                <div className={styles.formGroup}>
                    <label htmlFor="item_type" className={styles.label}>Item Type</label>
                    <select
                        name="item_type"
                        id="item_type"
                        value={formData.item_type}
                        onChange={handleChange}
                        className={styles.inputBox}
                    >
                        <option value="">Select Item Type</option>
                        <option value="property item">Property Item</option>
                        <option value="consumable item">Consumable Item</option>
                    </select>
                </div>

                <button type="submit" className={styles.submitButton}>
                    {isEditing ? 'Update' : 'Submit'}
                </button>

            </form>

            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Item Type</th>
                        <th>Department ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item._id}>
                            <td>{item.item_id}</td>
                            <td>{item.item_name}</td>
                            <td>{item.item_type}</td>
                            <td>{item.department_id}</td>
                            <td>
                                <button onClick={() => handleEdit(item)} className={styles.editButton}>Edit</button>
                                <button onClick={() => handleDelete(item._id)} className={styles.deleteButton}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );

}

export default Items;
