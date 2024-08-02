import "client-only";

import Pusher from "pusher-js";

declare const globalThis: {
    pusherClientGlobal: Pusher;
} & typeof global;

const pusherClient =
    globalThis.pusherClientGlobal ??
    new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        channelAuthorization: {
            endpoint: "/api/pusher/auth",
            transport: "ajax",
            headers: {
                "Content-Type": "application/json",
            },
        },
    });

if (process.env.NEXT_PUBLIC_VERCEL_ENV! !== "production") {
    globalThis.pusherClientGlobal = pusherClient;
}

export default pusherClient;
