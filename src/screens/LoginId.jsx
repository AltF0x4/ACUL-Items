import React from 'react';
import LoginId from '@auth0/auth0-acul-js/login-id';

export default function LoginIdPrompt({ appData }) {
  const screenProvider = new LoginId();

  const formSubmitHandler = (event) => {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.setAttribute("disabled", "true");

    const identifierInput = event.target.querySelector('input[name="username"]').value;
    screenProvider.login({ username: identifierInput });
  };

  return (
    <div className="login-card">
      <div className="branding-header">
        {/* Render the dynamic logo and name */}
        {appData.logo && <img src={appData.logo} alt={`${appData.name} Logo`} className="app-logo" />}
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
