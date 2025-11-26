import React, {useState} from 'react';

export default function Register() {
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('ROLE_READER');

  const submit = async () => {
    const res = await fetch('http://localhost:8080/api/auth/register', {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username,email,password,role})
    });
    if(res.ok) {
      alert('Registered, now login');
      setUsername('');setEmail('');setPassword('');
    } else {
      const e = await res.text();
      alert(e || 'register failed');
    }
  };

  return <div>
    <h3>Register</h3>
    <input placeholder='username' value={username} onChange={e=>setUsername(e.target.value)}/><br/>
    <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)}/><br/>
    <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)}/><br/>
    <select value={role} onChange={e=>setRole(e.target.value)}>
      <option value='ROLE_READER'>Reader</option>
      <option value='ROLE_AUTHOR'>Author</option>
    </select><br/>
    <button onClick={submit}>Register</button>
  </div>;
}
