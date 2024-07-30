import pusherServer from "@/_/common/lib/pusherServer";
import { RenameTaskListOptionsSchema } from "@/_/common/schema/mutation";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        taskBoardId: string;
    };
}

export async function POST(request: NextRequest, { params }: Segment) {
    const { taskBoardId } = params;
    const rawBody = await request.json();
    const body = RenameTaskListOptionsSchema.parse(rawBody);

    pusherServer.trigger(taskBoardId, "rename-task-list", body);

    return NextResponse.json({});
}
