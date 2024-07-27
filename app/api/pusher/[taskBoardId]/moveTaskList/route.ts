import pusherServer from "@/_/common/lib/pusherServer";
import { MoveTaskListOptionsSchema } from "@/_/common/schema/mutation";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        taskBoardId: string;
    };
}

export async function POST(request: NextRequest, { params }: Segment) {
    const { taskBoardId } = params;
    const rawBody = await request.json();
    const body = MoveTaskListOptionsSchema.parse(rawBody);

    pusherServer.trigger(taskBoardId, "move-task-list", body, {
        socket_id: rawBody.socketId,
    });

    return NextResponse.json({});
}
