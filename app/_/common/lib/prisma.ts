import "server-only";

import { PrismaClient } from "@prisma/client";

declare const globalThis: {
    prismaGlobal: PrismaClient;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? new PrismaClient();

if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}

export default prisma;
