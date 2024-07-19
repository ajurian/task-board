import { z } from "zod";

export const UserModelSchema = z.object({
    id: z.string(),
    googleId: z.string(),
    email: z.string().email(),
    displayName: z.string(),
    photoURL: z.string(),
    createdAt: z.coerce.date(),
});

export const UserCreateSchema = UserModelSchema.omit({
    id: true,
    createdAt: true,
});

export const UserUpdateSchema = UserCreateSchema.omit({
    googleId: true,
})
    .partial()
    .refine(
        ({ email, displayName, photoURL }) =>
            email !== undefined ||
            displayName !== undefined ||
            photoURL !== undefined
    );

export type UserModel = z.infer<typeof UserModelSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
