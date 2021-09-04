import axios, { AxiosPromise, AxiosResponse } from "axios";

const MAX_TRIES = 6;

export function graphql<T>(query: string, variables: T) {
    return retry(
        axios({
            url: "https://api.github.com/graphql",
            method: "post",
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN_1}`,
            },
            data: {
                query,
                variables,
            },
        })
    );
}

async function retry(
    request: AxiosPromise<AxiosResponse<any>>,
    tries: number = 0
): Promise<AxiosResponse> {
    if (tries > MAX_TRIES) {
        throw new Error("Max tries reached");
    }

    try {
        const response = await request
        console.log(response)
        // @ts-ignore
        const isRateExceeded = response.data.errors && response.data.errors[0].type === "RATE_LIMITED";

        // if rate limit is hit increase the RETRIES and recursively call the retry
        // with username, and current RETRIES
        if (isRateExceeded) {
            console.log(`PAT_${tries + 1} Failed`);
            tries++;
            // directly return from the function
            return retry(request, tries);
        }

        // finally return the response
        return response;
    } catch (err: any) {
        // prettier-ignore
        // also checking for bad credentials if any tokens gets invalidated
        const isBadCredential = err.response.data && err.response.data.message === "Bad credentials";

        if (isBadCredential) {
            console.log(`PAT_${tries + 1} Failed`);
        }
        tries++;
        // directly return from the function
        return retry(request, tries);
    }
}
