import React, { useCallback, useEffect, useState } from 'react';
import { handleError, handleSuccess } from '../../Utils/utils';
import Navbar from '../../component/navbar/Navbar';
import styles from './StockBookToolsAndPlants.module.css';

const StockBookToolsAndPlants = () => {
    const [inputData, setInputData] = useState({
        itemName: '',
        dateReceived: '',
        receivedBy: '',
        quantityReceived: '',
        invoiceNumber: '',
        price: '',
        dateOfIssue: '',
        givenTo: '',
        givenQuantity: '',
        receiver: '',
        stockLeft: '',
        dateOfStoreReturn: '',
        returnedBy: '',
        totalDefectiveItems: '',
        statusOfUsage: ''
    });

    const [stockEntries, setStockEntries] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [originalEntryId, setOriginalEntryId] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    const fetchEntries = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/sbtp/read`);
            const data = await res.json();
            setStockEntries(data?.data || []);
        } catch (err) {
            handleError("Failed to fetch stock entries");
        }
    }, [API_URL]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isEditing
            ? `${API_URL}/api/sbtp/update/${originalEntryId}`
            : `${API_URL}/api/sbtp/create`;
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
                handleSuccess(message);
                setInputData({
                    itemName: '',
                    dateReceived: '',
                    receivedBy: '',
                    quantityReceived: '',
                    invoiceNumber: '',
                    price: '',
                    dateOfIssue: '',
                    givenTo: '',
                    givenQuantity: '',
                    receiver: '',
                    stockLeft: '',
                    dateOfStoreReturn: '',
                    returnedBy: '',
                    totalDefectiveItems: '',
                    statusOfUsage: ''
                });
                setIsEditing(false);
                setOriginalEntryId(null);
                fetchEntries();
            } else {
                handleError(error);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleEdit = (entry) => {
        setIsEditing(true);
        setOriginalEntryId(entry._id);
        setInputData({ ...entry });
    };

    const handleDelete = async (_id) => {
        try {
            const res = await fetch(`${API_URL}/api/sbtp/delete/${_id}`, {
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
                fetchEntries();
            } else {
                handleError(error);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <Navbar />

            <form className={styles.formContainer} onSubmit={handleSubmit}>
                {[
                    { label: 'Item Name', name: 'itemName', type: 'text', placeholder: 'Enter Item Name' },
                    { label: 'Date Received', name: 'dateReceived', type: 'date' },
                    { label: 'Received By', name: 'receivedBy', type: 'text', placeholder: 'Enter Receiver Name' },
                    { label: 'Quantity Received', name: 'quantityReceived', type: 'number', placeholder: 'Enter Quantity Received' },
                    { label: 'Invoice Number', name: 'invoiceNumber', type: 'text', placeholder: 'Enter Invoice Number' },
                    { label: 'Price', name: 'price', type: 'number', placeholder: 'Enter Price' },
                    { label: 'Date of Issue', name: 'dateOfIssue', type: 'date' },
                    { label: 'Given To', name: 'givenTo', type: 'text', placeholder: 'Enter Given To' },
                    { label: 'Given Quantity', name: 'givenQuantity', type: 'number', placeholder: 'Enter Given Quantity' },
                    { label: 'Receiver', name: 'receiver', type: 'text', placeholder: 'Enter Receiver' },
                    { label: 'Stock Left', name: 'stockLeft', type: 'number', placeholder: 'Enter Stock Left' },
                    { label: 'Date of Store Return', name: 'dateOfStoreReturn', type: 'date' },
                    { label: 'Returned By', name: 'returnedBy', type: 'text', placeholder: 'Enter Returned By' },
                    { label: 'Total Defective Items', name: 'totalDefectiveItems', type: 'number', placeholder: 'Enter Total Defective Items' },
                    { label: 'Status of Usage', name: 'statusOfUsage', type: 'text', placeholder: 'Enter Status of Usage' },
                ].map((field, index) => (
                    <div key={index} className={styles.formGroup}>
                        <label htmlFor={field.name} className={styles.label}>{field.label}</label>
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={inputData[field.name]}
                            onChange={handleChange}
                            className={styles.inputBox}
                        />
                    </div>
                ))}

                <button type="submit" className={styles.submitButton}>
                    {isEditing ? "Update Entry" : "Add Entry"}
                </button>

            </form>

            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Date Received</th>
                        <th>Received By</th>
                        <th>Qty Received</th>
                        <th>Invoice No.</th>
                        <th>Price</th>
                        <th>Date Issued</th>
                        <th>Given To</th>
                        <th>Qty Given</th>
                        <th>Receiver</th>
                        <th>Stock Left</th>
                        <th>Return Date</th>
                        <th>Returned By</th>
                        <th>Defective</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stockEntries.map((entry) => (
                        <tr key={entry._id}>
                            <td>{entry.itemName}</td>
                            <td>{formatDate(entry.dateReceived)}</td>
                            <td>{entry.receivedBy}</td>
                            <td>{entry.quantityReceived}</td>
                            <td>{entry.invoiceNumber}</td>
                            <td>{entry.price}</td>
                            <td>{formatDate(entry.dateOfIssue)}</td>
                            <td>{entry.givenTo}</td>
                            <td>{entry.givenQuantity}</td>
                            <td>{entry.receiver}</td>
                            <td>{entry.stockLeft}</td>
                            <td>{formatDate(entry.dateOfStoreReturn)}</td>
                            <td>{entry.returnedBy}</td>
                            <td>{entry.totalDefectiveItems}</td>
                            <td>{entry.statusOfUsage}</td>
                            <td>
                                <button onClick={() => handleEdit(entry)} className={styles.editButton}>Edit</button>
                                <button onClick={() => handleDelete(entry._id)} className={styles.deleteButton}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );

};

export default StockBookToolsAndPlants;
