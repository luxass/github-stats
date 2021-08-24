import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCard from "@lib/cards/errorCard";
import RepoCard from "@lib/cards/repoCard";
import { graphql } from "@lib/fetcher";
import { RepoStats } from "@lib/types";
import { breakMultiLineText } from "@lib/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user, repo } = req.query as {
        user: string;
        repo: string;
    };

    res.setHeader("Content-Type", "application/json");

    try {
        const { data } = await graphql<{
            login: string;
            repo: string;
        }>(
            `
                fragment RepoInfo on Repository {
                    name: nameWithOwner
                    stars: stargazers {
                        totalCount
                    }
                    description
                    language: primaryLanguage {
                        color
                        languageName: name
                    }
                    forks: forkCount
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
                login: user,
                repo: repo,
            }
        );
        if (!data.user && !data.organization) {
            throw new Error("Both the user and organization was not found");
        }
        const userRepo = data.organization === null && data.user;
        const orgRepo = data.user === null && data.organization;
        let dataRepo;
        if (userRepo) {
            if (!data.user.repository) {
                throw new Error("No User Repository found");
            }
            dataRepo = data.user.repository;
        }

        if (orgRepo) {
            if (!data.organization.repository) {
                throw new Error("No Organization Repository found");
            }
            dataRepo = data.organization.repository;
        }

        let { name, description, language, stars, forks } = dataRepo;
        description = description || "No description provided";

        // TODO: Parse Description for unicode emojis

        const repoData: RepoStats = {
            name: name,
            description: breakMultiLineText(description),
            language: language,
            stars: stars,
            forks: forks,
        };
        return res.status(200).json(repoData);
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
}
