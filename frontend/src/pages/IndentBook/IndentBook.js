import React, { useCallback, useEffect, useState } from 'react';
import { handleSuccess, handleError } from '../../Utils/utils';
import Navbar from '../../component/navbar/Navbar';
import styles from './IndentBook.module.css'; // <-- Import the CSS module

function IndentBook() {
    const [indentData, setIndentData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [originalId, setOriginalId] = useState(null);
    const [formData, setFormData] = useState({
        equipmentFullDetail: '',
        demandedQuantity: '',
        issuedQuantity: '',
        stockRegisterReference: '',
        requester: '',
        recipientId: '',
        principalApproved: '',
        storekeeperId: ''
    });
    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchIndentData = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/indentbook/read`);
            const data = await res.json();
            setIndentData(data.data || []);
        } catch (error) {
            handleError("Failed to fetch indent records");
        }
    }, [API_URL]);

    const handleEdit = (entry) => {
        setIsEditing(true);
        setOriginalId(entry._id);
        setFormData({ ...entry });
    };

    const handleDelete = async (_id) => {
        try {
            const res = await fetch(`${API_URL}/api/indentbook/delete/${_id}`, {
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
                fetchIndentData();
            } else {
                handleError(error);
            }
        } catch (error) {
            handleError("Failed to delete entry");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isEditing
            ? `${API_URL}/api/indentbook/update/${originalId}`
            : 'http://localhost:5000/api/indentbook/create';
        const method = isEditing ? 'put' : 'post';

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
                    equipmentFullDetail: '',
                    demandedQuantity: '',
                    issuedQuantity: '',
                    stockRegisterReference: '',
                    requester: '',
                    recipientId: '',
                    principalApproved: '',
                    storekeeperId: ''
                });
                setIsEditing(false);
                setOriginalId(null);
                fetchIndentData();
            } else {
                handleError(error)
            }
        } catch (error) {
            handleError(error.response?.data?.error || "Submission failed");
        }
    };

    useEffect(() => {
        fetchIndentData();
    }, [fetchIndentData]);

    return (
        <>
            <Navbar />
            <div className={styles.indentContainer}>
                <form onSubmit={handleSubmit} className={styles.indentForm}>
                    <div>
                        <label>Equipment Details</label>
                        <input
                            type="text"
                            name="equipmentFullDetail"
                            value={formData.equipmentFullDetail}
                            onChange={handleChange}
                            placeholder="Equipment Details"
                        />
                    </div>
                    <div>
                        <label>Demanded Quantity</label>
                        <input
                            type="number"
                            name="demandedQuantity"
                            value={formData.demandedQuantity}
                            onChange={handleChange}
                            placeholder="Demanded Quantity"
                        />
                    </div>
                    <div>
                        <label>Issued Quantity</label>
                        <input
                            type="number"
                            name="issuedQuantity"
                            value={formData.issuedQuantity}
                            onChange={handleChange}
                            placeholder="Issued Quantity"
                        />
                    </div>
                    <div>
                        <label>Stock Register Ref</label>
                        <input
                            type="text"
                            name="stockRegisterReference"
                            value={formData.stockRegisterReference}
                            onChange={handleChange}
                            placeholder="Stock Register Ref"
                        />
                    </div>
                    <div>
                        <label>Requester</label>
                        <input
                            type="text"
                            name="requester"
                            value={formData.requester}
                            onChange={handleChange}
                            placeholder="Requester"
                        />
                    </div>
                    <div>
                        <label>Recipient ID</label>
                        <input
                            type="text"
                            name="recipientId"
                            value={formData.recipientId}
                            onChange={handleChange}
                            placeholder="Recipient ID"
                        />
                    </div>
                    <div>
                        <label>Principal Approved</label>
                        <input
                            type="text"
                            name="principalApproved"
                            value={formData.principalApproved}
                            onChange={handleChange}
                            placeholder="Principal Approved"
                        />
                    </div>
                    <div>
                        <label>Storekeeper ID</label>
                        <input
                            type="text"
                            name="storekeeperId"
                            value={formData.storekeeperId}
                            onChange={handleChange}
                            placeholder="Storekeeper ID"
                        />
                    </div>
                    <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
                </form>

                <table className={styles.indentTable}>
                    <thead>
                        <tr>
                            <th>Equipment Detail</th>
                            <th>Demanded Qty</th>
                            <th>Issued Qty</th>
                            <th>Stock Ref</th>
                            <th>Requester</th>
                            <th>Recipient ID</th>
                            <th>Principal Approved</th>
                            <th>Storekeeper ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {indentData.map((entry) => (
                            <tr key={entry._id}>
                                <td>{entry.equipmentFullDetail}</td>
                                <td>{entry.demandedQuantity}</td>
                                <td>{entry.issuedQuantity}</td>
                                <td>{entry.stockRegisterReference}</td>
                                <td>{entry.requester}</td>
                                <td>{entry.recipientId}</td>
                                <td>{entry.principalApproved}</td>
                                <td>{entry.storekeeperId}</td>
                                <td className={styles.actionButtons}>
                                    <button onClick={() => handleEdit(entry)}>Edit</button>
                                    <button onClick={() => handleDelete(entry._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default IndentBook;
