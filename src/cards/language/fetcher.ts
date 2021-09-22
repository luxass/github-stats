import Fetcher from "@helpers/fetcher";
import NotFoundError from "@lib/errors/NotFoundError";
import { parseImage } from "@lib/parser";
import { LanguageFetcherResponse, RepoFetcherResponse, RepoNode } from "@lib/types";

export default async function fetch(
    username: string,
    with_forks: boolean,
    exclude_repos: string[],
    url?: string
): Promise<LanguageFetcherResponse> {
    let response = await Fetcher.graphql<{
        login: string;
    }>(
        `
    query userQuery($login: String!) {
        user(login: $login) {
            repositories(ownerAffiliations: OWNER, ${
                with_forks ? "isFork: true" : "isFork: false"
            }, first: 100) {
                nodes {
                    name
                    languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                        edges {
                           size
                            node {
                                color
                                name
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
        }
    );

    const { data, errors } = response.data;

    if (errors) {
        throw new NotFoundError("User not found");
    }

    const hiddenRepos = new Set(exclude_repos);
    const repoNodes: RepoNode[] = data.user.repositories.nodes.filter(
        (repo: RepoNode) => {
            if (hiddenRepos.has(repo.name)) {
                return false;
            }
            if (repo.languages!.edges.length <= 0) {
                return false;
            }
            return true;
        }
    );

    const languages = repoNodes.reduce(
        (stat, repo) => {
            repo.languages!.edges.forEach(({ size, node }) => {
                const { name, color } = node;
                if (stat.hasOwnProperty(name)) {
                    stat[name]["size"] += size;
                } else {
                    stat[name] = {
                        name,
                        color,
                        size,
                    };
                }
            });

            return stat;
        },
        {} as {
            [key: string]: { name: string; color: string; size: number };
        }
    );
    return {
        languages: Object.values(languages).sort(
            ({ size: size1 }, { size: size2 }) => size2 - size1
        ),
        base64: await parseImage(url),
    };
}
