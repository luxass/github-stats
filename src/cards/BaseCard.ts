import { VercelRequestQuery } from "@vercel/node";
import { toString } from "@helpers/query";
import { removePair } from "@lib/json";

export interface CommonProps {
    username: string;
    title?: string;
    text?: string;
    icon?: string;
    border?: string;
    background?: string;
    tq?: string;
    url?: string;
    font?: string;
    size?: string;
    weight?: string;
    textsize?: string;
    titlesize?: string;
    textweight?: string;
    titleweight?: string;
}

export default class BaseCard {
    props: CommonProps;

    constructor(query: VercelRequestQuery) {
        this.props = this.preprocess(query);
    }

    public async renderSVGString(): Promise<string> {
        try {
            const stats = await this.fetch();
            return this.render(stats);
        } catch (err) {
            return this.renderError(err as Error);
        }
    }

    public async renderJSON() {
        try {
            let stats = await this.fetch();
            
            delete stats.base64;
            return { username: this.props.username, stats: stats };
        } catch (err) {
            return {
                error: err,
            };
        }
    }

    protected async fetch(): Promise<any> {}

    protected render(stats: any): string {
        return `<svg></svg>`;
    }
    private renderError(error: Error | string): string {
        return `
            <svg width="495" height="120" viewBox="0 0 495 120" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="485" height="110" rx="6" ry="6" fill="#FFFEFE"  stroke="#E4E2E2"/>
                <text x="25" y="15" style="font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif;" fill="#2f80ed">
                    <tspan x="25" dy="18">An error occurred</tspan>
                    <tspan x="25" dy="18">Report at https://git.io/J0sDR</tspan>
                </text>
                <text x="25" y="65" style="font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif;" fill="#252525">
                    <tspan x="25" dy="18">
                        ${error}
                    </tspan>
                </text>
            </svg>
        `;
    }
    protected preprocess(query: VercelRequestQuery): CommonProps {
        const { username, title, text, icon, border, background, tq, url, font, size, weight, textsize, titlesize, textweight, titleweight } =
            query;

        return {
            username: toString(username) ?? "",
            title: toString(title),
            text: toString(text),
            icon: toString(icon),
            border: toString(border),
            background: toString(background),
            tq: toString(tq),
            url: toString(url),
            font: toString(font),
            size: toString(size),
            weight: toString(weight),
            textsize: toString(textsize),
            titlesize: toString(titlesize),
            textweight: toString(textweight),
            titleweight: toString(titleweight),
        };
    }
}
