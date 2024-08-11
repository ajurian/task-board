import { ObjectId } from "bson";
import { z } from "zod";
import {
    TASK_BOARD_DISPLAY_NAME_MAX_LEN,
    TASK_BOARD_DISPLAY_NAME_MIN_LEN,
} from "../constants/constraints";
import {
    PERMISSION_ROLE_NONE,
    PERMISSION_ROLE_OWNER,
} from "../constants/permissions";

export const TaskBoardModelSchema = z.object({
    id: z.string().refine(ObjectId.isValid),
    displayName: z
        .string()
        .min(TASK_BOARD_DISPLAY_NAME_MIN_LEN)
        .max(TASK_BOARD_DISPLAY_NAME_MAX_LEN),
    flowDirection: z.enum(["row", "column"]),
    defaultPermission: z
        .number()
        .int()
        .min(PERMISSION_ROLE_NONE)
        .max(PERMISSION_ROLE_OWNER),
    thumbnailData: z
        .union([
            z.string().base64(),
            z.object({
                type: z.literal("Buffer"),
                data: z.number().int().array(),
            }),
            z.object({
                $binary: z.object({
                    base64: z.string().base64(),
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
        }),
    createdAt: z.coerce.date(),
    maxTaskLists: z.number().int().positive(),
    maxTasks: z.number().int().positive(),
});

export const TaskBoardCreateSchema = TaskBoardModelSchema.omit({
    id: true,
    flowDirection: true,
    defaultPermission: true,
    thumbnailData: true,
    createdAt: true,
    maxTaskLists: true,
    maxTasks: true,
});

export const TaskBoardUpdateSchema = TaskBoardModelSchema.omit({
    id: true,
    thumbnailData: true,
    createdAt: true,
    maxTaskLists: true,
    maxTasks: true,
})
    .extend({
        thumbnailData: z
            .union([
                z.instanceof(Buffer),
                z.string().base64(),
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

export type TaskBoardUpdateInput = z.input<typeof TaskBoardUpdateSchema>;
export type TaskBoardUpdateOutput = z.infer<typeof TaskBoardUpdateSchema>;
