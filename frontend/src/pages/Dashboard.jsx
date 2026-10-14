import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showSosModal, setShowSosModal] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    // Retrieve the active user stored during Login or Registration
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setPatient(JSON.parse(savedUser));
    } else {
      setPatient({
        name: "Guest Patient",
        id: "MC-00000",
        age: "--",
        gender: "--",
        phone: "Not Provided",
        email: "guest@medicare.com",
        bloodGroup: "N/A",
        allergies: ["None"],
        emergencyContact: { name: "Not Set", phone: "N/A" }
      });
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const symptomsList = [
    { name: 'Fever / Flu', specialty: 'General Physician' },
    { name: 'Chest Pain', specialty: 'Cardiologist' },
    { name: 'Skin Rash', specialty: 'Dermatologist' },
    { name: 'Toothache', specialty: 'Dentist' },
    { name: 'Joint Pain', specialty: 'Orthopedist' }
  ];

  if (!patient) return null;

  return (
    <div style={styles.pageContainer}>
      
      {/* Top Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.greeting}>Welcome back, {patient.name}! 👋</h1>
          <p style={styles.subGreeting}>Patient ID: {patient.id || 'MC-10024'} • Active Profile</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button style={styles.sosButton} onClick={() => setShowSosModal(true)}>
            🚨 Emergency SOS
          </button>
          
          {/* Logout Button */}
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout 🚪
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div style={styles.gridContainer}>
        
        {/* Left Column - Dynamic Patient Profile Card */}
        <div style={styles.leftColumn}>
          <div style={styles.card}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>👤</div>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>{patient.name}</h2>
                <span style={styles.verifiedBadge}>✓ Registered Patient</span>
              </div>
            </div>

            <hr style={styles.divider} />

            <div style={styles.infoGroup}>
              <p style={styles.infoLabel}>PERSONAL DETAILS</p>
              <div style={styles.infoRow}>
                <span>Age / Gender:</span>
                <strong>{patient.age} Yrs / {patient.gender}</strong>
              </div>
              <div style={styles.infoRow}>
                <span>Blood Group:</span>
                <strong style={{ color: '#ff5252' }}>{patient.bloodGroup}</strong>
              </div>
            </div>

            <hr style={styles.divider} />

            <div style={styles.infoGroup}>
              <p style={styles.infoLabel}>CONTACT DETAILS</p>
              <div style={styles.infoRow}>
                <span>Phone:</span>
                <strong>{patient.phone}</strong>
              </div>
              <div style={styles.infoRow}>
                <span>Email:</span>
                <strong style={{ fontSize: '13px' }}>{patient.email}</strong>
              </div>
            </div>

            <hr style={styles.divider} />

            <div style={styles.infoGroup}>
              <p style={styles.infoLabel}>MEDICAL SNAPSHOT</p>
              <div style={styles.infoRow}>
                <span>Allergies:</span>
                <div>
                  {patient.allergies && patient.allergies.map((item, i) => (
                    <span key={i} style={styles.allergyTag}>{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <hr style={styles.divider} />

            <div style={styles.infoGroup}>
              <p style={styles.infoLabel}>EMERGENCY CONTACT</p>
              <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 'bold' }}>
                {patient.emergencyContact?.name}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#00e676' }}>
                {patient.emergencyContact?.phone}
              </p>
            </div>

            <button style={styles.editBtn} onClick={() => navigate('/register')}>
              ✏️ Re-register / Update Profile
            </button>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div style={styles.rightColumn}>
          
          <div style={styles.bannerCard}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>Find Your Medical Specialist</h2>
            <p style={{ margin: '0 0 18px 0', color: '#b0bec5', fontSize: '14px' }}>
              Book instant consultations with top-rated medical professionals.
            </p>
            <button style={styles.primaryBtn} onClick={() => navigate('/search-doctors')}>
              🔍 Search All Doctors
            </button>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📅 Next Scheduled Appointment</h3>
            <div style={styles.appointmentBox}>
              <div style={styles.doctorAvatar}>👨‍⚕️</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#ffffff' }}>Dr. Sarah Jenkins</h4>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#00e676' }}>Cardiologist • Video Call</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#b0bec5' }}>Today, 04:30 PM</p>
              </div>
              <button style={styles.joinBtn} onClick={() => alert('Opening consultation room...')}>
                Join Call
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🩺 Quick Search by Symptom</h3>
            <div style={styles.symptomPills}>
              {symptomsList.map((item, idx) => (
                <button
                  key={idx}
                  style={selectedSymptom === item.name ? styles.activePill : styles.pill}
                  onClick={() => setSelectedSymptom(item.name)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            {selectedSymptom && (
              <div style={styles.symptomResult}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                  Recommended Specialist: <strong style={{ color: '#ffb74d' }}>{symptomsList.find(s => s.name === selectedSymptom)?.specialty}</strong>
                </p>
                <button style={styles.smallSearchBtn} onClick={() => navigate('/search-doctors')}>
                  Find {symptomsList.find(s => s.name === selectedSymptom)?.specialty}s →
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Emergency SOS Modal */}
      {showSosModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h2 style={{ color: '#ff5252', margin: '0 0 10px 0' }}>🚨 EMERGENCY SOS ACTIVATED</h2>
            <p style={{ fontSize: '14px', color: '#d0dce5', lineHeight: '1.5' }}>
              Dispatching details for <strong>{patient.name}</strong> to local emergency services:
            </p>

            <div style={styles.sosContacts}>
              <div style={styles.sosRow}>
                <span>National Emergency:</span>
                <strong style={{ color: '#ff5252', fontSize: '18px' }}>911 / 108</strong>
              </div>
              <div style={styles.sosRow}>
                <span>Urgent Desk:</span>
                <strong style={{ color: '#00e676', fontSize: '16px' }}>+1 (800) 555-0199</strong>
              </div>
            </div>

            <div style={styles.patientDispatchBox}>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#9fb3c6' }}>PATIENT CONTACT DETAILS:</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{patient.name} ({patient.phone})</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#b0bec5' }}>
                Emergency Contact: {patient.emergencyContact?.name} ({patient.emergencyContact?.phone})
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                style={styles.callNowBtn} 
                onClick={() => alert(`Connecting call to Emergency Dispatch for ${patient.name}...`)}
              >
                📞 Call Dispatch
              </button>
              <button style={styles.closeModalBtn} onClick={() => setShowSosModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const styles = {
  pageContainer: { minHeight: '100vh', width: '100vw', backgroundColor: '#0b1b28', color: '#ffffff', fontFamily: 'sans-serif', padding: '30px 20px', boxSizing: 'border-box' },
  header: { maxWidth: '1100px', margin: '0 auto 25px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
  greeting: { margin: '0 0 4px 0', fontSize: '26px' },
  subGreeting: { margin: 0, color: '#9fb3c6', fontSize: '14px' },
  sosButton: { padding: '12px 20px', backgroundColor: '#d32f2f', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
  logoutButton: { padding: '12px 18px', backgroundColor: '#374151', color: '#ffffff', border: '1px solid #4b5563', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
  gridContainer: { maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '24px', flexWrap: 'wrap' },
  leftColumn: { flex: '1', minWidth: '320px' },
  rightColumn: { flex: '2', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#132838', padding: '24px', borderRadius: '12px', border: '1px solid #1f3a50' },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '15px' },
  avatar: { fontSize: '32px', backgroundColor: '#1c3b4d', padding: '12px', borderRadius: '50%' },
  verifiedBadge: { fontSize: '12px', color: '#00e676', backgroundColor: 'rgba(0, 230, 118, 0.1)', padding: '4px 8px', borderRadius: '4px' },
  divider: { borderColor: '#1c3b4d', margin: '16px 0', borderStyle: 'solid', borderWidth: '0.5px' },
  infoGroup: { fontSize: '14px' },
  infoLabel: { fontSize: '11px', color: '#9fb3c6', letterSpacing: '1px', margin: '0 0 8px 0', fontWeight: 'bold' },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#cfdbe6' },
  allergyTag: { backgroundColor: '#3d1e24', color: '#ff8a80', fontSize: '12px', padding: '2px 8px', borderRadius: '4px', marginLeft: '4px' },
  editBtn: { width: '100%', padding: '10px', marginTop: '15px', backgroundColor: 'transparent', border: '1px solid #2e526b', color: '#9fb3c6', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  bannerCard: { backgroundColor: '#1c3b4d', padding: '24px', borderRadius: '12px', border: '1px solid #2e526b' },
  primaryBtn: { padding: '12px 20px', backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
  cardTitle: { margin: '0 0 16px 0', fontSize: '16px' },
  appointmentBox: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#0b1b28', padding: '16px', borderRadius: '8px' },
  doctorAvatar: { fontSize: '28px', backgroundColor: '#1c3b4d', padding: '10px', borderRadius: '50%' },
  joinBtn: { padding: '10px 16px', backgroundColor: '#00e676', color: '#000000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  symptomPills: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  pill: { padding: '8px 14px', backgroundColor: '#1c3b4d', color: '#ffffff', border: '1px solid #2e526b', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  activePill: { padding: '8px 14px', backgroundColor: '#007bff', color: '#ffffff', border: '1px solid #007bff', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  symptomResult: { marginTop: '15px', padding: '12px', backgroundColor: '#0b1b28', borderRadius: '8px' },
  smallSearchBtn: { padding: '8px 14px', backgroundColor: '#ff9800', color: '#000000', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalCard: { backgroundColor: '#132838', padding: '30px', borderRadius: '12px', maxWidth: '450px', width: '90%', border: '1px solid #ff5252' },
  sosContacts: { backgroundColor: '#0b1b28', padding: '15px', borderRadius: '8px', margin: '20px 0' },
  sosRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  patientDispatchBox: { backgroundColor: '#1c3b4d', padding: '12px', borderRadius: '6px' },
  callNowBtn: { flex: 2, padding: '12px', backgroundColor: '#d32f2f', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  closeModalBtn: { flex: 1, padding: '12px', backgroundColor: '#333333', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default Dashboard;