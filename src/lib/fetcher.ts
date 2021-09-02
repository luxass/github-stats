import fetch from "node-fetch";

export async function graphql<T>(query: string, variables: T) {
    return await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `bearer ${process.env.GITHUB_TOKEN_1}`,
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
    }).then((response) => response.json());
}

export async function request(
    path: string,
    extraHeaders: { [key: string]: string } = {}
) {
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
            Authorization: `bearer ${process.env.GITHUB_TOKEN_1}`,
            ...extraHeaders,
        };
    }

    return await fetch(url, {
        method: "GET",
        headers: headers,
    })
}
