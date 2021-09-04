import { VercelRequestQuery, VercelResponse } from "@vercel/node";
import {
    toString,
    toInteger,
    toFloatingNumber,
    toBoolean,
} from "@helpers/query";
import ErrorComp from "../components/Error";

export interface CommonProps {
    username: string;
    title?: string;
    text?: string;
    icon?: string;
    border?: string;
    background?: string;
    tq?: string;
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
            console.error(err);
            if (err instanceof Error) {
                return `ReactDOMServer.renderToString(<ErrorComp error={err} />);`;
            }
            return `ReactDOMServer.renderToString(
                <ErrorComp error={} />
            );
            `;
        }
    }

    protected async fetch(): Promise<any> {}

    protected render(stats: any): string {
        return `<svg></svg>`;
    }

    protected preprocess(query: VercelRequestQuery): CommonProps {
        const { username, title, text, icon, border, background, tq } = query;
        return {
            username: toString(username) ?? "",
            title: toString(title),
            text: toString(text),
            icon: toString(icon),
            border: toString(border),
            background: toString(background),
            tq: toString(tq),
        };
    }
}
