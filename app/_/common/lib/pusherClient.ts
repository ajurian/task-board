import "client-only";

import Pusher from "pusher-js";

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    userAuthentication: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
        headers: {
            "Content-Type": "application/json",
        },
    },
});

export default pusherClient;
