import { FallbackDesign, ThemeDesign } from "@lib/types";
import { ReactNode } from "react";
import CardTitle from "./CardTitle";

interface Props {
    children: ReactNode;
    width?: number;
    height?: number;
    defaultTitle?: string;
    titleIcon?: string;
    design: FallbackDesign;
}

export default function Card({
    width = 100,
    height = 100,
    defaultTitle = "",
    titleIcon,
    design,
    children,
}: Props) {
    const { title, icon, text, background, border } = design;
    console.log(defaultTitle);
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            fontSize="14"
            fontWeight="400"
            fontFamily="'Segoe UI', Ubuntu, Sans-Serif"
        >
            <rect
                x="5"
                y="5"
                width={width - 10}
                height={height - 10}
                fill={background}
                stroke={border}
                strokeWidth="1px"
                rx="6px"
                ry="6px"
            />
            <CardTitle
                title={defaultTitle}
                icon={titleIcon}
                iconColor={icon}
                titleColor={title}
            />
            {children}
        </svg>
    );
}
