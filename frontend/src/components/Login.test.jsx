import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Login from './Login';

describe('Login Component', () => {
  it('renders login form by default', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check if Sign In text is present
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    
    // Check if email and password inputs are present
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    
    // Check if submit button is present
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('switches to sign up mode when link is clicked', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Click the sign up link
    const signUpLink = screen.getByRole('button', { name: /Sign up here/i });
    fireEvent.click(signUpLink);

    // Check if subtitle changed to Create your account
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
    
    // Check if Name input appeared
    expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument();
    
    // Check if submit button changed
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });
});
