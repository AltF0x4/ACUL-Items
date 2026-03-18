import fs from 'fs';
import path from 'path';

async function updateAuth0() {
  console.log("Starting Auth0 ACUL Update...");

  // 1. Find the newly generated JS and CSS files
  const assetsDir = path.resolve('./dist/assets');
  const files = fs.readdirSync(assetsDir);
  const jsFile = files.find(f => f.endsWith('.js') && f.startsWith('index-'));
  const cssFile = files.find(f => f.endsWith('.css') && f.startsWith('index-'));

  if (!jsFile || !cssFile) throw new Error("Could not find bundled JS or CSS files!");

  const jsUrl = `https://AltF0x4.github.io/ACUL-Items/assets/${jsFile}`;
  const cssUrl = `https://AltF0x4.github.io/ACUL-Items/assets/${cssFile}`;
  console.log(`Found assets:\nJS: ${jsUrl}\nCSS: ${cssUrl}`);

  // 2. Get an Auth0 Management API Token
  console.log("Fetching Auth0 Management Token...");
  const tokenRes = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials'
    })
  });
  
  const { access_token } = await tokenRes.json();
  if (!access_token) throw new Error("Failed to get Auth0 token!");

  // 3. The Prompts to update
  const prompts = ['login-id', 'login-password', 'organization-picker'];
  
  for (const prompt of prompts) {
    console.log(`Patching prompt: ${prompt}...`);

    // BASE context for standard login screens
    let contextConfig = [
      "branding.settings", 
      "client.id", 
      "client.name"
    ];

    // ADVANCED context ONLY for the organization picker
    if (prompt === 'organization-picker') {
      contextConfig = [
        ...contextConfig,
        "organization.branding",
        "organization.display_name",
        "prompt.organizations",
        "screen.organizations",
        "transaction.organizations",
        "user.organizations"
      ];
    }

    const payload = {
      rendering_mode: "advanced",
      use_page_template: true,
      context_configuration: contextConfig,
      head_tags: [
        { tag: "script", attributes: { src: jsUrl, type: "module", crossorigin: "anonymous" } },
        { tag: "link", attributes: { rel: "stylesheet", href: cssUrl, crossorigin: "anonymous" } }
      ]
    };

    // 4. Fire the PATCH request
    const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/prompts/${prompt}/screen/${prompt}/rendering`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to patch ${prompt}: ${err}`);
    }
    console.log(`Successfully patched ${prompt}!`);
  }
}

updateAuth0().catch(err => {
  console.error(err);
  process.exit(1);
});
