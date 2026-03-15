import React, { useEffect, useState } from 'react';
import LoginIdPrompt from './screens/LoginId';
import LoginPasswordPrompt from './screens/LoginPassword'; 
import * as Screens from '@auth0/auth0-acul-js';

// 1. Import your local images so Vite bundles them with the correct GitHub Pages path
import academyLogo from './assets/academy.png';
import insuranceLogo from './assets/insurance.png';

export default function App() {
  const [theme, setTheme] = useState('theme-default');
  const [screenName, setScreenName] = useState(null);
  
  // Initialize with null so the image tag doesn't render a broken link on load
  const [appData, setAppData] = useState({ name: 'Welcome', logo: null });

  useEffect(() => {
    const genericScreen = new Screens.LoginId(); 
    const clientId = genericScreen.client?.id || genericScreen.transaction?.client?.id;
    const currentScreen = genericScreen.screen?.name;
    
    setScreenName(currentScreen);

    // 2. Set the branding data using your imported image variables
    if (clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og') {
      setTheme('theme-academy');
      setAppData({
        name: 'Academy Learning Portal',
        logo: academyLogo // Uses the imported academy.png
      });
    } else if (clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov') {
      setTheme('theme-insurance');
      setAppData({
        name: 'Insurance Management System',
        logo: insuranceLogo // Uses the imported insurance.png
      });
    } else {
      setTheme('theme-default');
    }
  }, []);

  const renderComponent = () => {
    if (!screenName) return <p>Loading...</p>;
    
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
