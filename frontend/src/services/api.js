const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getHealthStatus() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error('The backend is unavailable.');
  return response.json();
}
