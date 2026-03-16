import React, { useEffect } from 'react';
import { 
  useOrganizationPicker, 
  useClient, 
  useTransaction, 
  useUser,
  usePrompt,
  useScreen
} from "@auth0/auth0-acul-react/organization-picker";
import academyLogo from '../assets/academy.png';
import insuranceLogo from '../assets/insurance.png';

export default function OrganizationPickerPrompt() {
  const { selectOrganization } = useOrganizationPicker();
  
  const client = useClient();
  const transaction = useTransaction();
  const user = useUser();
  const prompt = usePrompt();
  const screen = useScreen();

  const clientId = client?.id || transaction?.client?.id;
  const isInsurance = clientId === 'q7BNjQlXfqA0x8QlXvIkzy92xM3jKDov';
  const isAcademy = clientId === 'w1uejxlnncU8P2gyBXSv0OE8WlGcV6og';
  
  const theme = isInsurance ? 'theme-insurance' : (isAcademy ? 'theme-academy' : 'theme-default');
  const logo = isInsurance ? insuranceLogo : (isAcademy ? academyLogo : null);

  const orgs = prompt?.organizations || screen?.organizations || transaction?.organizations || user?.organizations || [];

  useEffect(() => {
    console.log("Raw Organizations Array from Auth0:", orgs);
  }, [orgs]);

  const handleSelect = (orgId) => {
    // Submit using the exact organizationId parameter
    selectOrganization({ organization: orgId });
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
            orgs.map((org, index) => (
              <button 
                key={org.organizationId || index} 
                type="button" 
                onClick={() => handleSelect(org.organizationId)} 
                className="org-button"
              >
                {/* Use exact displayName for the UI */}
                <span className="org-name">{org.displayName}</span>
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
