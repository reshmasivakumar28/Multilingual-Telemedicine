import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mock doctors list so UI works even without backend running
const mockDoctors = [
  {
    _id: '1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology',
    experienceYears: 12,
    consultationFee: 800,
    languages: ['en', 'ta']
  },
  {
    _id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    experienceYears: 8,
    consultationFee: 600,
    languages: ['en', 'hi']
  },
  {
    _id: '3',
    name: 'Dr. Priya Patel',
    specialty: 'General Physician',
    experienceYears: 10,
    consultationFee: 500,
    languages: ['en', 'ta', 'hi']
  },
  {
    _id: '4',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Pediatrics',
    experienceYears: 15,
    consultationFee: 700,
    languages: ['en', 'ta', 'te']
  }
];

export default function DoctorSearch() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      // Try fetching from backend API
      const res = await axios.get('http://localhost:5000/api/doctors', {
        params: { specialty, language }
      });
      setDoctors(res.data);
    } catch (err) {
      console.warn('Backend server not detected at http://localhost:5000. Using local mock data instead.');
      
      // Filter mock data locally if API fails
      let filtered = mockDoctors;
      if (specialty) {
        filtered = filtered.filter(doc => doc.specialty === specialty);
      }
      if (language) {
        filtered = filtered.filter(doc => doc.languages.includes(language));
      }
      setDoctors(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialty, language]);

  return (
    <div style={{ padding: '30px', color: '#fff', backgroundColor: '#0b1b28', minHeight: '100vh', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ backgroundColor: '#132838', color: '#00e676', border: '1px solid #1f3a50', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 style={{ color: '#ff6b3d', marginTop: 0 }}>Find a Doctor</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '25px' }}>Filter doctors by specialty or language preference.</p>

      {/* Filters Section */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {/* 20 Specialties Filter */}
        <select 
          value={specialty} 
          onChange={(e) => setSpecialty(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Specialties</option>
          <option value="General Physician">General Physician</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Psychiatry">Psychiatry & Mental Health</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Neurology">Neurology</option>
          <option value="ENT">ENT (Ear, Nose, Throat)</option>
          <option value="Endocrinology">Endocrinology & Diabetes</option>
          <option value="Gastroenterology">Gastroenterology</option>
          <option value="Pulmonology">Pulmonology</option>
          <option value="Ophthalmology">Ophthalmology</option>
          <option value="Urology">Urology</option>
          <option value="Dentistry">Dentistry</option>
          <option value="Oncology">Oncology</option>
          <option value="Nephrology">Nephrology</option>
          <option value="Rheumatology">Rheumatology</option>
          <option value="Nutrition & Dietetics">Nutrition & Dietetics</option>
          <option value="Physiotherapy">Physiotherapy & Rehab</option>
        </select>

        {/* 10 Languages Filter */}
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="bn">বাংলা (Bengali)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="es">Español (Spanish)</option>
          <option value="fr">Français (French)</option>
          <option value="ar">العربية (Arabic)</option>
          <option value="zh">中文 (Mandarin)</option>
        </select>
      </div>

      {/* Results Display */}
      {loading ? (
        <p style={{ color: '#00e676' }}>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p style={{ color: '#9fb3c6' }}>No doctors found matching your filters.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {doctors.map((doc) => (
            <div key={doc._id} style={cardStyle}>
              <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{doc.name}</h3>
              <p style={{ color: '#ff6b3d', margin: '5px 0', fontWeight: 'bold' }}>{doc.specialty}</p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: '4px 0' }}>
                Experience: {doc.experienceYears} years
              </p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: '4px 0' }}>
                Fee: ₹{doc.consultationFee}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '4px 0' }}>
                Languages: {Array.isArray(doc.languages) ? doc.languages.join(', ').toUpperCase() : doc.languages}
              </p>
              <button 
                onClick={() => alert(`Booking appointment with ${doc.name}`)}
                style={btnStyle}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  padding: '10px 14px',
  borderRadius: '6px',
  backgroundColor: '#1c3d52',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.2)',
  fontSize: '0.95rem',
  cursor: 'pointer'
};

const cardStyle = {
  backgroundColor: '#1c3d52',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  border: '1px solid #2e526b'
};

const btnStyle = {
  marginTop: '15px',
  padding: '10px 16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  width: '100%'
};