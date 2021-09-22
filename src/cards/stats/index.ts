import { toBoolean, toString } from "@helpers/query";
import { RepoNode, UserFetcherResponse } from "@lib/types";
import { VercelRequestQuery } from "@vercel/node";
import BaseCard, { CommonProps } from "../BaseCard";
import { getFallbackTheme } from "@lib/theme";
import fetch from "./fetcher";

interface StatsCardProps extends CommonProps {
    custom_title: string;
    hide_icons: boolean;
    show_rank: boolean;
}

export default class StatsCard extends BaseCard {
    constructor(query: VercelRequestQuery) {
        super(query);
    }

    protected preprocess(query: VercelRequestQuery) {
        const commonProps: CommonProps = super.preprocess(query);
        const { custom_title, hide_icons, show_rank } = query;

        return {
            ...commonProps,
            custom_title: toString(custom_title) ?? "",
            hide_icons: toBoolean(hide_icons) ?? false,
            show_rank: toBoolean(show_rank) ?? false,
        };
    }

    protected async fetch(): Promise<UserFetcherResponse> {
        const { username, url } = this.props as StatsCardProps;
        return await fetch(username, url);
    }

    protected render(data: UserFetcherResponse) {
        const {
            custom_title,
            hide_icons,
            show_rank,
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
            titlesize,
            titleweight,
            textsize,
            textweight,
        } = this.props as StatsCardProps;

        const {
            stars,
            forks,
            issues,
            commits,
            contributions,
            ranking,
            base64,
        } = data;

        const includeApostrophe = ["x", "s"].includes(
            username.slice(-1).toLocaleLowerCase()
        )
            ? "'"
            : "'s";

        let cardTitle = `${username}${includeApostrophe} GitHub Statistics`;
        if (custom_title) {
            cardTitle = custom_title;
        }
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
        const rankCircle = show_rank
            ? `<g
        transform="translate(280, ${185 / 2 - 45})">
      <circle stroke="${
          design.design.title
      }" fill="none" stroke-width="6" opacity="0.2" cx="-10" cy="8" r="40" />
      <circle stroke="${
          design.design.title
      }" stroke-dasharray="250" fill="none" stroke-width="6" stroke-linecap="round" opacity="0.8" cx="-10" cy="8" r="40" />
      <g class="rank-text">
        <text
          x="-10"
          y="0"
          alignment-baseline="central"
          dominant-baseline="central"
          text-anchor="middle"
        >
          ${ranking.ranking}
        </text>
      </g>
    </g>`
            : "";

        const textX = show_rank ? "185" : "250";
        return `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="360" height="185" viewBox="0 0 360 185" font-family="${
        design.text.font
    }" font-size="${design.text.size}" font-weight="${design.text.weight}">
        <rect x="5" y="5" width="350" height="175" fill="${
            design.design.background
        }" stroke="${
            design.design.border
        }" stroke-width="1px" rx="6px" ry="6px" />
        ${
            typeof base64 === "string"
                ? `              <clipPath id="background">
      <rect x="5" y="5" width="350" height="175" rx="6" />
  </clipPath>
  <image x="5" y="5" clip-path="url(#background)" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${base64}" width="390" height="175" />`
                : ""
        }
        <text fill="${design.design.title}" font-weight="${
            design.text.title.weight
        }" font-size="${
            design.text.title.size
        }" x="25" y="35">${cardTitle}</text>
        <g transform="translate(${hide_icons ? "0" : "25"}, 55)">
        ${rankCircle}
            <g transform="translate(0, 0)">
                <g transform="translate(0, 0)">
                    ${
                        hide_icons
                            ? ""
                            : `<path fill-rule="evenodd" fill="${design.design.icon}" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z" />`
                    }
                    <text x="25" y="12.5" font-size="${
                        design.text.text.size
                    }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">Stars Earned</text>
                    <text x="${textX}" y="12.5" font-size="${
            design.text.text.size
        }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">${stars}</text>
                </g>
                <g transform="translate(0, 25)">
                    ${
                        hide_icons
                            ? ""
                            : `<path fill-rule="evenodd" fill="${design.design.icon}" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />`
                    }
                    <text x="25" y="12.5" font-size="${
                        design.text.text.size
                    }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">Forks</text>
                    <text x="${textX}" y="12.5" font-size="${
            design.text.text.size
        }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">${forks}</text>
                </g>
                <g transform="translate(0, 50)">
                    ${
                        hide_icons
                            ? ""
                            : `<path fill-rule="evenodd" fill="${design.design.icon}" d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fill-rule="evenodd" fill="${design.design.icon}" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path>`
                    }
                    <text x="25" y="12.5" font-size="${
                        design.text.text.size
                    }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">Issues</text>
                    <text x="${textX}" y="12.5" font-size="${
            design.text.text.size
        }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">${issues}</text>
                </g>
                <g transform="translate(0, 75)">
                    ${
                        hide_icons
                            ? ""
                            : `<path fill-rule="evenodd" fill="${design.design.icon}" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path>`
                    }
                    <text x="25" y="12.5" font-size="${
                        design.text.text.size
                    }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">Commits</text>
                    <text x="${textX}" y="12.5" font-size="${
            design.text.text.size
        }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">${commits}</text>
                </g>
                <g transform="translate(0, 100)">
                    ${
                        hide_icons
                            ? ""
                            : `<path fill-rule="evenodd" fill="${design.design.icon}" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />`
                    }      
                    <text x="25" y="12.5" font-size="${
                        design.text.text.size
                    }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">Contributions</text>
                    <text x="${textX}" y="12.5" font-size="${
            design.text.text.size
        }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">${contributions}</text>
                </g>
            </g>
        </g>

    </svg>
`;
    }
}
