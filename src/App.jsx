import React, { useEffect, useState } from 'react';
import LoginIdPrompt from './screens/LoginId';
import LoginPasswordPrompt from './screens/LoginPassword'; 
import OrganizationPickerPrompt from './screens/OrganizationPicker';

// Strictly using the official React SDK hooks!
import { useScreen, useClient, useTransaction } from '@auth0/auth0-acul-react/organization-picker';

import academyLogo from './assets/academy.png';
import insuranceLogo from './assets/insurance.png';

export default function App() {
  // 1. Use the React Hooks to pull the context safely
  const screen = useScreen();
  const client = useClient();
  const transaction = useTransaction();

  const [theme, setTheme] = useState('theme-default');
  const [appData, setAppData] = useState({ name: 'Welcome', logo: null });

  // 2. The hook automatically knows what screen Auth0 is asking for
  const screenName = screen?.name;

  useEffect(() => {
    // 3. The hook automatically knows the client ID
    const clientId = client?.id || transaction?.client?.id;

    if (clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og') {
      setTheme('theme-academy');
      setAppData({ name: 'Academy Learning Portal', logo: academyLogo });
    } else if (clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov') {
      setTheme('theme-insurance');
      setAppData({ name: 'Insurance Management System', logo: insuranceLogo });
    }
  }, [client, transaction]);

  const renderComponent = () => {
    if (!screenName) return <div className="loading">Loading Context...</div>;
    
    switch (screenName) {
      case 'login-id': 
        return <LoginIdPrompt appData={appData} />;
      case 'login-password': 
        return <LoginPasswordPrompt appData={appData} />;
      // Added a fallback case just in case Auth0 sends the alternate beta string
      case 'organization-picker': 
      case 'organization-selection': 
        return <OrganizationPickerPrompt appData={appData} />;
      default: 
        return <p>Unsupported Screen: {screenName}</p>;
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      {renderComponent()}
    </div>
  );
}
