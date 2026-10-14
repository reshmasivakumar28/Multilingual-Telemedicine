import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api'; // Import your central API helper

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Calls http://localhost:5000/api/auth/login through api.js
      const response = await API.post('/auth/login', {
        email,
        password,
      });

      // Save JWT token & user object from MongoDB to local storage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      }

      // Navigate to the dashboard on success
      navigate('/dashboard');
    } catch (err) {
      // Capture error messages from backend
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Top Header Section */}
      <div style={styles.topSection}>
        <h1 style={styles.mainTitle}>MediCare</h1>
        <p style={styles.tagline}>we care for sure</p>

        {/* Circular Healthcare Icons Row */}
        <div style={styles.iconRow}>
          <div style={styles.iconCircleSmall}>♿</div>
          <div style={styles.iconCircleSmall}>🛡️</div>
          <div style={styles.iconCircleLarge}>➕</div>
          <div style={styles.iconCircleSmall}>💓</div>
        </div>

        {/* Centered Lock Avatar Badge */}
        <div style={styles.lockBadge}>
          <span style={{ fontSize: '28px' }}>🔒</span>
        </div>
      </div>

      {/* Bottom Form Section */}
      <div style={styles.bottomSection}>
        <h2 style={styles.loginTitle}>LOGIN</h2>

        {error && <div style={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.formContainer}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.inputField}
          />

          <input
            type="password"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.inputField}
          />

          <div style={styles.forgotPassContainer}>
            <span style={styles.forgotPassText}>Forgot Password?</span>
          </div>

          <button type="submit" style={styles.loginButton}>
            LOGIN
          </button>
        </form>

        <p style={styles.footerText}>
          Not Registered yet? <Link to="/register" style={styles.signupLink}>SIGNUP</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'sans-serif',
    backgroundColor: '#071521',
    color: '#ffffff',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  topSection: {
    backgroundColor: '#1b3b4d',
    paddingTop: '40px',
    paddingBottom: '50px',
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    margin: 0,
    letterSpacing: '1px',
  },
  tagline: {
    fontSize: '16px',
    fontStyle: 'italic',
    color: '#a2b7c7',
    marginTop: '4px',
    marginBottom: '25px',
  },
  iconRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  iconCircleSmall: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    border: '1px solid #3d6075',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  iconCircleLarge: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '1px solid #4a758f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  lockBadge: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '-35px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
  bottomSection: {
    backgroundColor: '#071521',
    flex: 1,
    paddingTop: '55px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '15px',
  },
  errorMsg: {
    backgroundColor: '#ff5252',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '15px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputField: {
    width: '100%',
    padding: '14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2b2f33',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  forgotPassContainer: {
    textAlign: 'right',
    marginTop: '-4px',
  },
  forgotPassText: {
    color: '#e65100',
    fontSize: '13px',
    fontStyle: 'italic',
    cursor: 'pointer',
  },
  loginButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  footerText: {
    marginTop: '30px',
    fontSize: '13px',
    color: '#d0dce5',
  },
  signupLink: {
    color: '#e65100',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginLeft: '5px',
  },
};

export default Login;