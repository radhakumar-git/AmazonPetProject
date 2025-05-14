import { defineConfig } from "cypress";
import fs from 'fs';
import { google } from 'googleapis';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.amazon.jobs/en/',
    viewportWidth: 1400,
    viewportHeight: 1200,
    chromeWebSecurity: false,
    modifyObstructiveCode: true,
    setupNodeEvents(on) {
      on('task', {
        async getGmailOtp() {
          const credentials = JSON.parse(fs.readFileSync('cypress/fixtures/credentials.json').toString());
          const token = JSON.parse(fs.readFileSync('cypress/fixtures/gmail_token.json').toString());
          const { client_secret, client_id, redirect_uris } = credentials.web;
          const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
          oAuth2Client.setCredentials(token);
          const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

          const MAX_ATTEMPTS = 10;
          const DELAY_MS = 5000;

          for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            console.log(`Attempt ${attempt} to fetch OTP...`);
            const res = await gmail.users.messages.list({
              userId: 'me',
              q: 'from:noreply@mail.amazon.jobs is:unread',
              maxResults: 1
            });

            const msgId = res.data.messages?.[0]?.id;

            if (msgId) {
              console.log(`Found message with ID: ${msgId}`);

              const msg = await gmail.users.messages.get({ userId: 'me', id: msgId });

              await gmail.users.messages.modify({
                userId: 'me',
                id: msgId,
                requestBody: { removeLabelIds: ['UNREAD'] }
              });
              console.log(`Marked message ${msgId} as read.`);

              const bodyData = msg.data.payload.body?.data
                || msg.data.payload.parts?.[0]?.body?.data
                || '';

              if (!bodyData) {
                console.log('Message body is empty.');
                return null;
              }

              const body = Buffer.from(bodyData, 'base64').toString();
              const otp = body.match(/\d{6}/)?.[0];

              console.log(`OTP found: ${otp}`);
              return otp;
            }
            console.log('No unread OTP email found yet. Waiting...');
            await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
          }
          console.log('OTP was not found after all attempts.');
          return null;
        },

        async markAllAsRead() {
          try {
            const credentials = JSON.parse(fs.readFileSync('cypress/fixtures/credentials.json').toString());
            const token = JSON.parse(fs.readFileSync('cypress/fixtures/gmail_token.json').toString());
            const { client_secret, client_id, redirect_uris } = credentials.web;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            oAuth2Client.setCredentials(token);
            const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        
            const res = await gmail.users.messages.list({
              userId: 'me',
              q: 'is:unread',
              maxResults: 10
            });
        
            const messages = res.data.messages || [];
        
            await Promise.all(messages.map(message =>
              gmail.users.messages.modify({
                userId: 'me',
                id: message.id,
                requestBody: { removeLabelIds: ['UNREAD'] }
              }).catch(e => {
                console.error(`Error marking message ${message.id}:`, e.message);
              })
            ));
        
            console.log(`Marked ${messages.length} messages as read.`);
            return `Marked ${messages.length} messages as read.`;
          } catch (err) {
            console.error('Error in markAllAsRead:', err.message);
            // вместо throw → возвращаем текст ошибки (чтобы Cypress не падал)
            return `markAllAsRead finished with error: ${err.message}`;
          }
        }
      });
    }
  },
});