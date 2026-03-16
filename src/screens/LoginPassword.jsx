import React from 'react';
import { useLoginPassword } from '@auth0/auth0-acul-react/login-password';

export default function LoginPasswordPrompt({ appData }) {
  const { login } = useLoginPassword();

  const formSubmitHandler = (event) => {
    event.preventDefault();
    const passwordInput = event.target.password.value;
    // Use the React Hook to submit
    login({ password: passwordInput });
  };

  return (
    <div className="login-card">
      <div className="branding-header">
        {appData.logo && <img src={appData.logo} alt="Logo" className="app-logo" />}
        <h1 className="app-title">{appData.name}</h1>
        <p className="app-subtitle">Please enter your password</p>
      </div>

      <form onSubmit={formSubmitHandler} className="login-form">
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required placeholder="Enter your password" />
        </div>
        <button type="submit" className="submit-btn">Log In</button>
      </form>
    </div>
  );
}
