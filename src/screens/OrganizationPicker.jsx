import React, { useEffect, useState } from 'react';
import OrganizationPicker from '@auth0/auth0-acul-js/organization-picker';

export default function OrganizationPickerPrompt({ appData }) {
  const screenProvider = new OrganizationPicker();
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    // Let's log the entire Auth0 payload to the browser console (F12)
    // so you can see exactly what Auth0 is sending you!
    console.log("=== AUTH0 SDK PAYLOAD ===", screenProvider);

    // Dynamically search for the organizations array in the 4 possible locations Auth0 uses
    let foundOrgs = [];
    if (Array.isArray(screenProvider.user?.organizations)) {
      foundOrgs = screenProvider.user.organizations;
      console.log("Found in: user.organizations");
    } else if (Array.isArray(screenProvider.transaction?.organizations)) {
      foundOrgs = screenProvider.transaction.organizations;
      console.log("Found in: transaction.organizations");
    } else if (Array.isArray(screenProvider.screen?.organizations)) {
      foundOrgs = screenProvider.screen.organizations;
      console.log("Found in: screen.organizations");
    } else if (Array.isArray(screenProvider.prompt?.organizations)) {
      foundOrgs = screenProvider.prompt.organizations;
      console.log("Found in: prompt.organizations");
    } else {
      console.warn("Auth0 did not provide an organizations array in the context.");
    }

    setOrgs(foundOrgs);
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
              (Check console for payload debug)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
