import React from 'react';
import LoginPassword from '@auth0/auth0-acul-js/login-password';

export default function LoginPasswordPrompt({ appData }) {
  // Initialize the SDK strictly for the password screen
  const screenProvider = new LoginPassword();

  const formSubmitHandler = (event) => {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.setAttribute("disabled", "true");

    // Grab the password and hand execution back to Auth0
    const passwordInput = event.target.querySelector('input[name="password"]').value;
    screenProvider.login({ password: passwordInput });
  };

  return (
    <div className="login-card">
      <div className="branding-header">
        {appData.logo && <img src={appData.logo} alt={`${appData.name} Logo`} className="app-logo" />}
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
