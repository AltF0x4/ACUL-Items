import React from 'react';
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
  const picker = useOrganizationPicker();
  
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

  // Because we added user.organizations back to the API, this will now successfully populate!
  const orgs = prompt?.organizations || screen?.organizations || transaction?.organizations || user?.organizations || [];

  const handleSelect = async (orgId) => {
    try {
      await picker.selectOrganization({ organization: orgId });
    } catch (error) {
      console.error("Failed to select organization:", error);
    }
  };

  const handleSkip = async () => {
    try {
      await picker.skipOrganizationSelection();
    } catch (error) {
      console.error("Failed to skip organization selection:", error);
    }
  };
  const handleBack = () => {
      // Grab the current transaction state from the URL (e.g., ?state=hKFo...)
      const queryParams = window.location.search;
      
      // Redirect them directly back to the Auth0 identifier (Email) screen
      window.location.href = `/u/login/identifier${queryParams}`;
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
                <span className="org-name">{org.displayName || org.name}</span>
                <span className="arrow">→</span>
              </button>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '10px', color: '#666' }}>
              <p>No organizations found for this account.</p>
            </div>
          )}

          {/* Personal Account Option */}
          <div style={{ textAlign: 'center', margin: '15px 0', color: '#888', fontSize: '14px' }}>
            or
          </div>
          
          <button 
            type="button" 
            onClick={handleSkip} 
            className="org-button"
            style={{ backgroundColor: 'transparent', border: '1px solid #ccc' }}
          >
            <span className="org-name">Personal Account</span>
            <span className="arrow">→</span>
          </button>

          {/* Styled Arrow Back Button (Now logs the user out) */}
          <button 
            type="button" 
            onClick={handleBack} 
            className="org-button"
            style={{ backgroundColor: 'transparent', border: 'none', color: '#0056b3', marginTop: '15px', justifyContent: 'center', gap: '8px' }}
          >
            <span style={{ fontSize: '18px' }}>←</span>
            <span className="org-name" style={{ flexGrow: 0 }}>Back to Login</span>
          </button>

        </div>
      </div>
    </div>
  );
}
