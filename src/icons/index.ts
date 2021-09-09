import commits from "./octicons/commits.svg";
import contribution from "./octicons/contribution.svg";
import fork from "./octicons/fork.svg";
import issues from "./octicons/issues.svg";
import star from "./octicons/star.svg";

export default function getIcons(): {
    [key: string]: string;
} {
    return {
        star: star,
        issues: issues,
        fork: fork,
        commits: commits,
        contribution: contribution,
    };
}
