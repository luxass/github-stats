import { ThemeDesign } from "@lib/types";

type RepoProps = {
    design: ThemeDesign;
};
export default function RepoCard({ design }: RepoProps) {
    const { title, border, background, text, icon } = design;

    return (
        <svg
            width="400"
            height="120"
            viewBox="0 0 400 120"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="5"
                width="390"
                height="110"
                fill={background}
                stroke={border}
                strokeWidth="1px"
                rx="6px"
                ry="6px"
            />
            <g transform="translate(25, 35)">
                <g transform="translate(0, 0)">
                    <svg
                        x="0"
                        y="-13"
                        viewBox="0 0 16 16"
                        version="1.1"
                        height="16"
                        width="16"
                        fill={icon}
                    >
                        <path
                            fillRule="evenodd"
                            d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                        />
                    </svg>
                </g>
                <g transform="translate(25, 0)">
                    <text
                        x="0"
                        y="0"
                        style={{
                            font: "600 18px 'Segoe UI', Ubuntu, Sans-serif",
                        }}
                        fill={title}
                    >
                        DeprecatedLuxas/live-server-qr
                    </text>
                </g>
            </g>
            <g transform="translate(0, 55)">
                <text
                    x="25"
                    y="-5"
                    style={{
                        font: "400 13px 'Segoe UI', Ubuntu, Sans-serif",
                    }}
                    fill={text}
                >
                    <tspan dy="1.2em" x="25">
                        No description provided
                    </tspan>
                </text>
                <g transform="translate(0, 45)">
                    <g transform="translate(30, 0)">
                        <circle cx="0" cy="-5" r="6" fill="#2b7489" />
                        <text
                            style={{
                                font: "400 12px 'Segoe UI', Ubuntu, Sans-serif",
                            }}
                            fill={text}
                            x="15"
                        >
                            TypeScript
                        </text>
                    </g>
                    <g transform="translate(125, 0)">
                        <g transform="translate(0, 0)">
                            <svg
                                fill={icon}
                                y="-12"
                                viewBox="0 0 16 16"
                                version="1.1"
                                width="16"
                                height="16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
                                />
                            </svg>
                            <text
                                style={{
                                    font: "400 12px 'Segoe UI', Ubuntu, Sans-serif",
                                }}
                                fill={text}
                                x="25"
                            >
                                0
                            </text>
                        </g>
                        <g transform="translate(65, 0)">
                            <svg
                                fill={icon}
                                y="-12"
                                viewBox="0 0 16 16"
                                version="1.1"
                                width="16"
                                height="16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                />
                            </svg>
                            <text
                                style={{
                                    font: "400 12px 'Segoe UI', Ubuntu, Sans-serif",
                                }}
                                fill={text}
                                x="25"
                            >
                                0
                            </text>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
}
