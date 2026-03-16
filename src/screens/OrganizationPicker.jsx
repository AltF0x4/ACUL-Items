import React from 'react';
import OrganizationPicker from '@auth0/auth0-acul-js/organization-picker';

export default function OrganizationPickerPrompt({ appData }) {
  const screenProvider = new OrganizationPicker();
  
  // The organizations list is safely extracted from the user object
  const orgs = screenProvider.user?.organizations || screenProvider.transaction?.organizations || [];

  const handleSelect = (orgId) => {
    // Verified method to submit the selection back to Auth0
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
        {orgs.length > 0 ? orgs.map((org) => (
          <button key={org.id} onClick={() => handleSelect(org.id)} className="org-button">
            <span className="org-name">{org.display_name || org.name}</span>
            <span className="arrow">→</span>
          </button>
        )) : <p>No organizations found for your account.</p>}
      </div>
    </div>
  );
}
