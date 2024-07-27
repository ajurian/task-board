import pusherServer from "@/_/common/lib/pusherServer";
import { UpdateFlowDirectionOptionsSchema } from "@/_/common/schema/mutation";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        taskBoardId: string;
    };
}

export async function POST(request: NextRequest, { params }: Segment) {
    const { taskBoardId } = params;
    const rawBody = await request.json();
    const body = UpdateFlowDirectionOptionsSchema.parse(rawBody);

    pusherServer.trigger(taskBoardId, "update-flow-direction", body, {
        socket_id: rawBody.socketId,
    });

    return NextResponse.json({});
}
