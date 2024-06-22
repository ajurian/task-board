import { z } from "zod";

export const UserModelSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    displayName: z.string(),
    photoURL: z.string().nullable(),
    createdAt: z.coerce.date(),
});

export const UserCreateSchema = UserModelSchema.omit({
    id: true,
    createdAt: true,
});

export const UserUpdateSchema = UserCreateSchema.omit({ email: true });

export type UserModel = z.infer<typeof UserModelSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
