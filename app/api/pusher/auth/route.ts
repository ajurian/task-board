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
    const [socketId] = data.split("&").map((str) => str.split("=")[1]);

    const authResponse = pusherServer.authenticateUser(socketId, {
        id: userInfo.sub,
    });

    return NextResponse.json(authResponse);
}
