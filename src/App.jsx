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

    // The order of instantiation matters for detection [cite: 231-243]
    try {
      screenInstance = new Screens.LoginId();
      currentScreen = 'login-id';
    } catch (e) {
      try {
        screenInstance = new Screens.LoginPassword();
        currentScreen = 'login-password';
      } catch (e2) {
        try {
          // Change: Try the SelectOrganization class which corresponds to /u/organization-picker
          screenInstance = new Screens.SelectOrganization(); 
          currentScreen = 'organization-selection';
        } catch (e3) {
          console.error("No matching SDK screen found for this context.");
        }
      }
    }

    if (currentScreen && screenInstance) {
      setScreenName(currentScreen);
      const clientId = screenInstance.client?.id || screenInstance.transaction?.client?.id;

      // Academy - Blue
      if (clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og') {
        setTheme('theme-academy');
      } 
      // Insurance - Black/Green
      else if (clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov') {
        setTheme('theme-insurance');
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
