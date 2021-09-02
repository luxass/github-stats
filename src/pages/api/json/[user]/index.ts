import type { NextApiRequest, NextApiResponse } from "next";
import { graphql } from "@lib/fetcher";
import { RepoNode, UserStats } from "@lib/types";
import { getDataFromNodes } from "@lib/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user } = req.query as { user: string };
    res.setHeader("Content-Type", "application/json");

    try {
        const { data, errors } = await graphql<{
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
                            first: 100
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
                login: user,
            }
        );
        if (errors) {
            throw new Error(
                errors[0].type === "NOT_FOUND"
                    ? "Could not find a user with this name"
                    : "Unknown Error"
            );
        }
        const repoNodes: RepoNode[] = data.user.repositories.nodes;
        const { stars, forks } = getDataFromNodes(repoNodes);

        const totalCommits =
            data.user.contributionsCollection.totalCommitContributions +
            data.user.contributionsCollection.restrictedContributionsCount;
        const userStats: UserStats = {
            stars: stars.toString(),
            forks: forks.toString(),
            issues: data.user.issues.totalCount.toString(),
            commits: totalCommits.toString(),
            contributions:
                data.user.repositoriesContributedTo.totalCount.toString(),
        };
        return res.status(200).json({
            user: user,
            stats: userStats,
        });
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                error: err.message,
            });
        }
        return console.error(err);
    }
}
