import fs from 'fs';
import path from 'path';

async function updateAuth0() {
  console.log("Starting Auth0 ACUL Bulk Update...");

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

  // 3. Define the HTML tags injected into Auth0
  const headTags = [
    { tag: "script", attributes: { src: jsUrl, type: "module", crossorigin: "anonymous" } },
    { tag: "link", attributes: { rel: "stylesheet", href: cssUrl, crossorigin: "anonymous" } }
  ];

  // 4. Build the Bulk Payload array according to the new API spec
  const bulkPayload = [
    {
      prompt: "login-id",
      screen: "login-id",
      rendering_mode: "advanced",
      use_page_template: true,
      context_configuration: ["branding.settings"],
      head_tags: headTags
    },
    {
      prompt: "login-password",
      screen: "login-password",
      rendering_mode: "advanced",
      use_page_template: true,
      context_configuration: ["branding.settings"],
      head_tags: headTags
    },
    {
      prompt: "organization-picker",
      screen: "organization-picker",
      rendering_mode: "advanced",
      use_page_template: true,
      context_configuration: [
        "branding.settings",
        "organization.branding",
        "organization.display_name",
        "prompt.organizations",
        "screen.organizations",
        "transaction.organizations",
        "user.organizations"
      ],
      head_tags: headTags
    }
  ];

  // 5. Fire the single Bulk PATCH request
  console.log("Sending Bulk PATCH request to Auth0...");
  const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/prompts/rendering`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bulkPayload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to execute bulk patch: ${err}`);
  }
  
  console.log("Successfully updated all prompts in a single request!");
}

updateAuth0().catch(err => {
  console.error(err);
  process.exit(1);
});
