import pusherServer from "@/_/common/lib/pusherServer";
import { forbiddenErrorResponse } from "@/api/_/utils/errorResponse";
import verifyToken from "@/api/_/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const userInfo = await verifyToken();

    if (userInfo === null) {
        return forbiddenErrorResponse({});
    }

    const data = await request.text();
    const [socketId, channelName] = data
        .split("&")
        .map((str) => str.split("=")[1]);

    const authResponse = pusherServer.authorizeChannel(socketId, channelName, {
        user_id: userInfo.sub,
        user_info: {
            googleId: userInfo.sub,
            email: userInfo.email,
            displayName: userInfo.name,
            photoURL: userInfo.picture,
        },
    });

    return NextResponse.json(authResponse);
}
