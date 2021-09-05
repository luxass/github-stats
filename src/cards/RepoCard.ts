import { toBoolean, toString } from "@helpers/query";
import { RepoFetcherResponse } from "@lib/types";
import { VercelRequestQuery } from "@vercel/node";
import BaseCard, { CommonProps } from "./BaseCard";
import Card from "../components/Card";
import wordwrap from "@lib/wordwrap";
import { getFallbackDesign } from "@lib/theme";
import getIcons from "src/icons";
import Fetcher from "@helpers/fetcher";
import NotFoundError from "@lib/errors/NotFoundError";

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
        const { username, repo } = this.props as RepoCardProps;
        let response = await Fetcher.graphql<{
            login: string;
            repo: string;
        }>(
            `
                fragment RepoInfo on Repository {
                    name
                    nameWithOwner
                    isPrivate
                    isArchived
                    isTemplate
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

        return dataRepo;
    }

    protected render(data: RepoFetcherResponse) {
        const {
            name,
            nameWithOwner,
            stargazers,
            description,
            primaryLanguage,
            forkCount,
        } = data;

        const { repo, hide_owner, text, border, title, icon, tq, background } =
            this.props as RepoCardProps;

        let desc: string | string[] = description;
        desc = desc || "No description provided";
        desc = wordwrap(desc, {
            width: 50,
            breakWord: false,
        });
        const height = (desc.length > 1 ? 120 : 110) + desc.length * 10;

        const design = getFallbackDesign(tq, {
            title,
            icon,
            text,
            background,
            border,
        });
        const langName =
            (primaryLanguage && primaryLanguage.name) || "Unspecified";
        const langColor =
            (primaryLanguage && primaryLanguage.color) || "#333333";

        const icons = getIcons();
        return `
            <svg width="400" height="${height}" viewBox="0 0 400 ${height}" xmlns="http://www.w3.org/2000/svg" font-size="14" font-weight="400" font-family="'Segoe UI', Ubuntu, Sans-Serif">
                <rect x="5" y="5" width="390" height="${height - 10}" fill="${
            design.background
        }" stroke="${design.border}" stroke-width="1px" rx="6px" ry="6px" />
                <g transform="translate(25, 35)">
                    <g transform="translate(0, 0)">
                        <svg x="0" y="-13" viewBox="0 0 16 16" version="1.1" height="16" width="16" fill="${
                            design.icon
                        }">
                            ${icons.contribution}
                        </svg>
                    </g>
                    <g transform="translate(25, 0)">
                        <text x="0" y="0" font-size="18" font-weight="600" fill="${
                            design.title
                        }">
                            ${hide_owner ? name : nameWithOwner}
                        </text>
                    </g>
                </g>
                <g transform="translate(0, 55)">
                    <text x="25" y="-5" font-size="13" font-weight="400" fill="${
                        design.text
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
                            <text font-size="12" font-weight="400" fill="${
                                design.text
                            }" x="15">${langName}</text>
                        </g>
                        <g transform="translate(${
                            langName
                                ? 185 - (langName.length > 15 ? 0 : 30)
                                : 25
                        }, 0)">
                            <g transform="translate(0, 0)">
                                <svg fill="${
                                    design.icon
                                }" y="-12" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                                    <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"/>
                                </svg>
                                <text font-size="12" font-weight="400" fill="${
                                    design.text
                                }" x="25">${stargazers.totalCount}</text>
                            </g>
                            <g transform="translate(65, 0)">
                                <svg fill="${
                                    design.icon
                                }" y="-12" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                                    <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                                </svg>
                                <text font-size="12" font-weight="400" fill="${
                                    design.text
                                }" x="25">${forkCount}</text>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        `;
    }
}
