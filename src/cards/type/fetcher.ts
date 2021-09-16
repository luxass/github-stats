import Fetcher from "@helpers/fetcher";
import { getRanking } from "@helpers/ranking";
import NotFoundError from "@lib/errors/NotFoundError";
import { parseImage } from "@lib/parser";
import { RepoNode, TypeFetcherResponse, UserFetcherResponse } from "@lib/types";
import { DateTime } from "luxon";

export default async function fetch(
    username: string,
    url?: string
): Promise<TypeFetcherResponse> {
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
        base64: await parseImage(url),
    };
}
