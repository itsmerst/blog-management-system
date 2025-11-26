import React from 'react';
import { apiFetch } from '../api';
import { useEffect, useState } from 'react';
import CategoryManager from '../components/CategoryManager';
import TagManager from '../components/TagManager';
import CommentManager from '../components/CommentManager';

export default function AdminPanel({user, onLogout}) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiFetch('/api/admin/users', {method:'GET'}).then(r=>r.json()).then(setUsers).catch(e=>console.error(e));
  },[]);

  return <div>
    <h2>Admin Dashboard</h2>
    <p>Welcome, {user.username}</p>
    <button onClick={onLogout}>Logout</button>

    <h3>Users</h3>
    <ul>{users.map(u => <li key={u.id}>{u.username} - {u.role}</li>)}</ul>

    <CategoryManager/>
    <TagManager/>
    <CommentManager/>
  </div>;
}
