import { ParsedUrlQuery } from "querystring";

export default function parseQuery(query: ParsedUrlQuery) {
    return Object.fromEntries(
        Object.entries(query).map(([k, v], i) => [
            k,
            v instanceof Array ? v[0] : v,
        ])
    ) as {
        [key: string]: string;
    };
}
