import dynamic from "next/dynamic";

export default dynamic(() => import("./TaskBoard"), {
    ssr: false,
});
