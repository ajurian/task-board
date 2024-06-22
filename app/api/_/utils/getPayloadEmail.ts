import "server-only";

import { z } from "zod";
import verifyIdToken from "./verifyIdToken";

export default async function getPayloadEmail() {
    const payload = await verifyIdToken();
    const { success, data: payloadEmail } = z
        .string()
        .safeParse(payload?.email);

    if (!success) {
        return null;
    }

    return payloadEmail;
}
