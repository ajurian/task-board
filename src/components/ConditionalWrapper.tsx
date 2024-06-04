interface ConditionalWrapperProps {
    condition: boolean;
    WrapperComponent: React.FC<{ children: React.ReactNode }>;
    children: React.ReactNode;
}

export default function ConditionalWrapper({
    condition,
    WrapperComponent,
    children,
}: ConditionalWrapperProps) {
    return condition ? (
        <WrapperComponent>{children}</WrapperComponent>
    ) : (
        children
    );
}
