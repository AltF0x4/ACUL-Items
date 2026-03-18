import fs from 'fs';
import path from 'path';

async function updateAuth0() {
  console.log("Starting Auth0 ACUL Update...");

  const assetsDir = path.resolve('./dist/assets');
  const files = fs.readdirSync(assetsDir);
  const jsFile = files.find(f => f.endsWith('.js') && f.startsWith('index-'));
  const cssFile = files.find(f => f.endsWith('.css') && f.startsWith('index-'));

  if (!jsFile || !cssFile) throw new Error("Could not find bundled JS or CSS files!");

  const jsUrl = `https://AltF0x4.github.io/ACUL-Items/assets/${jsFile}`;
  const cssUrl = `https://AltF0x4.github.io/ACUL-Items/assets/${cssFile}`;
  console.log(`Found assets:\nJS: ${jsUrl}\nCSS: ${cssUrl}`);

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

  const targets = [
    { prompt: 'login-id', screen: 'login-id' },
    { prompt: 'login-password', screen: 'login-password' },
    { prompt: 'organizations', screen: 'organization-picker' }
  ];
  
  for (const target of targets) {
    console.log(`Patching screen: ${target.screen}...`);

    let contextConfig = ["branding.settings"];

    // Add the extra branding/display data ONLY for the picker screen
    // We removed the prompt/screen/transaction/user.organizations keys 
    // because Auth0 sends them automatically!
    if (target.screen === 'organization-picker') {
      contextConfig = [
        "branding.settings",
        "organization.branding",
        "organization.display_name",
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

    const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/prompts/${target.prompt}/screen/${target.screen}/rendering`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to patch ${target.screen}: ${err}`);
    }
    console.log(`Successfully patched ${target.screen}!`);
  }
}

updateAuth0().catch(err => {
  console.error(err);
  process.exit(1);
});
