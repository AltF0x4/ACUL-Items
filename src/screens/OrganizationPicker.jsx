import React from 'react';
import OrganizationSelection from '@auth0/auth0-acul-js/organization-selection';

export default function OrganizationPickerPrompt({ appData }) {
  const screenProvider = new OrganizationSelection();
  const orgs = screenProvider.transaction?.organizations || [];

  const handleSelect = (orgId) => {
    screenProvider.submit({ organization: orgId });
  };

  return (
    <div className="login-card">
      <div className="branding-header">
        {appData.logo && <img src={appData.logo} alt="Logo" className="app-logo" />}
        <h1 className="app-title">Select Organization</h1>
        <p className="app-subtitle">Which account would you like to access?</p>
      </div>

      <div className="org-list">
        {orgs.map((org) => (
          <button key={org.id} onClick={() => handleSelect(org.id)} className="org-button">
            {org.display_name || org.name}
          </button>
        ))}
      </div>
    </div>
  );
}
