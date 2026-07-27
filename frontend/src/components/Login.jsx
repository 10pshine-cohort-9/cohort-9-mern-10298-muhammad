import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
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

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-card auth-box">
        <h1 className="auth-logo">NoteMaster Pro</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back. Let\'s get to work.' : 'Create your account to start managing notes.'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input 
                id="fullName"
                type="text" 
                className="input-field" 
                placeholder="John Doe"
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
