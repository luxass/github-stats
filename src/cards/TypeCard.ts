import {
    RepoNode,
    TypeFetcherResponse,
    TypeObject,
    FallbackDesign,
} from "@lib/types";
import { VercelRequestQuery } from "@vercel/node";
import BaseCard, { CommonProps } from "./BaseCard";
import { getFallbackDesign } from "@lib/theme";
import Fetcher from "@helpers/fetcher";
import NotFoundError from "@lib/errors/NotFoundError";
import { DateTime } from "luxon";
import makeGraph from "progress-graph";

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
        const { username } = this.props;
        let userResponse = await Fetcher.request(`/users/${username}`);
        const userId = userResponse.data.node_id;
        /*
        We only take the 10 first repos, 
        because if the user has over 500 repos 
        and we are looping through them, 
        it will take a long time to fetch them all.

        10 repos is also taking a long time to load.

        */

        const response = await Fetcher.graphql<{
            login: string;
        }>(
            `
          query userInfo($login: String!) {
            user(login: $login) {
      
                repositories(
                    first: 10
                    ownerAffiliations: OWNER
                    orderBy: { direction: DESC, field: UPDATED_AT }
                ) {
                    totalCount
                    nodes {
                        name
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
            throw new NotFoundError("Data is undefined");
        }

        const repoNodes: RepoNode[] = data.user.repositories.nodes;

        let commits = repoNodes.map(async (repo) => {
            let response = await Fetcher.graphql<{
                login: string;
                repo: string;
                id: string;
            }>(
                `
                query userInfo($login: String!, $repo: String!, $id: ID!) {
                    viewer {
                    id
                    }
                    repository(owner: $login, name: $repo) {
                    defaultBranchRef {
                        target {
                        ... on Commit {
                            history(first: 100, author: { id: $id }) {
                            edges {
                                node {
                                committedDate
                                }
                            }
                            }
                        }
                        }
                    }
                    }
                }
                `,
                {
                    login: username,
                    repo: repo.name,
                    id: userId,
                }
            );

            return response.data.data.repository.defaultBranchRef.target.history.edges.map(
                (v: any) => v.node.committedDate
            );
        });

        commits = (await Promise.all(commits)).flatMap((v) => v);

        let morning: number = 0;
        let daytime: number = 0;
        let evening: number = 0;
        let night: number = 0;
        commits.forEach((commit: any) => {
            let hour = DateTime.fromISO(commit).hour;

            if (6 <= hour && hour < 12) {
                morning += 1;
            }

            if (12 <= hour && hour < 18) {
                daytime += 1;
            }

            if (18 <= hour && hour < 24) {
                evening += 1;
            }

            if (0 <= hour && hour < 6) {
                night += 1;
            }
        });
        const sum = morning + daytime + evening + night;
        const type =
            morning + daytime >= evening + night
                ? "I'm an Early 🐤"
                : "I'm a Night 🦉";
        return {
            type: type,
            morning: {
                name: "🌞 Morning",
                commits: morning,
                percent: Math.round((morning / sum) * 100),
            },
            daytime: {
                name: "🌆 Daytime",
                commits: daytime,
                percent: Math.round((daytime / sum) * 100),
            },
            evening: {
                name: "🌃 Evening",
                commits: evening,
                percent: Math.round((evening / sum) * 100),
            },
            night: {
                name: "🌙 Night",
                commits: night,
                percent: Math.round((night / sum) * 100),
            },
        };
    }

    protected render(data: TypeFetcherResponse) {
        const { type, daytime, morning, evening, night } = data;

        const { username, text, border, title, icon, tq, background } =
            this.props;

        const design = getFallbackDesign(tq, {
            title,
            icon,
            text,
            background,
            border,
        });

        const generateTypeLines = (design: FallbackDesign) => {
            let y = 30;
            return [morning, daytime, evening, night].map(
                (type: TypeObject, index: number) => {
                    y += 30;
                    return `
                        <g transform="translate(25, ${y})">
                            <text x="0" fill="${design.text}">${
                        type.name
                    }</text>
                            <text x="90" fill="${design.text}">${
                        type.commits
                    } commits</text>
                            <text x="180" fill="${design.text}">${makeGraph(
                        type.percent
                    )}</text>
                            <text x="450" fill="${design.text}">${
                        type.percent
                    }%</text>
                        </g>
                    `;
                }
            );
        };

        return `
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="530" height="185" viewBox="0 0 530 185" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji" font-size="85%">
                <rect x="5" y="5" width="520" height="175" fill="${
                    design.background
                }" stroke="${
            design.border
        }" stroke-width="1px" rx="6px" ry="6px" />
                <text x="25" y="30" fill="${design.title}">${type}</text>
                ${generateTypeLines(design).join("")}
            
            </svg>
        `;
    }
}
