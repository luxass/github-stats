export type UserStats = {
    stars: string;
    forks: string;
    contributions: string;
    issues: string;
    commits: string;
};

export type RepoStats = {
    name: string;
    description: string[];
    language: {
        languageName: string;
        color: string;
    };
    forks: string;
    stars: {
        totalCount: string;
    };
};

export type RepoNode = {
    name?: string;
    nameWithOwner?: string;
    languages?: {
        edges: LanguageEdge[];
    };
    stargazers?: {
        totalCount: number;
    };
    forkCount?: number;
};

export type LanguageEdge = {
    size: number;
    node: LanguageNode;
};
export type LanguageNode = {
    color: string;
    name: string;
};
