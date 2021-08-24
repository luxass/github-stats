import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCard from "@lib/cards/errorCard";
import StatsCard from "@lib/cards/statsCard";
import { breakMultiLineText, getDataFromNodes } from "@lib/utils";
import { graphql } from "@lib/fetcher";
import { RepoNode, UserStats } from "@lib/types";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user } = req.query as { user: string };
    res.setHeader("Content-Type", "image/svg+xml");

    try {
        const { data } = await graphql<{
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
                login: user,
            }
        );
        // TODO: This should probably have some better error handling when the user doesn't exist.
        // TODO: Should probably also update the cards to contain the correct messages.
        const repoNodes: RepoNode[] = data.user.repositories.nodes;
        const { stars, forks } = getDataFromNodes(repoNodes);
        const userStats: UserStats = {
            stars: stars.toString(),
            forks: forks.toString(),
            issues: data.user.issues.totalCount.toString(),
            commits:
                data.user.contributionsCollection.totalCommitContributions.toString(),
            contributions:
                data.user.repositoriesContributedTo.totalCount.toString(),
        };
        return res.status(200).send(StatsCard(user, userStats));
    } catch (err) {
        return res.status(500).send(ErrorCard(breakMultiLineText(err.message)));
    }
}
