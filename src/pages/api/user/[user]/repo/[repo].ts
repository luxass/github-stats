import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCard from "@lib/cards/errorCard";
import RepoCard from "@lib/cards/repoCard";
import { graphql } from "@lib/fetcher";
import { RepoStats } from "@lib/types";
import { breakMultiLineText } from "@lib/utils";
import parseQuery from "@lib/parseQuery";
import { getFallbackDesign } from "@lib/theme";
import wordwrap from "@lib/wordwrap";
import wcwidth from "wcwidth";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        user,
        repo,
        tq,
        hide_owner,
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
        const { data } = await graphql<{
            login: string;
            repo: string;
        }>(
            `
                fragment RepoInfo on Repository {
                    name: ${hide_owner ? "name" : "nameWithOwner"}
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

 
        const repoData: RepoStats = {
            name:  wcwidth(name) >= 32 ? name.substring(0, 32 / wcwidth(name.substring(0, 1))) + "..." : name,
            description: wordwrap(description, {
                width: 50,
                breakWord: false,
            }),
            language: language,
            stars: stars,
            forks: forks,
        };

        return res
            .status(200)
            .send(new RepoCard(themeDesign, repoData).render());
    } catch (err) {
        if (err instanceof Error) {
            return res
                .status(500)
                .send(new ErrorCard(themeDesign, err.message).render());
        }
        return console.error(err);
    }
}
