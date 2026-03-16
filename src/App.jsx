import React, { useState, useEffect } from 'react';
import LoginIdPrompt from './screens/LoginId';
import LoginPasswordPrompt from './screens/LoginPassword';
import OrganizationPickerPrompt from './screens/OrganizationPicker';

// We MUST use the JS SDK here. It acts as our safe "Traffic Cop" to prevent React Hooks from crashing.
import * as Screens from '@auth0/auth0-acul-js';
import OrganizationPickerClass from '@auth0/auth0-acul-js/organization-picker';

export default function App() {
  const [screenName, setScreenName] = useState(null);

  useEffect(() => {
    let currentScreen = null;

    // The JS SDK safely probes Auth0's invisible context. 
    // If a screen fails, it drops to the next block without crashing the app.
    try {
      new Screens.LoginId();
      currentScreen = 'login-id';
    } catch (e) {
      try {
        new Screens.LoginPassword();
        currentScreen = 'login-password';
      } catch (e2) {
        try {
          new OrganizationPickerClass();
          currentScreen = 'organization-picker';
        } catch (e3) {
          console.error("Critical Error: Auth0 context is missing or unsupported.");
          return;
        }
      }
    }

    setScreenName(currentScreen);
  }, []);

  if (!screenName) return <div className="loading">Loading Auth0 Context...</div>;

  // Now that we know EXACTLY what screen we are on, we safely mount the React component.
  // The React SDK Hooks inside these components will now run perfectly without throwing 'this.instance is null'.
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
