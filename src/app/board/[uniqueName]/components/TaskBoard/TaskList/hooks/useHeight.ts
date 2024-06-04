import { useEffect, useRef, useState } from "react";

export default function useHeight<T extends HTMLElement>() {
    const [height, setHeight] = useState(0);
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (ref.current === null) {
            return;
        }

        setHeight(ref.current.clientHeight);
    }, []);

    return { ref, height };
}
