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
    base64: Maybe<string>;
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
    base64: Maybe<string>;
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
    base64: Maybe<string>;
}
export interface UserFetcherResponse {
    stars: string;
    forks: string;
    issues: string;
    commits: string;
    contributions: string;
    ranking: UserRanking;
    base64: Maybe<string>;
}

export interface LanguageFetcherResponse {
    languages: {
        name: string;
        color: string;
        size: number;
    }[];
    base64: Maybe<string>;
}
export interface EditorFetcherResponse {
    editors: WakatimeEditor[];
    base64: Maybe<string>;
}

export interface WakaLanguageFetcherResponse {
    languages: WakatimeLanguage[];
    base64: Maybe<string>;
}

export interface WakatimeLanguage {
    decimal: string;
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
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

export interface Theme {
    name: string;
    identifier: string;
    design?: ThemeDesign;
    text?: ThemeText;
}

export interface ThemeDesign {
    title?: string;
    icon?: string;
    text?: string;
    background?: string;
    border?: string;
}

export interface ThemeText {
    font?: string;
    size?: string;
    weight?: string;
    title?: {
        size?: string;
        weight?: string;
    };
    text?: {
        size?: string;
        weight?: string;
    };
}

export interface WakatimeEditor {
    decimal: string;
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
}

export interface FallbackTheme {
    design: FallbackThemeDesign;
    text: FallbackThemeText;
}

export interface FallbackThemeDesign {
    title: string;
    icon: string;
    text: string;
    background: string;
    border: string;
}

export interface FallbackThemeText {
    font: string;
    size: string;
    weight: string;
    title: {
        size: string;
        weight: string;
    };
    text: {
        size: string;
        weight: string;
    };
}

export interface RankingValues {
    commits: number;
    contributions: number;
    repos: number;
    issues: number;
    stars: number;
    pullRequests: number;
    followers: number;
}

export interface UserRanking {
    ranking: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Master" | "Guru" | "God"; 
    points: number;
}
