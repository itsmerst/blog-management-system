import React, {useState} from 'react';

export default function Login({onLogin}) {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');

  const submit = async () => {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username,password})
    });
    if(res.ok) {
      const data = await res.json();
      onLogin(data);
    } else {
      const e = await res.json().catch(()=>({}));
      alert(e.error || 'login failed');
    }
  };

  return <div>
    <h3>Login</h3>
    <input placeholder='username' value={username} onChange={e=>setUsername(e.target.value)}/><br/>
    <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)}/><br/>
    <button onClick={submit}>Login</button>
  </div>;
}
