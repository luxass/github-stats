import { RepoStats, ThemeDesign } from "../types";
import icons from "../icons";
import BaseCard from "./baseCard";

export default class RepoCard extends BaseCard {
    data: RepoStats;
    constructor(design: ThemeDesign, data: RepoStats) {
        super(design);
        this.data = data;
    }

    render() {
        const { name, description, language, stars, forks } = this.data;
        const { languageName, color } = language;
        const { totalCount } = stars;

        const height =
            (description.length > 1 ? 120 : 110) + description.length * 10;

        const { title, icon, border, background, text } = this.design;
        return `
            <svg width="400" height="${height}" viewBox="0 0 400 ${height}" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="390" height="${
                    height - 10
                }" fill="${background}" stroke="${border}" stroke-width="1px" rx="6px" ry="6px" />
                <g transform="translate(25, 35)">
                    <g transform="translate(0, 0)">
                        <svg x="0" y="-13" viewBox="0 0 16 16" version="1.1" height="16" width="16" fill="${icon}">
                            ${icons.contributions}
                        </svg>
                    </g>
                    <g transform="translate(25, 0)">
                        <text x="0" y="0" style="font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;" fill="${title}">
                            ${name}
                        </text>
                    </g>
                </g>
                <g transform="translate(0, 55)">
                    <text x="25" y="-5" style="font:400 13px 'Segoe UI', Ubuntu, Sans-Serif;" fill="${text}">
                        ${description
                            .map(
                                (line: string) =>
                                    `<tspan dy="1.2em" x="25">${line}</tspan>`
                            )
                            .join("")}
                    </text>
                    <g transform="translate(0, ${height - 75})">
                        <g transform="translate(30, 0)">
                            <circle cx="0" cy="-5" r="6" fill="${color}"/>
                            <text style="font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif;" fill="${text}" x="15">${languageName}</text>
                        </g>
                        <g transform="translate(${
                            language
                                ? 185 - (languageName.length > 15 ? 0 : 30)
                                : 25
                        }, 0)">
                            <g transform="translate(0, 0)">
                                <svg fill="${icon}" y="-12" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                                    <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"/>
                                </svg>
                                <text style="font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif;" fill="${text}" x="25">${totalCount}</text>
                            </g>
                            <g transform="translate(65, 0)">
                                <svg fill="${icon}" y="-12" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                                    <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                                </svg>
                                <text style="font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif;" fill="${text}" x="25">${forks}</text>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        `;
    }
}
