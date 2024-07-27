import pusherServer from "@/_/common/lib/pusherServer";
import { EditTaskOptionsSchema } from "@/_/common/schema/mutation";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        taskBoardId: string;
    };
}

export async function POST(request: NextRequest, { params }: Segment) {
    const { taskBoardId } = params;
    const rawBody = await request.json();
    const body = EditTaskOptionsSchema.parse(rawBody);

    pusherServer.trigger(taskBoardId, "edit-task", body, {
        socket_id: rawBody.socketId,
    });

    return NextResponse.json({});
}
