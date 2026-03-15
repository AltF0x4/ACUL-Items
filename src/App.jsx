import React, { useEffect, useState } from 'react';
import LoginIdPrompt from './screens/LoginId';
import LoginPasswordPrompt from './screens/LoginPassword'; 
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

    // Log the raw window.location to see if Auth0 is passing clues in the URL
    console.log("Current URL:", window.location.href);

    try {
      screenInstance = new Screens.LoginId();
      currentScreen = 'login-id';
    } catch (e) {
      try {
        screenInstance = new Screens.LoginPassword();
        currentScreen = 'login-password';
      } catch (e2) {
        try {
          // Try both common naming conventions for the Org Selection screen [cite: 111, 257]
          screenInstance = new Screens.OrganizationSelection() || new Screens.SelectOrganization();
          currentScreen = 'organization-selection';
        } catch (e3) {
          console.error("SDK Error: Prompt context mismatch or unauthorized screen access.");
        }
      }
    }

    if (currentScreen && screenInstance) {
      setScreenName(currentScreen);
      // Ensure the client ID is pulled from the active instance [cite: 58, 271]
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
    if (!screenName) return <div className="loading">Checking Authentication Context...</div>;
    
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
