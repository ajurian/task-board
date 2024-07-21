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
                hostname: "task-board-olive.vercel.app",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
