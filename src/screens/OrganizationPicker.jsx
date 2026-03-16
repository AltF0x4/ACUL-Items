import React from 'react';
import { 
  useOrganizationPicker, 
  useTransaction, 
  useUser 
} from "@auth0/auth0-acul-react/organization-picker";

export default function OrganizationPickerPrompt({ appData }) {
  const { selectOrganization } = useOrganizationPicker();
  
  // React Hooks gracefully handle undefined data
  const transaction = useTransaction();
  const user = useUser();

  // Extract orgs wherever Auth0 decided to place them
  const orgs = transaction?.organizations || user?.organizations || [];

  const handleSelect = (orgId) => {
    selectOrganization({ organization: orgId });
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
