import "server-only";

import Pusher from "pusher";

declare const globalThis: {
    pusherServerGlobal: Pusher;
} & typeof global;

const pusherServer =
    globalThis.pusherServerGlobal ??
    new Pusher({
        appId: process.env.PUSHER_APP_ID!,
        key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
        secret: process.env.PUSHER_SECRET!,
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        useTLS: true,
    });

if (process.env.NEXT_PUBLIC_VERCEL_ENV! !== "production") {
    globalThis.pusherServerGlobal = pusherServer;
}

export default pusherServer;
