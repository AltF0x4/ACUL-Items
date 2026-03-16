import React, { useEffect, useState } from 'react';
// Exact import from the docs you linked
import {
  useOrganizationPicker,
  useUser,
  useTenant,
  useBranding,
  useClient,
  useOrganization,
  usePrompt,
  useUntrustedData,
} from "@auth0/auth0-acul-react/organization-picker";

export default function OrganizationPickerPrompt({ appData }) {
  // Initialize as documented: new OrganizationPicker()
  const screenProvider = new OrganizationPicker();
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    // Debug to help you see what Auth0 actually sent to the browser
    console.log("=== SDK CONTEXT ===", screenProvider);

    // According to Auth0's context, organizations could be nested in user or transaction
    let availableOrgs = [];
    if (screenProvider.user && Array.isArray(screenProvider.user.organizations)) {
      availableOrgs = screenProvider.user.organizations;
    } else if (screenProvider.transaction && Array.isArray(screenProvider.transaction.organizations)) {
      availableOrgs = screenProvider.transaction.organizations;
    }
    
    setOrgs(availableOrgs);
  }, []);

  const handleSelect = (orgId) => {
    // Official submission method from the docs you linked
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
              Press F12 and check the Console. If the array is missing, you must run the API PATCH.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
