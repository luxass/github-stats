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
        <div
            style={{
                backgroundColor: "green",
                width: "100%",
                height: "calc(100vh - 60px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {query === "user" ? (
                <StatsCard design={design.stats} />
            ) : (
                <RepoCard design={design.repo} />
            )}
        </div>
    );
}
