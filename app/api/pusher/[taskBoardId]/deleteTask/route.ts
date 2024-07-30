import pusherServer from "@/_/common/lib/pusherServer";
import { DeleteTaskOptionsSchema } from "@/_/common/schema/mutation";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        taskBoardId: string;
    };
}

export async function POST(request: NextRequest, { params }: Segment) {
    const { taskBoardId } = params;
    const rawBody = await request.json();
    const body = DeleteTaskOptionsSchema.parse(rawBody);

    pusherServer.trigger(taskBoardId, "delete-task", body);

    return NextResponse.json({});
}
