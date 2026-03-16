import React, { useState, useEffect } from 'react';
import LoginIdPrompt from './screens/LoginId';
import LoginPasswordPrompt from './screens/LoginPassword';
import OrganizationPickerPrompt from './screens/OrganizationPicker';

export default function App() {
  const [screenName, setScreenName] = useState(null);

  useEffect(() => {
    // 100% Native React routing based on the Auth0 URL.
    const path = window.location.pathname.toLowerCase();

    if (path.includes('login-password')) {
      setScreenName('login-password');
    } else if (path.includes('organization-picker') || path.includes('organization-selection')) {
      setScreenName('organization-picker');
    } else {
      setScreenName('login-id'); // Default fallback for the first screen
    }
  }, []);

  if (!screenName) return <div className="loading">Loading App...</div>;

  switch (screenName) {
    case 'login-id': 
      return <LoginIdPrompt />;
    case 'login-password': 
      return <LoginPasswordPrompt />;
    case 'organization-picker': 
      return <OrganizationPickerPrompt />;
    default: 
      return <p>Unsupported Screen: {screenName}</p>;
  }
}
