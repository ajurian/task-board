import prisma from "@/_/lib/prisma";
import { UserCreateSchema } from "@/_/schema/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const rawBody = await request.json();
    const data = UserCreateSchema.parse(rawBody);

    let user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (user === null) {
        user = await prisma.user.create({ data });
    } else {
        await prisma.user.update({ where: { id: user.id }, data });
    }

    return NextResponse.json({ user });
}
