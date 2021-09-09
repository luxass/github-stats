import RateLimitError from "@lib/errors/RateLimitError";
import axios, { AxiosResponse } from "axios";

// Looping through the env variables to check how many GH_PATs there are
function getMaximumOfRetries() {
    return Object.keys(process.env)
        .map((key) => /GH_PAT_(?<int>\d+)/g.exec(key)?.groups?.int)
        .filter((key) => key !== undefined);
}

export default class Fetcher {
    private static RETRIES_LIST = getMaximumOfRetries();
    static readonly MAX_RETRIES = getMaximumOfRetries().length;

    static async request(
        path: string,
        extraHeaders: { [key: string]: string } = {},
        retries: number = 0
    ): Promise<AxiosResponse> {
        if (retries > Fetcher.MAX_RETRIES) {
            throw new RateLimitError();
        }

        try {
            console.log(
                `Fetching GH GraphQL Api with PAT TOKEN ${this.RETRIES_LIST[retries]}`
            );

            if (path.startsWith("/")) {
                path = path.substring(1);
            }
            let url = `https://api.github.com/${path}`;
            let headers: { [key: string]: string } = {};
            if (path.startsWith("https://github.com")) {
                url = path;
                headers = extraHeaders;
            } else {
                headers = {
                    Authorization: `bearer ${
                        process.env[`GH_PAT_${this.RETRIES_LIST[retries]}`]
                    }`,
                    ...extraHeaders,
                };
            }
            const response = await axios.get(url, {
                headers,
            });
            const isRateExceeded =
                response.data.errors &&
                response.data.errors[0].type === "RATE_LIMITED";

            if (isRateExceeded) {
                console.log(
                    `Rate limit exceeded, GH_PAT_${this.RETRIES_LIST[retries]} FAILED`
                );
                retries++;
                return this.request(path, extraHeaders, retries);
            }

            return response;
            // TODO: Remove type any from this catch block
        } catch (err: any) {
            const isBadCredential =
                err.response.data &&
                err.response.data.message === "Bad credentials";

            if (isBadCredential) {
                console.log(
                    `Rate limit exceeded, GH_PAT_${this.RETRIES_LIST[retries]} FAILED`
                );
            }
            retries++;
            return this.request(path, extraHeaders, retries);
        }
    }

    static async graphql<T>(
        query: string,
        variables: T,
        retries: number = 0
    ): Promise<AxiosResponse> {
        if (retries > Fetcher.MAX_RETRIES) {
            throw new RateLimitError();
        }

        try {
            console.log(
                `Fetching GH GraphQL Api with PAT TOKEN ${this.RETRIES_LIST[retries]}`
            );
            const response = await axios.post(
                "https://api.github.com/graphql",
                {
                    query,
                    variables,
                },
                {
                    headers: {
                        Authorization: `Bearer ${
                            process.env[`GH_PAT_${this.RETRIES_LIST[retries]}`]
                        }`,
                    },
                }
            );

            const isRateExceeded =
                response.data.errors &&
                response.data.errors[0].type === "RATE_LIMITED";

            if (isRateExceeded) {
                console.log(
                    `Rate limit exceeded, GH_PAT_${this.RETRIES_LIST[retries]} FAILED`
                );
                return this.graphql(query, variables, retries + 1);
            }

            return response;
            // TODO: Remove type any from this catch block
        } catch (err: any) {
            const isBadCredential =
                err.response.data &&
                err.response.data.message === "Bad credentials";

            if (isBadCredential) {
                console.log(
                    `Rate limit exceeded, GH_PAT_${this.RETRIES_LIST[retries]} FAILED`
                );
            }
            return this.graphql(query, variables, retries + 1);
        }
    }
}
