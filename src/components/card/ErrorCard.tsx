import { ThemeDesign } from "@lib/types";
import { breakMultiLineText } from "@lib/utils";

type ErrorProps = {
    design: ThemeDesign;
    error: string;
};

export default function ErrorCard({ design, error }: ErrorProps) {
    let message = breakMultiLineText(error);
    const height = (message.length > 1 ? 100 : 90) + message.length * 10;

    const { title, border, background, text } = design;
    console.log(design);
    return (
        <svg
            width="350"
            height={height}
            viewBox={`0 0 350 ${height}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="0.5"
                y="0.5"
                width="340"
                height={height - 10}
                rx="4.5"
                fill={background}
                stroke={border}
            />
            <text
                x="25"
                y="15"
                style={{
                    font: "600 16px 'Segoe UI', Ubuntu, Sans-Serif",
                }}
                fill={title}
            >
                <tspan x="25" dy="18">
                    An error occurred
                </tspan>
                <tspan x="25" dy="18">
                    Report at https://git.io/J0sDR
                </tspan>
            </text>
            <text
                x="25"
                y="65"
                style={{
                    font: "600 12px 'Segoe UI', Ubuntu, Sans-Serif",
                }}
                fill={text}
            >
                {message &&
                    message.map((line: string) => (
                        <tspan key={line} dy="1.2em" x="25">
                            {line}
                        </tspan>
                    ))}
            </text>
        </svg>
    );
}
