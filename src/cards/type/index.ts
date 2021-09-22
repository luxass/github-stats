import {
    RepoNode,
    TypeFetcherResponse,
    TypeObject,
    FallbackThemeDesign,
    FallbackThemeText,
    FallbackTheme,
} from "@lib/types";
import { VercelRequestQuery } from "@vercel/node";
import BaseCard, { CommonProps } from "../BaseCard";
import { getFallbackTheme } from "@lib/theme";
import Fetcher from "@helpers/fetcher";
import NotFoundError from "@lib/errors/NotFoundError";
import { DateTime } from "luxon";
import makeGraph from "progress-graph";
import { parseImage } from "@lib/parser";
import fetch from "./fetcher";

export default class Typecard extends BaseCard {
    constructor(query: VercelRequestQuery) {
        super(query);
    }

    protected preprocess(query: VercelRequestQuery) {
        const commonProps: CommonProps = super.preprocess(query);

        return {
            ...commonProps,
        };
    }

    protected async fetch(): Promise<TypeFetcherResponse> {
        const { username, url } = this.props;
        return await fetch(username, url);
    }

    protected render(data: TypeFetcherResponse) {
        const { type, daytime, morning, evening, night, base64 } = data;

        const {
            username,
            text,
            border,
            title,
            icon,
            tq,
            background,
            font,
            size,
            weight,
            textsize,
            titlesize,
            textweight,
            titleweight,
        } = this.props;

        const design = getFallbackTheme(tq, {
            design: {
                title,
                icon,
                text,
                background,
                border,
            },
            text: {
                font,
                size,
                weight,
                title: {
                    size: titlesize,
                    weight: titleweight,
                },
                text: {
                    size: textsize,
                    weight: textweight,
                },
            },
        });

        const generateTypeLines = (fallback: FallbackTheme) => {
            let y = 30;
            const { design, text } = fallback;
            return [morning, daytime, evening, night].map(
                (type: TypeObject) => {
                    y += 30;
                    return `
                        <g transform="translate(25, ${y})">
                            <text x="0" fill="${design.text}" font-size="${
                        text.text.size
                    }" font-weight="${text.text.weight}">${type.name}</text>
                            <text x="90" fill="${design.text}" font-size="${
                        text.text.size
                    }" font-weight="${text.text.weight}">${
                        type.commits
                    } commits</text>
                            <text x="180" fill="${design.text}" font-size="${
                        text.text.size
                    }" font-weight="${text.text.weight}">${makeGraph(
                        type.percent
                    )}</text>
                            <text x="450" fill="${design.text}" font-size="${
                        text.text.size
                    }" font-weight="${text.text.weight}">${type.percent}%</text>
                        </g>
                    `;
                }
            );
        };

        return `
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="530" height="185" viewBox="0 0 530 185" font-size="${
                design.text.size
            }" font-family="${design.text.font}" font-weight="${
            design.text.weight
        }">
                <rect x="5" y="5" width="520" height="175" fill="${
                    design.design.background
                }" stroke="${
            design.design.border
        }" stroke-width="1px" rx="6px" ry="6px" />
        ${
            typeof base64 === "string"
                ? `              <clipPath id="background">
        <rect x="5" y="5" width="520" height="175" rx="6" />
    </clipPath>
    <image x="5" y="5" clip-path="url(#background)" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${base64}" width="390" height="175" />`
                : ""
        }
                <text x="25" y="30" fill="${design.design.title}" font-size="${
            design.text.title.size
        }" font-weight="${design.text.title.weight}">${type}</text>
                ${generateTypeLines({
                    design: design.design,
                    text: design.text,
                }).join("")}
            
            </svg>
        `;
    }
}
