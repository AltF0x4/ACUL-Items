import React from 'react';
import { useLoginPassword, useClient } from '@auth0/auth0-acul-react/login-password';
import academyLogo from '../assets/academy.png';
import insuranceLogo from '../assets/insurance.png';

export default function LoginPasswordPrompt() {
  const loginPasswordProvider = useLoginPassword();
  const client = useClient();

  const isInsurance = client?.id === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov';
  const isAcademy = client?.id === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og';
  
  const theme = isInsurance ? 'theme-insurance' : (isAcademy ? 'theme-academy' : 'theme-default');
  const logo = isInsurance ? insuranceLogo : (isAcademy ? academyLogo : null);
  const appName = isInsurance ? 'Insurance Management System' : (isAcademy ? 'Academy Learning Portal' : 'Welcome');

  const formSubmitHandler = (event) => {
    event.preventDefault();
    loginPasswordProvider.login({ password: event.target.password.value });
  };

  const handleBack = () => {
    // Redirects to the root login URL to restart the flow
    window.location.href = '/u/login';
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="login-card">
        <div className="branding-header">
          {logo && <img src={logo} alt="Logo" className="app-logo" />}
          <h1 className="app-title">{appName}</h1>
          <p className="app-subtitle">Please enter your password</p>
        </div>

        <form onSubmit={formSubmitHandler} className="login-form">
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required placeholder="Enter your password" />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {/* Back Button */}
            <button 
              type="button" 
              onClick={handleBack} 
              className="submit-btn" 
              style={{ backgroundColor: 'transparent', color: '#666', border: '1px solid #ccc', flex: 1 }}
            >
              Back
            </button>
            
            {/* Login Button */}
            <button type="submit" className="submit-btn" style={{ flex: 2 }}>
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
