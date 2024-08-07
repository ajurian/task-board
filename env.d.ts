declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_VERCEL_ENV: "production" | "preview" | "development";
            NEXT_PUBLIC_SITE_URL: string;
            NEXT_PUBLIC_PUSHER_CLUSTER: string;
            NEXT_PUBLIC_PUSHER_KEY: string;
            PUSHER_APP_ID: string;
            PUSHER_SECRET: string;
            GOOGLE_OAUTH_CLIENT_ID: string;
            GOOGLE_OAUTH_CLIENT_SECRET: string;
            GMAIL_SERVICE_ACCOUNT: string;
            SMTP_AUTH_USER: string;
            SMTP_AUTH_PASS: string;
            DATABASE_URL: string;
        }
    }
}

export {};
