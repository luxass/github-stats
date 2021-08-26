import { ThemeDesign } from "@lib/types";
import StatsCard from "../components/cards/StatsCard";
import RepoCard from "../components/cards/RepoCard";

type ProviderProps = {
    query: string;
    design: {
        stats: ThemeDesign;
        repo: ThemeDesign;
    };
};

export default function CardProvider({ query, design }: ProviderProps) {
    return (
        <div>
            {query === "user" ? (
                <StatsCard design={design.stats} />
            ) : (
                <RepoCard design={design.repo} />
            )}
        </div>
    );
}
