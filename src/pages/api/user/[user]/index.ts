import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCard from "@lib/cards/errorCard";
import StatsCard from "@lib/cards/statsCard";
import { breakMultiLineText, getDataFromNodes } from "@lib/utils";
import { graphql } from "@lib/fetcher";
import { RepoNode, UserStats } from "@lib/types";
import parseQuery from "@lib/parseQuery";
import { getFallbackDesign } from "@lib/theme";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        user,
        tq,
        custom_title,
        hide_icons,
        title,
        icon,
        text,
        background,
        border,
    } = parseQuery(req.query);

    const themeDesign = getFallbackDesign(tq, {
        title,
        icon,
        text,
        background,
        border,
    });
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200");
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

        return res.status(200).send(
            new StatsCard(themeDesign, user, userStats, {
                customTitle: custom_title,
                hideIcons: hide_icons,
            }).render()
        );
    } catch (err) {
        if (err instanceof Error) {
            return res
                .status(500)
                .send(new ErrorCard(themeDesign, err.message).render());
        }

        return console.error(err)
        
    }
}
