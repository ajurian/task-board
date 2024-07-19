import { z } from "zod";

export const TaskBoardModelSchema = z.object({
    id: z.string(),
    displayName: z.string(),
    flowDirection: z.enum(["row", "column"]),
    defaultPermission: z.number().int(),
    thumbnailData: z
        .union([
            z.string(),
            z.object({
                type: z.literal("Buffer"),
                data: z.number().int().array(),
            }),
            z.object({
                $binary: z.object({
                    base64: z.string(),
                    subType: z.string(),
                }),
            }),
        ])
        .transform((bufferLike) => {
            if (typeof bufferLike === "string") {
                return bufferLike;
            }

            if ("type" in bufferLike && "data" in bufferLike) {
                return Buffer.from(bufferLike.data).toString("base64");
            }

            if ("$binary" in bufferLike) {
                return bufferLike.$binary.base64;
            }

            return null;
        })
        .nullable(),
    createdAt: z.coerce.date(),
});

export const TaskBoardCreateSchema = TaskBoardModelSchema.omit({
    id: true,
    flowDirection: true,
    defaultPermission: true,
    thumbnailData: true,
    createdAt: true,
});

export const TaskBoardUpdateSchema = TaskBoardModelSchema.omit({
    id: true,
    thumbnailData: true,
    createdAt: true,
})
    .extend({
        thumbnailData: z
            .union([
                z.instanceof(Buffer),
                z.string(),
                z.object({
                    type: z.literal("Buffer"),
                    data: z.number().int().array(),
                }),
            ])
            .transform((bufferLike) => {
                if (bufferLike instanceof Buffer) {
                    return bufferLike;
                }

                if (typeof bufferLike === "string") {
                    return Buffer.from(bufferLike, "base64");
                }

                if ("type" in bufferLike && "data" in bufferLike) {
                    return Buffer.from(bufferLike.data);
                }

                return null;
            }),
    })
    .partial()
    .refine(
        ({ displayName, flowDirection, defaultPermission, thumbnailData }) =>
            displayName !== undefined ||
            flowDirection !== undefined ||
            defaultPermission !== undefined ||
            thumbnailData !== undefined
    );

export type TaskBoardModel = z.infer<typeof TaskBoardModelSchema>;
export type TaskBoardCreate = z.infer<typeof TaskBoardCreateSchema>;

export type TaskBoardUpdateInput = Omit<
    z.infer<typeof TaskBoardUpdateSchema>,
    "thumbnailData"
> & { thumbnailData?: Buffer | string | { type: "Buffer"; data: number[] } };
export type TaskBoardUpdateOutput = z.infer<typeof TaskBoardUpdateSchema>;
