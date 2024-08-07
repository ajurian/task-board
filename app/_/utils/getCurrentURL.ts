export default function getCurrentURL() {
    const protocol =
        process.env.NEXT_PUBLIC_VERCEL_ENV! === "production"
            ? "https://"
            : "http://";

    return protocol + process.env.NEXT_PUBLIC_SITE_URL!;
}
