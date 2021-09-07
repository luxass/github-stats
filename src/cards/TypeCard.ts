import { toBoolean, toString } from "@helpers/query";
import { RepoNode, TypeFetcherResponse, UserFetcherResponse } from "@lib/types";
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
        return {
            morning: {
                name: "🌞 Morning",
                commits: morning,
                percent: Math.round((morning / sum) * 100) / 100,
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
        const { daytime, morning, evening, night } = data;

        const { username, text, border, title, icon, tq, background } =
            this.props;

        let hide_icons = false;

        const includeApostrophe = ["x", "s"].includes(
            username.slice(-1).toLocaleLowerCase()
        )
            ? "'"
            : "'s";

        let cardTitle = `${username}${includeApostrophe} GitHub Statistics`;
        if (true) {
            cardTitle = "custom_title";
        }

        console.log(makeGraph(daytime.percent));
        const design = getFallbackDesign(tq, {
            title,
            icon,
            text,
            background,
            border,
        });
        return `
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="600" height="185" viewBox="0 0 600 185" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji" font-size="85%">
                <rect x="5" y="5" width="590" height="175" fill="${
                    design.background
                }" stroke="${
            design.border
        }" stroke-width="1px" rx="6px" ry="6px" />
                <g transform="translate(25, 35)">
                    <text x="0">🌞 Morning</text>
                    <text x="80">55 commits</text>
                    <text x="180">${makeGraph(morning.percent)}</text>
                    <text x="500">13.06%</text>
                </g>
                <g transform="translate(25, 70)">
                <text x="0">🌞 Morning</text>
                <text x="80">55 commits</text>
                <text x="180">${makeGraph(daytime.percent)}</text>
                <text x="500">13.06%</text>
            </g>
            <g transform="translate(25, 105)">
            <text x="0">🌞 Morning</text>
            <text x="80">55 commits</text>
            <text x="180">${makeGraph(evening.percent)}</text>
            <text x="500">13.06%</text>
        </g>
        <g transform="translate(25, 140)">
        <text x="0">🌞 Morning</text>
        <text x="80">55 commits</text>
        <text x="180">${makeGraph(night.percent)}</text>
        <text x="500">13.06%</text>
    </g>
            </svg>
        `;
    }
}
//🌞 Morning    55 commits     ███░░░░░░░░░░░░░░░░░░░░░░   13.06%
//🌆 Daytime    55 commits     ███░░░░░░░░░░░░░░░░░░░░░░   13.06%
//🌃 Evening    55 commits     ███░░░░░░░░░░░░░░░░░░░░░░   13.06%
//🌙 Night      55 commits     ███░░░░░░░░░░░░░░░░░░░░░░   13.06%


█