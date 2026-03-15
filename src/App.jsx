import React, { useEffect, useState } from 'react';
import LoginIdPrompt from './screens/LoginId';
import LoginPasswordPrompt from './screens/LoginPassword'; // <-- Import the new screen
import * as Screens from '@auth0/auth0-acul-js';

export default function App() {
  const [theme, setTheme] = useState('theme-default');
  const [screenName, setScreenName] = useState(null);
  
  // Create a state to hold the specific branding for the apps
  const [appData, setAppData] = useState({ name: 'Welcome', logo: '' });

  useEffect(() => {
    const genericScreen = new Screens.LoginId(); 
    const clientId = genericScreen.client?.id || genericScreen.transaction?.client?.id;
    const currentScreen = genericScreen.screen?.name;
    
    setScreenName(currentScreen);

    // Set theme AND branding data based on the Client ID
    if (clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og') {
      setTheme('theme-academy');
      setAppData({
        name: 'Academy Learning Portal',
        logo: 'https://via.placeholder.com/150x50/2563eb/ffffff?text=Academy+Logo' // Swap with your real URL
      });
    } else if (clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov') {
      setTheme('theme-insurance');
      setAppData({
        name: 'Insurance Management System',
        logo: 'https://via.placeholder.com/150x50/10b981/ffffff?text=Insurance+Logo' // Swap with your real URL
      });
    } else {
      setTheme('theme-default');
    }
  }, []);

  const renderComponent = () => {
    if (!screenName) return <p>Loading...</p>;
    
    // Switch statement to render the correct component 
    switch (screenName) {
      case 'login-id':
        return <LoginIdPrompt appData={appData} />;
      case 'login-password':
        return <LoginPasswordPrompt appData={appData} />;
      default:
        return <p>Unknown screen: {screenName}</p>;
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      {renderComponent()}
    </div>
  );
}
