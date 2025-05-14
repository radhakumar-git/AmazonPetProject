const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, 'cypress/fixtures/credentials.json');
const TOKEN_PATH = path.join(__dirname, 'cypress/fixtures/gmail_token.json');

async function getOTPFromGmail() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));

  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials(token);

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'subject:Your OTP is is: newer_than:1d',
    maxResults: 1,
  });

  const message = res.data.messages?.[0];
  if (!message) {
    throw new Error('No OTP email found.');
  }

  const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });
  const emailBody = Buffer.from(msg.data.payload.parts?.[0]?.body?.data || '', 'base64').toString();

  const otpMatch = emailBody.match(/\b\d{6}\b/);
  if (!otpMatch) {
    throw new Error('OTP not found in email body.');
  }

  return otpMatch[0];
}

async function markAllAsRead() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));

  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials(token);

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const messagesRes = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread',
  });

  const messages = messagesRes.data.messages || [];
  if (messages.length) {
    const ids = messages.map((m) => m.id);
    await gmail.users.messages.modify({
      userId: 'me',
      id: ids[0],
      requestBody: { removeLabelIds: ['UNREAD'] },
    });
  }

  return null;
}

module.exports = { getOTPFromGmail, markAllAsRead };
