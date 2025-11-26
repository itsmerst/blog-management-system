import React, {useEffect, useState} from 'react';
import Login from './auth/Login';
import Register from './auth/Register';
import AdminPanel from './pages/AdminPanel';
import AuthorPanel from './pages/AuthorPanel';
import ReaderPanel from './pages/ReaderPanel';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const onLogin = (data) => {
    setToken(data.token);
    setUser({username: data.username, role: data.role});
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken || '');
    localStorage.setItem('user', JSON.stringify({username: data.username, role: data.role}));
  };

  const onLogout = () => {
    const username = user && user.username;
    fetch('http://localhost:8080/api/auth/logout', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username})
    }).catch(()=>{});
    setToken(null); setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  let content;
  if(!token || !user) {
    content = (
      <>
        <Login onLogin={onLogin}/>
        <hr/>
        <Register/>
      </>
    );
  } else if(user.role === 'ROLE_ADMIN') {
    content = <AdminPanel user={user} onLogout={onLogout} />;
  } else if(user.role === 'ROLE_AUTHOR') {
    content = <AuthorPanel user={user} onLogout={onLogout} />;
  } else {
    content = <ReaderPanel user={user} onLogout={onLogout} />;
  }

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1>Blog Management System</h1>
      {content}
    </div>
  );
}
