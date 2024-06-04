import { useEffect, useRef, useState } from "react";

export default function useHeight<T extends HTMLElement>() {
    const [height, setHeight] = useState(0);
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (ref.current === null) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            setHeight(ref.current?.clientHeight || 0);
        });

        setHeight(ref.current.clientHeight);
        resizeObserver.observe(ref.current);

        return () => resizeObserver.disconnect();
    }, []);

    return { ref, height };
}
