import React, { useCallback, useEffect, useState } from 'react';
import { handleSuccess, handleError } from '../../Utils/utils';
import Navbar from '../../component/navbar/Navbar';
import styles from './SupplierItems.module.css';

const SupplierItem = () => {
  const [supplierItems, setSupplierItems] = useState([]);
  const [inputData, setInputData] = useState({
    supplierId: '',
    item_id: ''
  });
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchSupplierItems = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/supplierItems/read`);
      const data = await res.json();
      if (data.success) {
        setSupplierItems(data.data);
      }
    } catch (err) {
      handleError("Failed to fetch supplier items");
    }
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/supplierItems/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        fetchSupplierItems();
      } else {
        handleError(error);
      }
    } catch (err) {
      handleError("Failed to delete supplier item");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/supplierItems/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData)
      });
      const data = await res.json();
      if (data.success) {
        handleSuccess(data.message);
        setInputData({ supplierId: '', item_id: '' });
        fetchSupplierItems();
      } else {
        handleError(data.error);
      }
    } catch (err) {
      handleError("Failed to save supplier item");
    }
  };

  useEffect(() => {
    fetchSupplierItems();
  }, [fetchSupplierItems]);

  // Format date
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
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {[
          { label: 'Supplier ID', name: 'supplierId', type: 'text', placeholder: 'Enter Supplier ID' },
          { label: 'Item ID', name: 'item_id', type: 'text', placeholder: 'Enter Item ID' }
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

        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>

      <table className={styles.dataTable}>
        <thead>
          <tr>
            {/* Supplier Fields */}
            <th>Supplier ID</th>
            <th>Supplier Name</th>
            <th>Address</th>
            <th>GSTIN</th>
            <th>Pincode</th>
            <th>Valid From</th>
            <th>Valid To</th>

            {/* Item Fields */}
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Item Type</th>
            <th>Department ID</th>

            {/* Actions */}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {supplierItems.map((supplierItem) => (
            <tr key={supplierItem._id}>
              {/* Supplier Fields */}
              <td>{supplierItem.supplierId?.supplierId}</td>
              <td>{supplierItem.supplierId?.supplierName}</td>
              <td>{supplierItem.supplierId?.address}</td>
              <td>{supplierItem.supplierId?.gstIn}</td>
              <td>{supplierItem.supplierId?.pincode}</td>
              <td>{formatDate(supplierItem.supplierId?.validFrom)}</td>
              <td>{formatDate(supplierItem.supplierId?.validTo)}</td>

              {/* Item Fields */}
              <td>{supplierItem.item_id?.item_id}</td>
              <td>{supplierItem.item_id?.item_name}</td>
              <td>{supplierItem.item_id?.item_type}</td>
              <td>{supplierItem.item_id?.department_id}</td>

              {/* Actions */}
              <td>
                <button onClick={() => handleDelete(supplierItem._id)} className={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );


};

export default SupplierItem;
