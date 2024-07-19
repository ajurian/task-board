declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_SITE_URL: string;
            GOOGLE_OAUTH_CLIENT_ID: string;
            GOOGLE_OAUTH_CLIENT_SECRET: string;
            GMAIL_SERVICE_ACCOUNT: string;
            GMAIL_SERVICE_PASSWORD: string;
            DATABASE_URL: string;
        }
    }
}

export {};
