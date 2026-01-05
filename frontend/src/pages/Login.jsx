import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Send data to your FastAPI backend
      // We use URLSearchParams because FastAPI expects 'form-data' for OAuth2
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await axios.post('http://127.0.0.1:8000/token', params);

      // 2. Save the token securely
      localStorage.setItem('token', response.data.access_token);
      
      // 3. Move to the main app
      alert('Login Successful!');
      navigate('/dashboard'); // Change this to wherever you want to go after login

    } catch (err) {
      setError('Invalid username or password');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: 'auto', padding: '20px' }}>
      <h2>Login to Penalytics</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>Login</button>
      </form>
    </div>
  );
}

export default Login;