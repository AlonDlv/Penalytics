import { useState, useEffect } from 'react';

// --- Constants ---
const LOCATIONS = ['Bed', 'Shower', 'Toilet', 'Public'];
const MOODS_BEFORE = ['Horny', 'Stressed', 'Bored', 'Lonely', 'Anxious', 'Tired'];
const MOODS_AFTER = ['Relaxed', 'Regret', 'Sleepy', 'Energetic', 'Shameful', 'Satisfied', 'Other'];

// --- Components ---

const Login = ({ onLogin }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pass === '1234') onLogin();
    else setError(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 p-6">
      <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-xl border-2 border-white w-full max-w-sm flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-center leading-tight drop-shadow-sm">
          Welcome back big daddy
        </h1>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password..."
            className="bg-white/80 border-2 border-pink-200 rounded-2xl p-4 text-center text-purple-700 placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all shadow-inner"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoFocus
          />
          <button type="submit" className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 active:scale-95 transition-all cursor-pointer">
            ✨ Enter ✨
          </button>
          {error && <p className="text-red-400 text-center font-bold bg-red-50 p-2 rounded-lg">Wrong password! 🥺</p>}
        </form>
      </div>
    </div>
  );
};

const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === ' ' && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) setTags([...tags, input.trim()]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} onClick={() => setTags(tags.filter(t => t !== tag))} className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-bold border border-pink-200 cursor-pointer hover:bg-red-100 hover:text-red-500 transition-colors">
            #{tag}
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type tag & space..."
        className="bg-purple-50 p-3 rounded-xl border-2 border-purple-100 focus:border-purple-300 focus:bg-white outline-none text-purple-700 placeholder-purple-300 transition-all"
      />
    </div>
  );
};

