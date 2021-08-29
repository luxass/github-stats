import { ThemeDesign } from "@lib/types";
import { breakMultiLineText } from "@lib/utils";
import BaseCard from "./baseCard";

export default class ErrorCard extends BaseCard {
    error: string[];
    constructor(design: ThemeDesign, error: string) {
        super(design);
        this.error = breakMultiLineText(error);
    }

    render() {
        const height =
            (this.error.length > 1 ? 100 : 90) + this.error.length * 10;

        const { title, border, background, text } = this.design;
        return `
            <svg width="350" height="${height}" viewBox="0 0 350 ${height}" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="349" height="99%" rx="4.5" fill="${background}" stroke="${border}"/>
                <text x="25" y="15" style="font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif;" fill="${title}">
                    <tspan x="25" dy="18">An error occurred</tspan>
                    <tspan x="25" dy="18">Report at https://git.io/J0sDR</tspan>
                </text>
                <text x="25" y="65" style="font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif;" fill="${text}">
                ${this.error
                    .map(
                        (line: string) =>
                            `<tspan dy="1.2em" x="25">${line}</tspan>`
                    )
                    .join("")}
                </text>
            </svg>
        
        `;
    }
}
