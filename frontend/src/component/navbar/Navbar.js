import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css'; // 👈 Using module now
import Logout from '../Logout/Logout';

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <ul className={styles['navbar-list']}>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/indentBook">Indent Book</Link></li>
        <li><Link to="/csb">Consumable Stock Book</Link></li>
        <li><Link to="/sbtp">Tools & Plants</Link></li>
        <li><Link to="/department">Department</Link></li>
        <li><Link to="/items">Items</Link></li>
        <li><Link to="/supplier">Supplier</Link></li>
        <li><Link to="/supplierItems">Supplier Items</Link></li>
      </ul>
      <div className={styles.logout}>
        <Logout />
      </div>
    </div>
  );
};

export default Navbar;
