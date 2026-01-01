import React from 'react';

export default function Analytics({ logs, onBack }) {
  // --- Calculations ---
  const total = logs.length;
  
  const avgDuration = total ? Math.round(logs.reduce((acc, log) => acc + Number(log.duration), 0) / total) : 0;
  
  const avgSatisfaction = total ? (logs.reduce((acc, log) => acc + Number(log.satisfaction), 0) / total).toFixed(1) : 0;

  // Find most frequent location
  const locationCounts = logs.reduce((acc, log) => {
    acc[log.location] = (acc[log.location] || 0) + 1;
    return acc;
  }, {});
  const topLocation = Object.keys(locationCounts).sort((a, b) => locationCounts[b] - locationCounts[a])[0] || '-';

  // Mood Stats
  const moodCounts = logs.reduce((acc, log) => {
    acc[log.moodBefore] = (acc[log.moodBefore] || 0) + 1;
    return acc;
  }, {});
  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          Analytics
        </h2>
        <button onClick={onBack} className="bg-white text-slate-500 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 cursor-pointer">
          ← Back
        </button>
      </div>

      {/* Key Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Logs" value={total} color="bg-blue-50 text-blue-500" />
        <StatCard label="Avg Duration" value={`${avgDuration}m`} color="bg-purple-50 text-purple-500" />
        <StatCard label="Avg Sat" value={`${avgSatisfaction}⭐`} color="bg-yellow-50 text-yellow-500" />
        <StatCard label="Fav Spot" value={topLocation} color="bg-pink-50 text-pink-500" />
      </div>

      {/* Mood Chart */}
      <div className="bg-white/60 p-6 rounded-3xl border-2 border-white shadow-lg mb-8">
        <h3 className="text-lg font-bold text-slate-400 uppercase tracking-wider mb-4">Top Moods Before</h3>
        <div className="space-y-3">
          {sortedMoods.map(([mood, count]) => (
            <div key={mood} className="flex items-center gap-3">
              <span className="w-20 text-sm font-bold text-slate-500 text-right">{mood}</span>
              <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-purple-400">{count}</span>
            </div>
          ))}
          {total === 0 && <p className="text-center text-slate-400 italic">No data yet</p>}
        </div>
      </div>

      {/* Satisfaction Trend (Simple List) */}
      <div className="bg-white/60 p-6 rounded-3xl border-2 border-white shadow-lg">
        <h3 className="text-lg font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Satisfaction</h3>
        <div className="flex items-end gap-2 h-32 border-b border-slate-200 pb-2 px-2">
          {logs.slice(0, 15).reverse().map((log, i) => ( // Show last 15
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div 
                className="w-full bg-yellow-300 rounded-t-md hover:bg-yellow-400 transition-all"
                style={{ height: `${(log.satisfaction / 10) * 100}%` }}
              ></div>
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                {new Date(log.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
           {total === 0 && <p className="w-full text-center text-slate-400 self-center">No logs to graph</p>}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, color }) => (
  <div className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm ${color}`}>
    <span className="text-2xl font-black">{value}</span>
    <span className="text-xs font-bold uppercase opacity-70">{label}</span>
  </div>
);