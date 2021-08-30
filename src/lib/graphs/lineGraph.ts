import { ThemeDesign } from "@lib/types";

export default class LineGraph {
    constructor(private design: ThemeDesign) {
        this.design = design;
    }

    render() {
        const { title, icon, border, background, text } = this.design;
        return `
            <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="390" height="390" fill="${background}" stroke="${border}" stroke-width="1px" rx="6px" ry="6px" />
                <g transform="translate(25, 25)">
                    <rect width="350" height="350" fill="black"/>
                </g>
            </svg>
        `;
    }
}
