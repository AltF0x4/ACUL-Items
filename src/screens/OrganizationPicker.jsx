import React from 'react';
import { 
  useOrganizationPicker, 
  useClient, 
  useTransaction, 
  useUser 
} from "@auth0/auth0-acul-react/organization-picker";
import academyLogo from '../assets/academy.png';
import insuranceLogo from '../assets/insurance.png';

export default function OrganizationPickerPrompt() {
  // 1. Initialize the hook into a variable (DO NOT destructure)
  const picker = useOrganizationPicker();
  
  const client = useClient();
  const transaction = useTransaction();
  const user = useUser();

  const clientId = client?.id || transaction?.client?.id;
  const isInsurance = clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov';
  const isAcademy = clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og';
  
  const theme = isInsurance ? 'theme-insurance' : (isAcademy ? 'theme-academy' : 'theme-default');
  const logo = isInsurance ? insuranceLogo : (isAcademy ? academyLogo : null);

  const orgs = transaction?.organizations || user?.organizations || [];

  const handleSelect = (org) => {
    // Safely grab the ID no matter what Auth0 named it
    const orgId = org.organization_id || org.id;
    
    // 2. Call the method safely attached to the hook instance
    picker.selectOrganization({ 
      organization: orgId 
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
            orgs.map((org, index) => {
              // Safely grab the name no matter what Auth0 named it
              const displayName = org.organization_name || org.display_name || org.name || `Organization ${index + 1}`;
              const orgId = org.organization_id || org.id;

              return (
                <button 
                  key={orgId || index} 
                  type="button" 
                  onClick={() => handleSelect(org)} 
                  className="org-button"
                >
                  <span className="org-name">{displayName}</span>
                  <span className="arrow">→</span>
                </button>
              );
            })
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
