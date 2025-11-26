import React from 'react';
import PostEditor from '../components/PostEditor';

export default function AuthorPanel({user, onLogout}) {
  return <div>
    <h2>Author Dashboard</h2>
    <p>Welcome, {user.username}</p>
    <button onClick={onLogout}>Logout</button>
    <PostEditor user={user}/>
  </div>;
}
