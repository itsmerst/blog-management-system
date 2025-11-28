import React, { useEffect, useState } from 'react';
import API from '../api';
import Dashboard from './Dashboard';
import CategoryManager from '../components/CategoryManager';
import TagManager from '../components/TagManager';
import CommentManager from '../components/CommentManager';

export default function AdminPanel({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    setLoadingUsers(true);
    API.get('/api/admin/users')
      .then((r) => setUsers(r.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));

    API.get('/api/admin/stats')
      .then((r) => setStats(r.data))
      .catch(() => {
        setStats({
          published: 102,
          scheduled: 8,
          drafts: 14,
          totalViews: 1027,
          topCategory: { name: 'Article', percent: 70 },
          impressions: 886
        });
      });
  }, []);

  const handleCompose = () => { alert('Open composer (implement modal or route)'); };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
          <p className="text-sm text-gray-500">Welcome back, {user?.username}</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleCompose} className="bg-gradient-to-br from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:brightness-105">Compose New</button>
          {onLogout && (<button onClick={onLogout} className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50">Logout</button>)}
        </div>
      </div>

      <Dashboard stats={stats} onCompose={handleCompose} />

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Users</h3>
            <div className="text-sm text-gray-500">{loadingUsers ? 'Loading...' : `${users.length} users`}</div>
          </div>

          <ul className="space-y-2 max-h-64 overflow-auto">
            {users.length === 0 && !loadingUsers && (<li className="text-sm text-gray-500">No users found</li>)}
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between border-b last:border-b-0 pb-2">
                <div>
                  <div className="font-medium">{u.username}</div>
                  <div className="text-xs text-gray-500">{u.email || '—'}</div>
                </div>
                <div className="text-sm text-gray-600">{u.role}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-medium mb-3">Managers</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <CategoryManager />
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <TagManager />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Comments</h3>
            <CommentManager />
          </div>
        </div>
      </section>
    </div>
  );
}
