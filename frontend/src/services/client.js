import { io } from 'socket.io-client';
const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const socketBase = import.meta.env.VITE_SOCKET_URL || (apiBase.startsWith('http') ? new URL(apiBase).origin : 'http://localhost:5000');
export async function api(path, options = {}) { const token = localStorage.getItem('token'); const response = await fetch(`${apiBase}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Request failed.'); return data; }
export const socket = () => io(socketBase, { autoConnect: true, auth: { token: localStorage.getItem('token') } });
