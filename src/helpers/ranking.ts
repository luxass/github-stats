import { RankingValues, UserRanking } from "@lib/types";

enum Points {
    COMMIT = 30,
    CONTRIBUTION = 25,
    REPO = 20,
    ISSUE = 20,
    STAR = 15,
    PULL_REQUEST = 10,
    FOLLOWERS = 5,
}

enum Ranks {
    BEGINNER = "Beginner",
    INTERMEDIATE = "Intermediate",
    ADVANCED = "Advanced",
    EXPERT = "Expert",
    MASTER = "Master",
    GURU = "Guru",
    GOD = "God",
}

// Should probably be reworked, but requires feedback from the community
function getRank(points: number) {
    if (points < 10000) return Ranks.BEGINNER;
    if (points < 120000) return Ranks.INTERMEDIATE;
    if (points < 350000) return Ranks.ADVANCED;
    if (points < 600000) return Ranks.EXPERT;
    if (points < 1000000) return Ranks.MASTER;
    if (points < 3500000) return Ranks.GURU;
    return Ranks.GOD;
}

export function getRanking({
    commits,
    contributions,
    repos,
    issues,
    stars,
    pullRequests,
    followers,
}: RankingValues): UserRanking {
    // Getting total points of user stats
    const points =
        commits * Points.COMMIT +
        contributions * Points.CONTRIBUTION +
        repos * Points.REPO +
        issues * Points.ISSUE +
        stars * Points.STAR +
        pullRequests * Points.PULL_REQUEST +
        followers * Points.FOLLOWERS;

    // Getting user rank by points
    const ranking = getRank(points);

    return {
        ranking: ranking,
        points: points,
    };
}
