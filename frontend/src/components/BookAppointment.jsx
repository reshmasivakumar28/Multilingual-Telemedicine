import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeSlot: '',
    reason: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch available doctors on load
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await API.get('/doctors');
        setDoctors(response.data);
      } catch (err) {
        console.error('Error loading doctors:', err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Sends POST request to /api/appointments with JWT token attached from api.js
      const res = await API.post('/appointments', formData);
      setMessage('Appointment booked successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Book an Appointment</h2>

      {message && <div style={styles.successMsg}>{message}</div>}
      {error && <div style={styles.errorMsg}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Doctor Selection Dropdown */}
        <select
          value={formData.doctorId}
          onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
          required
          style={styles.input}
        >
          <option value="">-- Select a Doctor --</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              Dr. {doc.name} ({doc.specialization || 'General'})
            </option>
          ))}
        </select>

        {/* Date Input */}
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          style={styles.input}
        />

        {/* Time Slot Input */}
        <input
          type="text"
          placeholder="Time Slot (e.g. 10:00 AM)"
          value={formData.timeSlot}
          onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
          required
          style={styles.input}
        />

        {/* Reason Textarea */}
        <textarea
          placeholder="Reason for consultation"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          rows="3"
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Confirm Booking</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#1b3b4d',
    borderRadius: '8px',
    color: '#ffffff',
    fontFamily: 'sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#2b2f33',
    color: '#ffffff',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  successMsg: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  errorMsg: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
  },
};

export default BookAppointment;