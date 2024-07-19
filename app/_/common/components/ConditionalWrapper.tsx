import React from "react";

interface ConditionalWrapperProps {
    condition: boolean;
    render: (children: React.ReactElement) => React.ReactNode;
    children: React.ReactElement;
}

export default function ConditionalWrapper({
    condition,
    render,
    children,
}: ConditionalWrapperProps) {
    return condition ? render(children) : children;
}
