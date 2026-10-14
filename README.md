# Multilingual Telemedicine for Equitable Healthcare Access

A beginner-friendly full-stack college prototype supporting patients, doctors, and interpreters. It demonstrates multilingual access (English, Tamil, Hindi), role-secured workflows, online appointments, consultation records, real-time chat/signaling, and browser-based speech tools.

## Features

- JWT authentication with bcrypt password hashing and patient/doctor/interpreter roles
- Centralized English, Tamil, and Hindi UI labels
- Doctor profiles with specialization, languages, availability, and searchable cards
- Appointment booking, acceptance, cancellation, and consultation entry
- Doctor/patient consultation records and prescriptions
- Interpreter availability and matching requests by language
- Socket.IO real-time chat and WebRTC signaling for browser video calls
- Translation service endpoint with a safe development fallback
- Browser speech-to-text and text-to-speech controls when supported

## Stack and architecture

`React + Vite → Express + Socket.IO → MongoDB + Mongoose`

```
frontend/src/
  components/ConsultationRoom.jsx  Video, chat, translation, speech controls
  i18n/translations.js             Centralized UI labels
  services/client.js               REST and Socket.IO client
  App.jsx                          Auth, dashboards, navigation
backend/
  config/                          MongoDB configuration
  middleware/auth.js               JWT and role authorization
  models/                          All Mongoose models
  routes/apiRoutes.js              REST APIs
  server.js                        Express and Socket.IO server
```

## Setup

1. Install MongoDB locally or create a MongoDB Atlas cluster.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and a long random `JWT_SECRET`.
3. Copy `frontend/.env.example` to `frontend/.env` if the API is not running at `http://localhost:5000/api`.
4. For a fresh checkout, run `npm install` in both `backend` and `frontend`.

## Run

Use two terminals:

```powershell
cd backend
npm run dev
```

```powershell
cd frontend
npm run dev
```

Open `http://localhost:5173`, create separate patient, doctor, and interpreter accounts, then use the dashboards to demonstrate the workflow.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random JWT signing secret |
| `PORT` | Backend port; defaults to 5000 |
| `CLIENT_URL` | Frontend origin; defaults to `http://localhost:5173` |
| `TRANSLATION_API_KEY` | Reserved for a production translation provider |
| `VITE_API_URL` | Frontend API base URL |

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/doctors`, `PATCH /api/doctors/me`
- `POST /api/appointments`, `GET /api/appointments`, `PATCH /api/appointments/:id`
- `POST /api/consultations`, `GET /api/consultations`, `PATCH /api/consultations/:id`
- `POST /api/prescriptions`, `GET /api/prescriptions`
- `POST /api/interpreter-requests`, `GET/PATCH /api/interpreter-requests`
- `POST /api/translation` and `GET /api/health`

## Testing

```powershell
cd backend
npm test

cd ..\frontend
npm run lint
npm run build
```

To test WebRTC, open two authenticated accounts in separate browser windows/devices, join the same consultation, and allow camera/microphone permissions. Public STUN is used for prototype connectivity; production deployment needs TURN infrastructure. The translation route deliberately returns a labeled development fallback until you integrate a provider using `TRANSLATION_API_KEY` on the server.

## Future enhancements

- Replace the development translation fallback with a configured provider
- Add TURN servers, HTTPS, and production Socket.IO authentication
- Add richer clinical validation, audit trails, notifications, and automated API tests
