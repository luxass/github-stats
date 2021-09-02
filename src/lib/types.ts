export type StatsCardOptions = {
    customTitle?: string;
    hideIcons?: string;
};

export type UserStats = {
    stars: string;
    forks: string;
    contributions: string;
    issues: string;
    commits: string;
};
export type CalendarData = {
    total_contribution: number;
    first_contribution: string;
    longest_streak: number;
    longest_streak_start: string;
    longest_streak_end: string;
    current_streak: number;
    current_streak_start: string;
    current_streak_end: string;

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
export type Theme = {
    name: string;
    identifier: string;
    design: ThemeDesign;
};
export type ThemeDesign = {
    [key: string]: string;
} & {
    title?: string;
    icon?: string;
    text?: string;
    background?: string;
    border?: string;
};

export type ExtendedTheme = Theme & {
    url: string;
};
