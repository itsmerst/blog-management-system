import React from 'react';
import PostEditor from '../components/PostEditor';

export default function AuthorPanel({ user }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold">Author Dashboard</h2>
        <p className="text-sm text-gray-500">Hello, {user.username}</p>
      </div>
      <PostEditor user={user} />
    </div>
  );
}
