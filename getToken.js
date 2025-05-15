const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const CREDENTIALS_PATH = 'cypress/fixtures/credentials.json';
const TOKEN_PATH = 'cypress/fixtures/gmail_token.json';

fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.error('Error loading credentials.json:', err);
  authorize(JSON.parse(content), getNewToken);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  callback(oAuth2Client);
}

function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // 
    prompt: 'consent',       
    scope: ['https://www.googleapis.com/auth/gmail.modify'],
  });

  console.log('\nAuthorize this app by visiting this URL:\n', authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('\nEnter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code).then(({ tokens }) => {
      oAuth2Client.setCredentials(tokens);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log(`✅ Token with refresh_token stored to ${TOKEN_PATH}`);
    }).catch(err => console.error('❌ Error retrieving access token', err));
  });
}
