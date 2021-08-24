import { RepoNode } from "./types";

/**
 * Breaks the text if the length is more than 50.
 * @param text
 * @returns {string[]}
 */
export function breakMultiLineText(text: string): string[] {
    const textLength = 50;
    let wrap = text
        .replace(
            new RegExp(
                `(?![^\\n]{1,${textLength}}$)([^\\n]{1,${textLength}})\\s`,
                "g"
            ),
            "$1\n"
        )
        .split("\n")
        .map((line: string) => line.trim());

    const lines = wrap.slice(0, 3);
    if (wrap.length > 3) {
        lines[3 - 1] += "...";
    }
    return lines.filter(Boolean);
}

export function getDataFromNodes(repoNodes: RepoNode[]): {
    stars: number;
    forks: number;
} {
    let stars: number = 0;
    let forks: number = 0;

    repoNodes.forEach((repoNode: RepoNode) => {
        stars += (
            repoNode.stargazers || {
                totalCount: 0,
            }
        ).totalCount;
        forks += repoNode.forkCount || 0;
    });

    return {
        stars,
        forks,
    };
}

export function encode(value: string) {
    let buff = Buffer.from(value, "utf-8");
    return buff.toString("base64");
}
export function decode(value: string) {
    return Buffer.from(value, "base64").toString("utf-8");
}

export function isProd() {
    return process.env.NODE_ENV === "production"
        ? "https://github-stats.vercel.app"
        : "localhost:3000";
}
