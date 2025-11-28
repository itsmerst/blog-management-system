import React from 'react';
import StatCard from '../components/StatCard';
import KpiRing from '../components/KpiRing';

export default function Dashboard({ stats = {}, onCompose }) {
  const published = stats.published ?? 102;
  const scheduled = stats.scheduled ?? 8;
  const drafts = stats.drafts ?? 14;
  const totalViews = stats.totalViews ?? 1027;
  const topCategory = stats.topCategory ?? { name: 'Article', percent: 70 };
  const impressions = stats.impressions ?? 886;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Published" value={published} subtitle="Total Published" color="from-yellow-400 to-orange-400" />
        <StatCard title="Scheduled" value={scheduled} subtitle="Upcoming posts" color="from-pink-500 to-violet-500" />
        <StatCard title="Drafts" value={drafts} subtitle="Work in progress" color="from-indigo-400 to-blue-400" action={onCompose} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Mostly Viewed Category</div>
              <div className="flex items-center gap-4 mt-3">
                <div><KpiRing percent={topCategory.percent} /></div>
                <div>
                  <div className="text-lg font-semibold">{topCategory.name}</div>
                  <div className="text-sm text-gray-500">Total Views This Month</div>
                  <div className="text-2xl font-bold mt-1">{totalViews}</div>
                </div>
              </div>
            </div>
            <div>
              <button className="bg-gradient-to-br from-green-400 to-teal-500 text-white px-4 py-2 rounded-lg shadow">View Full Statistics</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Top Impressions From Social Channels</div>
              <div className="text-2xl font-bold mt-2">{impressions}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-green-600 font-semibold">+12% this month</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Facebook', pct: 30 },
              { name: 'Twitter', pct: 20 },
              { name: 'LinkedIn', pct: 18 },
              { name: 'Instagram', pct: 12 },
            ].map((c) => (
              <div key={c.name} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">Total Views</div>
                </div>
                <div className="text-lg font-semibold">{c.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
