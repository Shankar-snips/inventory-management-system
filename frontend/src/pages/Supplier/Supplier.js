import React, { useCallback, useEffect, useState } from 'react';
import { handleSuccess, handleError } from '../../Utils/utils';
import Navbar from '../../component/navbar/Navbar';
import styles from './Supplier.module.css'; // assuming CSS file


function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [originalId, setOriginalId] = useState(null);
  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    address: '',
    gstIn: '',
    pincode: '',
    validFrom: '',
    validTo: ''
  });
  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/supplier/read`);
      const result = await res.json();
      if (result.success) {
        setSuppliers(result.data || []);
      } else {
        handleError(result.error || "Failed to fetch suppliers");
      }
    } catch (error) {
      handleError("Failed to fetch suppliers");
    }
  }, [API_URL]);

  const handleEdit = (supplier) => {
    setIsEditing(true);
    setOriginalId(supplier.supplierId);
    setFormData({ ...supplier });
  };

  const handleDelete = async (supplierId) => {
    try {
      const res = await fetch(`${API_URL}/api/supplier/delete/${supplierId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        fetchSuppliers();
      } else {
        handleError(error);
      }
    } catch (error) {
      handleError("Failed to delete supplier");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEditing
      ? `${API_URL}/api/supplier/update/${originalId}`
      : `${API_URL}/api/supplier/create`;
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
          supplierId: '',
          supplierName: '',
          address: '',
          gstIn: '',
          pincode: '',
          validFrom: '',
          validTo: ''
        });
        setIsEditing(false);
        setOriginalId(null);
        fetchSuppliers();
      } else {
        handleError(error);
      }
    } catch (error) {
      handleError("Submission failed");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

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
          { label: 'Supplier ID', name: 'supplierId', type: 'text', placeholder: 'Supplier ID', disabled: isEditing },
          { label: 'Supplier Name', name: 'supplierName', type: 'text', placeholder: 'Supplier Name' },
          { label: 'Address', name: 'address', type: 'text', placeholder: 'Address' },
          { label: 'GSTIN', name: 'gstIn', type: 'text', placeholder: 'GSTIN' },
          { label: 'Pincode', name: 'pincode', type: 'text', placeholder: 'Pincode' },
          { label: 'Valid From', name: 'validFrom', type: 'date' },
          { label: 'Valid To', name: 'validTo', type: 'date' }
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
              disabled={field.disabled || false}
              className={styles.inputBox}
            />
          </div>
        ))}

        <button type="submit" className={styles.submitButton}>
          {isEditing ? 'Update Supplier' : 'Add Supplier'}
        </button>

      </form>

      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>GSTIN</th>
            <th>Pincode</th>
            <th>Valid From</th>
            <th>Valid To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td>{supplier.supplierId}</td>
              <td>{supplier.supplierName}</td>
              <td>{supplier.address}</td>
              <td>{supplier.gstIn}</td>
              <td>{supplier.pincode}</td>
              <td>{formatDate(supplier.validFrom)}</td>
              <td>{formatDate(supplier.validTo)}</td>
              <td>
                <button onClick={() => handleEdit(supplier)} className={styles.editButton}>Edit</button>
                <button onClick={() => handleDelete(supplier.supplierId)} className={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

}

export default Supplier;
