import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState(''); // NEW: state for Full Name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // NEW: state for red error warnings

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors when they click submit

    try {
      // 1. Determine if we are logging in or signing up
      const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';

      // 2. Prepare the data to send to the backend
      const bodyData = isLogin ? { email, password } : { fullName, email, password };

      // 3. Make the actual request to the Node.js server
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      // 4. Check if the backend rejected us (e.g., wrong password, email exists)
      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      // 5. Success! Save the security token in the browser and redirect
      localStorage.setItem('token', data.data.token);
      navigate('/dashboard');

    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  /* const [isLogin, setIsLogin] = useState(true);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const navigate = useNavigate();
 
   const handleSubmit = (e) => {
     e.preventDefault();
     // Simulate successful login/signup and redirect
     setTimeout(() => {
       navigate('/dashboard');
     }, 800);
   };
 */
  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-card auth-box">
        <h1 className="auth-logo">NoteMaster Pro</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back. Let\'s get to work.' : 'Create your account to start managing notes.'}
        </p>

        <form onSubmit={handleSubmit}>
          {/* NEW: If there is an error, show a red warning box */}
          {error && <div style={{ color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

          {!isLogin && (
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={fullName} // NEW: Bind this input to our new state
                onChange={(e) => setFullName(e.target.value)} // NEW: Update state on type
                required
              />
            </div>
          )}


          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600', background: 'none', border: 'none', padding: 0, fontSize: '0.9rem', fontFamily: 'inherit' }}
          >
            {isLogin ? 'Sign up here' : 'Log in here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
