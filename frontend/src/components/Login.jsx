import { ArrowRight, NotebookPen } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroImage from '../assets/login_hero.jpg';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Determine if we are logging in or signing up
      const endpoint = isLogin ? `${import.meta.env.VITE_API_URL}/auth/login` : `${import.meta.env.VITE_API_URL}/auth/signup`;

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

    } catch {
      setError('Failed to connect to the server');
    }
  };

  return (
    <div className="auth-container animate-fade-in">

      {/* Left Side: Hero Image & Branding */}
      <div className="auth-hero">
        <img src={HeroImage} alt="" aria-hidden="true" className="auth-hero-img" />
        <div className="auth-hero-overlay">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <NotebookPen size={48} color="#a855f7" />
            <h1 className="auth-logo" style={{ marginBottom: 0, fontSize: '2.5rem', textAlign: 'left' }}>NoteMaster Pro</h1>
          </div>
          <h2 className="auth-hero-title">Organize your thoughts.<br />Secure your ideas.</h2>
          <p className="auth-hero-text">
            Join thousands of professionals who use NoteMaster Pro to capture, organize, and execute on their best ideas every single day.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="auth-form-wrapper">
        <div className="glass-card auth-box">
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '10px' }}>
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="auth-subtitle" style={{ textAlign: 'left', marginBottom: '30px' }}>
            {isLogin ? 'Enter your details to access your notes.' : 'Start managing your notes securely today.'}
          </p>

          <form onSubmit={handleSubmit}>
            {error && <div role="alert" style={{ color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

            {!isLogin && (
              <div className="input-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  className="input-field"
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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

            <button type="submit" className="btn-primary" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px' }}>
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '30px', fontSize: '0.95rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600', background: 'none', border: 'none', padding: 0, fontSize: '0.95rem', fontFamily: 'inherit' }}
            >
              {isLogin ? 'Sign up here' : 'Log in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
