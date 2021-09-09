import { toBoolean, toString } from "@helpers/query";
import { RepoFetcherResponse } from "@lib/types";
import { VercelRequestQuery } from "@vercel/node";
import BaseCard, { CommonProps } from "./BaseCard";
import wordwrap from "@lib/wordwrap";
import { getFallbackTheme } from "@lib/theme";
import getIcons from "src/icons";
import Fetcher from "@helpers/fetcher";
import NotFoundError from "@lib/errors/NotFoundError";
import wcwidth from "wcwidth";
import { parseImage } from "@lib/parser";
interface RepoCardProps extends CommonProps {
    repo: string;
    hide_owner: boolean;
}

export default class RepoCard extends BaseCard {
    constructor(query: VercelRequestQuery) {
        super(query);
    }

    protected preprocess(query: VercelRequestQuery) {
        const commonProps: CommonProps = super.preprocess(query);
        const { repo, hide_owner } = query;

        return {
            ...commonProps,
            repo: toString(repo) ?? "",
            hide_owner: toBoolean(hide_owner) ?? false,
        };
    }

    protected async fetch(): Promise<RepoFetcherResponse> {
        const { username, repo, url } = this.props as RepoCardProps;
        let response = await Fetcher.graphql<{
            login: string;
            repo: string;
        }>(
            `
                fragment RepoInfo on Repository {
                    name
                    nameWithOwner
                    stargazers {
                        totalCount
                    }
                    description
                    primaryLanguage {
                        color
                        id
                        name
                    }
                    forkCount
                }
                query getRepo($login: String!, $repo: String!) {
                    user(login: $login) {
                        repository(name: $repo) {
                            ...RepoInfo
                        }
                    }
                    organization(login: $login) {
                        repository(name: $repo) {
                            ...RepoInfo
                        }
                    }
                }
            `,
            {
                login: username,
                repo: repo,
            }
        );
        const { data, errors } = response.data;

        if (!data.user && !data.organization) {
            throw new NotFoundError(
                "Both the user and organization was not found"
            );
        }

        const userRepo = data.organization === null && data.user;
        const orgRepo = data.user === null && data.organization;

        let dataRepo;
        if (userRepo) {
            if (!data.user.repository || data.user.repository.isPrivate) {
                throw new NotFoundError("No User Repository found");
            }
            dataRepo = data.user.repository;
        }

        if (orgRepo) {
            if (
                !data.organization.repository ||
                data.organization.repository.isPrivate
            ) {
                throw new NotFoundError("No Organization Repository found");
            }
            dataRepo = data.organization.repository;
        }

        return { ...dataRepo, base64: await parseImage(url) };
    }

    protected render(data: RepoFetcherResponse) {
        const {
            name,
            nameWithOwner,
            stargazers,
            description,
            primaryLanguage,
            forkCount,
            base64,
        } = data;

        const {
            hide_owner,
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
        } = this.props as RepoCardProps;

        let desc: string | string[] = description;
        desc = desc || "No description provided";
        desc = wordwrap(desc, {
            width: 50,
            breakWord: false,
        });

        let repoName = hide_owner ? name : nameWithOwner;

        repoName =
            wcwidth(repoName) >= 32
                ? repoName.substring(
                      0,
                      32 / wcwidth(repoName.substring(0, 1))
                  ) + "..."
                : repoName;
        const height = (desc.length > 1 ? 120 : 110) + desc.length * 10;

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
        const langName =
            (primaryLanguage && primaryLanguage.name) || "Unspecified";
        const langColor =
            (primaryLanguage && primaryLanguage.color) || "#333333";

        return `
            <svg width="400" height="${height}" viewBox="0 0 400 ${height}" xmlns="http://www.w3.org/2000/svg" font-family="${
            design.text.font
        }" font-size="${design.text.size}" font-weight="${design.text.weight}">
                <rect x="5" y="5" width="390" height="${height - 10}" fill="${
            design.design.background
        }" stroke="${design.design.border}" stroke-width="1px" rx="6px" />
                ${
                    typeof base64 === "string"
                        ? `              <clipPath id="background">
                <rect x="5" y="5" width="390" height="${height - 10}" rx="6" />
            </clipPath>
            <image x="5" y="5" clip-path="url(#background)" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${base64}" width="390" height="${
                              height - 10
                          }" />`
                        : ""
                }
                <g transform="translate(25, 35)">
                    <g transform="translate(0, 0)">
                        <svg x="0" y="-13" viewBox="0 0 16 16" version="1.1" height="16" width="16" fill="${
                            design.design.icon
                        }">
                        <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
                        </svg>
                    </g>
                    <g transform="translate(25, 0)">
                        <text x="0" y="0" font-size="${
                            design.text.title.size
                        }" font-weight="${design.text.title.weight}" fill="${
            design.design.title
        }">
                            ${repoName}
                        </text>
                    </g>
                </g>
                <g transform="translate(0, 55)">
                    <text x="25" y="-5" font-size="${
                        design.text.text.size
                    }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }">
                        ${desc
                            .map(
                                (line: string) =>
                                    `<tspan dy="1.2em" x="25">${line}</tspan>`
                            )
                            .join("")}
                    </text>
                    <g transform="translate(0, ${height - 75})">
                        <g transform="translate(30, 0)">
                            <circle cx="0" cy="-5" r="6" fill="${langColor}"/>
                            <text font-size="${
                                design.text.text.size
                            }" font-weight="${design.text.text.weight}" fill="${
            design.design.text
        }" x="15">${langName}</text>
                        </g>
                        <g transform="translate(${
                            langName
                                ? 185 - (langName.length > 15 ? 0 : 30)
                                : 25
                        }, 0)">
                            <g transform="translate(0, 0)">
                                <svg fill="${
                                    design.design.icon
                                }" y="-12" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                                    <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"/>
                                </svg>
                                <text font-size="${
                                    design.text.text.size
                                }" font-weight="${
            design.text.text.weight
        }" fill="${design.design.text}" x="25">${stargazers.totalCount}</text>
                            </g>
                            <g transform="translate(65, 0)">
                                <svg fill="${
                                    design.design.icon
                                }" y="-12" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                                    <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                                </svg>
                                <text font-size="${
                                    design.text.text.size
                                }" font-weight="${
            design.text.text.weight
        }" fill="${design.design.text}" x="25">${forkCount}</text>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        `;
    }
}
