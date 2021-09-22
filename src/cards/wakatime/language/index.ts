import { toString } from "@helpers/query";
import {
    WakaLanguageFetcherResponse,
    WakatimeEditor,
    WakatimeLanguage,
} from "@lib/types";
import { VercelRequestQuery } from "@vercel/node";
import BaseCard, { CommonProps } from "../../BaseCard";
import { getFallbackTheme } from "@lib/theme";
import Fetcher from "@helpers/fetcher";
import { parseImage } from "@lib/parser";
import { languageColors } from "@lib/colors";
import fetch from "./fetcher";

interface LanguageCardProps extends CommonProps {
    custom_title: string;
}

export default class LanguageCard extends BaseCard {
    constructor(query: VercelRequestQuery) {
        super(query);
    }

    protected preprocess(query: VercelRequestQuery) {
        const commonProps: CommonProps = super.preprocess(query);
        const { custom_title } = query;

        return {
            ...commonProps,
            custom_title: toString(custom_title) ?? "",
        };
    }

    protected async fetch(): Promise<WakaLanguageFetcherResponse> {
        const { username, url } = this.props;
        return await fetch(username, url);
    }

    protected renderBar(
        totalSize: number,
        editors: { name: string; color: string; percentage: number }[]
    ): string[] {
        let offset = 0;

        return editors.map(
            (editor: { name: string; color: string; percentage: number }) => {
                const progress = parseFloat(
                    ((editor.percentage / totalSize) * 300).toFixed(2)
                );
                const rect = `
                    <rect mask="url(#bar-mask)" x="${offset}" y="0" width="${progress}" height="8" fill="${
                    editor.color || "#858585"
                }"/>
                `;
                offset += progress;
                return rect;
            }
        );
    }

    protected renderLanguages(
        totalSize: number,
        editors: { name: string; color: string; percentage: number }[],

        fill: string,
        weight: string,
        size: string
    ) {
        return editors.map(
            (
                editor: { name: string; color: string; percentage: number },
                index: number
            ) => {
                const percentage = (
                    (editor.percentage / totalSize) *
                    100
                ).toFixed(2);
                const color = editor.color || "#858585";
                const x = index % 2 === 0 ? 0 : 170;
                const y =
                    index % 2 === 0 ? 12.5 * index + 25 : 12.5 * (index + 1);

                return `
                    <g transform="translate(${x}, ${y})">
                        <circle
                            cx="5"
                            cy="6"
                            r="5"
                            fill="${color}"
                        />
                        <text x="15" y="10" fill="${fill}" font-size="${size}" font-weight="${weight}">${editor.name} ${percentage}%</text>
                    </g>
                `;
            }
        );
    }

    protected render(data: WakaLanguageFetcherResponse) {
        const { languages, base64 } = data;

        const {
            custom_title,
            text,
            border,
            title,
            icon,
            tq,
            background,
            font,
            size,
            weight,
            titlesize,
            titleweight,
            textsize,
            textweight,
        } = this.props as LanguageCardProps;

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
        const parsedLanguages = languages.map((lang: WakatimeLanguage) => {
            return {
                name: lang.name,
                color: languageColors[lang.name]!,
                percentage: lang.percent,
            };
        });

        let cardTitle = "Most used wakatime languages";
        if (custom_title) cardTitle = custom_title;

        const height = 90 + Math.round(parsedLanguages.length / 2) * 25;

        return `          
            <svg width="350" height="${height}" viewBox="0 0 350 ${height}" xmlns="http://www.w3.org/2000/svg" font-family="${
            design.text.font
        }" font-size="${design.text.size}" font-weight="${design.text.weight}">
                <rect x="5" y="5" width="340" height="${height - 10}" fill="${
            design.design.background
        }" stroke="${
            design.design.border
        }" stroke-width="1px" rx="6px" ry="6px" />
                     ${
                         typeof base64 === "string"
                             ? `              <clipPath id="background">
                <rect x="5" y="5" width="340" height="${height - 10}" rx="6" />
            </clipPath>
            <image x="5" y="5" clip-path="url(#background)" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${base64}" width="390" height="340" />`
                             : ""
                     }

                <g transform="translate(25, 35)">
                     <g transform="translate(0, 0)">
                         <text x="0" y="0" font-weight="${
                             design.text.title.weight
                         }" font-size="${design.text.title.size}" fill="${
            design.design.title
        }">${cardTitle}
                        </text>
                     </g>
                 </g>
                 <g transform="translate(25, 55)">
                    <mask id="bar-mask">
                        <rect x="0" y="0" width="300" height="8" fill="white" rx="5" />
                    </mask>
                    ${this.renderBar(100, parsedLanguages).join("")}
                    ${this.renderLanguages(
                        100,
                        parsedLanguages,
                        design.design.text,
                        design.text.text.weight,
                        design.text.text.size
                    ).join("")}
                 </g>
            </svg>
        `;
    }
}
