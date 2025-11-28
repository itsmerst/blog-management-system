import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080' });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  cfg.headers['Content-Type'] = cfg.headers['Content-Type'] || 'application/json';
  return cfg;
});

export default API;

export async function apiFetch(path, options = {}) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const url = path.startsWith('http') ? path : (path.startsWith('/') ? `${base}${path}` : `${base}/${path}`);
  const headers = Object.assign({}, options.headers || {});
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    options.body = JSON.stringify(options.body);
  }
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, Object.assign({}, options, { headers }));
  return res;
}
