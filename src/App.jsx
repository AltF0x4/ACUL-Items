import React from 'react';
import { useLoginId, useClient } from '@auth0/auth0-acul-react/login-id';
import academyLogo from '../assets/academy.png';
import insuranceLogo from '../assets/insurance.png';

export default function LoginIdPrompt() {
  // Grab the whole object, DO NOT destructure!
  const loginIdProvider = useLoginId(); 
  const client = useClient();

  const isInsurance = client?.id === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov';
  const isAcademy = client?.id === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og';
  
  const theme = isInsurance ? 'theme-insurance' : (isAcademy ? 'theme-academy' : 'theme-default');
  const logo = isInsurance ? insuranceLogo : (isAcademy ? academyLogo : null);
  const appName = isInsurance ? 'Insurance Management System' : (isAcademy ? 'Academy Learning Portal' : 'Welcome');

  const formSubmitHandler = (event) => {
    event.preventDefault();
    // Call the method ON the object to keep the 'this' context safe
    loginIdProvider.login({ username: event.target.username.value });
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="login-card">
        <div className="branding-header">
          {logo && <img src={logo} alt="Logo" className="app-logo" />}
          <h1 className="app-title">{appName}</h1>
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
    </div>
  );
}
