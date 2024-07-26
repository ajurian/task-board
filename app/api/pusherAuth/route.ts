import pusherServer from "@/_/common/lib/pusherServer";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PusherAuthBodySchema = z.object({
    socket_id: z.string(),
    channel_name: z.string(),
});

export async function POST(request: NextRequest) {
    const rawBody = await request.json();
    const { socket_id, channel_name } = PusherAuthBodySchema.parse(rawBody);

    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name);

    return NextResponse.json(authResponse);
}
