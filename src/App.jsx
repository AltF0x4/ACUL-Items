import React, { useEffect, useState } from 'react';
import LoginIdPrompt from './screens/LoginId';
import * as Screens from '@auth0/auth0-acul-js';

export default function App() {
  const [theme, setTheme] = useState('theme-default');
  const [screenName, setScreenName] = useState(null);

useEffect(() => {
    // Instantiate a generic screen to grab the context
    const genericScreen = new Screens.LoginId(); 
    
    // Check both paths just to be perfectly safe, and log the entire object so we can see it!
    const clientId = genericScreen.client?.id || genericScreen.transaction?.client?.id;
    const currentScreen = genericScreen.screen?.name;
    
    console.log("=== ACUL DEBUG ===");
    console.log("Extracted Client ID:", clientId);
    console.log("Screen Name:", currentScreen);
    console.log("Full Screen Provider:", genericScreen);
    
    setScreenName(currentScreen);

    // Apply the theme based on your exact Client IDs
    if (clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og') {
      setTheme('theme-academy'); // Blue
    } else if (clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov') {
      setTheme('theme-insurance'); // Green
    } else {
      setTheme('theme-default'); // Gray Fallback
    }
  }, []);

  // Determine which component to render based on the screen name
  const renderComponent = () => {
    if (!screenName) return <p>Loading...</p>;
    
    switch (screenName) {
      case 'login-id':
        return <LoginIdPrompt />;
      // You would add case 'login-password' here for the next step of the flow
      default:
        return <p>Unknown screen</p>;
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      {renderComponent()}
    </div>
  );
}
