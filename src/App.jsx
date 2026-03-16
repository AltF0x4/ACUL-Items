import React, { useEffect, useState } from 'react';
import LoginIdPrompt from './screens/LoginId';
import LoginPasswordPrompt from './screens/LoginPassword'; 
import OrganizationPickerPrompt from './screens/OrganizationPicker';

import academyLogo from './assets/academy.png';
import insuranceLogo from './assets/insurance.png';

export default function App() {
  const [theme, setTheme] = useState('theme-default');
  const [screenName, setScreenName] = useState(null);
  const [appData, setAppData] = useState({ name: 'Welcome', logo: null });

  useEffect(() => {
    // 1. Read the raw Auth0 context directly from the window object
    const context = window._auth0_context;
    
    if (!context) {
      console.error("Auth0 context not found. Are you running this outside of Auth0?");
      return;
    }

    // 2. Safely extract the exact screen name Auth0 is asking for
    const currentScreen = context.screen?.name;
    setScreenName(currentScreen);

    // 3. Extract the client ID for branding
    const clientId = context.client?.id || context.transaction?.client?.id;

    if (clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og') {
      setTheme('theme-academy');
      setAppData({ name: 'Academy Learning Portal', logo: academyLogo });
    } else if (clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov') {
      setTheme('theme-insurance');
      setAppData({ name: 'Insurance Management System', logo: insuranceLogo });
    }
  }, []);

  const renderComponent = () => {
    if (!screenName) return <div className="loading">Loading App...</div>;
    
    switch (screenName) {
      case 'login-id': return <LoginIdPrompt appData={appData} />;
      case 'login-password': return <LoginPasswordPrompt appData={appData} />;
      case 'organization-picker': return <OrganizationPickerPrompt appData={appData} />;
      default: return <p>Unsupported Screen: {screenName}</p>;
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      {renderComponent()}
    </div>
  );
}
