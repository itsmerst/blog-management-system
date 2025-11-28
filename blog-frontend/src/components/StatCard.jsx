import React from 'react';
import { FiPlus } from 'react-icons/fi';

export default function StatCard({ title, value, subtitle, color='from-pink-500 to-purple-500', action }) {
  return (
    <div className="relative bg-white rounded-2xl shadow p-4 overflow-hidden">
      <div className={`absolute -left-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br ${color} opacity-20`}></div>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-500 uppercase">{title}</div>
          <div className="text-2xl font-semibold mt-2">{value}</div>
          {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
        </div>
        {action && (
          <button
            onClick={action}
            className="ml-4 bg-white/90 border border-gray-200 p-2 rounded-lg shadow-sm hover:scale-105 transition"
            aria-label="action"
          >
            <FiPlus />
          </button>
        )}
      </div>
    </div>
  );
}
