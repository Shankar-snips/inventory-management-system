import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../Utils/utils';
import styles from './Login.module.css'; 

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const API_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });
      const result = await response.json();
      const { success, message, token, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', token);
        localStorage.setItem('loggedInUser', name);
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else if (error) {
        handleError(error);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className={styles['form-group']}>
            <label className={styles.label} htmlFor='email'>Email</label>
            <input
              className={styles.input}
              onChange={handleChange}
              type='email'
              name='email'
              placeholder='Enter your email'
              value={loginInfo.email}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label className={styles.label} htmlFor='password'>Password</label>
            <input
              className={styles.input}
              onChange={handleChange}
              type='password'
              name='password'
              placeholder='Enter your password'
              value={loginInfo.password}
              required
            />
          </div>
          <button type='submit' className={styles.button}>Login</button>
          <span className={styles.link}>
            Don't have an account? <Link to='/signup'>Signup</Link>
          </span>
        </form>
      </div>
    </>
  );
}

export default Login;
