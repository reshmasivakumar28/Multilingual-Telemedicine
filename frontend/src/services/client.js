import { io } from 'socket.io-client';
const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export async function api(path, options = {}) { const token = localStorage.getItem('token'); const response = await fetch(`${base}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Request failed.'); return data; }
export const socket = () => io(base.replace('/api', ''), { autoConnect: true, auth: { token: localStorage.getItem('token') } });
