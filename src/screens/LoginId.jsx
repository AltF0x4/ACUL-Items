import React from 'react';
import { useLoginId } from '@auth0/auth0-acul-react/login-id';

export default function LoginIdPrompt({ appData }) {
  const { login } = useLoginId();

  const formSubmitHandler = (event) => {
    event.preventDefault();
    const identifierInput = event.target.username.value;
    // Use the React Hook to submit
    login({ username: identifierInput });
  };

  return (
    <div className="login-card">
      <div className="branding-header">
        {appData.logo && <img src={appData.logo} alt="Logo" className="app-logo" />}
        <h1 className="app-title">{appData.name}</h1>
        <p className="app-subtitle">Please enter your email to continue</p>
      </div>

      <form onSubmit={formSubmitHandler} className="login-form">
        <div className="input-group">
          <label htmlFor="username">Email address</label>
          <input type="email" name="username" id="username" required placeholder="Enter your email" />
        </div>
        <button type="submit" className="submit-btn">Continue</button>
      </form>
    </div>
  );
}
