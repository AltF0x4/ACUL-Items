import React from 'react';
import { 
  useOrganizationPicker, 
  useTransaction, 
  useUser 
} from "@auth0/auth0-acul-react/organization-picker";

export default function OrganizationPickerPrompt({ appData }) {
  // 1. Initialize the Auth0 methods via the React Hook
  const { selectOrganization } = useOrganizationPicker();
  
  // 2. Safely grab the context via React Hooks
  const transaction = useTransaction();
  const user = useUser();

  // 3. Auth0 attaches the organizations array to the transaction object during the Identifier-First flow
  const orgs = transaction?.organizations || user?.organizations || [];

  const handleSelect = (orgId) => {
    // 4. Submit the selected organization ID back to Auth0
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
            <p>No organizations found for your account.</p>
          </div>
        )}
      </div>
    </div>
  );
}
