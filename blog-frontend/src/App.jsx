import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminPanel from "./pages/AdminPanel";
import AuthorPanel from "./pages/AuthorPanel";
import ReaderPanel from "./pages/ReaderPanel";
import API from './api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const onLogin = (data) => {
    setToken(data.token);
    setUser({ username: data.username, role: data.role });
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken || '');
    localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }));
  };

  const onLogout = () => {
    const username = user && user.username;
    try { API.post('/api/auth/logout', { username }); } catch(e){}
    setToken(null); setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  let content;
  if (!token || !user) {
    content = (
      <>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <Login onLogin={onLogin} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <Register />
          </div>
        </div>
      </>
    );
  } else if (user.role === 'ROLE_ADMIN') {
    content = <AdminPanel user={user} onLogout={onLogout} />;
  } else if (user.role === 'ROLE_AUTHOR') {
    content = <AuthorPanel user={user} onLogout={onLogout} />;
  } else {
    content = <ReaderPanel user={user} onLogout={onLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">{content}</div>
        </main>
      </div>
    </div>
  );
}
