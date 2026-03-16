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
  // Use the official React hook to get the submission method
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

  // Search the entire Auth0 context for the organizations array
  const orgs = prompt?.organizations || screen?.organizations || transaction?.organizations || user?.organizations || [];

  useEffect(() => {
    // This will print the EXACT shape of the organizations to your browser console (F12)
    console.log("Raw Organizations Array from Auth0:", orgs);
  }, [orgs]);

  const handleSelect = (org) => {
    // If Auth0 sent a raw string (just the ID), use it. Otherwise, extract the ID from the object.
    const isString = typeof org === 'string';
    const orgId = isString ? org : (org.id || org.organization_id);
    
    // Submit the real ID back to Auth0
    if (orgId) {
      selectOrganization({ organization: orgId });
    } else {
      console.error("Could not find a valid Organization ID in:", org);
    }
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
              // Safely extract the data whether Auth0 sent a string or an object
              const isString = typeof org === 'string';
              const orgId = isString ? org : (org.id || org.organization_id);
              
              // Try to get the name, fallback to the raw ID if Auth0 hid the name
              const displayName = isString 
                ? `Org: ${org}` 
                : (org.display_name || org.name || `Org: ${orgId}`);

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
