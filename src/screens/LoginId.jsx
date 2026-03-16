import React, { useState } from 'react';
import { useLoginId, useClient, useTransaction } from '@auth0/auth0-acul-react/login-id';
import academyLogo from '../assets/academy.png';
import insuranceLogo from '../assets/insurance.png';

export default function LoginIdPrompt() {
  const loginIdProvider = useLoginId();
  const client = useClient();
  const transaction = useTransaction();
  
  // State to hold our local error message
  const [localError, setLocalError] = useState(null);

  const isInsurance = client?.id === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov';
  const isAcademy = client?.id === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og';
  const theme = isInsurance ? 'theme-insurance' : (isAcademy ? 'theme-academy' : 'theme-default');
  const logo = isInsurance ? insuranceLogo : (isAcademy ? academyLogo : null);
  const appName = isInsurance ? 'Insurance Management System' : (isAcademy ? 'Academy Learning Portal' : 'Welcome');

  // Check if Auth0 sent an error on page load, or use our local error
  const serverError = transaction?.errors?.[0]?.message || transaction?.errors?.[0]?.description;
  const displayError = localError || serverError;

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setLocalError(null); // Clear previous errors
    
    try {
      // We MUST await the login so we can catch the error if it fails!
      await loginIdProvider.login({ username: event.target.username.value });
    } catch (error) {
      console.error("Auth0 Error:", error);
      // Catch the error so the app doesn't freeze, and display it to the user
      setLocalError(error.message || error.description || "Invalid email address. Please try again.");
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="login-card">
        <div className="branding-header">
          {logo && <img src={logo} alt="Logo" className="app-logo" />}
          <h1 className="app-title">{appName}</h1>
          <p className="app-subtitle">Please enter your email to continue</p>
        </div>

        {/* Display the error message if one exists */}
        {displayError && (
          <div style={{ color: '#d93025', backgroundColor: '#fce8e6', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>
            {displayError}
          </div>
        )}

        <form onSubmit={formSubmitHandler} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Email address</label>
            <input type="email" name="username" id="username" required placeholder="Enter your email" />
          </div>
          <button type="submit" className="submit-btn">Continue</button>
        </form>
      </div>
    </div>
  );
}
