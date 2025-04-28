import React, { useEffect, useState } from 'react';
import Navbar from '../../component/navbar/Navbar';
import styles from './Home.module.css'; // 👈 Importing CSS Module

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    const user = setLoggedInUser(localStorage.getItem('loggedInUser'));
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.homeContainer}>
        <h1>Hello {loggedInUser}!</h1> {/* Assuming loggedInUser is an object */}
        <h2>Welcome to the Inventory Management System</h2>
        <p>This system helps manage and track various operations such as:</p>

        <ul className={styles.list}>
          <li><strong>Consumable Stock Book:</strong> Track and manage consumable stock inventory.</li>
          <li><strong>Department:</strong> Manage different departments of the organization.</li>
          <li><strong>Indent Book:</strong> Handle requisition/indent requests for items and materials.</li>
          <li><strong>Items:</strong> Maintain master data of all items (both property and consumable).</li>
          <li><strong>Tools & Plants Stock:</strong> Manage records of tools, plants, and machinery inventory.</li>
          <li><strong>Supplier:</strong> Manage supplier information and registrations.</li>
          <li><strong>Supplier Items:</strong> Associate suppliers with the items they provide.</li>
        </ul>

      </div>
    </>
  );
}

export default Home;
