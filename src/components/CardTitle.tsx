interface Props {
    titleColor: string;
    iconColor: string;
    title: string;
    icon?: string;
}

export default function CardTitle({
    title,
    icon,
    iconColor,
    titleColor,
}: Props) {


    return (
        <g transform="translate(25, 35)">
            <g transform="translate(0, 0)">
                <svg
                    x="0"
                    y="-13"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    height="16"
                    fill={iconColor}
                >
                    {icon}
                </svg>
            </g>
            <g transform="translate(25, 0)">
                <text
                    x="0"
                    y="0"
                    fill={titleColor}
                    fontWeight="600"
                    fontSize="18"
                >
                    {title}
                </text>
            </g>
        </g>
    );
}
