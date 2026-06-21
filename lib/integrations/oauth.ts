import crypto from 'crypto';

const encryptionKey = process.env.ENCRYPTION_KEY || 'dev-key-32-chars-minimum!!!!!!';

export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function encryptToken(token: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptToken(encrypted: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export const oauthConfigs = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/google/callback`,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/drive',
    ],
  },
  slack: {
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/slack/callback`,
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scopes: ['chat:write', 'chat:write.public', 'users:read', 'channels:read'],
  },
  salesforce: {
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/salesforce/callback`,
    authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
    tokenUrl: 'https://login.salesforce.com/services/oauth2/token',
    scopes: ['api', 'refresh_token', 'offline_access'],
  },
  hubspot: {
    clientId: process.env.HUBSPOT_CLIENT_ID,
    clientSecret: process.env.HUBSPOT_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/hubspot/callback`,
    authUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    scopes: ['crm.objects.contacts.read', 'crm.objects.deals.read', 'crm.objects.companies.read'],
  },
};

export function getOAuthUrl(provider: 'google' | 'slack' | 'salesforce' | 'hubspot', state: string): string {
  const config = oauthConfigs[provider];
  const params = new URLSearchParams({
    client_id: config.clientId || '',
    redirect_uri: config.redirectUri,
    response_type: 'code',
    state,
    scope: config.scopes.join(' '),
  });

  if (provider === 'slack') {
    params.set('user_scope', '');
  }

  return `${config.authUrl}?${params.toString()}`;
}

export async function exchangeOAuthCode(
  provider: 'google' | 'slack' | 'salesforce' | 'hubspot',
  code: string
): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number }> {
  const config = oauthConfigs[provider];

  const params = new URLSearchParams({
    client_id: config.clientId || '',
    client_secret: config.clientSecret || '',
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUri,
  });

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) {
    throw new Error(`OAuth token exchange failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}
