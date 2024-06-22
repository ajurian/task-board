import ClientAuthSessionAPI from "@/api/_/layers/client/AuthSessionAPI";
import ClientUserAPI from "@/api/_/layers/client/UserAPI";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { auth } from "../lib/firebase";
import { UserCreateSchema } from "../schema/user";

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: "select_account",
});

export default function useAuth() {
    const router = useRouter();

    const signIn = useCallback(async () => {
        const { user } = await signInWithPopup(auth, provider);
        const userCreate = UserCreateSchema.parse(user);
        const idToken = await user.getIdToken();

        await ClientUserAPI.post(userCreate);
        await ClientAuthSessionAPI.post({
            idToken,
            refreshToken: user.refreshToken,
        });
        await auth.signOut();

        router.refresh();
    }, [router]);

    const signOut = useCallback(async () => {
        await ClientAuthSessionAPI.delete();
        router.refresh();
    }, [router]);

    return { signIn, signOut };
}
