import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { ThemeDesign } from "@lib/types";

type CardProps = {
    design: ThemeDesign;
};

export default function StatsCard({ design }: CardProps) {
    const { title, icon, text, background, border } = design;

    const [data, setData] = useState({
        user: "not found",
        stats: {
            stars: "0",
            forks: "0",
            issues: "0",
            commits: "0",
            contributions: "0",
        },
    });

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:3000/api/json/deprecatedluxas/"
            );
            const data = await response.json();
            setData(data);
        }
        fetchData();
    }, []);
    const { user, stats } = data;
    const { stars, forks, commits, issues, contributions } = stats;
    let username = user;
    const includeApostrophe = ["x", "s"].includes(
        username.slice(-1).toLocaleLowerCase()
    )
        ? "'"
        : "'s";
    username = `${username}${includeApostrophe}`;
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="360"
            height="185"
            viewBox="0 0 360 185"
            fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji"
            fontSize="14px"
        >
            <rect
                x="5"
                y="5"
                width="calc(100% - 10px)"
                height="calc(100% - 10px)"
                fill={background}
                stroke={border}
                strokeWidth="1px"
                rx="6px"
                ry="6px"
            />
            <text fill={title} x="25" y="35">
                {username} GitHub Statistics
            </text>
            <g transform="translate(25, 55)">
                <g transform="translate(0, 0)">
                    <g transform="translate(0, 0)">
                        <path
                            fill={icon}
                            fillRule="evenodd"
                            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
                        />
                        <text x="25" y="12.5" fontSize="12px" fill={text}>
                            Stars
                        </text>
                        <text x="250" y="12.5" fontSize="12px" fill={text}>
                            {stars}
                        </text>
                    </g>
                    <g transform="translate(0, 25)">
                        <path
                            fill={icon}
                            fillRule="evenodd"
                            d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        />
                        <text x="25" y="12.5" fontSize="12px" fill={text}>
                            Forks
                        </text>
                        <text x="250" y="12.5" fontSize="12px" fill={text}>
                            {forks}
                        </text>
                    </g>
                    <g transform="translate(0, 50)">
                        <path
                            fill={icon}
                            fillRule="evenodd"
                            d="M1 2.5A2.5 2.5 0 013.5 0h8.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V1.5h-8a1 1 0 00-1 1v6.708A2.492 2.492 0 013.5 9h3.25a.75.75 0 010 1.5H3.5a1 1 0 100 2h5.75a.75.75 0 010 1.5H3.5A2.5 2.5 0 011 11.5v-9zm13.23 7.79a.75.75 0 001.06-1.06l-2.505-2.505a.75.75 0 00-1.06 0L9.22 9.229a.75.75 0 001.06 1.061l1.225-1.224v6.184a.75.75 0 001.5 0V9.066l1.224 1.224z"
                        />
                        <text x="25" y="12.5" fontSize="12px" fill={text}>
                            Issues
                        </text>
                        <text x="250" y="12.5" fontSize="12px" fill={text}>
                            {issues}
                        </text>
                    </g>
                    <g transform="translate(0, 75)">
                        <path
                            fill={icon}
                            fillRule="evenodd"
                            d="M8.75 1.75a.75.75 0 00-1.5 0V5H4a.75.75 0 000 1.5h3.25v3.25a.75.75 0 001.5 0V6.5H12A.75.75 0 0012 5H8.75V1.75zM4 13a.75.75 0 000 1.5h8a.75.75 0 100-1.5H4z"
                        />
                        <text x="25" y="12.5" fontSize="12px" fill={text}>
                            Commits
                        </text>
                        <text x="250" y="12.5" fontSize="12px" fill={text}>
                            {commits}
                        </text>
                    </g>
                    <g transform="translate(0, 100)">
                        <path
                            fill={icon}
                            fillRule="evenodd"
                            d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                        />
                        <text x="25" y="12.5" fontSize="12px" fill={text}>
                            Repositories with contributions
                        </text>
                        <text x="250" y="12.5" fontSize="12px" fill={text}>
                            {contributions}
                        </text>
                    </g>
                </g>
            </g>
        </svg>
    );
}
