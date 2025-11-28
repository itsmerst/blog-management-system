import React, { useState } from "react";
import { apiFetch } from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_READER");

  const submit = async () => {
    try {
      const res = await apiFetch('/api/auth/register', { method: 'POST', body: { username, email, password, role }});
      if (!res.ok) {
        const e = await res.text().catch(()=>(''));
        alert(e || 'Registration failed');
      } else {
        alert('Registered — please login');
        setUsername(''); setEmail(''); setPassword('');
      }
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Register</h3>
      <input className="w-full border rounded p-2 mb-2" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
      <input className="w-full border rounded p-2 mb-2" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full border rounded p-2 mb-2" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <select className="w-full border rounded p-2 mb-2" value={role} onChange={e => setRole(e.target.value)}>
        <option value="ROLE_READER">Reader</option>
        <option value="ROLE_AUTHOR">Author</option>
      </select>
      <button onClick={submit} className="w-full bg-emerald-600 text-white p-2 rounded">Register</button>
    </div>
  );
}
