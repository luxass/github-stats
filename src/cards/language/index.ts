import { toBoolean, toInteger, toString, toStringArray } from "@helpers/query";
import { LanguageFetcherResponse, RepoNode } from "@lib/types";
import { VercelRequestQuery } from "@vercel/node";
import BaseCard, { CommonProps } from "../BaseCard";
import { getFallbackTheme } from "@lib/theme";
import Fetcher from "@helpers/fetcher";
import NotFoundError from "@lib/errors/NotFoundError";
import longLanguages from "@lib/languages";
import { parseImage } from "@lib/parser";
import fetch from "./fetcher";

interface LanguageCardProps extends CommonProps {
    custom_title: string;
    hide_langs: string[];
    langs_count: number;
    exclude_repos: string[];
    with_forks: boolean;
}

export default class LanguageCard extends BaseCard {
    constructor(query: VercelRequestQuery) {
        super(query);
    }

    protected preprocess(query: VercelRequestQuery) {
        const commonProps: CommonProps = super.preprocess(query);
        const {
            custom_title,
            hide_langs,
            langs_count,
            exclude_repos,
            with_forks,
        } = query;

        return {
            ...commonProps,
            custom_title: toString(custom_title) ?? "",
            hide_langs: toStringArray(hide_langs),
            exclude_repos: toStringArray(exclude_repos),
            langs_count: toInteger(langs_count) ?? 6,
            with_forks: toBoolean(with_forks) ?? false,
        };
    }

    protected async fetch(): Promise<LanguageFetcherResponse> {
        const { username, with_forks, exclude_repos, url } = this
            .props as LanguageCardProps;

        return await fetch(username, with_forks, exclude_repos, url);
    }

    protected renderProgressBar(
        totalSize: number,
        languages: { name: string; color: string; size: number }[]
    ): string[] {
        let offset = 0;

        return languages.map(
            (lang: { name: string; color: string; size: number }) => {
                const progress = parseFloat(
                    ((lang.size / totalSize) * 300).toFixed(2)
                );
                const rect = `
                    <rect mask="url(#bar-mask)" x="${offset}" y="0" width="${progress}" height="8" fill="${
                    lang.color || "#858585"
                }"/>
                `;
                offset += progress;
                return rect;
            }
        );
    }

    protected renderLanguages(
        totalSize: number,
        languages: { name: string; color: string; size: number }[],
        fill: string,
        weight: string,
        size: string
    ) {
        return languages.map(
            (
                lang: { name: string; color: string; size: number },
                index: number
            ) => {
                const percentage = ((lang.size / totalSize) * 100).toFixed(2);
                const color = lang.color || "#858585";
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
                        <text x="15" y="10" fill="${fill}" font-size="${size}" font-weight="${weight}">${lang.name} ${percentage}%</text>
                    </g>
                `;
            }
        );
    }

    protected render(data: LanguageFetcherResponse) {
        const { languages, base64 } = data;

        // Make a Set from all the long language names
        const longLanguageNames = new Set(longLanguages);

        const {
            custom_title,
            hide_langs,
            langs_count,
            with_forks,
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

        // Set of hidden languages
        const hiddenLangs = new Set(
            hide_langs.map((lang) => lang.toLowerCase().trim())
        );

        const langsCount = Math.min(Math.max(1, langs_count), 20);

        const langs = languages
            .filter((lang) => !hiddenLangs.has(lang.name.toLowerCase().trim()))
            .slice(0, langsCount);

        const totalSize = langs.reduce((acc, curr) => acc + curr.size, 0);

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
        langs.map((lang) =>
            longLanguageNames.has(lang.name)
                ? (lang.name = lang.name.slice(0, 15) + "...")
                : lang.name
        );
        let cardTitle = `Most Used Languages ${
            with_forks ? "Including Forks" : ""
        }`;
        if (custom_title) cardTitle = custom_title;

        const height = 90 + Math.round(langs.length / 2) * 25;
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
            <image x="5" y="5" clip-path="url(#background)" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${base64}" width="390" height="${
                                   height - 10
                               }" />`
                             : ""
                     }
                <g transform="translate(25, 35)">
                    <g transform="translate(0, 0)">
                        <text x="0" y="0" font-weight="${
                            design.text.title.weight
                        }" font-size="${design.text.title.size}" fill="${
            design.design.title
        }">${cardTitle}</text>
                    </g>
                </g>
                <g transform="translate(0, 55)">
                    <svg x="25">
                        <mask id="bar-mask">
                            <rect x="0" y="0" width="300" height="8" fill="white" rx="5" />
                        </mask>
                        ${this.renderProgressBar(totalSize, langs).join("")}
                       ${this.renderLanguages(
                           totalSize,
                           langs,
                           design.design.text,
                           design.text.text.weight,
                           design.text.text.size
                       ).join("")}
                    </svg>
                </g>
            </svg>
        `;
    }
}
