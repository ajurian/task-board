/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => [
        {
            source: "/",
            destination: "/board",
            permanent: true,
        },
    ],
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "task-board-urian.vercel.app",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
        path: "/_next/image",
    },
};

export default nextConfig;
