import React, { useEffect, useState } from 'react';
// This line right here is what was breaking your build in this specific file!
import OrganizationPicker from '@auth0/auth0-acul-js/organization-picker';

export default function OrganizationPickerPrompt({ appData }) {
  const screenProvider = new OrganizationPicker();
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    console.log("=== SDK CONTEXT ===", screenProvider);

    let availableOrgs = [];
    if (screenProvider.user && Array.isArray(screenProvider.user.organizations)) {
      availableOrgs = screenProvider.user.organizations;
    } else if (screenProvider.transaction && Array.isArray(screenProvider.transaction.organizations)) {
      availableOrgs = screenProvider.transaction.organizations;
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
          </div>
        )}
      </div>
    </div>
  );
}
