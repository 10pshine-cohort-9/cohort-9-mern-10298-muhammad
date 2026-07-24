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
    // In a real app, you'd call your backend API here
    console.log('Authenticating...', { email, password });
    
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
              <label>Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe"
                required
              />
            </div>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
               <input 
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
            <label>Password</label>
            <input 
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
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign up here' : 'Log in here'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
