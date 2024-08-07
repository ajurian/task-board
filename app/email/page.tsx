import { render } from "@react-email/components";
import { notFound } from "next/navigation";
import EmailTemplate from "./EmailTemplate";

const html = render(<EmailTemplate />);

export default function EmailPage() {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV! === "production") {
        return notFound();
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
