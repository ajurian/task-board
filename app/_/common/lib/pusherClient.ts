import "client-only";

import Pusher from "pusher-js";

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    authEndpoint: "api/pusherAuth",
    authTransport: "ajax",
    auth: {
        headers: {
            "Content-Type": "application/json",
        },
    },
});

export default pusherClient;
