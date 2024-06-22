import { createTheme, responsiveFontSizes } from "@mui/material";
import { grey } from "@mui/material/colors";
import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";

const LinkBehavior = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    return <Link ref={ref} {...props} />;
});
LinkBehavior.displayName = "LinkBehavior";

const theme = createTheme({
    spacing: (factor: number) => `${0.25 * factor}rem`,
    palette: {
        background: {
            default: grey[50],
        },
    },
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
    },
});

export default responsiveFontSizes(theme);
