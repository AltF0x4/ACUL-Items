import React from 'react';
import { useOrganizationPicker, useClient, useTransaction, useUser } from "@auth0/auth0-acul-react/organization-picker";
import academyLogo from '../assets/academy.png';
import insuranceLogo from '../assets/insurance.png';

export default function OrganizationPickerPrompt() {
  const orgPickerProvider = useOrganizationPicker();
  const client = useClient();
  const transaction = useTransaction();
  const user = useUser();

  const clientId = client?.id || transaction?.client?.id;
  const isInsurance = clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov';
  const isAcademy = clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og';
  
  const theme = isInsurance ? 'theme-insurance' : (isAcademy ? 'theme-academy' : 'theme-default');
  const logo = isInsurance ? insuranceLogo : (isAcademy ? academyLogo : null);

  // Safely extract the array
  const orgs = transaction?.organizations || user?.organizations || [];

  const handleSelect = (org) => {
    // Auth0 contexts differ; guarantee we grab the valid string identifier
    const validOrgId = org.id || org.organization_id || org.name;
    
    // Pass BOTH the organization AND the security state so Auth0 doesn't throw a 400 Error
    orgPickerProvider.selectOrganization({ 
      organization: validOrgId,
      state: transaction?.state 
    });
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="login-card">
        <div className="branding-header">
          {logo && <img src={logo} alt="Logo" className="app-logo" />}
          <h1 className="app-title">Select Account</h1>
          <p className="app-subtitle">Choose the organization you want to access.</p>
        </div>

        <div className="org-list">
          {orgs.length > 0 ? (
            orgs.map((org) => (
              <button 
                key={org.id || org.name} 
                type="button" 
                onClick={() => handleSelect(org)} 
                className="org-button"
              >
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
    </div>
  );
}
