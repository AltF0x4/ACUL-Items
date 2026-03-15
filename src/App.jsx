import React, { useEffect, useState } from 'react';
import LoginIdPrompt from './screens/LoginId';
import LoginPasswordPrompt from './screens/LoginPassword'; 
import OrganizationPickerPrompt from './screens/OrganizationPicker';
import * as Screens from '@auth0/auth0-acul-js';

export default function App() {
  const [theme, setTheme] = useState('theme-default');
  const [screenName, setScreenName] = useState(null);
  const [appData, setAppData] = useState({ name: 'Welcome', logo: null });

  useEffect(() => {
    let screenInstance = null;
    let currentScreen = null;

    // SDK screens must be instantiated based on the current prompt [cite: 111, 255]
    try {
      screenInstance = new Screens.LoginId();
      currentScreen = 'login-id';
    } catch (e) {
      try {
        screenInstance = new Screens.LoginPassword();
        currentScreen = 'login-password';
      } catch (e2) {
        try {
          // This is the specific class for the Org Picker [cite: 257-259]
          screenInstance = new Screens.OrganizationSelection();
          currentScreen = 'organization-selection';
        } catch (e3) {
          // If all fail, we might be on a screen we haven't mapped yet
          console.warn("No matching SDK screen found for this prompt.");
        }
      }
    }

    if (currentScreen) {
      setScreenName(currentScreen);
      const clientId = screenInstance.client?.id || screenInstance.transaction?.client?.id;

      if (clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og') {
        setTheme('theme-academy');
        // Set your Academy branding here
      } else if (clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov') {
        setTheme('theme-insurance');
        // Set your Insurance branding here
      }
    }
  }, []);

  const renderComponent = () => {
    if (!screenName) return <div className="loading">Initializing...</div>;
    
    switch (screenName) {
      case 'login-id': return <LoginIdPrompt appData={appData} />;
      case 'login-password': return <LoginPasswordPrompt appData={appData} />;
      case 'organization-selection': return <OrganizationPickerPrompt appData={appData} />;
      default: return <p>Screen not supported: {screenName}</p>;
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      {renderComponent()}
    </div>
  );
}
