import Fetcher from "@helpers/fetcher";
import { getRanking } from "@helpers/ranking";
import NotFoundError from "@lib/errors/NotFoundError";
import { parseImage } from "@lib/parser";
import { RepoNode, UserFetcherResponse } from "@lib/types";

export default async function fetch(
    username: string,
    url?: string
): Promise<UserFetcherResponse> {
    let response = await Fetcher.graphql<{
        login: string;
    }>(
        `
        query userInfo($login: String!) {
            user(login: $login) {
                name
                login
                followers {
                    totalCount
                }
                contributionsCollection {
                    totalCommitContributions
                    restrictedContributionsCount
                }
                pullRequests(first: 1) {
                    totalCount
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
        ranking: getRanking({
            commits: totalCommits,
            contributions: data.user.repositoriesContributedTo.totalCount,
            repos: data.user.repositories.totalCount,
            issues: data.user.issues.totalCount,
            stars,
            pullRequests: data.user.pullRequests.totalCount,
            followers: data.user.followers.totalCount,
        }),
        base64: await parseImage(url),
    };
}
