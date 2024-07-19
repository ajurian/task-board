import "server-only";

import { OAuth2Client } from "google-auth-library";

export const gauth = new OAuth2Client({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login/callback`,
});
