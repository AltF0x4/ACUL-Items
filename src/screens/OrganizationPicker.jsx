import React, { useEffect, useState } from 'react';
import OrganizationPicker from '@auth0/auth0-acul-js/organization-picker';

export default function OrganizationPickerPrompt({ appData }) {
  const screenProvider = new OrganizationPicker();
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    // Press F12 in your browser to see this object! It will show you EXACTLY where Auth0 hid the data.
    console.log("=== SDK CONTEXT ===", screenProvider);

    let availableOrgs = [];
    
    // Dynamically search the SDK class for the array, prioritizing the 'prompt' object
    if (screenProvider.prompt && Array.isArray(screenProvider.prompt.organizations)) {
      availableOrgs = screenProvider.prompt.organizations;
    } else if (screenProvider.screen && Array.isArray(screenProvider.screen.organizations)) {
      availableOrgs = screenProvider.screen.organizations;
    } else if (screenProvider.transaction && Array.isArray(screenProvider.transaction.organizations)) {
      availableOrgs = screenProvider.transaction.organizations;
    } else if (screenProvider.user && Array.isArray(screenProvider.user.organizations)) {
      availableOrgs = screenProvider.user.organizations;
    }
    
    setOrgs(availableOrgs);
  }, []);

  const handleSelect = (orgId) => {
    screenProvider.selectOrganization({ organization: orgId });
  };

  return (
    <div className="login-card">
      <div className="branding-header">
        {appData.logo && <img src={appData.logo} alt="Logo" className="app-logo" />}
        <h1 className="app-title">Select Account</h1>
        <p className="app-subtitle">Choose the organization you want to access.</p>
      </div>

      <div className="org-list">
        {orgs.length > 0 ? (
          orgs.map((org) => (
            <button key={org.id} onClick={() => handleSelect(org.id)} className="org-button">
              <span className="org-name">{org.display_name || org.name}</span>
              <span className="arrow">→</span>
            </button>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            <p>No organizations found in context.</p>
            <p style={{ fontSize: '12px', marginTop: '10px' }}>
              Press F12 and open the Console to see the raw SDK payload.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