const LogForm = ({ onSave, onCancel }) => {
  const now = new Date();
  
  const [formData, setFormData] = useState({
    timestamp: now.toISOString(),
    duration: '',
    location: 'Bed',
    locationDetail: '',
    porn: false,
    genreTags: [],
    videoCount: 0,
    moodBefore: 'Horny',
    horninessLevel: 3,
    moodAfter: 'Relaxed',
    moodAfterDetail: '',
    satisfaction: 5,
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...formData, id: Date.now() }); }} 
      className="w-full max-w-lg bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-4 border-white flex flex-col gap-6"
    >
      <h2 className="text-3xl font-bold text-purple-600 text-center">New Entry 📝</h2>

      {/* Duration */}
      <label className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
        <span className="text-blue-400 font-bold text-sm uppercase block mb-2">Duration (mins)</span>
        <input 
          type="number" required
          className="w-full bg-white p-3 rounded-xl border border-blue-200 outline-none text-blue-600 font-bold text-lg"
          value={formData.duration}
          onChange={e => handleChange('duration', e.target.value)}
        />
      </label>

      {/* Location */}
      <div className="bg-pink-50 p-4 rounded-2xl border-2 border-pink-100">
        <span className="text-pink-400 font-bold text-sm uppercase block mb-3">Location</span>
        <div className="grid grid-cols-2 gap-3">
          {LOCATIONS.map(loc => (
            <button
              key={loc} type="button"
              onClick={() => handleChange('location', loc)}
              className={`p-3 rounded-xl font-bold transition-all ${
                formData.location === loc 
                  ? 'bg-pink-400 text-white shadow-md transform scale-105' 
                  : 'bg-white text-pink-300 hover:bg-pink-100'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
        {formData.location === 'Public' && (
          <input 
            type="text" placeholder="Where exactly? 👀" 
            className="mt-3 w-full bg-white p-3 rounded-xl border-2 border-pink-200 outline-none text-pink-600"
            value={formData.locationDetail} onChange={e => handleChange('locationDetail', e.target.value)}
          />
        )}
      </div>

      {/* Porn Toggle */}
      <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100 flex items-center justify-between">
        <span className="text-purple-400 font-bold">Watched content?</span>
        <button
          type="button"
          onClick={() => handleChange('porn', !formData.porn)}
          className={`w-14 h-8 rounded-full p-1 transition-colors ${formData.porn ? 'bg-purple-400' : 'bg-gray-200'}`}
        >
          <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${formData.porn ? 'translate-x-6' : ''}`} />
        </button>
      </div>

      {/* Porn Details */}
      {formData.porn && (
        <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100 -mt-4 flex flex-col gap-4">
          <label>
            <span className="text-purple-400 text-sm font-bold block mb-1">How many videos?</span>
            <input type="number" className="w-full bg-white p-2 rounded-xl border border-purple-200 outline-none text-purple-600"
              value={formData.videoCount} onChange={e => handleChange('videoCount', e.target.value)} />
          </label>
          <div>
            <span className="text-purple-400 text-sm font-bold block mb-2">Tags</span>
            <TagInput tags={formData.genreTags} setTags={(t) => handleChange('genreTags', t)} />
          </div>
        </div>
      )}

      {/* Moods */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-100">
          <span className="text-orange-400 text-sm font-bold block mb-2">Before</span>
          <select className="w-full bg-white p-2 rounded-xl text-orange-500 border border-orange-200 outline-none"
            value={formData.moodBefore} onChange={e => handleChange('moodBefore', e.target.value)}>
            {MOODS_BEFORE.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {formData.moodBefore === 'Horny' && (
            <div className="mt-3">
              <input type="range" min="1" max="5" className="w-full accent-orange-400"
                value={formData.horninessLevel} onChange={e => handleChange('horninessLevel', e.target.value)} />
              <div className="text-center text-orange-400 font-bold text-sm">🔥 Level {formData.horninessLevel}</div>
            </div>
          )}
        </div>

        <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-100">
          <span className="text-green-400 text-sm font-bold block mb-2">After</span>
          <select className="w-full bg-white p-2 rounded-xl text-green-500 border border-green-200 outline-none"
            value={formData.moodAfter} onChange={e => handleChange('moodAfter', e.target.value)}>
            {MOODS_AFTER.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {formData.moodAfter === 'Other' && (
             <input type="text" placeholder="..." className="mt-2 w-full bg-white p-1 rounded border border-green-200 text-sm"
             value={formData.moodAfterDetail} onChange={e => handleChange('moodAfterDetail', e.target.value)} />
          )}
        </div>
      </div>

      {/* Satisfaction */}
      <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-100">
        <span className="text-yellow-400 text-sm font-bold block mb-2">Satisfaction 🌟</span>
        <div className="flex items-center gap-4">
          <input type="range" min="1" max="10" className="w-full accent-yellow-400"
            value={formData.satisfaction} onChange={e => handleChange('satisfaction', e.target.value)} />
          <span className="text-2xl font-black text-yellow-400 w-8">{formData.satisfaction}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <button type="button" onClick={onCancel} className="bg-slate-100 text-slate-400 py-3 rounded-xl font-bold hover:bg-slate-200 transition cursor-pointer">Cancel</button>
        <button type="submit" className="bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl active:scale-95 transition cursor-pointer">Save ✨</button>
      </div>
    </form>
  );
};

// --- Main App ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('dashboard');
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('penalytics_logs')) || []);

  useEffect(() => localStorage.setItem('penalytics_logs', JSON.stringify(logs)), [logs]);

  const handleSave = (newLog) => {
    setLogs([newLog, ...logs]);
    setView('dashboard');
  };

  if (!isAuthenticated) return <Login onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-slate-600 flex flex-col items-center py-10 px-4 font-sans">
      
      {view === 'dashboard' && (
        <>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-8 tracking-tight drop-shadow-sm">
            Penalytics
          </h1>
          
          <button 
            onClick={() => setView('form')}
            className="bg-white text-purple-500 text-xl font-bold py-5 px-10 rounded-3xl shadow-xl border-4 border-purple-100 hover:border-purple-300 hover:scale-105 transition-all cursor-pointer mb-12 flex items-center gap-2"
          >
            <span>✨</span> Log New Fap <span>✨</span>
          </button>

          <div className="w-full max-w-md">
            <h3 className="text-purple-300 font-bold text-sm uppercase tracking-wider mb-4 text-center">Your History ({logs.length})</h3>
            <div className="space-y-4">
              {logs.length === 0 && (
                <div className="bg-white/50 p-6 rounded-3xl text-center border-2 border-dashed border-purple-200 text-purple-300">
                  No logs yet! Get busy! 😜
                </div>
              )}
              {logs.map((log, i) => (
                <div key={log.id} className={`p-5 rounded-3xl border-2 flex flex-col gap-2 shadow-sm bg-white border-purple-100`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-600">{new Date(log.timestamp).toLocaleDateString()}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold bg-blue-100 text-blue-500`}>
                      {new Date(log.timestamp).getHours() < 12 ? 'Morning ☀️' : new Date(log.timestamp).getHours() < 18 ? 'Noon 🌤️' : 'Night 🌙'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400 font-medium">
                    <span>{log.duration} mins • {log.location}</span>
                    <span className={log.satisfaction >= 8 ? 'text-yellow-400 font-bold' : 'text-slate-400'}>
                      {log.satisfaction}/10 ⭐
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {view === 'form' && <LogForm onSave={handleSave} onCancel={() => setView('dashboard')} />}
    </div>
  );
}