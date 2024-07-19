import { createTheme, responsiveFontSizes } from "@mui/material";
import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";

const LinkBehavior = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    return <Link ref={ref} {...props} />;
});
LinkBehavior.displayName = "LinkBehavior";

const theme = createTheme({
    spacing: (factor: number) => `${0.25 * factor}rem`,
    components: {
        MuiLink: {
            defaultProps: {
                component: LinkBehavior,
            },
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehavior,
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: ({ theme }) => ({ boxShadow: theme.shadows[1] }),
            },
        },
    },
});

export default responsiveFontSizes(theme);
