import React from 'react';

export default function KpiRing({ percent = 70, size = 64 }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <g transform={`translate(${size/2},${size/2})`}>
        <circle r={radius} fill="none" stroke="#e6e9ee" strokeWidth={stroke} />
        <circle
          r={radius}
          fill="none"
          stroke="url(#g1)"
          strokeWidth={stroke}
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90)"
        />
        <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#111" fontWeight="700">
          {percent}%
        </text>
      </g>
    </svg>
  );
}
