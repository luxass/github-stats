import RepoCard from "./RepoCard";
import ErrorCard from "./ErrorCard";
import { ThemeDesign } from "@lib/types";
import StreaksCard from "./StreaksCard";
import StatsCard from "./StatsCard";
type ProviderProps = {
    design: ThemeDesign;
    card: string;
};

export default function CardProvider({ design, card }: ProviderProps) {
    return (
        <div
            style={{
                height: "250px",
                display: "flex",
                justifyContent: "center",
            }}
        >
            {(() => {
                switch (card) {
                    case "repo":
                        return <RepoCard design={design} />;
                    case "streak":
                        return <StreaksCard design={design} />;
                    case "stats":
                        return <StatsCard design={design} />;
                    default:
                        return (
                            <ErrorCard
                                design={design}
                                error="The card was not found"
                            />
                        );
                }
            })()}
        </div>
    );
}
