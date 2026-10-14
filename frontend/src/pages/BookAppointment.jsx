import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableSlots = [
    '09:00 AM', '10:30 AM', '11:45 AM',
    '02:00 PM', '03:30 PM', '05:00 PM'
  ];

  useEffect(() => {
    // Fetch selected doctor details from backend
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${id}`);
        const data = await response.json();
        if (response.ok) {
          setDoctor(data);
        } else {
          // Fallback mock if doctor ID route is pending
          setDoctor({
            _id: id,
            name: "Dr. Sarah Jenkins",
            specialty: "Cardiologist",
            experience: "12+ Years",
            rating: 4.9,
            fees: "$80",
            image: "👨‍⚕️"
          });
        }
      } catch (err) {
        setDoctor({
          _id: id,
          name: "Dr. Medical Specialist",
          specialty: "General Physician",
          experience: "10+ Years",
          rating: 4.8,
          fees: "$75",
          image: "👨‍⚕️"
        });
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      alert('Please select both a date and a time slot!');
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!savedUser || !savedUser._id) {
      alert('Please log in first to book an appointment.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: savedUser._id,
          doctorId: doctor._id || id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          date: selectedDate,
          timeSlot: selectedSlot,
          symptoms: symptoms || 'General Consultation'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      alert(`Appointment Booked Successfully with ${doctor.name}!`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return <div style={{ color: '#fff', textAlign: 'center', paddingTop: '50px' }}>Loading Doctor Details...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={() => navigate('/search-doctors')}>← Back to Doctors</button>

        {/* Doctor Header Header */}
        <div style={styles.doctorHeader}>
          <div style={styles.avatar}>{doctor.image || "👨‍⚕️"}</div>
          <div>
            <h2 style={{ margin: '0 0 4px 0' }}>{doctor.name}</h2>
            <p style={{ margin: '0 0 6px 0', color: '#00e676', fontWeight: 'bold' }}>{doctor.specialty}</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#9fb3c6' }}>Experience: {doctor.experience} • Rating: ⭐ {doctor.rating}</p>
          </div>
        </div>

        <hr style={styles.divider} />

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleBooking}>
          {/* Date Picker */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Select Consultation Date*</label>
            <input 
              type="date" 
              required 
              style={styles.input}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Time Slots */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Select Time Slot*</label>
            <div style={styles.slotGrid}>
              {availableSlots.map((slot, index) => (
                <button
                  type="button"
                  key={index}
                  style={selectedSlot === slot ? styles.activeSlot : styles.slotBtn}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Input */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Describe Health Concern / Symptoms (Optional)</label>
            <textarea
              rows="3"
              placeholder="e.g. Mild fever, persistent headache for 2 days..."
              style={{ ...styles.input, resize: 'none' }}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Booking...' : 'Confirm Appointment Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0b1b28', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  card: { backgroundColor: '#132838', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '100%', border: '1px solid #1f3a50' },
  backBtn: { backgroundColor: 'transparent', border: 'none', color: '#007bff', cursor: 'pointer', marginBottom: '15px', padding: 0 },
  doctorHeader: { display: 'flex', alignItems: 'center', gap: '15px' },
  avatar: { fontSize: '36px', backgroundColor: '#1c3b4d', padding: '12px', borderRadius: '50%' },
  divider: { borderColor: '#1f3a50', margin: '20px 0', borderStyle: 'solid', borderWidth: '0.5px' },
  errorBox: { backgroundColor: '#ff5252', color: '#fff', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' },
  fieldGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', color: '#9fb3c6', marginBottom: '8px', fontWeight: 'bold' },
  input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #2e526b', backgroundColor: '#0b1b28', color: '#fff', boxSizing: 'border-box' },
  slotGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  slotBtn: { padding: '10px', backgroundColor: '#0b1b28', color: '#fff', border: '1px solid #2e526b', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  activeSlot: { padding: '10px', backgroundColor: '#007bff', color: '#fff', border: '1px solid #007bff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  submitBtn: { width: '100%', padding: '14px', backgroundColor: '#00e676', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }
};

export default BookAppointment;