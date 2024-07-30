import pusherServer from "@/_/common/lib/pusherServer";
import { RenameTaskBoardOptionsSchema } from "@/_/common/schema/mutation";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        taskBoardId: string;
    };
}

export async function POST(request: NextRequest, { params }: Segment) {
    const { taskBoardId } = params;
    const rawBody = await request.json();
    const body = RenameTaskBoardOptionsSchema.parse(rawBody);

    pusherServer.trigger(taskBoardId, "rename-task-board", body);

    return NextResponse.json({});
}
