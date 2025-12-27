/*import "./Test.css";*/
import React from "react";

export default function Test({ result }) {
  const extract = (v) => {
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  };

  let sugar = 0, fat = 0;
  result.nutrients.forEach(n => {
    if (n.name.toLowerCase().includes("sugar")) sugar = extract(n.value);
    if (n.name.toLowerCase().includes("fat")) fat = extract(n.value);
  });

  const badge =
    sugar >= 20 || fat >= 15
      ? { label: "UNHEALTHY", color: "bg-red-100 text-red-700" }
      : sugar >= 10 || fat >= 8
      ? { label: "MODERATE", color: "bg-orange-100 text-orange-700" }
      : { label: "HEALTHY", color: "bg-green-100 text-green-700" };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min((result.calories / 500) * 100, 100);
  const offset = circumference - (circumference * percent) / 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-700">
          {result.food}
        </h2>
        <span className={`px-4 py-1 rounded-full font-bold text-sm ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <p className="text-slate-500">{result.description}</p>

      {/* CALORIE RING */}
      <div className="flex justify-center">
        <div className="relative">
          <svg width="160" height="160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="14"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#22c55e"
              strokeWidth="14"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold">
              {result.calories}
            </span>
            <span className="text-sm text-slate-500">kcal</span>
          </div>
        </div>
      </div>

      {/* NUTRIENTS */}
      <div className="grid grid-cols-2 gap-3">
        {result.nutrients.map((n, i) => (
          <div
            key={i}
            className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-sm"
          >
            <strong>{n.name}</strong>: {n.value}
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
         <strong>Health Warning:</strong> {result.risk}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
         <strong>Better Option:</strong> {result.alternative}
      </div>
    </div>
  );
}
