interface Props {
    error: Error | string;
}
export default function Error({ error }: Props) {
    return (
        <svg
            width="495"
            height="120"
            viewBox="0 0 495 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="0.5"
                y="0.5"
                width="494"
                height="99%"
                rx="4.5"
                fill="#FFFEFE"
                stroke="#E4E2E2"
            />
            <text
                x="25"
                y="45"
                fontSize="16"
                fontFamily="'Segoe UI', Ubuntu, Sans-Serif"
                fontWeight="600"
                fill="#2f80ed"
            >
                <tspan x="25" dy="18">
                    An error occurred
                </tspan>
                <tspan x="25" dy="18">
                    Report at https://git.io/J0sDR
                </tspan>
            </text>
            <text
                data-testid="message"
                x="25"
                y="55"
                fontSize="12"
                fontFamily="'Segoe UI', Ubuntu, Sans-Serif"
                fontWeight="600"
                fill="#252525"
            >
                <tspan x="25" dy="18">
                    {typeof error === 'string' ? error : error.message}
                </tspan>
            </text>
        </svg>
    );
}
