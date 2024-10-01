import { IOAuth2RequestTokenResult, TOAuth2Scope, TwitterApi, UserV2Result } from "twitter-api-v2";
import { TypeOrArrayOf } from "twitter-api-v2/dist/esm/types/shared.types";

const envConfig = process.env;

export async function generateTwitterOAuthUrl(redirect_uri: string, scope?: TypeOrArrayOf<TOAuth2Scope> | TypeOrArrayOf<string>): Promise<IOAuth2RequestTokenResult> {
  const client = new TwitterApi({ clientId: envConfig.TWITTER_CLIENT_ID ?? '', clientSecret: envConfig.TWITTER_CLIENT_SECRET ?? '' });
  if(!client) {
    throw new Error('Check your secrets');
  }
  const authLink = await client.generateOAuth2AuthLink(redirect_uri, { scope: scope ?? ['users.read', 'offline.access', 'tweet.read'] });
  return authLink;
}

export async function authorizeTwitterUser(code: string, codeVerifier: string, redirect_uri: string): Promise<UserV2Result> {
  try {
    const client = new TwitterApi({ clientId: envConfig.TWITTER_CLIENT_ID ?? '', clientSecret: envConfig.TWITTER_CLIENT_SECRET ?? '' });
    if(!client) {
      throw new Error('Check your secrets');
    }
    return client.loginWithOAuth2({ code, codeVerifier, redirectUri: redirect_uri })
      .then(async ({ client: loggedClient }) => {
        return await loggedClient.v2.me();
      }).catch((err) => { throw new Error(err) });
  } catch (error: any) {
    throw new Error(error);
  }
}