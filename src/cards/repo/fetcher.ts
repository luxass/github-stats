import Fetcher from "@helpers/fetcher";
import NotFoundError from "@lib/errors/NotFoundError";
import { parseImage } from "@lib/parser";
import { RepoFetcherResponse } from "@lib/types";

export default async function fetch(
    username: string,
    repo: string,
    url?: string
): Promise<RepoFetcherResponse> {
    let response = await Fetcher.graphql<{
        login: string;
        repo: string;
    }>(
        `
            fragment RepoInfo on Repository {
                name
                nameWithOwner
                stargazers {
                    totalCount
                }
                description
                primaryLanguage {
                    color
                    id
                    name
                }
                forkCount
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
            login: username,
            repo: repo,
        }
    );
    const { data, errors } = response.data;

    if (!data.user && !data.organization) {
        throw new NotFoundError("Both the user and organization was not found");
    }

    const userRepo = data.organization === null && data.user;
    const orgRepo = data.user === null && data.organization;

    let dataRepo;
    if (userRepo) {
        if (!data.user.repository || data.user.repository.isPrivate) {
            throw new NotFoundError("No User Repository found");
        }
        dataRepo = data.user.repository;
    }

    if (orgRepo) {
        if (
            !data.organization.repository ||
            data.organization.repository.isPrivate
        ) {
            throw new NotFoundError("No Organization Repository found");
        }
        dataRepo = data.organization.repository;
    }

    return { ...dataRepo, base64: await parseImage(url) };
}
