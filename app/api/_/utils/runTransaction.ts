import prisma from "@/_/common/lib/prisma";
import { PrismaClient } from "@prisma/client";
import {
    ITXClientDenyList,
    PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";

export default async function runTransaction<R>(
    fn: (prisma: Omit<PrismaClient, ITXClientDenyList>) => Promise<R>,
    options?: { maxWait?: number; timeout?: number }
) {
    let retries = 0;
    let result: R | null = null;

    while (retries < 5) {
        try {
            result = await prisma.$transaction<R>(fn, options);
            break;
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === "P2034"
            ) {
                retries++;
                continue;
            }

            throw error;
        }
    }

    return result;
}
