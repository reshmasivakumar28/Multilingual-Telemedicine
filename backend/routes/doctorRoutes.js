const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// 1. GET /api/doctors - Search and filter doctors by specialty or language
router.get('/', async (req, res) => {
  try {
    const { specialty, language } = req.query;
    let query = {};

    if (specialty) {
      query.specialty = { $regex: specialty, $options: 'i' };
    }

    if (language) {
      query.languages = { $in: [language] };
    }

    const doctors = await Doctor.find(query);
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve doctors', error: error.message });
  }
});

// 2. SEED ROUTE (Must be defined BEFORE the /:id route)
const seedDatabase = async (req, res) => {
  try {
    await Doctor.deleteMany({});

    const sampleDoctors = [
      { name: "Dr. Ananya Sharma", specialty: "General Physician", languages: ["en", "hi", "ta"], experienceYears: 8, consultationFee: 500, isAvailable: true, rating: 4.9 },
      { name: "Dr. Rajesh Kumar", specialty: "Cardiology", languages: ["en", "ta", "te"], experienceYears: 12, consultationFee: 800, isAvailable: true, rating: 4.8 },
      { name: "Dr. Priya Patel", specialty: "Pediatrics", languages: ["en", "hi", "bn"], experienceYears: 6, consultationFee: 450, isAvailable: true, rating: 4.7 },
      { name: "Dr. Jean Dupont", specialty: "Dermatology", languages: ["en", "fr", "es"], experienceYears: 10, consultationFee: 650, isAvailable: true, rating: 4.6 },
      { name: "Dr. Tariq Al-Mansoor", specialty: "Neurology", languages: ["en", "ar", "fr"], experienceYears: 15, consultationFee: 900, isAvailable: false, rating: 4.9 },
      { name: "Dr. Mei Ling", specialty: "Gynecology & Obstetrics", languages: ["en", "zh", "mr"], experienceYears: 7, consultationFee: 550, isAvailable: true, rating: 4.8 },
      { name: "Dr. Suresh Menon", specialty: "Orthopedics", languages: ["en", "ta", "hi"], experienceYears: 11, consultationFee: 700, isAvailable: true, rating: 4.7 },
      { name: "Dr. Kavita Reddy", specialty: "Psychiatry", languages: ["en", "te", "hi"], experienceYears: 9, consultationFee: 750, isAvailable: true, rating: 4.9 },
      { name: "Dr. Amit Mukherjee", specialty: "ENT", languages: ["en", "bn", "hi"], experienceYears: 14, consultationFee: 600, isAvailable: true, rating: 4.8 },
      { name: "Dr. Sunita Deshmukh", specialty: "Endocrinology", languages: ["en", "mr", "hi"], experienceYears: 10, consultationFee: 850, isAvailable: true, rating: 4.7 },
      { name: "Dr. Carlos Silva", specialty: "Gastroenterology", languages: ["en", "es", "fr"], experienceYears: 13, consultationFee: 800, isAvailable: true, rating: 4.8 },
      { name: "Dr. Ahmed Hassan", specialty: "Pulmonology", languages: ["en", "ar"], experienceYears: 9, consultationFee: 700, isAvailable: true, rating: 4.6 },
      { name: "Dr. Vikram Singh", specialty: "Ophthalmology", languages: ["en", "hi", "ta"], experienceYears: 8, consultationFee: 500, isAvailable: true, rating: 4.7 },
      { name: "Dr. Fatima Al-Zahra", specialty: "Urology", languages: ["en", "ar", "es"], experienceYears: 12, consultationFee: 850, isAvailable: true, rating: 4.9 },
      { name: "Dr. Chen Wei", specialty: "Dentistry", languages: ["en", "zh"], experienceYears: 5, consultationFee: 400, isAvailable: true, rating: 4.5 },
      { name: "Dr. Robert Taylor", specialty: "Oncology", languages: ["en", "fr"], experienceYears: 18, consultationFee: 1200, isAvailable: true, rating: 5.0 },
      { name: "Dr. Meera Joshi", specialty: "Nephrology", languages: ["en", "mr", "hi"], experienceYears: 10, consultationFee: 750, isAvailable: true, rating: 4.8 },
      { name: "Dr. Sanjay Rao", specialty: "Rheumatology", languages: ["en", "te", "ta"], experienceYears: 16, consultationFee: 900, isAvailable: true, rating: 4.9 },
      { name: "Dr. Anita Gupta", specialty: "Nutrition & Dietetics", languages: ["en", "hi", "bn"], experienceYears: 6, consultationFee: 350, isAvailable: true, rating: 4.6 },
      { name: "Dr. David Miller", specialty: "Physiotherapy", languages: ["en", "es"], experienceYears: 7, consultationFee: 500, isAvailable: true, rating: 4.7 }
    ];

    const seededDoctors = await Doctor.insertMany(sampleDoctors);
    res.status(201).json({
      message: 'Database seeded successfully with 20 doctors!',
      count: seededDoctors.length,
      doctors: seededDoctors
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed doctor data', error: error.message });
  }
};

router.get('/seed', seedDatabase);
router.post('/seed', seedDatabase);

// 3. GET /api/doctors/:id - Fetch single doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor details', error: error.message });
  }
});

module.exports = router;