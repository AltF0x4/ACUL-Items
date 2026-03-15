import React from 'react';
import LoginId from '@auth0/auth0-acul-js/login-id';

export default function LoginIdPrompt() {
  // Initialize the SDK specifically for this screen
  const screenProvider = new LoginId();

  const formSubmitHandler = (event) => {
    event.preventDefault();

    // Disable the submit button to prevent double-clicks
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.setAttribute("disabled", "true");

    // Grab the value from the form
    const identifierInput = event.target.querySelector('input[name="username"]').value;

    // Hand off to the Auth0 pipeline
    screenProvider.login({ username: identifierInput });
  };

  return (
    <div className="login-card">
      <div className="branding-header">
        <h1 className="app-title">Welcome</h1>
        <p className="app-subtitle">Please enter your email to continue</p>
      </div>

      <form onSubmit={formSubmitHandler} className="login-form">
        <div className="input-group">
          <label htmlFor="username">Email address</label>
          <input 
            type="email" 
            name="username" 
            id="username" 
            required 
            placeholder="Enter your email"
          />
        </div>
        <button type="submit" className="submit-btn">Continue</button>
      </form>
    </div>
  );
}
