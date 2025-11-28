import React, { useState } from "react";
import { apiFetch } from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', { method: 'POST', body: { username, password }});
      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        alert(err.error || 'Login failed');
      } else {
        const data = await res.json();
        onLogin(data);
      }
    } catch (e) {
      alert('Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Login</h3>
      <input className="w-full border rounded p-2 mb-2" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
      <input className="w-full border rounded p-2 mb-2" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={submit} disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">{loading? 'Signing...' : 'Login'}</button>
    </div>
  );
}
