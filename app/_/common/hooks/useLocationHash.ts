import { useEffect, useState } from "react";

export default function useLocationHash() {
    const [hash, setHash] = useState(
        typeof window === "undefined" ? "" : location.hash
    );

    useEffect(() => {
        const onHashChange = () => {
            setHash(window.location.hash);
        };

        window.addEventListener("hashchange", onHashChange);

        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    return hash;
}
