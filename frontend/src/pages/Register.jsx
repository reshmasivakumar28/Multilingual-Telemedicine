import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Female',
    phone: '',
    bloodGroup: 'O+',
    allergies: '',
    emergencyName: '',
    emergencyPhone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create complete patient profile object
    const newPatient = {
      name: formData.name || "Reshma Sivakumar",
      id: "MC-" + Math.floor(10000 + Math.random() * 90000),
      age: formData.age || "24",
      gender: formData.gender,
      phone: formData.phone || "+1 (555) 234-5678",
      email: formData.email || "reshmasivakumarr@gmail.com",
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies ? formData.allergies.split(',') : ["None"],
      emergencyContact: {
        name: formData.emergencyName || "Sivakumar",
        phone: formData.emergencyPhone || "+1 (555) 987-6543"
      }
    };

    // Save profile and auth token to localStorage
    localStorage.setItem('currentUser', JSON.stringify(newPatient));
    localStorage.setItem('token', 'sample-jwt-token-12345');

    // Direct user to Dashboard
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>MediCare Patient Registration</h2>
        <p style={styles.subtitle}>Fill in details to complete your patient profile</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Reshma Sivakumar"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="reshma@example.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Age</label>
              <input
                type="number"
                name="age"
                placeholder="24"
                value={formData.age}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={styles.label}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={styles.select}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={styles.label}>Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={styles.select}>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="+1 (555) 234-5678"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Allergies (comma separated)</label>
              <input
                type="text"
                name="allergies"
                placeholder="Penicillin, Dust"
                value={formData.allergies}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <hr style={styles.divider} />

          <p style={styles.sectionHeader}>Emergency Contact</p>
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Contact Name</label>
              <input
                type="text"
                name="emergencyName"
                placeholder="Sivakumar"
                value={formData.emergencyName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Contact Phone</label>
              <input
                type="text"
                name="emergencyPhone"
                placeholder="+1 (555) 987-6543"
                value={formData.emergencyPhone}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>Register Profile</button>
        </form>

        <p style={styles.loginText}>
          Already registered? <Link to="/login" style={styles.link}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', width: '100vw', backgroundColor: '#0b1b28', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' },
  card: { backgroundColor: '#132838', padding: '30px', borderRadius: '12px', border: '1px solid #1f3a50', maxWidth: '550px', width: '100%', color: '#ffffff' },
  title: { margin: '0 0 6px 0', fontSize: '22px', textAlign: 'center' },
  subtitle: { margin: '0 0 20px 0', color: '#9fb3c6', fontSize: '13px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  row: { display: 'flex', gap: '12px' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '12px', color: '#9fb3c6', marginBottom: '4px' },
  input: { width: '100%', padding: '10px', backgroundColor: '#0b1b28', border: '1px solid #2e526b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box', fontSize: '13px' },
  select: { width: '100%', padding: '10px', backgroundColor: '#0b1b28', border: '1px solid #2e526b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box', fontSize: '13px' },
  divider: { borderColor: '#1c3b4d', margin: '10px 0', borderStyle: 'solid', borderWidth: '0.5px' },
  sectionHeader: { margin: '0 0 6px 0', fontSize: '13px', fontWeight: 'bold', color: '#00e676' },
  button: { padding: '12px', backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '10px' },
  loginText: { marginTop: '15px', textAlign: 'center', fontSize: '13px', color: '#9fb3c6' },
  link: { color: '#00e676', textDecoration: 'none' }
};

export default Register;