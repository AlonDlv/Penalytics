import React, { useState, useEffect } from 'react';

const App = () => {
  // Load logs from local storage or start with empty array
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('user_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to local storage whenever logs change
  useEffect(() => {
    localStorage.setItem('user_logs', JSON.stringify(logs));
  }, [logs]);

  const handleLog = () => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);
  };

  const clearLogs = () => {
    if (window.confirm("Are you sure you want to clear history?")) {
      setLogs([]);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Personal Log</h1>
      
      <button onClick={handleLog} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Log Now
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>History ({logs.length})</h3>
        <ul>
          {logs.map(log => (
            <li key={log.id}>
              {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={clearLogs} style={{ marginTop: '20px', color: 'red' }}>
        Reset Data
      </button>
    </div>
  );
};

export default App;