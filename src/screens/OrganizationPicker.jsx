import React from 'react';
import OrganizationSelection from '@auth0/auth0-acul-js/organization-selection';

export default function OrganizationPickerPrompt({ appData }) {
  const screenProvider = new OrganizationSelection();
  // Accessing the list of organizations available for the user [cite: 103]
  const orgs = screenProvider.transaction?.organizations || [];

  const handleSelect = (orgId) => {
    // Submitting the selected organization back to the Auth0 server [cite: 73]
    screenProvider.submit({ organization: orgId });
  };

  return (
    <div className="login-card">
      <div className="branding-header">
        {appData.logo && <img src={appData.logo} alt="Logo" className="app-logo" />}
        <h1 className="app-title">Select Account</h1>
        <p className="app-subtitle">Choose the organization you want to access.</p>
      </div>

      <div className="org-list">
        {orgs.length > 0 ? orgs.map((org) => (
          <button key={org.id} onClick={() => handleSelect(org.id)} className="org-button">
            <span className="org-name">{org.display_name || org.name}</span>
            <span className="arrow">→</span>
          </button>
        )) : <p>No organizations found.</p>}
      </div>
    </div>
  );
}
