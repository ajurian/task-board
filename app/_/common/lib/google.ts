import "server-only";

import getCurrentURL from "@/_/utils/getCurrentURL";
import { OAuth2Client } from "google-auth-library";

export const gauth = new OAuth2Client({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: `${getCurrentURL()}/auth/login/callback`,
});
