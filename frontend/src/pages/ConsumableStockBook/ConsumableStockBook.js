import React, { useCallback, useEffect, useState } from 'react';
import { handleError, handleSuccess } from '../../Utils/utils';
import Navbar from '../../component/navbar/Navbar';
import styles from './ConsumableStockBook.module.css'; // ✅ imported CSS module

function ConsumableStockBook() {
    const [isEditing, setIsEditing] = useState(false);
    const [originalBillNo, setOriginalBillNo] = useState(null);
    const [entries, setEntries] = useState([]);
    const [inputData, setInputData] = useState({
        billno: "",
        billDate: "",
        firmName: "",
        quantity: "",
        rate: "",
        totalAmount: "",
        storekeeperId: "",
        date: "",
        indentNo: "",
        givenTo: "",
        quantityGiven: "",
        balance: ""
    });

    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = {
            ...inputData,
            [name]: value
        };

        if ((name === 'quantity' || name === 'rate') && updatedData.quantity && updatedData.rate) {
            updatedData.totalAmount = (parseFloat(updatedData.quantity) * parseFloat(updatedData.rate)).toFixed(2);
        }

        if ((name === 'quantity' || name === 'quantityGiven') && updatedData.quantity && updatedData.quantityGiven) {
            updatedData.balance = (parseFloat(updatedData.quantity) - parseFloat(updatedData.quantityGiven)).toFixed(0);
        }

        setInputData(updatedData);
    };

    const fetchEntries = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/CSB/read`);
            const data = await res.json();
            setEntries(data?.consumableStockBook || []);
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    }, [API_URL]);

    const handleEdit = (entry) => {
        setIsEditing(true);
        setOriginalBillNo(entry.billno);
        setInputData({ ...entry });
    };

    const handleDelete = async (billno) => {
        try {
            const res = await fetch(`${API_URL}/api/CSB/delete/${billno}`, {
                method: 'DELETE',
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
            handleError(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isEditing
            ? `${API_URL}/api/CSB/update/${originalBillNo}`
            : `${API_URL}/api/CSB/create`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputData)
            });

            const result = await res.json();
            const { success, message, error } = result;

            if (success) {
                handleSuccess(message);
                setInputData({
                    billno: "",
                    billDate: "",
                    firmName: "",
                    quantity: "",
                    rate: "",
                    totalAmount: "",
                    storekeeperId: "",
                    date: "",
                    indentNo: "",
                    givenTo: "",
                    quantityGiven: "",
                    balance: ""
                });
                setIsEditing(false);
                setOriginalBillNo(null);
                fetchEntries();
            } else {
                handleError(error);
            }
        } catch (error) {
            handleError(error);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

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
            <form className={styles.consumableStockForm} onSubmit={handleSubmit}>
                {[
                    { label: 'Bill No.', name: 'billno', type: 'text', placeholder: 'Enter Bill No.' },
                    { label: 'Bill Date', name: 'billDate', type: 'date' },
                    { label: 'Firm Name', name: 'firmName', type: 'text', placeholder: 'Enter Firm Name' },
                    { label: 'Quantity', name: 'quantity', type: 'number', placeholder: 'Enter Quantity' },
                    { label: 'Rate', name: 'rate', type: 'number', placeholder: 'Enter Rate' },
                    { label: 'Total Amount', name: 'totalAmount', type: 'number', placeholder: 'Enter Total Amount' },
                    { label: 'Storekeeper ID', name: 'storekeeperId', type: 'text', placeholder: 'Enter Storekeeper ID' },
                    { label: 'Issue Date', name: 'date', type: 'date' },
                    { label: 'Indent No.', name: 'indentNo', type: 'text', placeholder: 'Enter Indent No.' },
                    { label: 'Given To', name: 'givenTo', type: 'text', placeholder: 'Enter Receiver Name' },
                    { label: 'Quantity Given', name: 'quantityGiven', type: 'number', placeholder: 'Enter Quantity Given' },
                    { label: 'Balance', name: 'balance', type: 'number', placeholder: 'Enter Balance' }
                ].map((field, index) => (
                    <div key={index} className={styles.formGroup}>
                        <label>{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={inputData[field.name]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button type="submit" className={styles.submitButton}>
                    {isEditing ? "Update" : "Submit"}
                </button>
            </form>

            <table className={styles.entriesTable}>
                <thead>
                    <tr>
                        <th>Bill No</th>
                        <th>Bill Date</th>
                        <th>Firm Name</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Total Amount</th>
                        <th>Storekeeper ID</th>
                        <th>Issue Date</th>
                        <th>Indent No</th>
                        <th>Given To</th>
                        <th>Quantity Given</th>
                        <th>Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => (
                        <tr key={entry._id}>
                            <td>{entry.billno}</td>
                            <td>{formatDate(entry.billDate)}</td>
                            <td>{entry.firmName}</td>
                            <td>{entry.quantity}</td>
                            <td>{entry.rate}</td>
                            <td>{entry.totalAmount}</td>
                            <td>{entry.storekeeperId}</td>
                            <td>{formatDate(entry.date)}</td>
                            <td>{entry.indentNo}</td>
                            <td>{entry.givenTo}</td>
                            <td>{entry.quantityGiven}</td>
                            <td>{entry.balance}</td>
                            <td>
                                <button onClick={() => handleEdit(entry)}>Edit</button>
                                <button onClick={() => handleDelete(entry.billno)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default ConsumableStockBook;
