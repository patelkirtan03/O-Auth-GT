import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
const envConfig = process.env;

const links = {
  GOOGLE_OAUTH_URL: 'https://accounts.google.com/o/oauth2/auth',
  GOOGLE_ACCESS_TOKEN_URL: 'https://oauth2.googleapis.com/token',
  GOOGLE_USER_INFO_URL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}

export function generateOAuthUrl(redirect_uri: string, access_type?: string, scopes?: string[] | string): string {
  try {
    const oauth2Client = new OAuth2Client(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      redirect_uri
    );
    const authorizationUri = oauth2Client.generateAuthUrl({
      access_type: access_type ?? 'offline',
      scope: scopes ?? ['profile', 'email'],
    });
    return authorizationUri;
  } catch (err: any) {
    return err.message;
  }
}

export async function authorize(code: string, redirect_uri: string) {
  try {
    const oauth2Client = new OAuth2Client(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      redirect_uri
    );
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const response = await axios.get(links.GOOGLE_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    });

    return response.data;
  } catch (error: any) {
    return error.message;
  }
}
