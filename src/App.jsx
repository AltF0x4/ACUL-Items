import React, { useEffect, useState } from 'react';
import LoginIdPrompt from './screens/LoginId';
import LoginPasswordPrompt from './screens/LoginPassword'; 
// Import the actual SDK class directly for the router
import OrganizationPicker from '@auth0/auth0-acul-js/organization-picker';
import OrganizationPickerPrompt from './screens/OrganizationPicker';
import * as Screens from '@auth0/auth0-acul-js';

import academyLogo from './assets/academy.png';
import insuranceLogo from './assets/insurance.png';

export default function App() {
  const [theme, setTheme] = useState('theme-default');
  const [screenName, setScreenName] = useState(null);
  const [appData, setAppData] = useState({ name: 'Welcome', logo: null });

  useEffect(() => {
    let screenInstance = null;
    let currentScreen = null;

    try {
      screenInstance = new Screens.LoginId();
      currentScreen = 'login-id';
    } catch (e) {
      try {
        screenInstance = new Screens.LoginPassword();
        currentScreen = 'login-password';
      } catch (e2) {
        try {
          // Initialize the exact OrganizationPicker class
          screenInstance = new OrganizationPicker(); 
          currentScreen = 'organization-selection';
        } catch (e3) {
          console.error("SDK Error: Prompt context mismatch.");
        }
      }
    }

    if (currentScreen && screenInstance) {
      setScreenName(currentScreen);
      const clientId = screenInstance.client?.id || screenInstance.transaction?.client?.id;

      if (clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og') {
        setTheme('theme-academy');
        setAppData({ name: 'Academy Learning Portal', logo: academyLogo });
      } else if (clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov') {
        setTheme('theme-insurance');
        setAppData({ name: 'Insurance Management System', logo: insuranceLogo });
      }
    }
  }, []);

  const renderComponent = () => {
    if (!screenName) return <div className="loading">Loading Context...</div>;
    
    switch (screenName) {
      case 'login-id': return <LoginIdPrompt appData={appData} />;
      case 'login-password': return <LoginPasswordPrompt appData={appData} />;
      case 'organization-selection': return <OrganizationPickerPrompt appData={appData} />;
      default: return <p>Unsupported Screen: {screenName}</p>;
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      {renderComponent()}
    </div>
  );
}
