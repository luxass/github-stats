import fetch from "node-fetch";

export async function graphql<T>(query: string, variables: T) {
    return await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
    }).then((response) => response.json());
}

export async function request(path: string) {
    if (path.startsWith("/")) {
        path = path.substring(1);
    }
    return await fetch(`https://api.github.com/${path}`, {
        method: "GET",
        headers: {
            Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
        },
    }).then((response) => response.json());
}
