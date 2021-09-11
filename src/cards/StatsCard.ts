import { toBoolean, toString } from "@helpers/query";
import { RepoNode, UserFetcherResponse } from "@lib/types";
import { VercelRequestQuery } from "@vercel/node";
import BaseCard, { CommonProps } from "./BaseCard";
import { getFallbackTheme } from "@lib/theme";
import Fetcher from "@helpers/fetcher";
import NotFoundError from "@lib/errors/NotFoundError";
import { parseImage } from "@lib/parser";

interface StatsCardProps extends CommonProps {
    custom_title: string;
    hide_icons: boolean;
}

export default class StatsCard extends BaseCard {
    constructor(query: VercelRequestQuery) {
        super(query);
    }

    protected preprocess(query: VercelRequestQuery) {
        const commonProps: CommonProps = super.preprocess(query);
        const { custom_title, hide_icons } = query;

        return {
            ...commonProps,
            custom_title: toString(custom_title) ?? "",
            hide_icons: toBoolean(hide_icons) ?? false,
        };
    }

    protected async fetch(): Promise<UserFetcherResponse> {
        const { username, url } = this.props as StatsCardProps;
        let response = await Fetcher.graphql<{
            login: string;
        }>(
            `
            query userInfo($login: String!) {
                user(login: $login) {
                    name
                    login
                    contributionsCollection {
                        totalCommitContributions
                        restrictedContributionsCount
                    }
                    repositoriesContributedTo(
                        first: 1
                        contributionTypes: [
                            COMMIT
                            ISSUE
                            PULL_REQUEST
                            REPOSITORY
                        ]
                    ) {
                        totalCount
                        nodes {
                            forkCount
                        }
                    }
                    issues(first: 1) {
                        totalCount
                    }
                    repositories(
                        first: 100
                        ownerAffiliations: OWNER
                        orderBy: { direction: DESC, field: UPDATED_AT }
                    ) {
                        totalCount
                        nodes {
                            nameWithOwner
                            stargazers {
                                totalCount
                            }
                            forkCount
                        }
                    }
                }
            }   
            `,
            {
                login: username,
            }
        );
        const { data, errors } = response.data;

        if (errors) {
            throw new NotFoundError("Could not find a user with this name");
        }

        const repoNodes: RepoNode[] = data.user.repositories.nodes;

        // Getting the amount of stars user has
        const stars = repoNodes.reduce((prev, curr) => {
            return prev + curr.stargazers!.totalCount;
        }, 0);

        // Getting the amount of forks user has
        const forks = repoNodes.reduce((prev, curr) => {
            return prev + curr.forkCount!;
        }, 0);

        const totalCommits: number =
            data.user.contributionsCollection.totalCommitContributions +
            data.user.contributionsCollection.restrictedContributionsCount;

        return {
            stars: stars.toString(),
            forks: forks.toString(),
            issues: data.user.issues.totalCount.toString(),
            commits: totalCommits.toString(),
            contributions:
                data.user.repositoriesContributedTo.totalCount.toString(),
            base64: await parseImage(url),
        };
    }

    protected render(data: UserFetcherResponse) {
        const { stars, forks, issues, commits, contributions, base64 } = data;

        const {
            custom_title,
            hide_icons,
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
                    <text x="250" y="12.5" font-size="${
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
                    <text x="250" y="12.5" font-size="${
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
                    <text x="250" y="12.5" font-size="${
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
                    <text x="250" y="12.5" font-size="${
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
                    <text x="250" y="12.5" font-size="${
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
