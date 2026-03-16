import React, { useEffect, useState } from 'react';
// Strictly using the JS SDK as per the documentation
import OrganizationPicker from '@auth0/auth0-acul-js/organization-picker';

export default function OrganizationPickerPrompt({ appData }) {
  // Initialize the class exactly as the JS SDK docs define
  const screenProvider = new OrganizationPicker();
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    // The Auth0 context injects organizations into the transaction object
    const availableOrgs = screenProvider.transaction?.organizations || [];
    setOrgs(availableOrgs);
    
    // Debug log to show you exactly what Auth0 transmitted
    console.log("Auth0 Transaction Data:", screenProvider.transaction);
  }, []);

  const handleSelect = (orgId) => {
    // The official submission method for the JS SDK
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
