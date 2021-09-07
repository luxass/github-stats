import { VercelRequestQuery } from "@vercel/node";

export type Maybe<T> = T | undefined;
export type ValueOf<T> = T[keyof T];
export type ValueOfQuery = ValueOf<VercelRequestQuery> | undefined;

export interface TypeFetcherResponse {
    type: string;
    morning: TypeObject;
    daytime: TypeObject;
    evening: TypeObject;
    night: TypeObject;
}

export type TypeObject = {
    name: string;
    commits: number;
    percent: number;
};
export interface StreaksFetcherResponse {
    calendar: CalendarData;
    currentStreak: string;
    longestStreak: string;
    firstContribution: string;
}

export interface RepoFetcherResponse {
    name: string;
    nameWithOwner: string;
    stargazers: {
        totalCount: number;
    };
    description: string;
    primaryLanguage: {
        color: string;
        id: string;
        name: string;
    };
    forkCount: number;
}
export interface UserFetcherResponse {
    stars: string;
    forks: string;
    issues: string;
    commits: string;
    contributions: string;
}

export interface LanguageFetcherResponse {
    languages: {
        name: string;
        color: string;
        size: number;
    }[];
}

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
    name: string;
    nameWithOwner: string;
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
    [key: string]: string | undefined;
} & {
    title?: string;
    icon?: string;
    text?: string;
    background?: string;
    border?: string;
};
export type FallbackDesign = {
    [key: string]: string | undefined;
} & {
    title: string;
    icon: string;
    text: string;
    background: string;
    border: string;
};

export type ExtendedTheme = Theme & {
    url: string;
};

export type WordWrapOptions = {
    breakWord?: boolean;
    input?: string[];
    minWidth?: number;
    paddingLeft?: number;
    paddingRight?: number;
    returnFormat?: "string" | "array";
    skipPadding?: boolean;
    width?: number;
    trim?: boolean;
    splitAt?: string[];
    errorChar?: string;
};
