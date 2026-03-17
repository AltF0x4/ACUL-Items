import React, { useState, useEffect } from 'react';
import { useLoginPassword, useClient, useTransaction } from '@auth0/auth0-acul-react/login-password';
import academyLogo from '../assets/academy.png';
import insuranceLogo from '../assets/insurance.png';

export default function LoginPasswordPrompt() {
  const loginPasswordProvider = useLoginPassword();
  const client = useClient();
  const transaction = useTransaction();
  
  const [localError, setLocalError] = useState(null);
  const [savedEmail, setSavedEmail] = useState('');

  const isInsurance = client?.id === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov';
  const isAcademy = client?.id === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og';
  const theme = isInsurance ? 'theme-insurance' : (isAcademy ? 'theme-academy' : 'theme-default');
  const logo = isInsurance ? insuranceLogo : (isAcademy ? academyLogo : null);
  const appName = isInsurance ? 'Insurance Management System' : (isAcademy ? 'Academy Learning Portal' : 'Welcome');

  const serverError = transaction?.errors?.[0]?.message || transaction?.errors?.[0]?.description;
  const displayError = localError || serverError;

  useEffect(() => {
    // Read the email we saved on the previous screen
    const emailFromStorage = sessionStorage.getItem('acul_saved_email') || '';
    setSavedEmail(emailFromStorage);
  }, []);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setLocalError(null);
    
    try {
      await loginPasswordProvider.login({ password: event.target.password.value });
    } catch (error) {
      console.error("Auth0 Error:", error);
      setLocalError(error.message || error.description || "Incorrect password. Please try again.");
    }
  };

  const handleBack = () => {
    const queryParams = window.location.search;
    window.location.href = `/u/login/identifier${queryParams}`;
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="login-card">
        <div className="branding-header">
          {logo && <img src={logo} alt="Logo" className="app-logo" />}
          <h1 className="app-title">{appName}</h1>
          <p className="app-subtitle">Please enter your password</p>
        </div>

        {displayError && (
          <div style={{ color: '#d93025', backgroundColor: '#fce8e6', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>
            {displayError}
          </div>
        )}

        <form onSubmit={formSubmitHandler} className="login-form">
          
          <div className="input-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="disabled-username">Email address</label>
            <input 
              type="text" 
              id="disabled-username" 
              value={savedEmail} 
              disabled 
              style={{ 
                backgroundColor: '#e9ecef', 
                color: '#555555',             // Dark gray text
                border: '1px solid #ced4da',
                opacity: 1,                 
                WebkitTextFillColor: '#555555', // Safari dark gray text fix
                userSelect: 'none',           // Prevents text highlighting
                WebkitUserSelect: 'none',     // Safari highlight prevention
                pointerEvents: 'none'         // Prevents clicking/focusing entirely
              }} 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required autoFocus placeholder="Enter your password" />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            <button 
              type="button" 
              onClick={handleBack} 
              style={{ background: 'transparent', border: 'none', color: '#0056b3', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 0', fontSize: '14px', fontWeight: 'bold' }}
            >
              <span style={{ fontSize: '18px' }}>←</span> Back
            </button>
            
            <button type="submit" className="submit-btn" style={{ width: 'auto', padding: '10px 30px' }}>
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
